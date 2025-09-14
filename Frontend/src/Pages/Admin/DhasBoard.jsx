import React from 'react';

const DhasBoard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col p-6">
        <nav className="flex flex-col gap-4">
          <a href="#" className="hover:bg-blue-700 p-2 rounded">Dashboard</a>
          <a href="#" className="hover:bg-blue-700 p-2 rounded">Users</a>
          <a href="#" className="hover:bg-blue-700 p-2 rounded">Notes</a>
          <a href="#" className="hover:bg-blue-700 p-2 rounded">Settings</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-6">Welcome, Admin!</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Widget 1 */}
          <div className="bg-white rounded shadow p-6">
            <h3 className="text-xl font-bold mb-2">Total Users</h3>
            <p className="text-2xl font-semibold">1,234</p>
          </div>
          {/* Widget 2 */}
          <div className="bg-white rounded shadow p-6">
            <h3 className="text-xl font-bold mb-2">No of Notes</h3>
            <p className="text-2xl font-semibold">567</p>
          </div>
          {/* Widget 3 */}
          <div className="bg-white rounded shadow p-6">
            <h3 className="text-xl font-bold mb-2">Plane</h3>
            <p className="text-2xl font-semibold">Free</p>
          </div>
        </div>

        {/* Recent Notes and Active Users Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Recent Notes */}
          <div className="bg-white rounded shadow p-6">
            <h3 className="text-lg font-bold mb-4">Recent Notes</h3>
            <ul>
              <li className="mb-2">Note 1: Meeting summary</li>
              <li className="mb-2">Note 2: Project update</li>
              <li className="mb-2">Note 3: Feature request</li>
            </ul>
          </div>
          {/* Active Users */}
          <div className="bg-white rounded shadow p-6">
            <h3 className="text-lg font-bold mb-4">Active Users</h3>
            <ul>
              <li className="mb-2">User: John Doe</li>
              <li className="mb-2">User: Jane Smith</li>
              <li className="mb-2">User: Alex Johnson</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DhasBoard;