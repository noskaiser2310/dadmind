
import React from 'react';
import { Outlet, Link } from 'react-router-dom'; // Added Link
import { Header } from './Header';
import { BackgroundArt } from './BackgroundArt';
import { BackgroundMusicPlayer } from './BackgroundMusicPlayer'; // Added Music Player
import { APP_NAME } from '../constants'; 

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-main text-brand-dark-text font-sans relative overflow-x-hidden flex flex-col">
      <BackgroundArt />
      <Header />
      <main className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28 sm:pt-32 md:pt-28 flex-grow"> {/* Added flex-grow */}
        <Outlet />
      </main>
      <footer className="relative z-10 text-center py-8 mt-12 border-t border-brand-primary/10 bg-white/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-brand-light-text mb-2">
                &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
            <div className="flex justify-center space-x-4 text-xs sm:text-sm">
                <Link to="#" className="text-brand-primary hover:text-brand-accent hover:underline transition-colors">
                    Về chúng tôi
                </Link>
                <span className="text-brand-light-text/50">|</span>
                <Link to="#" className="text-brand-primary hover:text-brand-accent hover:underline transition-colors">
                    Chính sách bảo mật
                </Link>
            </div>
        </div>
      </footer>
      <BackgroundMusicPlayer /> {/* Added music player globally */}
    </div>
  );
};