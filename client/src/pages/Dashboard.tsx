import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mealsAPI } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { Meal, MealHistory } from '../types';
import { FaUtensils, FaClock, FaRedo, FaStar, FaSignOutAlt, FaCog } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [history, setHistory] = useState<MealHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [excludeRecent, setExcludeRecent] = useState(true);
  const [maxPrepTime, setMaxPrepTime] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await mealsAPI.getMealHistory(10);
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const suggestMeal = async () => {
    setLoading(true);
    try {
      const data = await mealsAPI.suggestMeal(
        excludeRecent,
        maxPrepTime > 0 ? maxPrepTime : undefined
      );
      setCurrentMeal(data.meal);
      setHistoryId(data.historyId);
      setRating(0);
      loadHistory();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to suggest meal');
    } finally {
      setLoading(false);
    }
  };

  const handleRating = async (newRating: number) => {
    if (!historyId) return;
    setRating(newRating);
    try {
      await mealsAPI.rateMeal(historyId, newRating);
      loadHistory();
    } catch (error) {
      console.error('Failed to rate meal:', error);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-yellow-400 to-orange-500 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              🍽️ What Should I Eat?
            </h1>
            <p className="text-gray-600">Welcome back, {user?.name || user?.email}!</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/preferences')}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
            >
              <FaCog /> Preferences
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center gap-2"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
          <div className="flex gap-6 flex-wrap">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={excludeRecent}
                onChange={(e) => setExcludeRecent(e.target.checked)}
                className="w-4 h-4 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-gray-700">Exclude recent meals</span>
            </label>
            <div className="flex items-center gap-2">
              <label className="text-gray-700">Max prep time:</label>
              <input
                type="number"
                value={maxPrepTime}
                onChange={(e) => setMaxPrepTime(parseInt(e.target.value) || 0)}
                placeholder="0 (no limit)"
                className="w-32 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
              />
              <span className="text-gray-700">minutes</span>
            </div>
          </div>
        </div>

        {/* Main Meal Card */}
        <div className="bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl shadow-2xl p-8 mb-6 min-h-[400px] flex flex-col justify-center items-center text-white">
          {currentMeal ? (
            <div className="w-full">
              <div className="text-center mb-6">
                <h2 className="text-5xl font-bold mb-4">{currentMeal.name}</h2>
                {currentMeal.description && (
                  <p className="text-xl text-white/90">{currentMeal.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">🥘 Ingredients</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {currentMeal.ingredients.map((ingredient, i) => (
                      <li key={i}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  {currentMeal.cuisine && (
                    <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">🌍 Cuisine</h3>
                      <p>{currentMeal.cuisine}</p>
                    </div>
                  )}

                  {currentMeal.prepTime && (
                    <div className="bg-white/20 backdrop-blur rounded-lg p-4 flex items-center gap-3">
                      <FaClock className="text-2xl" />
                      <div>
                        <h3 className="font-semibold">Prep Time</h3>
                        <p>{currentMeal.prepTime} minutes</p>
                      </div>
                    </div>
                  )}

                  {currentMeal.dietaryTags.length > 0 && (
                    <div className="bg-white/20 backdrop-blur rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">🏷️ Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentMeal.dietaryTags.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-white/30 px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="text-center mb-4">
                <p className="mb-2 font-semibold">Rate this meal:</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(star)}
                      className="text-3xl transition transform hover:scale-110"
                    >
                      <FaStar
                        className={
                          star <= rating ? 'text-yellow-300' : 'text-white/30'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={suggestMeal}
                  disabled={loading}
                  className="bg-white text-orange-600 font-bold px-8 py-4 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                >
                  <FaRedo /> Suggest Another
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <FaUtensils className="text-8xl mb-6 mx-auto" />
              <h2 className="text-4xl font-bold mb-4">Ready to eat?</h2>
              <p className="text-xl mb-8 text-white/90">
                Click below to get your personalized meal suggestion!
              </p>
              <button
                onClick={suggestMeal}
                disabled={loading}
                className="bg-white text-orange-600 font-bold px-8 py-4 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
              >
                <FaUtensils /> {loading ? 'Finding a meal...' : 'Suggest a Meal'}
              </button>
            </div>
          )}
        </div>

        {/* Recent History */}
        {history.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Recent Meal History
            </h3>
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-orange-50 p-4 rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold text-gray-800">{item.meal.name}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(item.suggestedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {item.rating && (
                    <div className="flex gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-500" />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
