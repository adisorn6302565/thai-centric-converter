import React, { useEffect, useMemo, useState } from 'react';
import { CATEGORIES } from './constants';
import { CategoryId } from './types';
import LandConverter from './components/LandConverter';
import GoldConverter from './components/GoldConverter';
import GenericConverter from './components/GenericConverter';

const ACTIVE_CATEGORY_KEY = 'thai-centric-active-category';
const FAVORITES_KEY = 'thai-centric-favorite-categories';

const readStoredCategory = (): CategoryId => {
  if (typeof window === 'undefined') return 'land';
  const saved = window.localStorage.getItem(ACTIVE_CATEGORY_KEY) as CategoryId | null;
  return CATEGORIES.some((category) => category.id === saved) ? saved! : 'land';
};

const readFavorites = (): CategoryId[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || '[]');
    return Array.isArray(saved)
      ? saved.filter((id): id is CategoryId => CATEGORIES.some((category) => category.id === id))
      : [];
  } catch {
    return [];
  }
};

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>(readStoredCategory);
  const [favorites, setFavorites] = useState<CategoryId[]>(readFavorites);
  const [search, setSearch] = useState('');

  useEffect(() => {
    window.localStorage.setItem(ACTIVE_CATEGORY_KEY, activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const visibleCategories = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('th-TH');
    return [...CATEGORIES]
      .filter((category) => !query || category.name.toLocaleLowerCase('th-TH').includes(query))
      .sort((a, b) => Number(favorites.includes(b.id)) - Number(favorites.includes(a.id)));
  }, [favorites, search]);

  const selectCategory = (id: CategoryId) => {
    setActiveCategory(id);
    setSearch('');
  };

  const toggleFavorite = (id: CategoryId) => {
    setFavorites((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : [...current, id]);
  };

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

  const activeInfo = CATEGORIES.find((category) => category.id === activeCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="container mx-auto px-4 pt-10 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
              คำนวณในเครื่อง • ไม่ต้องส่งข้อมูลออกไป
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 bg-clip-text text-transparent mt-4">
              Thai-Centric Converter
            </h1>
            <p className="text-slate-400 mt-2 text-lg">เครื่องมือแปลงหน่วยฉบับคนไทย ใช้ง่าย จำค่าที่ใช้บ่อยให้คุณ</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center text-sm">
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 px-5 py-3">
              <strong className="block text-2xl text-amber-300">{CATEGORIES.length}</strong>
              <span className="text-slate-400">หมวดหน่วย</span>
            </div>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 px-5 py-3">
              <strong className="block text-2xl text-emerald-300">{favorites.length}</strong>
              <span className="text-slate-400">รายการโปรด</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-12 flex-grow">
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <label className="relative flex-1">
            <span className="sr-only">ค้นหาหมวดแปลงหน่วย</span>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ค้นหาหมวด เช่น ไร่ ทอง วา หาบ..."
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 py-3 pl-11 pr-12 text-slate-100 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 text-slate-400 hover:bg-slate-800 hover:text-white" aria-label="ล้างการค้นหา">
                ×
              </button>
            )}
          </label>
          <div className="flex items-center rounded-2xl border border-slate-700 bg-slate-950/60 px-4 text-sm text-slate-400">
            {search ? `พบ ${visibleCategories.length} หมวด` : 'เลือกหมวดที่ต้องการแปลง'}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4 lg:w-1/5">
            <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-widest text-slate-500">
              <span>หมวดแปลงหน่วย</span>
              <span>★ โปรด</span>
            </div>
            <nav className="flex flex-row md:flex-col gap-2 flex-wrap">
              {visibleCategories.map((category) => {
                const isActive = activeCategory === category.id;
                const isFavorite = favorites.includes(category.id);
                return (
                  <div key={category.id} className={`flex items-center gap-2 rounded-xl transition-all ${isActive ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-gray-900 shadow-lg shadow-amber-500/20' : 'border border-gray-800 bg-gray-900/50 text-slate-200 hover:border-gray-700 hover:bg-gray-800/70'}`}>
                    <button onClick={() => selectCategory(category.id)} className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left">
                      {category.icon}
                      <span className="truncate">{category.name}</span>
                    </button>
                    <button
                      onClick={() => toggleFavorite(category.id)}
                      className={`mr-2 rounded-lg px-2 py-1 text-lg leading-none transition ${isFavorite ? 'text-amber-300' : isActive ? 'text-gray-700 hover:text-gray-900' : 'text-slate-600 hover:text-amber-300'}`}
                      aria-label={isFavorite ? `นำ ${category.name} ออกจากรายการโปรด` : `เพิ่ม ${category.name} ในรายการโปรด`}
                    >
                      {isFavorite ? '★' : '☆'}
                    </button>
                  </div>
                );
              })}
            </nav>
            {!visibleCategories.length && <p className="rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-500">ไม่พบหมวดที่ค้นหา</p>}
          </aside>

          <main className="w-full md:w-3/4 lg:w-4/5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-amber-400/80">กำลังใช้งาน</p>
                <p className="mt-1 text-slate-300">{activeInfo?.name}</p>
              </div>
              <button onClick={() => toggleFavorite(activeCategory)} className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-300 transition hover:border-amber-400 hover:text-amber-300">
                {favorites.includes(activeCategory) ? '★ อยู่ในรายการโปรด' : '☆ เพิ่มในรายการโปรด'}
              </button>
            </div>
            {renderConverter()}
          </main>
        </div>
      </div>

      <footer className="container mx-auto px-4 py-5 text-center text-sm text-slate-500">
        <p>สร้างขึ้นเพื่อความสะดวกในการแปลงหน่วยวัดไทย • ใช้คีย์บอร์ดค้นหาได้ทันที</p>
      </footer>
    </div>
  );
};

export default App;
