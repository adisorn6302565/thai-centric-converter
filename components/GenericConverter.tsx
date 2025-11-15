import React, { useState, useMemo, useEffect } from 'react';
import Card from './Card';
// FIX: Update the import for 'CategoryId' to point to '../types' to resolve an error.
import { UNIT_CONFIGS, CATEGORIES_DATA } from '../constants';
import { Unit, CategoryId } from '../types';
import { ArrowDownIcon } from './icons';

interface GenericConverterProps {
  categoryId: CategoryId;
}

const numberFormat = new Intl.NumberFormat('th-TH', { maximumFractionDigits: 4 });
const inputStyles = "w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:ring-0 focus:border-amber-500 transition-colors";
const selectStyles = "w-full bg-gray-800 border border-gray-700 rounded-lg p-3 focus:ring-0 focus:border-amber-500 transition-colors appearance-none";


const GenericConverter: React.FC<GenericConverterProps> = ({ categoryId }) => {
  const config = UNIT_CONFIGS[categoryId];
  const categoryInfo = CATEGORIES_DATA[categoryId];

  const { units, description } = config || {};
  const unitKeys = units ? Object.keys(units) : [];

  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>(unitKeys[1] || unitKeys[0]);
  const [toUnit, setToUnit] = useState<string>(unitKeys[0]);

  useEffect(() => {
    if (units) {
      const unitKeys = Object.keys(units);
      setFromUnit(unitKeys[1] || unitKeys[0]);
      setToUnit(unitKeys[0]);
      setInputValue(1);
    }
  }, [categoryId, units]);


  const result = useMemo(() => {
    if (!inputValue || !units) return 0;
    const from: Unit = units[fromUnit];
    const to: Unit = units[toUnit];
    if (!from || !to) return 0;
    
    const baseValue = from.toBase(inputValue);
    return to.fromBase(baseValue);
  }, [inputValue, fromUnit, toUnit, units]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(parseFloat(e.target.value) || 0);
  };
  
  if (!config || !categoryInfo || !units) {
    return <Card title="Error"><p>Could not load converter configuration.</p></Card>;
  }
  
  return (
    <Card title={`แปลงหน่วย${categoryInfo.name}`}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label htmlFor="fromValue" className="block text-sm font-medium text-slate-400 mb-2">จำนวน</label>
            <input id="fromValue" type="number" value={inputValue} onChange={handleInputChange} className={inputStyles} />
          </div>
          <div>
            <label htmlFor="fromUnit" className="block text-sm font-medium text-slate-400 mb-2">จากหน่วย</label>
            <select id="fromUnit" value={fromUnit} onChange={e => setFromUnit(e.target.value)} className={selectStyles}>
              {Object.values(units).map(unit => <option key={unit.key} value={unit.key}>{unit.name}</option>)}
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
                {Object.values(units).map(unit => <option key={unit.key} value={unit.key}>{unit.name}</option>)}
              </select>
            </div>
        </div>

        <div className="text-sm text-slate-400 pt-4 border-t border-gray-800 bg-gray-950/50 p-4 rounded-lg">
            <p><strong>ข้อมูล:</strong> {description}</p>
        </div>
      </div>
    </Card>
  );
};

export default GenericConverter;
