import React from 'react';

const About = () => {
  return (
    <div 
      className="relative h-screen bg-cover bg-center" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
    >
      <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
        <div className="text-white text-center p-8 rounded-lg shadow-lg bg-opacity-75">
          <h1 className="text-4xl font-bold mb-4">About the System</h1>
          <p className="text-lg mb-6">
            This is a simple Leave Management System that allows students to apply for leave and get it approved by the Coordinator and HOD.
          </p>
          <h2 className="text-2xl font-semibold mb-2">Key Features:</h2>
          <ul className="list-disc list-inside mb-6">
            <li>Easy leave application process</li>
            <li>Real-time status updates</li>
            <li>Secure user authentication</li>
            <li>User-friendly interface</li>
            <li>Admin dashboard for managing requests</li>
          </ul>
          <h2 className="text-2xl font-semibold mb-2">Our Mission:</h2>
          <p className="mb-6">
            To streamline the leave application process, making it easier for students to manage their time and responsibilities while ensuring effective communication with faculty.
          </p>
          <a 
            href="/signup" 
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            Join Us Today
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;