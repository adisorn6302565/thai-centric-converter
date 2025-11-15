import React from 'react';

// FIX: Define CategoryId here as a string literal type to break the circular dependency with constants.ts.
export type CategoryId = 'land' | 'gold' | 'agriculture' | 'length' | 'weight' | 'volume';

export interface Category {
  id: CategoryId;
  name: string;
  icon: JSX.Element;
}

export interface Unit {
  key: string;
  name: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}
