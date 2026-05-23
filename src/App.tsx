/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FavoritesMenu } from './components/FavoritesMenu';
import { Testimonial } from './components/Testimonial';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CartModal } from './components/CartModal';
import { AdminPanel } from './components/AdminPanel';

function AppContent() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Simple client-side routing listener
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    
    // Listen for back/forward navigation
    window.addEventListener('popstate', handleLocationChange);
    
    // Polyfill click capture of storefront /admin hash links
    const handleHashChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const isAdminRoute = currentPath === '/admin' || window.location.hash === '#admin';

  if (isAdminRoute) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between selection:bg-[#ff5c35] selection:text-white">
      
      {/* 1. Header Navigation */}
      <Navbar
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* 2. Visual Comic-Sticker Hero banner */}
      <Hero />

      {/* 3. Products list catalog grid with active searching/filters */}
      <FavoritesMenu
        searchQuery={searchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* 4. Testimonials client feedback quotes widget */}
      <Testimonial />

      {/* 5. Comic Registration Newsletter Form */}
      <Newsletter />

      {/* 6. Dynamic social footprints Footer */}
      <Footer />

      {/* 7. Slide-over checkout Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ToastProvider>
  );
}
