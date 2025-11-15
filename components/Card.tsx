import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-2xl shadow-2xl shadow-black/30 p-6 md:p-8">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 pb-4 border-b border-gray-800 mb-8">
        {title}
      </h2>
      {children}
    </div>
  );
};

export default Card;