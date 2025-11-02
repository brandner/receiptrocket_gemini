
import React from 'react';
import { RocketIcon, UserIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="py-4 px-6 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <RocketIcon className="w-8 h-8 text-indigo-400" />
          <h1 className="text-2xl font-bold text-white tracking-tight">Receipt Rocket</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 hidden sm:block">Welcome, User!</span>
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
