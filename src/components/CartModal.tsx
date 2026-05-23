/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from './Toast';
import { X, Minus, Plus, Trash2, Tag, Ticket, CreditCard, ShoppingBag, Landmark, Sparkles, Printer } from 'lucide-react';
import { Order, CartItem } from '../types';
import { BkashLogo, NagadLogo, StripeLogo, PaypalLogo, VisaMastercardLogo, RocketLogo, QuirkyFruityLogo } from './PaymentLogos';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    siteSettings,
    paymentSettings,
    appliedCoupon,
    updateCartQuantity,
    removeFromCart,
    applyCouponCode,
    removeCoupon,
    placeOrder,
  } = useApp();

  const toast = useToast();

  const [couponCode, setCouponCode] = useState('');
  
  // Checkout Shipping form
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');

  // Payment selections
  const [paymentMethod, setPaymentMethod] = useState<string>('COD');
  
  // Interactive Automatic Gateway Simulation states
  const [isAutoPortalOpen, setIsAutoPortalOpen] = useState(false);
  const [autoStep, setAutoStep] = useState(0); // 0: Account/Card details input, 1: OTP verification code, 2: PIN password collection, 3: Processing API, 4: Success confirmation
  const [autoPhoneInput, setAutoPhoneInput] = useState('');
  const [autoOtpInput, setAutoOtpInput] = useState('');
  const [autoPinInput, setAutoPinInput] = useState('');
  const [autoPaypalEmailInput, setAutoPaypalEmailInput] = useState('');
  const [autoPaypalPasswordInput, setAutoPaypalPasswordInput] = useState('');
  const [autoCardNumberInput, setAutoCardNumberInput] = useState('');
  const [autoCardExpiryInput, setAutoCardExpiryInput] = useState('');
  const [autoCardCvcInput, setAutoCardCvcInput] = useState('');
  const [autoCardHolderInput, setAutoCardHolderInput] = useState('');
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [autoPortalError, setAutoPortalError] = useState('');
  const [storedOrderData, setStoredOrderData] = useState<any | null>(null);
  
  // Credit Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  // Manual payment transaction reference
  const [manualTxId, setManualTxId] = useState('');

  // Active Placement invoice state
  const [placedInvoiceOrder, setPlacedInvoiceOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity, 0);
  const discountRate = appliedCoupon ? appliedCoupon.discountPercentage : 0;
  const discountAmount = (subtotal * discountRate) / 100;
  
  // Live delivery logic
  const deliveryFee = paymentSettings.shippingFee || 5.0;
  const taxRate = paymentSettings.taxPercentage || 0.05;
  const taxAmount = (subtotal - discountAmount) * taxRate;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee + taxAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCouponCode(couponCode);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  const validateCheckoutForm = (): boolean => {
    if (!customerName.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      toast.error('All shipping fields marked with an asterisk (*) are required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Form invalid: Please supply a genuine, valid email address.');
      return false;
    }

    if (['bKash', 'Nagad', 'Rocket', 'Bank', 'CreditManual'].includes(paymentMethod)) {
      if (!manualTxId.trim()) {
        toast.error(`Manual Verification: Please complete your mobile / bank / card txn sender reference details for ${paymentMethod}.`);
        return false;
      }
    }

    return true;
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCheckoutForm()) return;

    try {
      const itemsToSubmit = cart.map(item => ({
        productId: item.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.salePrice || item.product.price,
      }));

      const orderData = {
        customerName,
        email,
        phone,
        address,
        city,
        postalCode,
        deliveryNote,
        items: itemsToSubmit,
        subtotal,
        deliveryFee,
        couponApplied: appliedCoupon?.code || '',
        discount: discountAmount,
        total: grandTotal,
        paymentMethod,
      };

      if (['bKashAuto', 'NagadAuto', 'PayPal', 'Stripe'].includes(paymentMethod)) {
        // Intercept order and open premium sandbox interactive gateway overlay
        setStoredOrderData(orderData);
        setIsAutoPortalOpen(true);
        setAutoStep(0);
        setAutoPhoneInput(phone || '');
        setAutoOtpInput('');
        setAutoPinInput('');
        setAutoPaypalEmailInput(email || '');
        setAutoPaypalPasswordInput('');
        setAutoCardNumberInput('');
        setAutoCardExpiryInput('');
        setAutoCardCvcInput('');
        setAutoCardHolderInput(customerName || '');
        setAutoPortalError('');
        return;
      }

      const placedOrder = await placeOrder(orderData);
      
      toast.success(`🎉 SUCCESS! Order placed successfully. Order Number: ${placedOrder.orderNumber}`);
      setPlacedInvoiceOrder(placedOrder);

      // Reset states
      setCustomerName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setCity('');
      setPostalCode('');
      setDeliveryNote('');
      setCardNumber('');
      setCardExpiry('');
      setCardCVC('');
      setManualTxId('');
      
    } catch (err) {
      toast.error('Could not submit your checkout request. Try submitting again.');
    }
  };

  const runFinalTriggerAPI = async (orderInfo: any, methodLabel: string, txnRef?: string) => {
    try {
      setAutoPortalError('');
      // Simulate API call to process payment
      await new Promise(resolve => setTimeout(resolve, 2200));

      const updatedOrder = {
        ...orderInfo,
        paymentStatus: 'Paid' as const,
        paymentMethod: methodLabel,
        transactionId: txnRef || `AUTO_${methodLabel.replace(/\s+/g, '_').toUpperCase()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      };

      const placedOrder = await placeOrder(updatedOrder);
      
      toast.success(`🎉 SUCCESS! Auto checkout completed. Order: ${placedOrder.orderNumber}`);
      setPlacedInvoiceOrder(placedOrder);
      
      // Reset checkout states
      setCustomerName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setCity('');
      setPostalCode('');
      setDeliveryNote('');
      setManualTxId('');
      setCardNumber('');
      setCardExpiry('');
      setCardCVC('');

      // Advance to success screen
      setAutoStep(4);
    } catch (err: any) {
      setAutoPortalError(err?.message || 'Processing error from automatic merchant link. Please retry.');
      setAutoStep(0);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex font-sans" role="dialog" aria-modal="true">
      
      {/* Dark background overlay */}
      <div onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity cursor-pointer"></div>

      {/* Slide-over Content Drawer */}
      <div className="relative ml-auto max-w-2xl w-full h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between overflow-y-auto p-6 scrollbar-thin">
        
        {/* Header Block */}
        <div className="flex items-center justify-between border-b border-slate-205 pb-4 mb-4 select-none">
          <div className="flex items-center gap-2.5">
            <QuirkyFruityLogo className="w-7 h-7" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 uppercase tracking-tight">
              Your Fresh Checkout Cart
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-50 border border-slate-200 hover:bg-rose-50 hover:text-rose-650 hover:border-rose-150 rounded-full cursor-pointer text-slate-400 transition-colors"
            id="close-cart-btn"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* IF SUCCESS INVOICE PREVIEW VIEW */}
        {placedInvoiceOrder ? (
          <div className="flex-1 py-4 flex flex-col justify-between" id="printable-sales-invoice-modal">
            
            {/* Sales Invoice Copy */}
            <div className="bg-slate-50 border border-dashed border-emerald-300 rounded-2xl p-5 relative select-none">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <div>
                  <h3 className="text-xl font-bold text-emerald-600 uppercase tracking-tight">
                    {siteSettings.websiteName || 'QUIRKY-FRUITY'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">SALES RECEIPT</p>
                </div>
                <div className="text-right">
                  <div className="bg-emerald-105 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border border-emerald-300 rounded-full">
                    COD PLACED
                  </div>
                  <div className="text-xs font-bold text-slate-700 mt-1">NO: {placedInvoiceOrder.orderNumber}</div>
                </div>
              </div>

              {/* Barcode details */}
              <div className="flex flex-col items-center justify-center py-2 mb-4">
                <div className="flex gap-0.5 justify-center h-8 w-2/3 bg-slate-800" style={{
                  backgroundImage: 'repeating-linear-gradient(90deg, #1e293b 0px, #1e293b 2px, #fff 2px, #fff 4px, #1e293b 4px, #1e293b 8px)'
                }}></div>
                <span className="text-[10px] font-mono mt-1 text-slate-400">{placedInvoiceOrder.id.toUpperCase()}</span>
              </div>

              {/* Invoice Table list */}
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-12 border-b border-slate-200 pb-1.5 font-bold text-emerald-600 uppercase text-[10px]">
                  <span className="col-span-8">Product Item description</span>
                  <span className="col-span-2 text-center">Qty</span>
                  <span className="col-span-2 text-right">Sum</span>
                </div>
                {placedInvoiceOrder.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 text-xs font-medium py-1.5 border-b border-slate-100 text-slate-650">
                    <span className="col-span-8 truncate">{item.name}</span>
                    <span className="col-span-2 text-center">{item.quantity}</span>
                    <span className="col-span-2 text-right">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Pricing Math breakdowns */}
              <div className="border-t border-dashed border-slate-200 pt-3 mt-4 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span className="font-semibold uppercase">Subtotal</span>
                  <span className="font-bold text-slate-800">${placedInvoiceOrder.subtotal.toFixed(2)}</span>
                </div>
                {placedInvoiceOrder.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span className="font-semibold uppercase">Discount</span>
                    <span className="font-bold">-${placedInvoiceOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span className="font-semibold uppercase">Delivery & Handling</span>
                  <span className="font-bold text-slate-800">${placedInvoiceOrder.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-emerald-600 text-sm">
                  <span className="uppercase">GRAND TOTAL</span>
                  <span>${placedInvoiceOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center text-xs text-slate-400 mt-6 border-t border-dashed border-slate-200 pt-3">
                <p className="font-semibold text-xs text-emerald-650">Thank you for your order!</p>
                <p className="mt-1 text-[10px] leading-relaxed">Your confirmation receipt invoice email has been compiled and forwarded to <strong>{placedInvoiceOrder.email}</strong>.</p>
                <p className="mt-3 text-[9px] text-slate-400 capitalize">{siteSettings.trademarkText}</p>
              </div>

            </div>

            <div className="flex flex-col gap-2 mt-6">
              <button
                onClick={handlePrintInvoice}
                className="w-full cursor-pointer py-3 bg-white border border-slate-205 text-slate-700 hover:bg-slate-50 font-bold rounded-xl uppercase transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>PRINT INVOICE</span>
              </button>

              <button
                onClick={() => {
                  setPlacedInvoiceOrder(null);
                  onClose();
                }}
                className="w-full cursor-pointer py-3 bg-emerald-500 text-white hover:bg-emerald-600 font-bold rounded-xl uppercase transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>CONTINUE SHOPPING</span>
              </button>
            </div>

          </div>
        ) : cart.length === 0 ? (
          
          /* EMPTY CART STATE */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 select-none">
            <div className="text-5xl mb-4 bg-slate-50 p-4 rounded-full text-slate-450 border border-slate-100">🛒</div>
            <h3 className="text-md font-bold text-slate-800 uppercase">Your Checkout Cart is Empty</h3>
            <p className="text-xs text-slate-450 font-semibold uppercase tracking-wider mt-1.5">
              Add products from the menu to proceed
            </p>
            <button
              onClick={onClose}
              className="mt-6 cursor-pointer px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs uppercase shadow-sm rounded-full transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          
          /* ACTIVE SHOPPING ITEMS AND CHECKOUT FORM FRAME */
          <div className="flex-1 flex flex-col justify-between">
            
            {/* Scrollable list items */}
            <div className="space-y-3 max-h-[220px] overflow-y-auto mb-4 border-b pb-4 border-dashed border-slate-150 scrollbar-thin">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-100 p-3 rounded-xl flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="text-xl h-9 w-9 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center select-none">
                    {item.product.image || '🥤'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-850 truncate uppercase">{item.product.name}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">
                      ${(item.product.salePrice || item.product.price).toFixed(2)} each
                    </p>
                  </div>

                  {/* Increment/Decrement controller */}
                  <div className="flex items-center gap-1.5 border border-slate-200 p-0.5 rounded-lg bg-slate-50 scale-90">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-slate-200 text-slate-650 rounded cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold px-1.5 text-slate-800">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-slate-200 text-slate-650 rounded cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => {
                      removeFromCart(item.id);
                      toast.info(`Removed ${item.product.name} from checkout list.`);
                    }}
                    className="p-1 text-slate-350 hover:text-rose-600 rounded cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Billing Breakdown calculations */}
            <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 mb-4 select-none">
              
              {/* Promo Coupon Applicator */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="ENTER DISCOUNT PROMO CODE"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full bg-white border border-slate-200 pl-8 pr-3 py-1.5 rounded-lg font-semibold text-xs text-slate-700 uppercase tracking-widest outline-none shadow-3xs focus:ring-1 focus:ring-emerald-400"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-1.5 cursor-pointer bg-slate-900 hover:bg-slate-850 text-white font-semibold text-xs uppercase rounded-lg transition-all flex items-center gap-1"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Apply</span>
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-2.5 mb-2.5 text-[11px]">
                  <span className="flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    🎉 Active: {appliedCoupon.code} ({appliedCoupon.discountPercentage}% OFF)
                  </span>
                  <button
                    onClick={() => {
                      removeCoupon();
                      toast.info('Coupon code removed.');
                    }}
                    className="text-rose-600 font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              <div className="space-y-1.5 text-xs text-slate-500">
                <div className="flex justify-between">
                  <span className="font-semibold uppercase">Subtotal</span>
                  <span className="font-bold text-slate-800">${subtotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-rose-600">
                    <span className="font-semibold uppercase">Applied Discount</span>
                    <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="font-semibold uppercase">Shipping & Delivery</span>
                  <span className="font-bold text-slate-800">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold uppercase">Tax ({Math.round(taxRate * 100)}%)</span>
                  <span className="font-bold text-slate-800">${taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-base text-emerald-600">
                  <span className="uppercase tracking-tight">GRAND TOTAL</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Shipping address details fields */}
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="text-xs font-bold uppercase text-slate-450 tracking-wider">
                1. Delivery & Contact Details
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Bowman"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-normal text-slate-705 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. david@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-normal text-slate-705 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Delivery Physical Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 4B, Plot 23"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-normal text-slate-705 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dhaka"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-normal text-slate-705 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +880 17112233"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-normal text-slate-705 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Postal/Zip Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 1212"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-normal text-slate-705 focus:bg-white outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Delivery Instruction Details (Optional)</label>
                <textarea
                  rows={1.5}
                  placeholder="e.g. ring bell twice, deliver to security post"
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-normal text-slate-705 focus:bg-white outline-none resize-none focus:ring-2 focus:ring-emerald-400"
                ></textarea>
              </div>

              <div className="text-xs font-bold uppercase text-slate-450 tracking-wider">
                2. Select Payment Method
              </div>

              {/* Automatic Instant Gateways Group */}
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-tight text-emerald-600 flex items-center gap-1">
                  <span>⚡</span> Automatic Quick Checkout (Instant Sync / Auto-Confirm)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {/* bKash Automatic Dynamic Gateway */}
                  {(paymentSettings.bKashAutoEnabled ?? true) && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bKashAuto')}
                      className={`cursor-pointer px-3 py-2.5 rounded-xl border transition-all flex flex-col items-center justify-center gap-1.5 ${
                        paymentMethod === 'bKashAuto'
                          ? 'bg-rose-50 border-rose-600 ring-2 ring-rose-500 font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-755 border-slate-205'
                      }`}
                    >
                      <BkashLogo className="h-5" />
                      <span className="block text-[9px] uppercase font-bold tracking-tight text-rose-700">bKash Instant</span>
                    </button>
                  )}

                  {/* Nagad Automatic Dynamic Gateway */}
                  {(paymentSettings.nagadAutoEnabled ?? true) && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('NagadAuto')}
                      className={`cursor-pointer px-3 py-2.5 rounded-xl border transition-all flex flex-col items-center justify-center gap-1.5 ${
                        paymentMethod === 'NagadAuto'
                          ? 'bg-orange-50 border-orange-600 ring-2 ring-orange-500 font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-755 border-slate-205'
                      }`}
                    >
                      <NagadLogo className="h-5" />
                      <span className="block text-[9px] uppercase font-bold tracking-tight text-orange-700">Nagad Instant</span>
                    </button>
                  )}

                  {/* PayPal Secure Checkout */}
                  {(paymentSettings.paypalEnabled ?? true) && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('PayPal')}
                      className={`cursor-pointer px-3 py-2.5 rounded-xl border transition-all flex flex-col items-center justify-center gap-1.5 ${
                        paymentMethod === 'PayPal'
                          ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-550 font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-755 border-slate-205'
                      }`}
                    >
                      <PaypalLogo className="h-5" />
                      <span className="block text-[9px] uppercase font-bold tracking-tight text-blue-700 font-sans">PayPal Express</span>
                    </button>
                  )}

                  {/* Stripe Dynamic Card Portal */}
                  {paymentSettings.stripeEnabled && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Stripe')}
                      className={`cursor-pointer px-3 py-2.5 rounded-xl border transition-all flex flex-col items-center justify-center gap-1.5 ${
                        paymentMethod === 'Stripe'
                          ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500 font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-755 border-slate-205'
                      }`}
                    >
                      <StripeLogo className="h-5" />
                      <span className="block text-[9px] uppercase font-bold tracking-tight text-indigo-700">Stripe Card</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Manual Transfers Group */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <p className="text-[10px] uppercase font-bold tracking-tight text-slate-450 flex items-center gap-1">
                  <span>📁</span> Manual Transfer Options (Requires sender photo/code references)
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {/* Cash On Delivery option */}
                  {paymentSettings.codEnabled && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('COD')}
                      className={`cursor-pointer p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        paymentMethod === 'COD'
                          ? 'bg-slate-900 border-slate-900 text-white font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-750 border-slate-205'
                      }`}
                    >
                      <span className="text-sm">💵</span>
                      <span className="block text-[9px] uppercase font-bold tracking-tight leading-tight">Cash on Del</span>
                    </button>
                  )}

                  {/* bKash manual transfer option */}
                  {paymentSettings.bKashEnabled && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bKash')}
                      className={`cursor-pointer p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        paymentMethod === 'bKash'
                          ? 'bg-rose-600 text-white border-rose-600 font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-755 border-slate-205'
                      }`}
                    >
                      <span className="text-[10px] px-1 bg-pink-150 rounded leading-none text-rose-600 font-sans font-bold">PINK</span>
                      <span className="block text-[9px] uppercase font-bold tracking-tight leading-tight">bKash Manual</span>
                    </button>
                  )}

                  {/* Nagad manual transfer option */}
                  {paymentSettings.nagadEnabled && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Nagad')}
                      className={`cursor-pointer p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        paymentMethod === 'Nagad'
                          ? 'bg-orange-600 text-white border-orange-600 font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-755 border-slate-205'
                      }`}
                    >
                      <span className="text-[10px] px-1 bg-orange-100 rounded leading-none text-orange-600 font-bold">ORNG</span>
                      <span className="block text-[9px] uppercase font-bold tracking-tight leading-tight">Nagad Manual</span>
                    </button>
                  )}

                  {/* Rocket manual transfer option */}
                  {paymentSettings.rocketEnabled && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Rocket')}
                      className={`cursor-pointer p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        paymentMethod === 'Rocket'
                          ? 'bg-purple-650 text-white border-purple-650 font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-755 border-slate-205'
                      }`}
                    >
                      <RocketLogo className="h-4 pointer-events-none" />
                      <span className="block text-[9px] uppercase font-bold tracking-tight leading-tight">Rocket manual</span>
                    </button>
                  )}

                  {/* Direct Bank transfer option */}
                  {paymentSettings.bankEnabled && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Bank')}
                      className={`cursor-pointer p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        paymentMethod === 'Bank'
                          ? 'bg-blue-600 text-white border-blue-650 font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-755 border-slate-205'
                      }`}
                    >
                      <span className="text-sm">🏦</span>
                      <span className="block text-[9px] uppercase font-bold tracking-tight leading-tight font-sans">Bank Transfer</span>
                    </button>
                  )}

                  {/* Manual Credit Card transfer option */}
                  {paymentSettings.creditManualEnabled && (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CreditManual')}
                      className={`cursor-pointer p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        paymentMethod === 'CreditManual'
                          ? 'bg-slate-800 text-white border-slate-900 font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-755 border-slate-205'
                      }`}
                    >
                      <span className="text-sm">💳</span>
                      <span className="block text-[9px] uppercase font-bold tracking-tight leading-tight">Manual Invoice</span>
                    </button>
                  )}
                </div>
              </div>

              {/* DYNAMIC PAYMENT METHOD RENDERING DETAILS */}
              {paymentMethod === 'bKashAuto' && (
                <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 text-xs space-y-1 animate-fade-in">
                  <div className="flex items-center gap-2 border-b pb-1 border-pink-100">
                    <BkashLogo className="h-5" />
                    <h4 className="font-extrabold uppercase text-pink-600 text-[10px]">bKash Automatic Merchant checkout portal</h4>
                  </div>
                  <p className="text-[10px] text-slate-505 font-medium leading-relaxed">
                    Upon clicking <strong>PLACE ORDER</strong> below, you will see our secure simulated checkout frame which verifies your bKash wallet statement, processes standard OTP validations instantly, and secures account completion automatically!
                  </p>
                </div>
              )}

              {paymentMethod === 'NagadAuto' && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs space-y-1 animate-fade-in">
                  <div className="flex items-center gap-2 border-b pb-1 border-orange-100">
                    <NagadLogo className="h-5" />
                    <h4 className="font-extrabold uppercase text-orange-600 text-[10px]">Nagad Automatic Merchant Checkout Portal</h4>
                  </div>
                  <p className="text-[10px] text-slate-505 font-medium leading-relaxed">
                    Upon clicking <strong>PLACE ORDER</strong> below, you will launch the secure simulated Nagad Instant payment frame. Enjoy automatic payment marking, seamless secure pin shielding, and direct checkout success!
                  </p>
                </div>
              )}

              {paymentMethod === 'PayPal' && (
                <div className="bg-blue-50 border border-blue-150 rounded-xl p-3 text-xs space-y-1 animate-fade-in">
                  <div className="flex items-center gap-2 border-b pb-1 border-blue-100">
                    <PaypalLogo className="h-4" />
                    <h4 className="font-extrabold uppercase text-blue-800 text-[10px]">PayPal Automated Sandbox Gateway</h4>
                  </div>
                  <p className="text-[10px] text-slate-505 font-medium leading-relaxed">
                    PayPal Sandbox link connects client funds directly via automated Express settlement. Clicking <strong>PLACE ORDER</strong> initiates the login confirmation screen for immediate approval.
                  </p>
                </div>
              )}

              {paymentMethod === 'Stripe' && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-xs space-y-1 animate-fade-in">
                  <div className="flex items-center gap-2 border-b pb-1 border-indigo-100">
                    <StripeLogo className="h-4" />
                    <h4 className="font-extrabold uppercase text-indigo-700 text-[10px]">Stripe PCI DSS Automatic Credit Checkout</h4>
                  </div>
                  <p className="text-[10px] text-slate-505 font-medium leading-relaxed">
                    Submit checkout below to enter the secure automatic Stripe credit card form handler. Direct token validation is handled dynamically with immediate bank settlement.
                  </p>
                </div>
              )}

              {paymentMethod === 'bKash' && (
                <div className="bg-pink-50/40 border border-pink-200 rounded-xl p-4 text-xs space-y-2 animate-fade-in" id="payment-bkash-details">
                  <div className="flex items-center justify-between border-b pb-1.5 border-pink-100">
                    <h4 className="font-bold uppercase text-pink-600">bKash Manual Instructions</h4>
                    <span className="text-md">{paymentSettings.bKashLogoEmoji}</span>
                  </div>
                  <p className="font-medium text-[10px] text-slate-500 leading-relaxed">
                    {paymentSettings.bKashInstructions || 'Send total order money to our Merchant wallet.'}
                  </p>
                  <p className="font-extrabold text-[#e2136e] bg-pink-100/50 px-2.5 py-1 rounded inline-block">bKash Merchant Target Number: <span className="underline font-mono">{paymentSettings.bKashNo}</span></p>
                  {paymentSettings.bKashQrCodeUrl && (
                    <div className="pt-1 flex flex-col items-center justify-center">
                      <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Scan bKash merchant QR</p>
                      <img src={paymentSettings.bKashQrCodeUrl} referrerPolicy="no-referrer" alt="bKash QR Code" className="w-24 h-24 object-contain border border-pink-205 rounded-lg bg-white p-1" />
                    </div>
                  )}
                  <div className="pt-1">
                    <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Enter your bKash Transaction ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bkash No. or TxId"
                      value={manualTxId}
                      onChange={(e) => setManualTxId(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 outline-none"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'Nagad' && (
                <div className="bg-orange-50/40 border border-orange-200 rounded-xl p-4 text-xs space-y-2 animate-fade-in" id="payment-nagad-details">
                  <div className="flex items-center justify-between border-b pb-1.5 border-orange-100">
                    <h4 className="font-bold uppercase text-orange-650">Nagad Wallet details</h4>
                    <span className="text-md">{paymentSettings.nagadLogoEmoji}</span>
                  </div>
                  <p className="font-medium text-[10px] text-slate-500 leading-relaxed">
                    {paymentSettings.nagadInstructions || 'Send Money to our personal Nagad number and input Transaction ID.'}
                  </p>
                  <p className="font-extrabold text-orange-600 bg-orange-100/50 px-2.5 py-1 rounded inline-block">Nagad No: <span className="underline font-mono">{paymentSettings.nagadNo}</span></p>
                  {paymentSettings.nagadQrCodeUrl && (
                    <div className="pt-1 flex flex-col items-center justify-center">
                      <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Scan Nagad QR</p>
                      <img src={paymentSettings.nagadQrCodeUrl} referrerPolicy="no-referrer" alt="Nagad QR Code" className="w-24 h-24 object-contain border border-orange-200 rounded-lg bg-white p-1" />
                    </div>
                  )}
                  <div className="pt-1">
                    <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Enter your Nagad Transaction ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nagad No. or TxId"
                      value={manualTxId}
                      onChange={(e) => setManualTxId(e.target.value)}
                      className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-orange-400"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'Rocket' && (
                <div className="bg-purple-50/40 border border-purple-200 rounded-xl p-4 text-xs space-y-2 animate-fade-in" id="payment-rocket-details">
                  <div className="flex items-center justify-between border-b pb-1.5 border-purple-100">
                    <h4 className="font-bold uppercase text-purple-700">Rocket Wallet details</h4>
                    <span className="text-md">{paymentSettings.rocketLogoEmoji}</span>
                  </div>
                  <p className="font-medium text-[10px] text-slate-500 leading-relaxed">
                    {paymentSettings.rocketInstructions || 'Send Money to our agent Rocket dial *322# and input Txn Ref.'}
                  </p>
                  <p className="font-extrabold text-purple-705 bg-purple-100/50 px-2.5 py-1 rounded inline-block">Rocket wallet No: <span className="underline font-mono">{paymentSettings.rocketNo}</span></p>
                  {paymentSettings.rocketQrCodeUrl && (
                    <div className="pt-1 flex flex-col items-center justify-center">
                      <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Scan Rocket QR</p>
                      <img src={paymentSettings.rocketQrCodeUrl} referrerPolicy="no-referrer" alt="Rocket QR Code" className="w-24 h-24 object-contain border border-purple-200 rounded-lg bg-white p-1" />
                    </div>
                  )}
                  <div className="pt-1">
                    <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Enter Rocket TXN Ref ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rocket TxId"
                      value={manualTxId}
                      onChange={(e) => setManualTxId(e.target.value)}
                      className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-purple-400"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'Bank' && (
                <div className="bg-blue-50/40 border border-blue-200 rounded-xl p-4 text-xs space-y-2 animate-fade-in" id="payment-bank-details">
                  <div className="flex items-center justify-between border-b pb-1.5 border-blue-100">
                    <h4 className="font-bold uppercase text-blue-800 font-sans">Bank account details</h4>
                    <span className="text-lg">{paymentSettings.bankLogoEmoji}</span>
                  </div>
                  <p className="font-medium text-[10px] text-slate-500 leading-relaxed">
                    {paymentSettings.bankInstructions || 'Transfer amount directly to our Bank.'}
                  </p>
                  <div className="bg-blue-100/50 p-2.5 rounded-lg text-[11px] text-slate-850 space-y-1">
                    <p><strong>Bank Name:</strong> {paymentSettings.bankName}</p>
                    <p><strong>Account Holder:</strong> {paymentSettings.bankHolder}</p>
                    <p><strong>Account Number:</strong> {paymentSettings.bankNo}</p>
                  </div>
                  {paymentSettings.bankQrCodeUrl && (
                    <div className="pt-1 flex flex-col items-center justify-center">
                      <img src={paymentSettings.bankQrCodeUrl} referrerPolicy="no-referrer" alt="Bank stamp Code" className="w-24 h-24 object-contain border rounded-lg bg-white p-1" />
                    </div>
                  )}
                  <div className="pt-1">
                    <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Enter Swift / wire reference Memo Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. deposit swift ref"
                      value={manualTxId}
                      onChange={(e) => setManualTxId(e.target.value)}
                      className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'CreditManual' && (
                <div className="bg-slate-50 border border-slate-250 rounded-xl p-4 text-xs space-y-2 animate-fade-in" id="payment-credit-manual-details">
                  <div className="flex items-center justify-between border-b pb-1.5 border-slate-200">
                    <h4 className="font-bold uppercase text-slate-800">Manual Credit Invoice details</h4>
                    <span className="text-lg">{paymentSettings.creditManualLogoEmoji}</span>
                  </div>
                  <p className="font-medium text-[10px] text-slate-500 leading-relaxed">
                    {paymentSettings.creditManualInstructions || 'Pay and submit receipt details.'}
                  </p>
                  <p className="font-extrabold text-slate-705 bg-slate-100 px-2.5 py-1 rounded inline-block">Credit Reference No: <span className="underline font-mono">{paymentSettings.creditManualNo}</span></p>
                  {paymentSettings.creditManualQrCodeUrl && (
                    <div className="pt-1 flex flex-col items-center justify-center">
                      <img src={paymentSettings.creditManualQrCodeUrl} referrerPolicy="no-referrer" alt="Form sheet illustration" className="w-24 h-24 object-contain border rounded-lg bg-white p-1" />
                    </div>
                  )}
                  <div className="pt-1">
                    <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Enter manual card payment proof / receipt ID *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Invoice Ref / receipt reference"
                      value={manualTxId}
                      onChange={(e) => setManualTxId(e.target.value)}
                      className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-slate-400"
                    />
                  </div>
                </div>
              )}

              {/* Submit placement trigger */}
              <div className="pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer leading-none shadow-md hover:shadow-lg hover:translate-y-[-0.5px]"
                  id="checkout-submit-trigger"
                >
                  <ShoppingBag className="w-4 h-4 text-emerald-250" />
                  <span>PLACE ORDER (${grandTotal.toFixed(2)})</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>

      {/* --- MASTERPLAY INTERACTIVE AUTOMATIC SECURE GATEWAY SIMULATION PORTAL --- */}
      {isAutoPortalOpen && (
        <div 
          className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative animate-scale-in border border-slate-200">
            {/* Header branding according to choice */}
            {paymentMethod === 'bKashAuto' && (
              <div className="bg-[#E2136E] px-6 py-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BkashLogo className="h-8 bg-white/20 p-1 rounded-lg" />
                  <div>
                    <h3 className="font-extrabold text-sm tracking-tight uppercase">bKash Merchant Payment</h3>
                    <p className="text-[10px] text-rose-100 font-medium">Secure Simulated Sandbox Link</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAutoPortalOpen(false)}
                  className="text-white hover:text-rose-100 text-xl font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {paymentMethod === 'NagadAuto' && (
              <div className="bg-[#F26422] px-6 py-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <NagadLogo className="h-8 bg-white/20 p-1 rounded-lg" />
                  <div>
                    <h3 className="font-extrabold text-sm tracking-tight uppercase">Nagad Payment Gateway</h3>
                    <p className="text-[10px] text-orange-100 font-medium">Secure Simulated Sandbox Link</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAutoPortalOpen(false)}
                  className="text-white hover:text-orange-100 text-xl font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {paymentMethod === 'PayPal' && (
              <div className="bg-[#003087] px-6 py-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PaypalLogo className="h-7 bg-white/10 px-2 py-0.5 rounded" />
                  <div>
                    <h3 className="font-extrabold text-sm tracking-tight uppercase">PayPal Checkout</h3>
                    <p className="text-[10px] text-blue-100 font-medium">Automatic Sandbox Verification</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAutoPortalOpen(false)}
                  className="text-white hover:text-blue-200 text-xl font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {paymentMethod === 'Stripe' && (
              <div className="bg-[#635BFF] px-6 py-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StripeLogo className="h-7 bg-white/15 px-2 py-0.5 rounded" />
                  <div>
                    <h3 className="font-extrabold text-sm tracking-tight uppercase">Stripe Secure Card Control</h3>
                    <p className="text-[10px] text-indigo-100 font-medium font-sans">PCI-DSS Encrypted Standard</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAutoPortalOpen(false)}
                  className="text-white hover:text-indigo-200 text-xl font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Portal Content Area */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl text-xs">
                <span className="font-bold text-slate-500 uppercase">Total Payable Amount</span>
                <span className="font-mono font-extrabold text-slate-850 text-sm">${grandTotal.toFixed(2)}</span>
              </div>

              {autoPortalError && (
                <div className="bg-rose-50 border border-rose-150 rounded-xl p-2.5 text-rose-650 text-[10px] font-bold text-center animate-shake">
                  ❌ {autoPortalError}
                </div>
              )}

              {/* STEP 0: WALLET OR DETAILS INPUT */}
              {autoStep === 0 && (
                <div className="space-y-3.5 animate-fade-in">
                  {/* Mobile Mobile gateways bkash/nagad prompt */}
                  {['bKashAuto', 'NagadAuto'].includes(paymentMethod) && (
                    <>
                      <p className="text-[11px] font-medium text-slate-500 text-center leading-normal">
                        Enter your active {paymentMethod === 'bKashAuto' ? 'bKash' : 'Nagad'} 11-digit wallet account number below to initiate transactional OTP dispatch.
                      </p>
                      <div>
                        <label className="block text-[9px] font-extrabold text-slate-400 uppercase mb-1">Wallet Number *</label>
                        <input
                          type="tel"
                          maxLength={11}
                          required
                          placeholder="e.g. 017XXXXXXXX"
                          value={autoPhoneInput}
                          onChange={(e) => setAutoPhoneInput(e.target.value.replace(/\D/g, ''))}
                          className="w-full text-center tracking-widest font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-base text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-400"
                        />
                      </div>
                    </>
                  )}

                  {/* Paypal layout */}
                  {paymentMethod === 'PayPal' && (
                    <>
                      <p className="text-[11px] font-medium text-slate-500 text-center leading-normal">
                        Access your PayPal sandbox account to authorize the automatic linked funds wire.
                      </p>
                      <div className="space-y-2.5">
                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-450 mb-0.5">PayPal Account Email</label>
                          <input
                            type="email"
                            required
                            placeholder="username@sandbox.paypal"
                            value={autoPaypalEmailInput}
                            onChange={(e) => setAutoPaypalEmailInput(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-450 mb-0.5">Secure Password</label>
                          <input
                            type="password"
                            required
                            placeholder="••••••••••••"
                            value={autoPaypalPasswordInput}
                            onChange={(e) => setAutoPaypalPasswordInput(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-400"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Stripe form layout */}
                  {paymentMethod === 'Stripe' && (
                    <>
                      <p className="text-[10px] font-semibold text-indigo-650 text-center bg-indigo-50/50 py-1 py-1.5 rounded-lg">
                        🔒 PCI Compliant Sandboxed Credit Gateway connection
                      </p>
                      <div className="space-y-2.5">
                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-450 mb-0.5">Cardholder Full Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. John Doe"
                            value={autoCardHolderInput}
                            onChange={(e) => setAutoCardHolderInput(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-bold uppercase text-slate-450 mb-0.5">Debit / Credit Card Number</label>
                          <input
                            type="text"
                            maxLength={19}
                            required
                            placeholder="4242 4242 4242 4242"
                            value={autoCardNumberInput}
                            onChange={(e) => {
                              // Auto format spacing
                              const raw = e.target.value.replace(/\D/g, '');
                              const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
                              setAutoCardNumberInput(formatted.substring(0, 19));
                            }}
                            className="w-full font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 tracking-wider outline-none focus:bg-white focus:ring-1 focus:ring-indigo-400"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[9px] font-bold uppercase text-slate-450 mb-0.5">Expiry Date</label>
                            <input
                              type="text"
                              maxLength={5}
                              required
                              placeholder="MM/YY"
                              value={autoCardExpiryInput}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, '');
                                if (raw.length >= 2) {
                                  setAutoCardExpiryInput(raw.slice(0, 2) + '/' + raw.slice(2, 4));
                                } else {
                                  setAutoCardExpiryInput(raw);
                                }
                              }}
                              className="w-full text-center font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-400"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-bold uppercase text-slate-450 mb-0.5">Secure CVC Code</label>
                            <input
                              type="password"
                              maxLength={4}
                              required
                              placeholder="•••"
                              value={autoCardCvcInput}
                              onChange={(e) => setAutoCardCvcInput(e.target.value.replace(/\D/g, ''))}
                              className="w-full text-center font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-indigo-400"
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAutoPortalOpen(false)}
                      className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-xs font-bold uppercase text-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // validations
                        if (['bKashAuto', 'NagadAuto'].includes(paymentMethod)) {
                          if (autoPhoneInput.length < 11) {
                            setAutoPortalError('Please enter a valid 11-digit wallet number!');
                            return;
                          }
                          // trigger SMS simulation banner toast
                          toast.info(`📲 SMS simulator dispatch! Verification code sent to: ${autoPhoneInput}. Enter '123456' to proceed.`);
                          setAutoStep(1);
                        } else if (paymentMethod === 'PayPal') {
                          if (!autoPaypalEmailInput || !autoPaypalPasswordInput) {
                            setAutoPortalError('Both email and password credentials are required!');
                            return;
                          }
                          setAutoStep(3); // skip straight to check loading
                          runFinalTriggerAPI(storedOrderData, 'PayPal (Auto)');
                        } else if (paymentMethod === 'Stripe') {
                          if (autoCardNumberInput.length < 15 || autoCardExpiryInput.length < 5 || autoCardCvcInput.length < 3) {
                            setAutoPortalError('Form incomplete! Secure card number details fail credentials validation.');
                            return;
                          }
                          setAutoStep(3); // skip straight to check loading
                          runFinalTriggerAPI(storedOrderData, `Stripe (Auto: Visa ending in ${autoCardNumberInput.slice(-4)})`);
                        }
                        setAutoPortalError('');
                      }}
                      className="w-2/3 py-2.5 text-white bg-slate-900 hover:bg-slate-850 rounded-2xl text-xs font-bold uppercase tracking-wide shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Proceed</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 1: MOBILE OTP PROMPT */}
              {autoStep === 1 && (
                <div className="space-y-3.5 animate-fade-in text-center">
                  <p className="text-[11px] font-medium text-slate-500 leading-normal">
                    Dispatched a simulated 6-digit transaction authorization key. Enter OTP code <strong>123455</strong> or <strong>123456</strong> below to proceed:
                  </p>
                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="XXXXXX"
                      value={autoOtpInput}
                      onChange={(e) => setAutoOtpInput(e.target.value.replace(/\D/g, ''))}
                      className="w-1/2 text-center text-xl tracking-[0.4em] font-mono font-black bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAutoStep(0)}
                      className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-xs font-bold uppercase text-slate-600 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (autoOtpInput !== '123456' && autoOtpInput !== '123455') {
                          setAutoPortalError('Form verification code incorrect! Try code: 123456 (simulated OTP).');
                          return;
                        }
                        setAutoPortalError('');
                        setAutoStep(2);
                      }}
                      className="w-2/3 py-2.5 text-white bg-slate-900 hover:bg-slate-850 rounded-2xl text-xs font-bold uppercase tracking-wide shadow-md transition-all cursor-pointer"
                    >
                      Verify OTP Code
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: MOBILE WALLET PIN MASK PROMPT */}
              {autoStep === 2 && (
                <div className="space-y-3.5 animate-fade-in text-center">
                  <p className="text-[11px] font-semibold text-slate-500 leading-normal text-rose-600">
                    🔒 SECURE PORTAL PIN DISPATCH
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Shielded link. Enter your secure mobile wallet 4-5 digit PIN code to finalize the automatic merchant settlement link.
                  </p>
                  <div>
                    <input
                      type="password"
                      maxLength={5}
                      required
                      placeholder="•••••"
                      value={autoPinInput}
                      onChange={(e) => setAutoPinInput(e.target.value.replace(/\D/g, ''))}
                      className="w-1/3 text-center text-xl tracking-[0.2em] font-mono font-black bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAutoStep(1)}
                      className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl text-xs font-bold uppercase text-slate-600 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (autoPinInput.length < 4) {
                          setAutoPortalError('Pin too short! High-security constraints require PIN code length.');
                          return;
                        }
                        setAutoStep(3);
                        const cleanToken = paymentMethod === 'bKashAuto' ? 'bKASH_AUTO_' : 'NAGAD_AUTO_';
                        const generatedTxnRef = cleanToken + Math.random().toString(36).substr(2, 9).toUpperCase();
                        runFinalTriggerAPI(storedOrderData, (paymentMethod === 'bKashAuto' ? 'bKash (Auto)' : 'Nagad (Auto)'), generatedTxnRef);
                      }}
                      className="w-2/3 py-2.5 text-white bg-slate-900 hover:bg-slate-850 rounded-2xl text-xs font-bold uppercase tracking-wide shadow-md transition-all cursor-pointer"
                    >
                      Confirm Checkout PIN
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: API WAITING SPINNER */}
              {autoStep === 3 && (
                <div className="py-6 flex flex-col items-center justify-center space-y-4 animate-fade-in text-center">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-slate-100 border-t-emerald-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase font-bold text-slate-450 font-sans">API</div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider">Verifying transaction ref link...</h4>
                    <p className="text-[10px] text-slate-500 font-medium">Communicating with bank payment nodes securely. Please don't close the browser window.</p>
                  </div>
                </div>
              )}

              {/* STEP 4: SUCCESS OVERVIEW */}
              {autoStep === 4 && (
                <div className="py-6 flex flex-col items-center justify-center space-y-4 animate-scale-in text-center">
                  <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-300 text-emerald-750 rounded-full flex items-center justify-center text-badge shadow-sm">
                    <Sparkles className="w-8 h-8 text-emerald-600 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-emerald-800 uppercase tracking-tight">TRANSACTION APPROVED!</h4>
                    <p className="text-[10px] text-slate-500 max-w-xs leading-normal">Awesome! Sandbox banking clearance returned positive code. Your order is registered completely as <strong>PAID</strong>.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAutoPortalOpen(false);
                      onClose();
                    }}
                    className="cursor-pointer px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase shadow rounded-xl transition-all"
                  >
                    View Invoice receipt
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
