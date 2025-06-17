import React from 'react';

type CardProps = {
  children: React.ReactNode;
};

export default function Card({ children }: CardProps) {
  return (
    <div className="bg-card p-4 rounded shadow-card">
      {children}
    </div>
  );
}
