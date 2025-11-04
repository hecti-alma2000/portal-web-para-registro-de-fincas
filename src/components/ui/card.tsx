import * as React from 'react';

export function Card({
  className = '',
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <div className={`bg-white rounded-xl shadow p-6 ${className}`}>{children}</div>;
}

export function CardHeader({
  className = '',
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardContent({
  className = '',
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <div className={className}>{children}</div>;
}

export function CardTitle({
  className = '',
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}
