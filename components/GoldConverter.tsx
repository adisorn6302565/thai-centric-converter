import React, { useState, useMemo } from 'react';
import Card from './Card';
import { GOLD_UNITS, GOLD_UNITS_BAR, GOLD_UNITS_JEWELRY } from '../constants';
import { ArrowDownIcon } from './icons';

type GoldType = 'bar' | 'jewelry';
const numberFormat = new Intl.NumberFormat('th-TH', { maximumFractionDigits: 4 });
const inputStyles = "w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:ring-0 focus:border-amber-500 transition-colors";
const selectStyles = "w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:ring-0 focus:border-amber-500 transition-colors appearance-none";

const GoldConverter: React.FC = () => {
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>('baht');
  const [toUnit, setToUnit] = useState<string>('gram');
  const [goldType, setGoldType] = useState<GoldType>('bar');

  const getBahtWeight = (type: GoldType) => type === 'bar' ? GOLD_UNITS_BAR : GOLD_UNITS_JEWELRY;

  const toBase = (value: number, unit: string, type: GoldType) => {
    if (unit === 'baht') return value * getBahtWeight(type);
    if (unit === 'salung') return value * (getBahtWeight(type) / 4);
    return GOLD_UNITS[unit].toBase(value);
  };
  
  const fromBase = (value: number, unit: string, type: GoldType) => {
    if (unit === 'baht') return value / getBahtWeight(type);
    if (unit === 'salung') return value / (getBahtWeight(type) / 4);
    return GOLD_UNITS[unit].fromBase(value);
  };
  
  const result = useMemo(() => {
    if (!inputValue) return 0;
    const baseValue = toBase(inputValue, fromUnit, goldType);
    return fromBase(baseValue, toUnit, goldType);
  }, [inputValue, fromUnit, toUnit, goldType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(parseFloat(e.target.value) || 0);
  };

  return (
    <Card title="แปลงหน่วยทองคำ (บาท-สลึง)">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">ประเภททองคำ</label>
          <div className="flex bg-gray-800 border border-gray-700 rounded-lg p-1">
            <button onClick={() => setGoldType('bar')} className={`w-1/2 p-2 rounded-md transition-colors text-slate-300 ${goldType === 'bar' ? 'bg-amber-500 text-slate-900 font-semibold' : 'hover:bg-gray-700'}`}>ทองคำแท่ง</button>
            <button onClick={() => setGoldType('jewelry')} className={`w-1/2 p-2 rounded-md transition-colors text-slate-300 ${goldType === 'jewelry' ? 'bg-amber-500 text-slate-900 font-semibold' : 'hover:bg-gray-700'}`}>ทองรูปพรรณ</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label htmlFor="fromValue" className="block text-sm font-medium text-slate-400 mb-2">จำนวน</label>
            <input id="fromValue" type="number" value={inputValue} onChange={handleInputChange} className={inputStyles} />
          </div>
          <div>
            <label htmlFor="fromUnit" className="block text-sm font-medium text-slate-400 mb-2">จากหน่วย</label>
            <select id="fromUnit" value={fromUnit} onChange={e => setFromUnit(e.target.value)} className={selectStyles}>
              {Object.values(GOLD_UNITS).map(unit => <option key={unit.key} value={unit.key}>{unit.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-center text-slate-500 my-2">
            <ArrowDownIcon />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label htmlFor="toValue" className="block text-sm font-medium text-slate-400 mb-2">ผลลัพธ์</label>
              <div id="toValue" className="w-full bg-gray-950 rounded-lg p-3 font-mono text-2xl text-amber-300 text-right">{numberFormat.format(result)}</div>
            </div>
            <div>
              <label htmlFor="toUnit" className="block text-sm font-medium text-slate-400 mb-2">เป็นหน่วย</label>
              <select id="toUnit" value={toUnit} onChange={e => setToUnit(e.target.value)} className={selectStyles}>
                {Object.values(GOLD_UNITS).map(unit => <option key={unit.key} value={unit.key}>{unit.name}</option>)}
              </select>
            </div>
        </div>

        <div className="text-xs text-slate-500 pt-4 border-t border-gray-800">
            <p><strong>อ้างอิง:</strong> 1 บาท (ทองคำแท่ง) = {GOLD_UNITS_BAR} กรัม | 1 บาท (ทองรูปพรรณ) = {GOLD_UNITS_JEWELRY} กรัม | 1 บาท = 4 สลึง</p>
        </div>
      </div>
    </Card>
  );
};

export default GoldConverter;