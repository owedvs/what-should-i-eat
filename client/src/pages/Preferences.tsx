import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { preferencesAPI } from '../services/api';
import { Preference } from '../types';
import { FaTrash, FaPlus } from 'react-icons/fa';

const Preferences: React.FC = () => {
  const [preferences, setPreferences] = useState<Record<string, Preference[]>>({});
  const [loading, setLoading] = useState(true);
  const [newPreference, setNewPreference] = useState({ type: 'liked_food', value: '' });
  const navigate = useNavigate();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const data = await preferencesAPI.getPreferences();
      setPreferences(data);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPreference.value.trim()) return;

    try {
      await preferencesAPI.addPreference(newPreference.type, newPreference.value);
      setNewPreference({ type: newPreference.type, value: '' });
      loadPreferences();
    } catch (error) {
      console.error('Failed to add preference:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await preferencesAPI.deletePreference(id);
      loadPreferences();
    } catch (error) {
      console.error('Failed to delete preference:', error);
    }
  };

  const PreferenceSection = ({ type, title }: { type: string; title: string }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-2 mb-4">
        {preferences[type]?.map((pref) => (
          <div
            key={pref.id}
            className="flex items-center justify-between bg-orange-50 px-4 py-2 rounded-lg"
          >
            <span className="text-gray-700">{pref.value}</span>
            <button
              onClick={() => handleDelete(pref.id)}
              className="text-red-500 hover:text-red-700 transition"
            >
              <FaTrash />
            </button>
          </div>
        )) || <p className="text-gray-500 text-sm">No preferences added yet</p>}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-yellow-400 to-orange-500 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-yellow-400 to-orange-500 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Set Your Preferences
          </h1>
          <p className="text-gray-600">
            Help us find the perfect meals for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <PreferenceSection type="liked_food" title="❤️ Liked Foods" />
          <PreferenceSection type="disliked_food" title="❌ Disliked Foods" />
          <PreferenceSection type="dietary_restriction" title="🥗 Dietary Restrictions" />
          <PreferenceSection type="cuisine_preference" title="🌍 Cuisine Preferences" />
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Add New Preference
          </h3>
          <form onSubmit={handleAdd} className="flex gap-4">
            <select
              value={newPreference.type}
              onChange={(e) =>
                setNewPreference({ ...newPreference, type: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
            >
              <option value="liked_food">Liked Food</option>
              <option value="disliked_food">Disliked Food</option>
              <option value="dietary_restriction">Dietary Restriction</option>
              <option value="cuisine_preference">Cuisine Preference</option>
            </select>
            <input
              type="text"
              value={newPreference.value}
              onChange={(e) =>
                setNewPreference({ ...newPreference, value: e.target.value })
              }
              placeholder="Enter value..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-yellow-600 transition flex items-center gap-2"
            >
              <FaPlus /> Add
            </button>
          </form>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white text-orange-600 font-semibold px-8 py-3 rounded-lg shadow hover:shadow-lg transition"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
