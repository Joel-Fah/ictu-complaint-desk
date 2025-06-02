"use client";
import React from 'react';
import './styles/grids.css';

interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: { sm: number; md: number; lg: number };
}

export const ResponsiveGrid = ({ 
  children, 
  cols = { sm: 1, md: 2, lg: 3 } 
}: ResponsiveGridProps) => {
  return (
    <div className={`grid 
  grid-cols-1     // 1 col by default (mobile)
  sm:grid-cols-2  // 2 cols after 640px
  md:grid-cols-3  // 3 cols after 768px
  gap-4
	overflow-hidden  // ← Prevents scrollbars
  w-full          // ← Ensures width containment
>
      {children}
    </div>
  );
};