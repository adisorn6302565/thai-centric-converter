import React, { useEffect, useMemo, useState } from 'react';
import Card from './Card';
import { UNIT_CONFIGS, CATEGORIES_DATA } from '../constants';
import { Unit, CategoryId } from '../types';
import { ArrowDownIcon, SwapIcon } from './icons';

interface GenericConverterProps {
  categoryId: CategoryId;
}

const numberFormat = new Intl.NumberFormat('th-TH', { maximumFractionDigits: 4 });
const inputStyles = 'w-full rounded-lg border border-gray-700 bg-gray-800 p-3 transition-colors focus:border-amber-500 focus:ring-0';
const selectStyles = 'w-full appearance-none rounded-lg border border-gray-700 bg-gray-800 p-3 transition-colors focus:border-amber-500 focus:ring-0';

const GenericConverter: React.FC<GenericConverterProps> = ({ categoryId }) => {
  const config = UNIT_CONFIGS[categoryId];
  const categoryInfo = CATEGORIES_DATA[categoryId];
  const { units, description } = config || {};
  const unitKeys = units ? Object.keys(units) : [];
  const [inputValue, setInputValue] = useState<number>(1);
  const [fromUnit, setFromUnit] = useState<string>(unitKeys[1] || unitKeys[0]);
  const [toUnit, setToUnit] = useState<string>(unitKeys[0]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (units) {
      const keys = Object.keys(units);
      setFromUnit(keys[1] || keys[0]);
      setToUnit(keys[0]);
      setInputValue(1);
      setCopied(false);
    }
  }, [categoryId, units]);

  const result = useMemo(() => {
    if (!units) return 0;
    const from: Unit | undefined = units[fromUnit];
    const to: Unit | undefined = units[toUnit];
    if (!from || !to) return 0;
    return to.fromBase(from.toBase(inputValue));
  }, [inputValue, fromUnit, toUnit, units]);

  const oneUnitResult = useMemo(() => {
    if (!units) return 0;
    const from = units[fromUnit];
    const to = units[toUnit];
    return from && to ? to.fromBase(from.toBase(1)) : 0;
  }, [fromUnit, toUnit, units]);

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const copyResult = async () => {
    const text = `${numberFormat.format(inputValue)} ${units?.[fromUnit]?.name || ''} = ${numberFormat.format(result)} ${units?.[toUnit]?.name || ''}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  if (!config || !categoryInfo || !units) {
    return <Card title="เกิดข้อผิดพลาด"><p>ไม่พบการตั้งค่าของหมวดนี้</p></Card>;
  }

  return (
    <Card title={`แปลงหน่วย${categoryInfo.name}`}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2">
          <div>
            <label htmlFor={`${categoryId}-fromValue`} className="mb-2 block text-sm font-medium text-slate-400">จำนวน</label>
            <input id={`${categoryId}-fromValue`} type="number" min="0" step="any" value={inputValue} onChange={(event) => setInputValue(parseFloat(event.target.value) || 0)} className={inputStyles} />
          </div>
          <div>
            <label htmlFor={`${categoryId}-fromUnit`} className="mb-2 block text-sm font-medium text-slate-400">จากหน่วย</label>
            <select id={`${categoryId}-fromUnit`} value={fromUnit} onChange={(event) => setFromUnit(event.target.value)} className={selectStyles}>
              {Object.values(units).map((unit) => <option key={unit.key} value={unit.key}>{unit.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-center gap-3 text-slate-500">
          <button onClick={swapUnits} className="rounded-full border border-gray-700 bg-gray-800 p-3 transition hover:scale-105 hover:border-amber-500 hover:text-amber-400" aria-label="สลับหน่วยต้นทางและปลายทาง" title="สลับหน่วย">
            <SwapIcon />
          </button>
          <ArrowDownIcon />
        </div>

        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label htmlFor={`${categoryId}-toValue`} className="block text-sm font-medium text-slate-400">ผลลัพธ์</label>
              <button onClick={copyResult} className="text-xs text-amber-300 hover:text-amber-200">{copied ? 'คัดลอกแล้ว ✓' : 'คัดลอกผลลัพธ์'}</button>
            </div>
            <div id={`${categoryId}-toValue`} className="w-full rounded-lg bg-gray-950 p-3 text-right font-mono text-2xl text-amber-300">{numberFormat.format(result)}</div>
          </div>
          <div>
            <label htmlFor={`${categoryId}-toUnit`} className="mb-2 block text-sm font-medium text-slate-400">เป็นหน่วย</label>
            <select id={`${categoryId}-toUnit`} value={toUnit} onChange={(event) => setToUnit(event.target.value)} className={selectStyles}>
              {Object.values(units).map((unit) => <option key={unit.key} value={unit.key}>{unit.name}</option>)}
            </select>
          </div>
        </div>

        <div className="rounded-lg border border-amber-400/20 bg-amber-400/5 p-4 text-sm text-amber-100">
          <p><strong>อัตราแปลง:</strong> 1 {units[fromUnit]?.name} = {numberFormat.format(oneUnitResult)} {units[toUnit]?.name}</p>
          <p className="mt-2 text-xs text-slate-400"><strong>ข้อมูล:</strong> {description}</p>
        </div>
      </div>
    </Card>
  );
};

export default GenericConverter;
