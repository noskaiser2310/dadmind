import React, { useState, useRef, useEffect } from 'react';
import { IconPlay, IconPause, IconVolumeUp, IconVolumeOff, BACKGROUND_MUSIC_URL } from '../constants.tsx'; // Added .tsx extension

export const BackgroundMusicPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false); // Autoplay only after user interaction

  // Attempt to play only after first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);
  
  useEffect(() => {
    if (hasInteracted && audioRef.current) {
        if (isPlaying && !isMuted) {
            audioRef.current.play().catch(error => console.warn("Audio play prevented:", error));
        } else {
            audioRef.current.pause();
        }
        audioRef.current.muted = isMuted;
    }
  }, [isPlaying, isMuted, hasInteracted]);

  const togglePlay = () => {
    if (!hasInteracted) setHasInteracted(true); // Ensure interaction flag is set
    setIsPlaying(prev => !prev);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  // Do not render if music URL is just a placeholder or empty
  // The placeholder value is '/assets/relaxing-background-music.mp3' as per constants.tsx
  if (!BACKGROUND_MUSIC_URL || BACKGROUND_MUSIC_URL === '/assets/relaxing-background-music.mp3') {
    console.warn("BackgroundMusicPlayer: BACKGROUND_MUSIC_URL is a placeholder or not set. Music player will not render. Please provide a valid music URL in constants.tsx.");
    return null; 
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center space-x-2 p-2 bg-brand-bg-card/80 backdrop-blur-sm rounded-full shadow-lg border border-brand-border/30">
      <audio ref={audioRef} src={BACKGROUND_MUSIC_URL} loop preload="auto" />
      <button
        onClick={togglePlay}
        className="p-2 text-brand-primary hover:text-brand-accent rounded-full hover:bg-brand-primary/10 transition-colors"
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        title={isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc'}
      >
        {isPlaying && !isMuted ? <IconPause className="w-5 h-5" /> : <IconPlay className="w-5 h-5" />}
      </button>
      <button
        onClick={toggleMute}
        className="p-2 text-brand-primary hover:text-brand-accent rounded-full hover:bg-brand-primary/10 transition-colors"
        aria-label={isMuted ? 'Unmute music' : 'Mute music'}
        title={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
      >
        {isMuted ? <IconVolumeOff className="w-5 h-5" /> : <IconVolumeUp className="w-5 h-5" />}
      </button>
    </div>
  );
};