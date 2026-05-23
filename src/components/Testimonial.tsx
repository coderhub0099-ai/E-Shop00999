/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Star } from 'lucide-react';

export const Testimonial: React.FC = () => {
  const { reviews } = useApp();

  // Filter approved reviews for public presentation
  const featuredReviews = reviews.filter(r => r.isApproved).slice(0, 3);

  return (
    <section className="py-16 px-6 sm:px-8 bg-[#f8fafc] border-b border-slate-100 font-sans text-center relative overflow-hidden bg-sleek-pattern" id="reviews">
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Sleek round icon */}
        <div className="mx-auto bg-emerald-500 text-white rounded-full h-14 w-14 flex items-center justify-center text-2xl shadow-sm mb-5 select-none transition-transform hover:scale-105">
          🍊
        </div>

        <h3 className="text-emerald-600 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-2">
          CLIENT LOVE & TESTIMONIALS
        </h3>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight uppercase mb-12">
          Deliciously Recommended!
        </h2>

        {featuredReviews.length === 0 ? (
          <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-xs font-semibold text-slate-400 max-w-lg mx-auto">
            No testimonials approved yet. Leave a review above to show up here!
          </div>
        ) : (
          <div className="space-y-6 max-w-2xl mx-auto">
            {featuredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 shadow-sm text-left hover:border-slate-205 transition-all"
              >
                {/* Score rating star */}
                <div className="flex items-center gap-1.5 text-amber-500 mb-4 bg-slate-50 max-w-max px-2.5 py-1 rounded-lg border border-slate-150">
                  {Array.from({ length: rev.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400 stroke-amber-500" />
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1">({rev.rating}/5)</span>
                </div>

                <p className="text-sm sm:text-base text-slate-750 font-medium leading-relaxed italic mb-4">
                  "{rev.comment}"
                </p>

                <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                  <div className="w-9 h-9 bg-emerald-100 text-emerald-800 rounded-lg flex items-center justify-center text-sm select-none font-bold">
                    {rev.reviewerName[0] || 'U'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase">
                      {rev.reviewerName}
                    </h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">
                      Verified Client
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
