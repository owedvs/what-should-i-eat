import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPreferences, addPreference, deletePreference } from '../services/api';
import { FaTimes } from 'react-icons/fa';

const PREFERENCE_TYPES = [
  { key: 'liked_food', label: '❤️ Liked Foods', placeholder: 'e.g., Chicken, Pasta, Salmon' },
  { key: 'disliked_food', label: '❌ Disliked Foods', placeholder: 'e.g., Mushrooms, Olives' },
  { key: 'dietary_restriction', label: '🥗 Dietary Restrictions', placeholder: 'e.g., vegetarian, gluten-free, vegan' },
  { key: 'cuisine_preference', label: '🌍 Cuisine Preferences', placeholder: 'e.g., Italian, Asian, Mexican' },
];

export default function Preferences() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [newPreferences, setNewPreferences] = useState<Record<string, string>>({});

  const { data: preferences = [], isLoading } = useQuery({
    queryKey: ['preferences'],
    queryFn: async () => {
      const response = await getPreferences();
      return response.data;
    },
  });

  const addMutation = useMutation({
    mutationFn: ({ type, value }: { type: string; value: string }) =>
      addPreference({ type, value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePreference(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
  });

  const handleAdd = (type: string) => {
    const value = newPreferences[type]?.trim();
    if (value) {
      addMutation.mutate({ type, value });
      setNewPreferences({ ...newPreferences, [type]: '' });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: string) => {
    if (e.key === 'Enter') {
      handleAdd(type);
    }
  };

  const getPreferencesByType = (type: string) => {
    return preferences.filter((p) => p.type === type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-orange-500 to-yellow-400 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Set Your Preferences</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white px-6 py-2 rounded-lg hover:from-orange-700 hover:to-yellow-600 transition-all"
            >
              Continue to Dashboard
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {PREFERENCE_TYPES.map((prefType) => (
                <div key={prefType.key} className="border-b pb-6 last:border-b-0">
                  <h2 className="text-xl font-semibold text-gray-700 mb-3">{prefType.label}</h2>
                  
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newPreferences[prefType.key] || ''}
                      onChange={(e) =>
                        setNewPreferences({ ...newPreferences, [prefType.key]: e.target.value })
                      }
                      onKeyPress={(e) => handleKeyPress(e, prefType.key)}
                      placeholder={prefType.placeholder}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => handleAdd(prefType.key)}
                      disabled={addMutation.isPending}
                      className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {getPreferencesByType(prefType.key).map((pref) => (
                      <span
                        key={pref.id}
                        className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                      >
                        {pref.value}
                        <button
                          onClick={() => deleteMutation.mutate(pref.id)}
                          disabled={deleteMutation.isPending}
                          className="hover:bg-orange-200 rounded-full p-1 transition-colors"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </span>
                    ))}
                  </div>

                  {getPreferencesByType(prefType.key).length === 0 && (
                    <p className="text-gray-400 text-sm italic">No preferences set yet</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
