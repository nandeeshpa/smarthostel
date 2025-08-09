import React, { useState } from 'react';
import { Utensils, Star, Calendar, Clock } from 'lucide-react';

const MessFeedback: React.FC = () => {
  const [selectedMeal, setSelectedMeal] = useState('');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const todayMenu = [
    { meal: 'Breakfast', items: ['Idli', 'Sambar', 'Coconut Chutney', 'Coffee/Tea'], time: '7:00 AM - 9:00 AM' },
    { meal: 'Lunch', items: ['Rice', 'Dal', 'Chicken Curry', 'Vegetables', 'Curd'], time: '12:00 PM - 2:00 PM' },
    { meal: 'Snacks', items: ['Samosa', 'Tea'], time: '4:00 PM - 5:00 PM' },
    { meal: 'Dinner', items: ['Chapati', 'Rice', 'Paneer Curry', 'Dal', 'Pickle'], time: '7:00 PM - 9:00 PM' }
  ];

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle feedback submission
    alert('Feedback submitted successfully!');
    setSelectedMeal('');
    setRating(0);
    setFeedback('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mess Feedback & Meal Booking</h1>
        <p className="text-gray-600 mt-2">Rate meals and pre-book your food preferences</p>
      </div>

      {/* Today's Menu */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
          <h2 className="text-xl font-semibold flex items-center">
            <Calendar className="h-6 w-6 mr-2" />
            Today's Menu - {new Date().toLocaleDateString()}
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {todayMenu.map((menu) => (
              <div key={menu.meal} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{menu.meal}</h3>
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mb-3">{menu.time}</p>
                <ul className="space-y-1">
                  {menu.items.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Star className="h-6 w-6 mr-2 text-yellow-500" />
            Rate Today's Meals
          </h2>
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Meal
              </label>
              <select
                value={selectedMeal}
                onChange={(e) => setSelectedMeal(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Choose a meal</option>
                {todayMenu.map((menu) => (
                  <option key={menu.meal} value={menu.meal}>{menu.meal}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feedback & Suggestions
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                rows={4}
                placeholder="Share your thoughts about the meal..."
              />
            </div>

            <button
              type="submit"
              disabled={!selectedMeal || rating === 0}
              className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Submit Feedback
            </button>
          </form>
        </div>

        {/* Pre-booking Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Utensils className="h-6 w-6 mr-2 text-green-500" />
            Pre-book Tomorrow's Meals
          </h2>
          <div className="space-y-4">
            {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
              <div key={meal} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{meal}</p>
                  <p className="text-sm text-gray-500">Pre-book for tomorrow</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            ))}
            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              Confirm Booking
            </button>
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Recent Reviews</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {[1, 2, 3].map((review) => (
            <div key={review} className="px-6 py-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">U{review}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900">Student {review}</p>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-4 w-4 text-yellow-500 fill-current"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Great food quality today! The chicken curry was especially good.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Lunch • 2 hours ago
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessFeedback;