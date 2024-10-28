import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <div className="mb-4 md:mb-0">
          <h3 className="text-xl md:text-lg font-bold">AutomatedLeaveSystem</h3>
          <p className="text-sm">&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>

        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <a href="/about" className="text-sm hover:underline transition duration-200">About Us</a>
          {/* <a href="#privacy" className="text-sm hover:underline transition duration-200">Privacy Policy</a> */}
          <a href="/contact" className="text-sm hover:underline transition duration-200">Contact Us</a>
        </div>

        <div className="text-sm mt-4 md:mt-0">
          Developed and designed by <strong>Aryan Singh Thakur</strong>
        </div>
      </div>
    </footer>
  );
}

export default Footer;