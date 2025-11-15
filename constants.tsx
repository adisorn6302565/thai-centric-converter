import React from 'react';
// FIX: Import CategoryId from './types' to break the circular dependency.
import { Category, Unit, CategoryId } from './types';
import { AreaIcon, GoldIcon, AgricultureIcon, LengthIcon, WeightIcon, VolumeIcon } from './components/icons';

// FIX: Explicitly type CATEGORIES_DATA with the imported CategoryId to ensure correctness.
export const CATEGORIES_DATA: { [key in CategoryId]: { name: string; icon: JSX.Element } } = {
  land: { name: 'ที่ดิน (ไร่-งาน-วา)', icon: <AreaIcon /> },
  gold: { name: 'ทองคำ (บาท-สลึง)', icon: <GoldIcon /> },
  agriculture: { name: 'เกษตร (เกวียน-ถัง)', icon: <AgricultureIcon /> },
  length: { name: 'ความยาว (วา-ศอก-คืบ)', icon: <LengthIcon /> },
  weight: { name: 'น้ำหนัก (หาบ-ชั่ง)', icon: <WeightIcon /> },
  volume: { name: 'ปริมาตร (ทะนาน)', icon: <VolumeIcon /> },
};

// FIX: Update CATEGORIES array creation to align with the new typing.
export const CATEGORIES: Category[] = (Object.keys(CATEGORIES_DATA) as CategoryId[]).map(key => ({
  id: key,
  name: CATEGORIES_DATA[key].name,
  icon: CATEGORIES_DATA[key].icon,
}));

// Base unit for land is Square Meter
export const LAND_UNITS: { [key: string]: Unit } = {
  sqm: { key: 'sqm', name: 'ตารางเมตร', toBase: v => v, fromBase: v => v },
  rai: { key: 'rai', name: 'ไร่', toBase: v => v * 1600, fromBase: v => v / 1600 },
  ngan: { key: 'ngan', name: 'งาน', toBase: v => v * 400, fromBase: v => v / 400 },
  sqwa: { key: 'sqwa', name: 'ตารางวา', toBase: v => v * 4, fromBase: v => v / 4 },
  acre: { key: 'acre', name: 'เอเคอร์', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
  hectare: { key: 'hectare', name: 'เฮกตาร์', toBase: v => v * 10000, fromBase: v => v / 10000 },
  sqft: { key: 'sqft', name: 'ตารางฟุต', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
};

// Base unit for gold is Gram
export const GOLD_UNITS_BAR = 15.244; // 1 Baht for gold bar
export const GOLD_UNITS_JEWELRY = 15.16; // 1 Baht for gold jewelry

export const GOLD_UNITS: { [key: string]: Unit } = {
    gram: { key: 'gram', name: 'กรัม', toBase: v => v, fromBase: v => v },
    baht: { key: 'baht', name: 'บาท', toBase: () => { throw new Error('Use specific gold type converter') }, fromBase: () => { throw new Error('Use specific gold type converter')} },
    salung: { key: 'salung', name: 'สลึง', toBase: () => { throw new Error('Use specific gold type converter') }, fromBase: () => { throw new Error('Use specific gold type converter')} },
    ounce: { key: 'ounce', name: 'ออนซ์ (troy)', toBase: v => v * 31.1035, fromBase: v => v / 31.1035 },
};

// Base unit for agriculture is Kilogram
export const AGRICULTURE_UNITS: { [key: string]: Unit } = {
    kg: { key: 'kg', name: 'กิโลกรัม', toBase: v => v, fromBase: v => v },
    kwian: { key: 'kwian', name: 'เกวียน (ข้าวเปลือก)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    thang: { key: 'thang', name: 'ถัง (ข้าวสาร)', toBase: v => v * 15, fromBase: v => v / 15 },
};

// Base unit for length is Meter
export const LENGTH_UNITS: { [key: string]: Unit } = {
    m: { key: 'm', name: 'เมตร', toBase: v => v, fromBase: v => v },
    wa: { key: 'wa', name: 'วา', toBase: v => v * 2, fromBase: v => v / 2 },
    sok: { key: 'sok', name: 'ศอก', toBase: v => v * 0.5, fromBase: v => v / 0.5 },
    kuep: { key: 'kuep', name: 'คืบ', toBase: v => v * 0.25, fromBase: v => v / 0.25 },
    sen: { key: 'sen', name: 'เส้น', toBase: v => v * 40, fromBase: v => v / 40 },
    yot: { key: 'yot', name: 'โยชน์', toBase: v => v * 16000, fromBase: v => v / 16000 },
};

// Base unit for weight is Kilogram
export const WEIGHT_UNITS: { [key: string]: Unit } = {
    kg: { key: 'kg', name: 'กิโลกรัม', toBase: v => v, fromBase: v => v },
    hap: { key: 'hap', name: 'หาบ', toBase: v => v * 60, fromBase: v => v / 60 },
    chang: { key: 'chang', name: 'ชั่ง', toBase: v => v * 1.2, fromBase: v => v / 1.2 },
    tamlueng: { key: 'tamlueng', name: 'ตำลึง', toBase: v => v * 0.06, fromBase: v => v / 0.06 }, // 60g
};

// Base unit for volume is Liter
export const VOLUME_UNITS: { [key: string]: Unit } = {
    l: { key: 'l', name: 'ลิตร', toBase: v => v, fromBase: v => v },
    thanan: { key: 'thanan', name: 'ทะนาน', toBase: v => v * 1, fromBase: v => v / 1 },
};

export const UNIT_CONFIGS: { [key in CategoryId]?: { units: { [key: string]: Unit }, description: string } } = {
  agriculture: { units: AGRICULTURE_UNITS, description: '1 เกวียน (ข้าวเปลือก) = 1,000 กก. | 1 ถัง (ข้าวสาร) = 15 กก.' },
  length: { units: LENGTH_UNITS, description: '1 วา = 2 เมตร | 1 เส้น = 20 วา | 1 โยชน์ = 400 เส้น' },
  weight: { units: WEIGHT_UNITS, description: '1 หาบ = 50 ชั่ง | 1 ชั่ง = 20 ตำลึง' },
  volume: { units: VOLUME_UNITS, description: '1 ทะนาน = 1 ลิตร' },
};
