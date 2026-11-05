import React from 'react';

interface InstituteLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'horizontal' | 'vertical' | 'iconOnly' | 'compact';
  theme?: 'dark' | 'light' | 'white';
  showText?: boolean;
}

export const InstituteLogo: React.FC<InstituteLogoProps> = ({className = '', size = 'md', variant = 'horizontal', theme = 'dark', showText = true}) => {
  const iconOnly = variant === 'iconOnly' || !showText;
  const white = theme === 'white' || theme === 'light';
  const sizes = {
    sm: 'w-[96px] sm:w-[120px]',
    md: 'w-[92px] min-[360px]:w-[120px] sm:w-[142px]',
    lg: 'w-[220px] sm:w-[260px]',
    xl: 'w-[260px] sm:w-[320px]',
  };
  const iconSizes = {sm: 'h-8 sm:h-10', md: 'h-10 sm:h-12', lg: 'h-16 sm:h-20', xl: 'h-24 sm:h-28'};
  return (
    <span className={`inline-flex shrink-0 items-center justify-center bg-transparent ${className}`}>
      <img
        src={iconOnly ? '/logo-emblema.png' : white ? '/logo-instituto-white.png' : '/logo-instituto.png'}
        alt={iconOnly ? 'Emblema Instituto Caminho e Forma' : 'Instituto Caminho e Forma'}
        width={iconOnly ? 1254 : 1448}
        height={iconOnly ? 1254 : white ? 567 : 565}
        className={`${iconOnly ? `${iconSizes[size]} w-auto` : `${sizes[size]} h-auto`} object-contain`}
      />
    </span>
  );
};
