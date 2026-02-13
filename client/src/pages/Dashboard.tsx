import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { suggestMeal, getMealHistory } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import { FaDice, FaCog, FaSignOutAlt, FaClock } from 'react-icons/fa';
import type { MealHistory } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();
  const [excludeRecent, setExcludeRecent] = useState(true);
  const [maxPrepTime, setMaxPrepTime] = useState<number | undefined>(undefined);

  const [currentSuggestion, setCurrentSuggestion] = useState<MealHistory | null>(null);

  const { data: history = [] } = useQuery({
    queryKey: ['mealHistory'],
    queryFn: async () => {
      const response = await getMealHistory(5);
      return response.data;
    },
  });

  const suggestMutation = useMutation({
    mutationFn: () => suggestMeal({ excludeRecent, maxPrepTime }),
    onSuccess: (response) => {
      setCurrentSuggestion(response.data);
      queryClient.invalidateQueries({ queryKey: ['mealHistory'] });
    },
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSuggest = () => {
    suggestMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-400 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
              🍽️ What Should I Eat?
            </h1>
            <p className="text-white text-opacity-90">Welcome, {user?.name}!</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/preferences')}
              className="bg-white text-orange-600 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              title="Preferences"
            >
              <FaCog />
            </button>
            <button
              onClick={handleLogout}
              className="bg-white text-orange-600 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              title="Logout"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Filters</h3>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={excludeRecent}
                onChange={(e) => setExcludeRecent(e.target.checked)}
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-700">Exclude recent meals (7 days)</span>
            </label>
            <div className="flex items-center gap-2">
              <FaClock className="text-gray-600" />
              <label className="text-sm text-gray-700">Max prep time:</label>
              <select
                value={maxPrepTime || ''}
                onChange={(e) => setMaxPrepTime(e.target.value ? parseInt(e.target.value) : undefined)}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Any</option>
                <option value="15">15 min</option>
                <option value="20">20 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Suggestion Card */}
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-6 md:p-8 mb-6">
          {suggestMutation.isPending ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Finding the perfect meal for you...</p>
            </div>
          ) : suggestMutation.isError ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">
                {(suggestMutation.error as any)?.response?.data?.error || 'Failed to suggest meal'}
              </p>
              <button
                onClick={handleSuggest}
                className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white px-8 py-3 rounded-lg hover:from-orange-700 hover:to-yellow-600 transition-all font-semibold"
              >
                Try Again
              </button>
            </div>
          ) : currentSuggestion ? (
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    {currentSuggestion.meal.name}
                  </h2>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                      {currentSuggestion.meal.cuisine}
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <FaClock /> {currentSuggestion.meal.prepTime} min
                    </span>
                    {currentSuggestion.meal.dietaryTags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 text-lg mb-6">{currentSuggestion.meal.description}</p>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3 text-lg">Ingredients:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {currentSuggestion.meal.ingredients.map((ingredient, idx) => (
                    <div key={idx} className="bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-700">
                      • {ingredient}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSuggest}
                disabled={suggestMutation.isPending}
                className="w-full bg-gradient-to-r from-orange-600 to-yellow-500 text-white font-bold py-4 rounded-lg hover:from-orange-700 hover:to-yellow-600 transition-all duration-200 flex items-center justify-center gap-2 text-lg"
              >
                <FaDice /> Suggest Another Meal
              </button>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Ready to decide what to eat?
              </h2>
              <p className="text-gray-600 mb-6">
                Click the button below to get a personalized meal suggestion!
              </p>
              <button
                onClick={handleSuggest}
                disabled={suggestMutation.isPending}
                className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white font-bold py-4 px-8 rounded-lg hover:from-orange-700 hover:to-yellow-600 transition-all duration-200 flex items-center gap-2 mx-auto text-lg"
              >
                <FaDice /> Get Meal Suggestion
              </button>
            </div>
          )}
        </div>

        {/* Recent History */}
        {history.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Meals</h3>
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-3 last:border-b-0"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{item.meal.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.suggestedAt).toLocaleDateString()} at{' '}
                      {new Date(item.suggestedAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className="text-sm text-orange-600 font-medium">
                    {item.meal.cuisine}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
