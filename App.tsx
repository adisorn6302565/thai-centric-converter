import React, { useState } from 'react';
// FIX: Update the import for 'CategoryId' to point to 'types.ts' to resolve an error.
import { CATEGORIES } from './constants';
import { CategoryId } from './types';
import LandConverter from './components/LandConverter';
import GoldConverter from './components/GoldConverter';
import GenericConverter from './components/GenericConverter';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('land');

  const renderConverter = () => {
    switch (activeCategory) {
      case 'land':
        return <LandConverter />;
      case 'gold':
        return <GoldConverter />;
      case 'agriculture':
      case 'length':
      case 'weight':
      case 'volume':
        return <GenericConverter categoryId={activeCategory} />;
      default:
        return <LandConverter />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
          Thai-Centric Converter
        </h1>
        <p className="text-slate-400 mt-2 text-lg">เว็บแปลงหน่วยฉบับคนไทย</p>
      </header>

      <div className="flex-grow container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <nav className="flex flex-row md:flex-col gap-2 flex-wrap">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-300 w-full text-slate-200 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 font-bold shadow-lg shadow-amber-500/20'
                    : 'bg-gray-900/50 border border-gray-800 hover:bg-gray-800/70 hover:border-gray-700'
                }`}
              >
                {category.icon}
                <span>{category.name}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="w-full md:w-3/4 lg:w-4/5">
          {renderConverter()}
        </main>
      </div>
      
      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>สร้างขึ้นเพื่อความสะดวกในการแปลงหน่วยวัดไทย</p>
      </footer>
    </div>
  );
};

export default App;
