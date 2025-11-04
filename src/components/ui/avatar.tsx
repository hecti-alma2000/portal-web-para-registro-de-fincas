import * as React from 'react';

export function Avatar({
  className = '',
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-700 ${className}`}
    >
      {children}
    </span>
  );
}

export function AvatarImage({ src, alt }: { src?: string; alt?: string }) {
  return src ? (
    <img src={src} alt={alt} className="rounded-full object-cover w-full h-full" />
  ) : null;
}

export function AvatarFallback({
  children,
  className = '',
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`w-full h-full flex items-center justify-center ${className}`}>
      {children}
    </span>
  );
}
