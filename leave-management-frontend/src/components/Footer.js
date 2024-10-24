import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">AutomatedLeaveSystem</h3>
          <p className="text-sm">&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>

        <div className="flex space-x-4">
          <a href="/about" className="text-sm hover:underline">About Us</a>
          {/* <a href="#privacy" className="text-sm hover:underline">Privacy Policy</a> */}
          <a href="/contact" className="text-sm hover:underline">Contact Us</a>
        </div>

        <div className="text-sm">
          Developed and designed by <strong>Aryan Singh Thakur</strong>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
