import React from 'react';

const HomePage = () => {
  return (
    <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://plus.unsplash.com/premium_photo-1691849271949-cb30187a80c3?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}>
      <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
        <div className="text-white text-center p-6 rounded-lg shadow-lg">
          <h1 className="text-5xl font-bold mb-4">Welcome to Leave Sync: An Early Leave Organizer</h1>
          <p className="text-lg mb-6"></p>
          <a href="/signup" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded transition duration-200">
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;