import * as React from 'react';

export function Badge({
  variant = 'default',
  children,
}: {
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  children?: React.ReactNode;
}) {
  const base = 'inline-block px-3 py-1 rounded-full text-xs font-semibold';
  let color = 'bg-blue-100 text-blue-700 border border-blue-200';
  if (variant === 'destructive') {
    color = 'bg-red-100 text-red-700 border border-red-200';
  } else if (variant === 'success') {
    color = 'bg-green-100 text-green-700 border border-green-200';
  } else if (variant === 'warning') {
    color = 'bg-yellow-100 text-yellow-700 border border-yellow-200';
  }

  return <span className={`${base} ${color}`}>{children}</span>;
}
