import React from 'react';
import { IconHeart, IconStar, IconWatch, IconTie } from '../constants';

const BackgroundIcon: React.FC<{ 
  icon: React.ElementType; 
  top: string; 
  left?: string; 
  right?: string; 
  size: string; 
  opacity?: string; 
  colorClass?: string; 
  rotate?: string; 
  animationClass?: string; // Changed from 'animate' to 'animationClass'
}> = 
  ({ icon: IconComponent, top, left, right, size, opacity = 'opacity-100', colorClass = 'text-brand-primary/30', rotate = '0', animationClass }) => {
  const style: React.CSSProperties = {
    top,
    ...(left && { left }),
    ...(right && { right }),
    transform: `rotate(${rotate})`, // Base rotation
  };
  return (
    <div className={`absolute ${size} ${opacity} ${colorClass} pointer-events-none ${animationClass || ''}`} style={style}>
      <IconComponent className="w-full h-full" />
    </div>
  );
};


export const BackgroundArt: React.FC = () => {
  return (
    <>
      {/* Subtle pattern elements - using new color system */}
      <BackgroundIcon icon={IconHeart} top="10%" left="5%" size="w-16 h-16" opacity="opacity-30" colorClass="text-brand-secondary/20" rotate="-15deg" animationClass="animate-float-diag [animation-delay:-2s]" />
      <BackgroundIcon icon={IconStar} top="15%" right="8%" size="w-12 h-12" opacity="opacity-20" colorClass="text-brand-accent/20" rotate="10deg" animationClass="animate-float-diag" />
      <BackgroundIcon icon={IconWatch} top="60%" left="10%" size="w-20 h-20" opacity="opacity-25" colorClass="text-brand-primary/20" rotate="5deg" />
      <BackgroundIcon icon={IconTie} top="70%" right="12%" size="w-16 h-16" opacity="opacity-30" colorClass="text-brand-accent/25" rotate="-5deg" animationClass="animate-float-diag [animation-delay:-4s]" />
      <BackgroundIcon icon={IconHeart} top="30%" left="35%" size="w-8 h-8" opacity="opacity-10" colorClass="text-brand-secondary/10" rotate="25deg" />
      <BackgroundIcon icon={IconStar} top="80%" left="45%" size="w-10 h-10" opacity="opacity-15" colorClass="text-brand-primary/15" rotate="0deg" animationClass="animate-float-diag [animation-delay:-6s]" />

      {/* Large decorative circles/shapes from design - using new color system */}
      <div 
        className="absolute top-[-50px] right-[-100px] w-[400px] h-[400px] bg-brand-accent/5 rounded-full filter blur-3xl opacity-50 pointer-events-none animate-subtle-pulse"
      />
      <div 
        className="absolute bottom-[-80px] left-[-120px] w-[350px] h-[350px] bg-brand-secondary/5 rounded-full filter blur-3xl opacity-40 pointer-events-none animate-subtle-pulse [animation-delay:-2.5s]"
      />
       <div 
        className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-2 border-dashed border-brand-primary/10 rounded-full opacity-30 pointer-events-none"
      />
    </>
  );
};