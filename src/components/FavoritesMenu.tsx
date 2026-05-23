/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { Plus, Star, AlertCircle, ShoppingCart } from 'lucide-react';
import { useToast } from './Toast';

interface FavoritesMenuProps {
  searchQuery: string;
  activeCategory: string | null;
  setActiveCategory: (category: string | null) => void;
}

export const FavoritesMenu: React.FC<FavoritesMenuProps> = ({
  searchQuery,
  activeCategory,
  setActiveCategory,
}) => {
  const { products, categories, reviews, addReview, addToCart, orders } = useApp();
  const toast = useToast();

  const [reviewingProduct, setReviewingProduct] = useState<Product | null>(null);
  const [revName, setRevName] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [verificationKey, setVerificationKey] = useState('');

  // Filtering products
  const filteredProducts = products.filter((prod) => {
    if (!prod.isActive) return false;
    
    const matchesCategory = activeCategory
      ? prod.category.toLowerCase().trim() === activeCategory.toLowerCase().trim()
      : true;

    const matchesSearch = searchQuery
      ? prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesCategory && matchesSearch;
  });

  const handleOpenReview = (prod: Product) => {
    setReviewingProduct(prod);
    setRevName('');
    setRevRating(5);
    setRevComment('');
  };

  const handleReviewSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingProduct) return;

    // Check if the user has an order that contains this product
    const key = verificationKey.trim().toLowerCase();
    if (!key) {
      toast.error('Verification required: Please enter your Order Number, Email, or Phone associated with a completed purchase of this product.');
      return;
    }

    const hasOrdered = orders.some(o => 
      (o.orderNumber.toLowerCase().includes(key) ||
       o.email.toLowerCase().trim() === key ||
       o.phone.toLowerCase().includes(key)) &&
      o.items.some(item => item.productId === reviewingProduct.id)
    );

    if (!hasOrdered) {
      toast.error(`Purchase protection: We could not find any order for "${reviewingProduct.name}" matching purchase code/email "${verificationKey}". Only customers who ordered this item can leave a review!`);
      return;
    }

    try {
      await addReview(reviewingProduct.id, revName, revRating, revComment);
      toast.success(`🎉 Verification Success! Review submitted successfully for ${reviewingProduct.name}!`);
      setReviewingProduct(null);
      setVerificationKey('');
    } catch (err) {
      toast.error('Could not post your review, please try again.');
    }
  };

  return (
    <section className="py-16 px-6 sm:px-8 font-sans bg-white border-b border-slate-100" id="menu">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading closely matching retro uploaded mockup */}
        <div className="text-center mb-10 relative select-none">
          <div className="text-emerald-600 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
            FRESH FROM THE KITCHENS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-850 tracking-tight uppercase">
            All time Favorites
          </h2>
          <div className="h-1 w-20 bg-emerald-500 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Dynamic Category Buttons Filter bar */}
        <div className="flex flex-wrap justify-center items-center gap-3 mb-10 w-full" id="category-filters-container">
          <button
            onClick={() => setActiveCategory(null)}
            className={`cursor-pointer px-5 py-2 rounded-full font-sans font-bold uppercase text-xs sm:text-sm border transition-all shadow-2xs ${
              activeCategory === null
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-205 hover:bg-slate-100 hover:translate-y-[-1px]'
            }`}
          >
            🥤 All Items ({products.filter(p => p.isActive).length})
          </button>
          {categories.map((cat) => {
            const prodCount = products.filter((p) => p.category.toLowerCase().trim() === cat.name.toLowerCase().trim() && p.isActive).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`cursor-pointer flex items-center gap-2 px-5 py-2 rounded-full font-sans font-bold uppercase text-xs sm:text-sm border transition-all shadow-2xs ${
                  activeCategory === cat.name
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-205 hover:bg-slate-100 hover:translate-y-[-1px]'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name} ({prodCount})</span>
              </button>
            );
          })}
        </div>

        {/* Grid List */}
        {filteredProducts.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 p-12 text-center rounded-2xl max-w-lg mx-auto shadow-xs">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No items match your criteria!</h3>
            <p className="text-slate-500 font-medium text-xs mt-1.5 leading-relaxed">Try tweaking filters or reset search query to inspect other products.</p>
            <button
              onClick={() => {
                setActiveCategory(null);
                toast.info('Search filters reset!');
              }}
              className="mt-4 cursor-pointer text-xs font-semibold uppercase px-4 py-2 border border-slate-200 bg-white shadow-3xs hover:bg-slate-50 rounded-full text-slate-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="product-grid">
            {filteredProducts.map((prod) => {
              const isLowStock = prod.stock > 0 && prod.stock < 10;
              const isOutOfStock = prod.stock <= 0;
              const hasDiscount = prod.salePrice !== null;
              const displayPrice = hasDiscount ? prod.salePrice : prod.price;

              return (
                <div
                  key={prod.id}
                  className="bg-white border border-slate-100 hover:border-slate-200/80 rounded-2xl p-4.5 flex flex-col justify-between transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md shadow-sm relative group"
                  id={`product-card-${prod.id}`}
                >
                  {/* Sale Badge */}
                  {hasDiscount && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded shadow-sm z-10">
                      SALE!
                    </div>
                  )}

                  {/* Rating Stars score */}
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-4">
                    <span className="bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg text-slate-800 flex items-center gap-1 shadow-2xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
                      <span>{prod.rating || 'New'}</span>
                      <span className="text-[10px] text-slate-400 font-medium">({prod.reviewsCount || 0})</span>
                    </span>
                    <span className="text-[10px] text-slate-450 font-sans tracking-tight uppercase bg-slate-50 px-2 py-0.5 rounded border border-slate-150">
                      {prod.category}
                    </span>
                  </div>

                  {/* Character Icon / Emoji Image circle container */}
                  <div className="h-32 bg-slate-50 rounded-xl flex items-center justify-center relative mb-4 overflow-hidden select-none group-hover:bg-slate-100 transition-colors">
                    <div className="text-6xl transform group-hover:scale-108 transition-all duration-350">
                      {prod.image || '🍎'}
                    </div>
                    {/* Subtle design pattern inside image slot */}
                    <div className="absolute inset-0 bg-sleek-pattern opacity-10 pointer-events-none"></div>
                  </div>

                  {/* Title and Description */}
                  <div className="flex-1 mb-4">
                    <h3 className="text-md font-bold font-sans text-slate-800 line-clamp-1 truncate uppercase">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-normal line-clamp-2 mt-1 leading-normal">
                      {prod.description}
                    </p>
                    
                    {/* Ingredients indicators */}
                    {prod.ingredients && prod.ingredients.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {prod.ingredients.slice(0, 3).map((ing, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-500 border border-slate-200 text-[8px] font-sans font-medium px-1.5 py-0.5 rounded uppercase">
                            {ing}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Stock & Add Cart interface */}
                  <div className="mt-auto pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      
                      {/* Pricing block */}
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-sans font-bold text-slate-800">
                          ${displayPrice?.toFixed(2)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-slate-400 line-through">
                            ${prod.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Required stock status badge (Red limit warning / Green healthy stock) */}
                      {isOutOfStock ? (
                        <span className="bg-slate-100 text-slate-400 border border-slate-200 text-[9px] font-bold px-2 py-0.5 rounded-full select-none">
                          🚨 OUT OF STOCK
                        </span>
                      ) : isLowStock ? (
                        <span className="bg-red-50 text-red-700 border border-red-200 text-[9px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-0.5 animate-pulse select-none">
                          ⚠️ ONLY {prod.stock} LEFT!
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-semibold px-2.5 py-0.5 rounded-full select-none">
                          ● {prod.stock} IN STOCK
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-12 gap-2">
                      <button
                        onClick={() => {
                          if (!isOutOfStock) {
                            addToCart(prod);
                            toast.success(`🛒 Added ${prod.name} to checkout list.`);
                          }
                        }}
                        disabled={isOutOfStock}
                        className={`col-span-8 flex items-center justify-center gap-1.5 cursor-pointer py-2 rounded-xl border font-sans font-semibold text-xs transition-all ${
                          isOutOfStock
                            ? 'bg-slate-100 text-slate-400 border-slate-200 shadow-none cursor-not-allowed'
                            : 'bg-emerald-500 hover:bg-emerald-600 border-transparent text-white shadow-xs hover:translate-y-[-0.5px]'
                        }`}
                        id={`add-to-cart-btn-${prod.id}`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add To Cart</span>
                      </button>

                      <button
                        onClick={() => handleOpenReview(prod)}
                        className="col-span-4 py-2 border border-slate-200 font-sans font-semibold text-xs text-center cursor-pointer uppercase rounded-xl hover:bg-slate-50 transition-all bg-white text-slate-650 shadow-3xs hover:translate-y-[-0.5px]"
                        title="Submit review rating"
                      >
                        + Review
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* WRITE A REVIEW MODAL Popup overlay */}
        {reviewingProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-slate-900/60 p-4 font-sans max-h-screen">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 max-w-md w-full shadow-xl animate-bounce-subtle">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h3 className="text-md font-bold text-slate-800 uppercase">Write a Review</h3>
                <span className="text-xl bg-slate-50 p-1.5 rounded-lg border border-slate-100">{reviewingProduct.image}</span>
              </div>
              
              <p className="text-xs text-slate-400 font-bold mb-4">
                Reviewing: <span className="text-slate-800 font-extrabold">{reviewingProduct.name}</span>
              </p>

              <form onSubmit={handleReviewSubmission} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-650 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={revName}
                    onChange={(e) => setRevName(e.target.value)}
                    placeholder="Enter your display name (e.g. David K.)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-650 mb-1">Order # or Email ID *</label>
                  <input
                    type="text"
                    required
                    value={verificationKey}
                    onChange={(e) => setVerificationKey(e.target.value)}
                    placeholder="e.g. QF-1002 or your checkout email"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    To prevent spam, only verified purchase orders of this product can submit ratings.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-650 mb-1">Overall Rating *</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRevRating(num)}
                        className="p-1 hover:scale-108 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            num <= revRating
                              ? 'fill-amber-400 text-amber-500'
                              : 'text-slate-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-1 text-xs font-bold text-slate-400">({revRating}/5)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-650 mb-1">Your Review *</label>
                  <textarea
                    required
                    rows={3}
                    value={revComment}
                    onChange={(e) => setRevComment(e.target.value)}
                    placeholder="What did you like about this recipe?"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setReviewingProduct(null)}
                    className="px-4 py-2 border border-slate-200 rounded-full text-xs font-semibold uppercase hover:bg-slate-50 cursor-pointer text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-xs font-semibold uppercase hover:shadow-sm cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
