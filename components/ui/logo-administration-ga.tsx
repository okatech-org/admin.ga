'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface LogoAdministrationGAProps {
  className?: string;
  width?: number;
  height?: number;
  usePNG?: boolean; // Option pour utiliser le PNG au lieu du SVG
}

export const LogoAdministrationGA: React.FC<LogoAdministrationGAProps> = ({
  className = '',
  width = 40,
  height = 40,
  usePNG = false
}) => {
  const [imageError, setImageError] = useState(false);

  // Si usePNG est activé et que l'image n'a pas d'erreur, utiliser le PNG
  if (usePNG && !imageError) {
    return (
      <Image
        src="/images/logo-administration-ga.png"
        alt="Logo ADMINISTRATION.GA"
        width={width}
        height={height}
        className={className}
        onError={() => setImageError(true)}
        priority
      />
    );
  }

  // Sinon, utiliser le SVG par défaut
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Logo exactement comme dans l'image - profil humain à droite, éléments organiques à gauche */}
      <g>
        {/* Forme principale - profil humain à droite (jaune) */}
        <path
          d="M 60 15
             C 60 10, 65 8, 70 8
             C 80 8, 85 12, 85 20
             L 85 30
             C 85 35, 83 38, 80 40
             L 78 42
             C 76 44, 74 44, 72 42
             L 70 40
             C 68 38, 66 35, 66 30
             L 66 20
             C 66 15, 68 12, 70 10
             Z"
          fill="#FFD700"
        />

        {/* Œil dans le profil */}
        <ellipse cx="75" cy="22" rx="3" ry="2" fill="#FFFFFF"/>
        <circle cx="75" cy="22" r="1.5" fill="#1a5490"/>

        {/* Éléments organiques/cheveux à gauche (vert et bleu) */}
        {/* Couche la plus à gauche - vert clair */}
        <path
          d="M 15 20
             C 15 15, 20 12, 25 12
             C 30 12, 35 15, 35 20
             L 35 30
             C 35 35, 30 38, 25 38
             L 20 38
             C 18 38, 17 37, 17 35
             L 17 25
             C 17 22, 18 20, 20 18
             Z"
          fill="#90EE90"
        />

        {/* Couche intermédiaire - vert émeraude */}
        <path
          d="M 25 18
             C 25 13, 30 10, 35 10
             C 40 10, 45 13, 45 18
             L 45 28
             C 45 33, 40 36, 35 36
             L 30 36
             C 28 36, 27 35, 27 33
             L 27 23
             C 27 20, 28 18, 30 16
             Z"
          fill="#228B22"
        />

        {/* Couche proche du visage - bleu */}
        <path
          d="M 35 16
             C 35 11, 40 8, 45 8
             C 50 8, 55 11, 55 16
             L 55 26
             C 55 31, 50 34, 45 34
             L 40 34
             C 38 34, 37 33, 37 31
             L 37 21
             C 37 18, 38 16, 40 14
             Z"
          fill="#3A75C4"
        />

        {/* Éléments décoratifs - bulles/points à gauche */}
        <circle cx="12" cy="25" r="2" fill="#FFD700" opacity="0.8"/>
        <circle cx="10" cy="30" r="1.5" fill="#87CEEB" opacity="0.8"/>
        <circle cx="14" cy="35" r="2.5" fill="#1a5490" opacity="0.8"/>
        <circle cx="8" cy="28" r="1" fill="#FFD700" opacity="0.6"/>
        <circle cx="16" cy="32" r="1.5" fill="#228B22" opacity="0.6"/>
      </g>
    </svg>
  );
};

export default LogoAdministrationGA;
