/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingCart, Search, Menu, X, ShieldAlert } from 'lucide-react';
import { useToast } from './Toast';
import { QuirkyFruityLogo } from './PaymentLogos';

interface NavbarProps {
  onCartToggle: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onCartToggle,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
}) => {
  const { siteSettings, cart, categories, isAdminLoggedIn } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toast = useToast();

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const resetFilters = () => {
    setActiveCategory(null);
    setSearchQuery('');
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 font-sans px-4 sm:px-8 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Dynamic Logo & Name */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            resetFilters();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 group cursor-pointer"
          id="navbar-logo"
        >
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shadow-xs border border-emerald-100 transform group-hover:scale-105 transition-transform p-0.5">
            <QuirkyFruityLogo className="w-full h-full" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 hover:text-emerald-600 transition-colors capitalize">
            {siteSettings.websiteName || 'quirky-fruity'}
          </span>
        </a>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md relative mx-4">
          <input
            type="text"
            placeholder={`Search ${siteSettings.websiteName || 'beverages'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 border border-slate-200 px-4 py-1.5 pl-10 rounded-full font-medium text-sm text-slate-850 outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white transition-all shadow-inner"
            id="desktop-search-input"
          />
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-450" />
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Quick Category Anchors - Desktop */}
          <div className="hidden lg:flex items-center gap-2 font-semibold text-sm text-slate-700">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-1.5 rounded-full border transition-all cursor-pointer ${
                activeCategory === null
                  ? 'bg-emerald-600 text-white border-emerald-650 shadow-sm'
                  : 'bg-slate-50 text-slate-650 border-slate-200 hover:bg-slate-100 hover:translate-y-[-1px]'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.name);
                  const el = document.getElementById('menu');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border transition-all cursor-pointer ${
                  activeCategory === cat.name
                    ? 'bg-emerald-600 text-white border-emerald-650 shadow-sm'
                    : 'bg-slate-50 text-slate-650 border-slate-200 hover:bg-slate-100 hover:translate-y-[-1px]'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Admin Indicator Badge (Quiet indicator if admin is logged in) */}
          {isAdminLoggedIn && (
            <a
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-full hover:bg-rose-100 transition-colors shadow-xs"
              title="Admin Mode Enabled"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin Mode</span>
            </a>
          )}

          {/* Cart Icon trigger */}
          <button
            onClick={onCartToggle}
            className="relative p-2 bg-slate-105 rounded-full border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 text-slate-600 transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-sm"
            aria-label="Toggle cart modal view"
            id="navbar-cart-trigger"
          >
            <ShoppingCart className="w-5 h-5" />
            
            {/* Animated Badge Count */}
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold shadow-sm">
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 block lg:hidden cursor-pointer"
            id="mobile-menu-trigger"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mt-3 py-3 border-t border-slate-100 flex flex-col gap-3 lg:hidden font-sans">
          
          {/* Mobile Search Input */}
          <div className="relative w-full md:hidden">
            <input
              type="text"
              placeholder={`Search products...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 px-4 py-1.5 pl-10 rounded-full font-medium text-sm text-slate-800 focus:bg-white outline-none"
              id="mobile-search-input"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          </div>

          {/* Mobile Categories lists */}
          <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">Categories</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setActiveCategory(null);
                setMobileMenuOpen(false);
              }}
              className={`px-3.5 py-1.5 rounded-full border text-xs font-bold ${
                activeCategory === null
                  ? 'bg-emerald-600 text-white border-emerald-650'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              All Beverages
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.name);
                  setMobileMenuOpen(false);
                  const el = document.getElementById('menu');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold ${
                  activeCategory === cat.name
                    ? 'bg-emerald-600 text-white border-emerald-650'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
