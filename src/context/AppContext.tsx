/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  Order,
  Coupon,
  NewsletterSubscriber,
  Review,
  SiteSettings,
  SMTPSettings,
  PaymentSettings,
  AdminCredentials,
  SupportSettings,
  CartItem,
} from '../types';
import {
  dbService,
  DEFAULT_SITE_SETTINGS,
  DEFAULT_SMTP_SETTINGS,
  DEFAULT_PAYMENT_SETTINGS,
  DEFAULT_ADMIN_CREDENTIALS,
  DEFAULT_SUPPORT_SETTINGS,
} from '../db';

interface AppContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  coupons: Coupon[];
  newsletterSubscribers: NewsletterSubscriber[];
  reviews: Review[];
  siteSettings: SiteSettings;
  smtpSettings: SMTPSettings;
  paymentSettings: PaymentSettings;
  adminSettings: AdminCredentials;
  supportSettings: SupportSettings;
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  isAdminLoggedIn: boolean;
  isLoading: boolean;

  // Actions
  addProduct: (product: Product) => Promise<void>;
  editProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateProductStock: (productId: string, newStock: number) => Promise<void>;
  
  addCategory: (category: Category) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;

  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'orderStatus' | 'paymentStatus'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['orderStatus']) => Promise<void>;
  updateOrderPaymentStatus: (orderId: string, status: Order['paymentStatus']) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  editOrderNumber: (orderId: string, newNumber: string) => Promise<void>;

  addCoupon: (coupon: Coupon) => Promise<void>;
  deleteCoupon: (couponId: string) => Promise<void>;

  subscribeNewsletter: (email: string) => Promise<{ success: boolean; message: string }>;
  deleteSubscriber: (id: string) => Promise<void>;

  addReview: (productId: string, name: string, rating: number, comment: string) => Promise<void>;
  approveReview: (reviewId: string, approve: boolean) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;

  saveSiteSettings: (settings: SiteSettings) => Promise<void>;
  saveSMTPSettings: (settings: SMTPSettings) => Promise<void>;
  savePaymentSettings: (settings: PaymentSettings) => Promise<void>;
  saveAdminSettings: (settings: AdminCredentials) => Promise<void>;
  saveSupportSettings: (settings: SupportSettings) => Promise<void>;

  // Cart actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  setAdminLoggedIn: (loggedIn: boolean) => void;
  triggerTawkToLoader: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [newsletterSubscribers, setNewsletterSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [smtpSettings, setSmtpSettings] = useState<SMTPSettings | null>(null);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [adminSettings, setAdminSettings] = useState<AdminCredentials | null>(null);
  const [supportSettings, setSupportSettings] = useState<SupportSettings | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('qf_admin_logged') === 'true';
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize and fetch DB in parallel
  useEffect(() => {
    async function loadData() {
      try {
        const [
          prods,
          cats,
          ords,
          coups,
          subs,
          revs,
          site,
          smtp,
          pay,
          adm,
          supp,
        ] = await Promise.all([
          dbService.getProducts(),
          dbService.getCategories(),
          dbService.getOrders(),
          dbService.getCoupons(),
          dbService.getNewsletterSubscribers(),
          dbService.getReviews(),
          dbService.getSiteSettings(),
          dbService.getSMTPSettings(),
          dbService.getPaymentSettings(),
          dbService.getAdminSettings(),
          dbService.getSupportSettings(),
        ]);

        setProducts(prods);
        setCategories(cats);
        setOrders(ords);
        setCoupons(coups);
        setNewsletterSubscribers(subs);
        setReviews(revs);
        setSiteSettings(site);
        setSmtpSettings(smtp);
        setPaymentSettings(pay);
        setAdminSettings(adm);
        setSupportSettings(supp);
      } catch (err) {
        console.error("Critical error pulling data context:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync admin state
  const setAdminLoggedIn = (loggedIn: boolean) => {
    setIsAdminLoggedIn(loggedIn);
    localStorage.setItem('qf_admin_logged', loggedIn ? 'true' : 'false');
  };

  // --- PRODUCTS ---
  const addProduct = async (product: Product) => {
    try {
      await dbService.saveProduct(product);
    } catch (err) {
      console.warn("Firestore saveProduct failure. Saved locally.", err);
    }
    setProducts(prev => [...prev, product]);
  };

  const editProduct = async (product: Product) => {
    try {
      await dbService.saveProduct(product);
    } catch (err) {
      console.warn("Firestore editProduct failure. Updated locally.", err);
    }
    setProducts(prev => prev.map((p) => (p.id === product.id ? product : p)));
  };

  const deleteProduct = async (productId: string) => {
    try {
      await dbService.deleteProduct(productId);
    } catch (err) {
      console.warn("Firestore deleteProduct failure. Deleted locally.", err);
    }
    setProducts(prev => prev.filter((p) => p.id !== productId));
  };

  const updateProductStock = async (productId: string, newStock: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const updated = { ...product, stock: Math.max(0, newStock) };
      await editProduct(updated);
    }
  };

  // --- CATEGORIES ---
  const addCategory = async (cat: Category) => {
    try {
      await dbService.saveCategory(cat);
    } catch (err) {
      console.warn("saveCategory failure:", err);
    }
    setCategories(prev => [...prev, cat]);
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await dbService.deleteCategory(categoryId);
    } catch (err) {
      console.warn("deleteCategory failure:", err);
    }
    setCategories(prev => prev.filter((c) => c.id !== categoryId));
  };

  // --- ORDERS & INVOICES ---
  const placeOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'orderStatus' | 'paymentStatus'>) => {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000); // ORD-123456
    const orderNumber = `ORD-${randomSuffix}`;
    const id = 'ord_' + Math.random().toString(36).substr(2, 9);
    
    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      createdAt: new Date().toISOString(),
      orderStatus: 'Pending',
      paymentStatus: orderData.paymentMethod === 'COD' ? 'Pending' : 'Paid', // Automatic payments mark Paid instantly in mock
    };

    await dbService.saveOrder(newOrder);
    
    // Update local products stock counts locally too to keep view snappy
    setProducts(prev =>
      prev.map((p) => {
        const item = newOrder.items.find((oi) => oi.productId === p.id);
        if (item) {
          return { ...p, stock: Math.max(0, p.stock - item.quantity) };
        }
        return p;
      })
    );

    setOrders(prev => [newOrder, ...prev]);

    // Send order confirmation via SMTP in the background
    triggerEmailNotifications(newOrder);

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['orderStatus']) => {
    try {
      await dbService.updateOrderStatus(orderId, status);
    } catch (err) {
      console.warn("updateOrderStatus failure. Offline local update done.", err);
    }
    setOrders(prev =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status, paymentStatus: status === 'Delivered' ? 'Paid' : o.paymentStatus } : o))
    );

    // Trigger update notification
    const orderObj = orders.find(o => o.id === orderId);
    if (orderObj) {
      const updatedOrder = { ...orderObj, orderStatus: status };
      triggerEmailNotifications(updatedOrder);
    }
  };

  const updateOrderPaymentStatus = async (orderId: string, status: Order['paymentStatus']) => {
    try {
      await dbService.updateOrderPaymentStatus(orderId, status);
    } catch (err) {
      console.warn("updateOrderPaymentStatus failure. Offline local update done.", err);
    }
    setOrders(prev =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o))
    );
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await dbService.deleteOrder(orderId);
    } catch (err) {
      console.warn("deleteOrder failure. Offline local update done.", err);
    }
    setOrders(prev => prev.filter((o) => o.id !== orderId));
  };

  const editOrderNumber = async (orderId: string, newNumber: string) => {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex > -1) {
      const updatedOrder = { ...orders[orderIndex], orderNumber: newNumber };
      try {
        await dbService.saveOrder(updatedOrder);
      } catch (err) {
        console.warn("saveOrder failure. Offline local update done.", err);
      }
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    }
  };

  // --- COUPONS ---
  const addCoupon = async (coupon: Coupon) => {
    try {
      await dbService.saveCoupon(coupon);
    } catch (err) {
      console.warn("saveCoupon failure:", err);
    }
    setCoupons(prev => [...prev, coupon]);
  };

  const deleteCoupon = async (couponId: string) => {
    try {
      await dbService.deleteCoupon(couponId);
    } catch (err) {
      console.warn("deleteCoupon failure:", err);
    }
    setCoupons(prev => prev.filter((c) => c.id !== couponId));
  };

  // --- NEWSLETTER ---
  const subscribeNewsletter = async (email: string) => {
    const success = await dbService.subscribeNewsletter(email);
    if (success) {
      const newSub: NewsletterSubscriber = {
        id: 'sub_' + Math.random().toString(36).substr(2, 9),
        email: email.trim().toLowerCase(),
        subscribedAt: new Date().toISOString()
      };
      setNewsletterSubscribers(prev => [...prev, newSub]);

      // send confirmation email simulation
      try {
        fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            subject: `Welcome to ${siteSettings?.websiteName || 'Quirky Fruity'} Newsletter!`,
            html: `
              <div style="font-family: 'Space Grotesk', sans-serif; background: #fcf3e3; padding: 40px; text-align: center; border-radius: 12px; max-width: 600px; margin: auto;">
                <div style="font-size: 50px;">🎉</div>
                <h1 style="color: #ff5c35; margin-bottom: 5px;">Awesome, you are subscribed!</h1>
                <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">Get ready for exciting product launches, healthy organic recipes, and exclusive promo codes directly in your inbox.</p>
                <div style="margin: 30px 0; border-top: 2px dashed #ff5c35;"></div>
                <p style="font-size: 13px; color: #9ca3af; margin: 0;">${siteSettings?.trademarkText || ''}</p>
              </div>
            `,
            smtpSettings: smtpSettings
          })
        });
      } catch (err) {
        console.warn("Newsletter confirmation trigger failed:", err);
      }

      return { success: true, message: '🎉 Hurray! You registered successfully.' };
    } else {
      return { success: false, message: 'This email address is already subscribed!' };
    }
  };

  const deleteSubscriber = async (id: string) => {
    try {
      await dbService.deleteSubscriber(id);
    } catch (err) {
      console.warn("deleteSubscriber failure:", err);
    }
    setNewsletterSubscribers(prev => prev.filter((s) => s.id !== id));
  };

  // --- REVIEWS ---
  const addReview = async (productId: string, name: string, rating: number, comment: string) => {
    try {
      await dbService.addReview(productId, name, rating, comment);
    } catch (err) {
      console.warn("addReview failure:", err);
    }
    try {
      const updatedReviews = await dbService.getReviews();
      setReviews(updatedReviews);
    } catch (err) {
      console.warn("getReviews failure:", err);
    }

    try {
      // Reload products to pull active rating count updates
      const updatedProds = await dbService.getProducts();
      setProducts(updatedProds);
    } catch (err) {
      console.warn("getProducts failure:", err);
    }
  };

  const approveReview = async (reviewId: string, approve: boolean) => {
    try {
      await dbService.approveReview(reviewId, approve);
    } catch (err) {
      console.warn("approveReview failure:", err);
    }
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, isApproved: approve } : r));
  };

  const deleteReview = async (reviewId: string) => {
    try {
      await dbService.deleteReview(reviewId);
    } catch (err) {
      console.warn("deleteReview failure:", err);
    }
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  // --- GLOBAL SETTINGS TABS ---
  const saveSiteSettings = async (settings: SiteSettings) => {
    await dbService.saveSiteSettings(settings);
    setSiteSettings(settings);
  };

  const saveSMTPSettings = async (settings: SMTPSettings) => {
    await dbService.saveSMTPSettings(settings);
    setSmtpSettings(settings);
  };

  const savePaymentSettings = async (settings: PaymentSettings) => {
    await dbService.savePaymentSettings(settings);
    setPaymentSettings(settings);
  };

  const saveAdminSettings = async (settings: AdminCredentials) => {
    await dbService.saveAdminSettings(settings);
    setAdminSettings(settings);
  };

  const saveSupportSettings = async (settings: SupportSettings) => {
    await dbService.saveSupportSettings(settings);
    setSupportSettings(settings);
    // dynamically reload support chat widget
    triggerTawkToLoader();
  };

  // --- CART OPERATIONS ---
  const addToCart = (product: Product) => {
    if (product.stock === 0) return;
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === product.id);
      if (existingIdx > -1) {
        const currentQty = prev[existingIdx].quantity;
        if (currentQty >= product.stock) return prev; // stock boundary limit
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], quantity: currentQty + 1 };
        return updated;
      } else {
        return [...prev, { id: product.id, product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    const productItem = products.find(p => p.id === productId);
    const maxStock = productItem ? productItem.stock : 999;
    
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.id !== productId);
      }
      return prev.map((item) =>
        item.id === productId ? { ...item, quantity: Math.min(quantity, maxStock) } : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCouponCode = (code: string) => {
    const match = coupons.find((c) => c.code.trim().toUpperCase() === code.trim().toUpperCase());
    if (!match) {
      return { success: false, message: 'Invalid coupon code!' };
    }
    const today = new Date().toISOString().split('T')[0];
    if (match.expiryDate < today) {
      return { success: false, message: 'Coupon has expired!' };
    }
    if (match.usedCount >= match.usageLimit) {
      return { success: false, message: 'Coupon usage limit reached!' };
    }
    setAppliedCoupon(match);
    return { success: true, message: `🎉 Applied ${match.discountPercentage}% Discount!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // --- TAWK TO LIVE CHIP ---
  const triggerTawkToLoader = () => {
    if (supportSettings?.isEnabled && supportSettings.tawkToId) {
      // remove old tawk.to scripts
      const oldScript = document.querySelector('script[src*="tawk.to"]');
      if (oldScript) oldScript.remove();
      const oldIframe = document.querySelector('[class*="tawk-"]');
      if (oldIframe) oldIframe.remove();

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://embed.tawk.to/${supportSettings.tawkToId}/default`;
      script.charset = 'UTF-8';
      script.setAttribute('crossorigin', '*');
      document.head.appendChild(script);
    }
  };

  useEffect(() => {
    if (supportSettings?.isEnabled) {
      triggerTawkToLoader();
    }
  }, [supportSettings]);

  // --- BEAUTIFUL SMTP INVOICE GENERATOR ---
  const triggerEmailNotifications = async (order: Order) => {
    const listHtml = order.items.map(item => `
      <tr style="border-bottom: 1px solid #e5e7eb;">
        <td style="padding: 12px 0; color: #1f2937; font-weight: 500;">${item.name}</td>
        <td style="padding: 12px 0; text-align: center; color: #4b5563;">${item.quantity}</td>
        <td style="padding: 12px 0; text-align: right; color: #ff5c35; font-weight: bold;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const invoiceSubject = `Receipt for Your Order ${order.orderNumber} - ${siteSettings?.websiteName || 'Store'}`;

    const invoiceHtml = `
      <div style="font-family: 'Inter', system-ui, sans-serif; background: #fafafa; padding: 30px; border-radius: 12px; max-width: 650px; margin: auto; border: 1px solid #e5e7eb;">
        <!-- Header Strip -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
          <tr>
            <td>
              <span style="font-size: 28px; font-weight: 800; color: #ff5c35; text-transform: uppercase;">${siteSettings?.websiteName || 'quirky-fruity'}</span>
              <span style="font-size: 24px;"> ${siteSettings?.logoEmoji || '🍊'}</span>
            </td>
            <td style="text-align: right;">
              <div style="font-size: 20px; font-weight: 700; color: #374151; letter-spacing: -0.5px;">Sales Invoice</div>
              <div style="font-size: 11px; color: #9ca3af; letter-spacing: 2px;">CONFIRMED</div>
            </td>
          </tr>
        </table>

        <!-- Red Line Graphic mimicking Stripe / quirky -->
        <div style="height: 6px; background: #ff5c35; border-radius: 3px; margin-bottom: 25px;"></div>

        <!-- Info Columns -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 13px;">
          <tr>
            <td style="width: 50%; vertical-align: top; padding-right: 20px; line-height: 1.6;">
              <span style="color: #ff5c35; font-weight: 700; text-transform: uppercase; font-size: 11px;">Shipping & Customer Details</span><br/>
              <strong>${order.customerName}</strong><br/>
              Phone: ${order.phone}<br/>
              Email: ${order.email}<br/>
              Address: ${order.address}, ${order.city}<br/>
              ${order.postalCode ? `Postal Code: ${order.postalCode}<br/>` : ''}
              ${order.deliveryNote ? `<span style="color: #6b7280; font-style: italic;">Note: "${order.deliveryNote}"</span>` : ''}
            </td>
            <td style="width: 50%; vertical-align: top; line-height: 1.6;">
              <span style="color: #ff5c35; font-weight: 700; text-transform: uppercase; font-size: 11px;">Invoice Details</span><br/>
              <strong>Invoice No:</strong> #${order.orderNumber}<br/>
              <strong>Order Status:</strong> <span style="background: #fef2f2; color: #b91c1c; padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 11px;">${order.orderStatus}</span><br/>
              <strong>Payment Status:</strong> <span style="background: #f0fdf4; color: #166534; padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 11px;">${order.paymentStatus}</span><br/>
              <strong>Payment Method:</strong> ${order.paymentMethod}<br/>
              <strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}
            </td>
          </tr>
        </table>

        <!-- Table of items -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 14px;">
          <thead>
            <tr style="border-bottom: 2px solid #ff5c35; font-size: 11px; text-transform: uppercase; color: #ff5c35; font-weight: bold;">
              <th style="text-align: left; padding-bottom: 8px;">Items</th>
              <th style="text-align: center; padding-bottom: 8px; width: 60px;">Qty</th>
              <th style="text-align: right; padding-bottom: 8px; width: 100px;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${listHtml}
          </tbody>
        </table>

        <!-- Calculations -->
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; line-height: 1.8;">
          <tr>
            <td style="color: #4b5563;">Subtotal</td>
            <td style="text-align: right; font-weight: 500; color: #1f2937;">$${order.subtotal.toFixed(2)}</td>
          </tr>
          ${order.discount > 0 ? `
          <tr>
            <td style="color: #b91c1c;">Discount ${order.couponApplied ? `(${order.couponApplied})` : ''}</td>
            <td style="text-align: right; font-weight: 500; color: #b91c1c;">-$${order.discount.toFixed(2)}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="color: #4b5563;">Delivery Shipping & Handling</td>
            <td style="text-align: right; font-weight: 500; color: #1f2937;">$${order.deliveryFee.toFixed(2)}</td>
          </tr>
          <tr style="border-top: 1px double #ff5c35; font-size: 16px; font-weight: bold; color: #ff5c35;">
            <td style="padding-top: 10px;">GRAND TOTAL</td>
            <td style="text-align: right; padding-top: 10px; font-weight: 800; font-size: 18px;">$${order.total.toFixed(2)}</td>
          </tr>
        </table>

        <!-- Signature/Thank you Footer -->
        <div style="margin-top: 40px; text-align: center; font-size: 13px; color: #4b5563; border-top: 1px dashed #e5e7eb; padding-top: 30px;">
          <h3 style="color: #ff5c35; margin: 0 0 5px 0; font-size: 16px;">Thank you for your order!</h3>
          <p style="margin: 0 0 15px 0;">If you have any questions about this invoice, simply write to us at <a href="mailto:${siteSettings?.contactEmail}" style="color: #ff5c35; text-decoration: none;">${siteSettings?.contactEmail || 'support@example.com'}</a>.</p>
          <div style="font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px;">
            ${siteSettings?.trademarkText || '© 2026 quirky-fruity Ltd. All rights reserved.'}
          </div>
          <p style="font-size: 10px; color: #d1d5db; margin-top: 5px;">Invoice generated automatically on order placement.</p>
        </div>
      </div>
    `;

    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: order.email,
          subject: invoiceSubject,
          html: invoiceHtml,
          smtpSettings: smtpSettings
        })
      });

      // Also notify merchant/admin of new order placement
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: siteSettings?.contactEmail || 'admin@quirkyfruity.com',
          subject: `🔔 NEW ORDER RECEIVED - [${order.orderNumber}] total $${order.total.toFixed(2)}`,
          html: `
            <div style="font-family: 'Inter', sans-serif; background: #fafafa; padding: 35px; border-radius: 12px; max-width: 600px; margin: auto; border: 1px solid #e5e7eb;">
              <h2 style="color: #ff5c35; margin-top: 0;">🔔 New Order Placed!</h2>
              <p>Hey Admin, order <strong>${order.orderNumber}</strong> has been submitted. Check details:</p>
              <ul>
                <li><strong>Customer:</strong> ${order.customerName} (${order.phone})</li>
                <li><strong>Shipping Info:</strong> ${order.address}, ${order.city}</li>
                <li><strong>Order Total:</strong> $${order.total.toFixed(2)}</li>
                <li><strong>Payment:</strong> ${order.paymentMethod} (${order.paymentStatus})</li>
              </ul>
              <p>Verify stock levels and process this transaction inside the <a href="${window.location.origin}/admin" style="color: #ff5c35; font-weight: bold; text-decoration: none;">Admin Dashboard</a>.</p>
            </div>
          `,
          smtpSettings: smtpSettings
        })
      });
    } catch (err) {
      console.warn("SMTP email dispatch failed or got offline simulation. Normal behavior on disconnected sandbox.", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        orders,
        coupons,
        newsletterSubscribers,
        reviews,
        siteSettings: siteSettings || DEFAULT_SITE_SETTINGS,
        smtpSettings: smtpSettings || DEFAULT_SMTP_SETTINGS,
        paymentSettings: paymentSettings || DEFAULT_PAYMENT_SETTINGS,
        adminSettings: adminSettings || DEFAULT_ADMIN_CREDENTIALS,
        supportSettings: supportSettings || DEFAULT_SUPPORT_SETTINGS,
        cart,
        appliedCoupon,
        isAdminLoggedIn,
        isLoading,

        addProduct,
        editProduct,
        deleteProduct,
        updateProductStock,
        addCategory,
        deleteCategory,
        placeOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        deleteOrder,
        editOrderNumber,
        addCoupon,
        deleteCoupon,
        subscribeNewsletter,
        deleteSubscriber,
        addReview,
        approveReview,
        deleteReview,
        saveSiteSettings,
        saveSMTPSettings,
        savePaymentSettings,
        saveAdminSettings,
        saveSupportSettings,

        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyCouponCode,
        removeCoupon,
        setAdminLoggedIn,
        triggerTawkToLoader,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an AppProvider context.');
  }
  return context;
};
