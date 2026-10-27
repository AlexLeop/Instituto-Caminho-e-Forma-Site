import React from 'react';
import { LOGO_IMAGE } from '../data/mockData';

interface InstituteLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'horizontal' | 'vertical' | 'iconOnly' | 'compact';
  theme?: 'dark' | 'light' | 'white';
  showText?: boolean;
}

export const InstituteLogo: React.FC<InstituteLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'horizontal',
  theme = 'dark',
  showText = true,
}) => {
  // Height presets tailored for high presence without any white background
  const sizeMap = {
    sm: {
      container: 'h-10 sm:h-12',
      emblem: 'h-8 sm:h-10',
      verticalSvg: 'h-12 sm:h-14',
      subText: 'text-[9px] sm:text-[11px] tracking-[0.2em]',
      mainText: 'text-[12px] sm:text-[14px] tracking-[0.06em]',
    },
    md: {
      container: 'h-11 sm:h-13',
      emblem: 'h-10 sm:h-12',
      verticalSvg: 'h-12 sm:h-14',
      subText: 'text-[9px] sm:text-[10.5px] tracking-[0.18em]',
      mainText: 'text-[13px] sm:text-[15.5px] tracking-[0.05em]',
    },
    lg: {
      container: 'h-16 sm:h-20',
      emblem: 'h-14 sm:h-18',
      verticalSvg: 'h-20 sm:h-24',
      subText: 'text-[12px] sm:text-[14px] tracking-[0.24em]',
      mainText: 'text-[18px] sm:text-[22px] tracking-[0.09em]',
    },
    xl: {
      container: 'h-20 sm:h-28',
      emblem: 'h-18 sm:h-24',
      verticalSvg: 'h-28 sm:h-36',
      subText: 'text-[14px] sm:text-[16px] tracking-[0.26em]',
      mainText: 'text-[22px] sm:text-[28px] tracking-[0.1em]',
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const isLightOrWhite = theme === 'white' || theme === 'light';

  // Typography color adapting smoothly with zero white background container
  const textColorClass = isLightOrWhite
    ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]'
    : 'text-[#191c1e]';

  // 1. Icon Only Variant (just the celebratory emblem)
  if (variant === 'iconOnly' || !showText) {
    return (
      <div className={`inline-flex items-center justify-center bg-transparent select-none ${className}`}>
        <img
          src="/logo-emblema.svg"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.endsWith('/logo-instituto.png')) {
              target.src = '/logo-instituto.png';
            }
          }}
          alt="Emblema Instituto Caminho e Forma"
          className={`${currentSize.emblem} w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-sm`}
        />
      </div>
    );
  }

  // 2. Vertical Variant (emblem stacked on top of text, tight bounding box, no white background)
  if (variant === 'vertical') {
    return (
      <div className={`inline-flex flex-col items-center justify-center bg-transparent select-none ${className}`}>
        <img
          src={isLightOrWhite ? '/logo-instituto-white.svg' : '/logo-instituto.svg'}
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.endsWith('/logo-instituto.png')) {
              target.src = '/logo-instituto.png';
            }
          }}
          alt="Instituto Caminho e Forma"
          className={`${currentSize.verticalSvg} w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-sm`}
        />
      </div>
    );
  }

  // 3. Horizontal / Full / Compact Variant (Emblem on left + Typography on right)
  // Perfectly fits standard navigation headers and footers with expansive size and 100% transparent background
  return (
    <div className={`inline-flex items-center gap-3 sm:gap-4 bg-transparent select-none transition-all ${className}`}>
      {/* Celebratory Emblem (Figures + Path + Droplets) */}
      <img
        src="/logo-emblema.svg"
        onError={(e) => {
          const target = e.currentTarget;
          if (!target.src.endsWith('/logo-instituto.png')) {
            target.src = '/logo-instituto.png';
          }
        }}
        alt="Emblema Instituto Caminho e Forma"
        className={`${currentSize.emblem} w-auto object-contain transition-transform duration-300 group-hover:scale-105 shrink-0 filter drop-shadow-sm`}
      />

      {/* Typography: INSTITUTO CAMINHO E FORMA */}
      <div className="flex flex-col justify-center leading-none select-none text-left">
        <span 
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          className={`font-semibold uppercase ${currentSize.subText} ${textColorClass} transition-colors duration-200`}
        >
          Instituto
        </span>
        <span 
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          className={`font-bold uppercase mt-1 ${currentSize.mainText} ${textColorClass} transition-colors duration-200 leading-tight whitespace-nowrap`}
        >
          Caminho e Forma
        </span>
      </div>
    </div>
  );
};
