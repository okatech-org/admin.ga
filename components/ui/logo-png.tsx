'use client';

import React from 'react';
import Image from 'next/image';

interface LogoPNGProps {
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
}

export const LogoPNG: React.FC<LogoPNGProps> = ({
  className = '',
  width = 40,
  height = 40,
  alt = 'Logo ADMINISTRATION.GA'
}) => {
  return (
    <Image
      src="/images/logo-administration-ga.png"
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
    />
  );
};

export default LogoPNG;
