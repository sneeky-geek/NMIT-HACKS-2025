import React from 'react';

const demoActivities = [
  {
    id: 1,
    title: 'Thrown garbage in a bin',
    date: '2025-05-10',
    points: 10
  },
  {
    id: 2,
    title: 'Planted a tree',
    date: '2025-05-12',
    points: 20
  },
  {
    id: 3,
    title: 'Helped clean a park',
    date: '2025-05-15',
    points: 15
  }
];

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center py-8">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-xl mb-8">
        <h2 className="text-xl font-bold mb-2">Welcome, {user.firstName} {user.lastName}</h2>
        <p className="mb-1">Phone: {user.phoneNumber}</p>
        <p className="mb-1">Email: {user.email}</p>
        <p className="mb-1">DOB: {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : ''}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-xl">
        <h3 className="text-lg font-semibold mb-4">Your Civic Activities</h3>
        <ul className="space-y-2">
          {demoActivities.map(activity => (
            <li key={activity.id} className="flex justify-between items-center border-b pb-2">
              <span>{activity.title} <span className="text-xs text-gray-500">({activity.date})</span></span>
              <span className="font-bold text-green-600">+{activity.points} pts</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
