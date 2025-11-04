import * as React from 'react';

export function Badge({
  variant = 'default',
  children,
}: {
  variant?: 'default' | 'destructive';
  children?: React.ReactNode;
}) {
  const base = 'inline-block px-3 py-1 rounded-full text-xs font-semibold';
  const color =
    variant === 'destructive'
      ? 'bg-red-100 text-red-700 border border-red-200'
      : 'bg-blue-100 text-blue-700 border border-blue-200';
  return <span className={`${base} ${color}`}>{children}</span>;
}
