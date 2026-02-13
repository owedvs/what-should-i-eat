import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'What Should I Eat? Subscription',
              description: 'Monthly subscription for personalized meal suggestions',
            },
            unit_amount: 400, // $4.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/dashboard?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard?canceled=true`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

export const getSubscriptionStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { userId: req.userId! },
    });

    if (!subscription) {
      res.json({ status: 'inactive', subscription: null });
      return;
    }

    res.json({ status: subscription.status, subscription });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
};

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    res.status(400).json({ error: 'Missing stripe signature' });
    return;
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    res.status(400).json({ error: `Webhook Error: ${err.message}` });
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId || !session.customer || !session.subscription) {
          break;
        }

        const stripeSubscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeCustomerId: session.customer as string,
            stripePriceId: stripeSubscription.items.data[0].price.id,
            status: stripeSubscription.status,
            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
          },
          update: {
            stripeCustomerId: session.customer as string,
            stripePriceId: stripeSubscription.items.data[0].price.id,
            status: stripeSubscription.status,
            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
          },
        });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscription.update({
          where: { stripeCustomerId: subscription.customer as string },
          data: {
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscription.update({
          where: { stripeCustomerId: subscription.customer as string },
          data: {
            status: 'canceled',
          },
        });
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};
