/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from './Toast';
import {
  Settings,
  Package,
  ShoppingBag,
  Ticket,
  Users,
  Star,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  Save,
  LogOut,
  Mail,
  Shield,
  KeyRound,
  Eye,
  Check,
  Phone,
  RefreshCw,
} from 'lucide-react';
import { Product, Coupon, Category } from '../types';

export const AdminPanel: React.FC = () => {
  const {
    products,
    categories,
    orders,
    coupons,
    newsletterSubscribers,
    reviews,
    siteSettings,
    smtpSettings,
    paymentSettings,
    adminSettings,
    supportSettings,
    isAdminLoggedIn,

    addProduct,
    editProduct,
    deleteProduct,
    addCategory,
    deleteCategory,
    updateOrderStatus,
    updateOrderPaymentStatus,
    deleteOrder,
    editOrderNumber,
    addCoupon,
    deleteCoupon,
    deleteSubscriber,
    approveReview,
    deleteReview,
    saveSiteSettings,
    saveSMTPSettings,
    savePaymentSettings,
    saveAdminSettings,
    saveSupportSettings,
    setAdminLoggedIn,
  } = useApp();

  const toast = useToast();

  // Route Login input
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Primary active Admin tab
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'coupons' | 'reviews' | 'subscribers' | 'settings'>('products');

  // Multi-Section settings tab index
  const [settingsSection, setSettingsSection] = useState<'general' | 'smtp' | 'payment' | 'security' | 'support'>('general');

  // --- SUBSTATES FOR ADD/EDIT PRODUCTS ---
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodSalePrice, setProdSalePrice] = useState<number | null>(null);
  const [prodStock, setProdStock] = useState(0);
  const [prodImage, setProdImage] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodFeatured, setProdFeatured] = useState(false);

  // --- SUBSTATES FOR ADDING A COUPON ---
  const [isCouponFormOpen, setIsCouponFormOpen] = useState(false);
  const [coupCode, setCoupCode] = useState('');
  const [coupDiscount, setCoupDiscount] = useState(10);
  const [coupExpiry, setCoupExpiry] = useState('');
  const [coupLimit, setCoupLimit] = useState(100);

  // --- SUBSTATES FOR QUICK CATEGORY CREATION ---
  const [newCatName, setNewCatName] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('🍊');

  // --- SHIPPING ORDER NUMBER EDITING ---
  const [selectedOrderIdToEdit, setSelectedOrderIdToEdit] = useState<string | null>(null);
  const [tempOrderNumber, setTempOrderNumber] = useState('');

  // --- DYNAMIC BRANDING FORM FIELDS ---
  const [brandName, setBrandName] = useState(siteSettings.websiteName || '');
  const [brandLogo, setBrandLogo] = useState(siteSettings.logoEmoji || '');
  const [heroBadgeText, setHeroBadgeText] = useState(siteSettings.heroBadge || '');
  const [heroLine1, setHeroLine1] = useState(siteSettings.heroTitleLine1 || '');
  const [heroLine2, setHeroLine2] = useState(siteSettings.heroTitleLine2 || '');
  const [heroSubText, setHeroSubText] = useState(siteSettings.heroSubtitle || '');
  const [heroBtnText, setHeroBtnText] = useState(siteSettings.heroButtonText || '');
  const [heroHours, setHeroHours] = useState(siteSettings.heroTimeBadge || '');
  const [footerCopy, setFooterCopy] = useState(siteSettings.footerText || '');
  const [footerPhone, setFooterPhone] = useState(siteSettings.contactPhone || '');
  const [footerMail, setFooterMail] = useState(siteSettings.contactEmail || '');
  const [footerLoc, setFooterLoc] = useState(siteSettings.contactAddress || '');
  const [trademarkTextVal, setTrademarkTextVal] = useState(siteSettings.trademarkText || '');
  const [promoActive, setPromoActive] = useState(siteSettings.promoBannerEnabled || false);
  const [promoTextVal, setPromoTextVal] = useState(siteSettings.promoBannerText || '');
  const [socialFB, setSocialFB] = useState(siteSettings.socialFacebook ?? '');
  const [socialIG, setSocialIG] = useState(siteSettings.socialInstagram ?? '');
  const [socialTW, setSocialTW] = useState(siteSettings.socialTwitter ?? '');

  // --- SMTP FORM FIELDS ---
  const [smtpEnabled, setSmtpEnabled] = useState(smtpSettings.isEnabled || false);
  const [smtpHost, setSmtpHost] = useState(smtpSettings.host || '');
  const [smtpPort, setSmtpPort] = useState(smtpSettings.port || '');
  const [smtpEmailVal, setSmtpEmailVal] = useState(smtpSettings.email || '');
  const [smtpPassVal, setSmtpPassVal] = useState(smtpSettings.password || '');

  // --- PAYMENTS CONFIG FIELDS ---
  const [payCod, setPayCod] = useState(paymentSettings.codEnabled ?? false);
  const [payBkash, setPayBkash] = useState(paymentSettings.bKashEnabled ?? false);
  const [payBkashNo, setPayBkashNo] = useState(paymentSettings.bKashNo ?? '');
  const [payBkashGuide, setPayBkashGuide] = useState(paymentSettings.bKashInstructions ?? '');
  const [payBkashLogoEmoji, setPayBkashLogoEmoji] = useState(paymentSettings.bKashLogoEmoji ?? '💸');
  const [payBkashQrCodeUrl, setPayBkashQrCodeUrl] = useState(paymentSettings.bKashQrCodeUrl ?? '');

  const [payNagad, setPayNagad] = useState(paymentSettings.nagadEnabled ?? false);
  const [payNagadNo, setPayNagadNo] = useState(paymentSettings.nagadNo ?? '');
  const [payNagadGuide, setPayNagadGuide] = useState(paymentSettings.nagadInstructions ?? '');
  const [payNagadLogoEmoji, setPayNagadLogoEmoji] = useState(paymentSettings.nagadLogoEmoji ?? '🟠');
  const [payNagadQrCodeUrl, setPayNagadQrCodeUrl] = useState(paymentSettings.nagadQrCodeUrl ?? '');

  const [payRocket, setPayRocket] = useState(paymentSettings.rocketEnabled ?? false);
  const [payRocketNo, setPayRocketNo] = useState(paymentSettings.rocketNo ?? '');
  const [payRocketGuide, setPayRocketGuide] = useState(paymentSettings.rocketInstructions ?? '');
  const [payRocketLogoEmoji, setPayRocketLogoEmoji] = useState(paymentSettings.rocketLogoEmoji ?? '🟣');
  const [payRocketQrCodeUrl, setPayRocketQrCodeUrl] = useState(paymentSettings.rocketQrCodeUrl ?? '');

  const [payBank, setPayBank] = useState(paymentSettings.bankEnabled ?? false);
  const [payBankNo, setPayBankNo] = useState(paymentSettings.bankNo ?? '');
  const [payBankGuide, setPayBankGuide] = useState(paymentSettings.bankInstructions ?? '');
  const [payBankLogoEmoji, setPayBankLogoEmoji] = useState(paymentSettings.bankLogoEmoji ?? '🏦');
  const [payBankQrCodeUrl, setPayBankQrCodeUrl] = useState(paymentSettings.bankQrCodeUrl ?? '');
  const [payBankName, setPayBankName] = useState(paymentSettings.bankName ?? '');
  const [payBankHolder, setPayBankHolder] = useState(paymentSettings.bankHolder ?? '');

  const [payCreditManual, setPayCreditManual] = useState(paymentSettings.creditManualEnabled ?? false);
  const [payCreditManualNo, setPayCreditManualNo] = useState(paymentSettings.creditManualNo ?? '');
  const [payCreditManualGuide, setPayCreditManualGuide] = useState(paymentSettings.creditManualInstructions ?? '');
  const [payCreditManualLogoEmoji, setPayCreditManualLogoEmoji] = useState(paymentSettings.creditManualLogoEmoji ?? '💳');
  const [payCreditManualQrCodeUrl, setPayCreditManualQrCodeUrl] = useState(paymentSettings.creditManualQrCodeUrl ?? '');

  const [payStripe, setPayStripe] = useState(paymentSettings.stripeEnabled ?? false);
  const [payStripeKey, setPayStripeKey] = useState(paymentSettings.stripePublicKey ?? '');
  const [payStripeSecret, setPayStripeSecret] = useState(paymentSettings.stripeSecretKey ?? '');
  const [payStripeSandbox, setPayStripeSandbox] = useState(paymentSettings.stripeSandboxMode ?? false);

  const [paySsl, setPaySsl] = useState(paymentSettings.sslCommerzEnabled ?? false);
  const [paySslStoreId, setPaySslStoreId] = useState(paymentSettings.sslCommerzStoreId ?? '');
  const [paySslStorePass, setPaySslStorePass] = useState(paymentSettings.sslCommerzStorePassword ?? '');
  const [paySslSandbox, setPaySslSandbox] = useState(paymentSettings.sslCommerzSandboxMode ?? false);

  const [payRazor, setPayRazor] = useState(paymentSettings.razorpayEnabled ?? false);
  const [payRazorKeyId, setPayRazorKeyId] = useState(paymentSettings.razorpayKeyId ?? '');
  const [payRazorKeySecret, setPayRazorKeySecret] = useState(paymentSettings.razorpayKeySecret ?? '');
  const [payRazorSandbox, setPayRazorSandbox] = useState(paymentSettings.razorpaySandboxMode ?? false);

  const [payFee, setPayFee] = useState(paymentSettings.shippingFee ?? 5);
  const [payTax, setPayTax] = useState(paymentSettings.taxPercentage ?? 0.05);

  // --- CHAT SUPPORT FIELDS ---
  const [supportEnabled, setSupportEnabled] = useState(supportSettings.isEnabled || false);
  const [supportId, setSupportId] = useState(supportSettings.tawkToId || '');

  // --- SECURITY AUTHENTICATION FORM ---
  const [secUsername, setSecUsername] = useState(adminSettings.username || '');
  const [secPass, setSecPass] = useState(adminSettings.password || '');

  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      usernameInput.trim() === adminSettings.username &&
      passwordInput.trim() === adminSettings.password
    ) {
      setAdminLoggedIn(true);
      toast.success('🔒 Access Granted! Welcome back Administrator.');
    } else {
      toast.error('❌ Authentication failed: Invalid administrator keys!');
    }
  };

  const handleLogout = () => {
    setAdminLoggedIn(false);
    toast.info('🔒 Logged out of secure administrative access.');
  };

  // --- CRUD: PRODUCT SAVE ---
  const handleOpenProductForm = (prod: Product | null = null) => {
    if (prod) {
      setEditingProduct(prod);
      setProdName(prod.name);
      setProdDesc(prod.description);
      setProdPrice(prod.price);
      setProdSalePrice(prod.salePrice);
      setProdStock(prod.stock);
      setProdImage(prod.image);
      setProdCategory(prod.category);
      setProdFeatured(prod.isFeatured);
    } else {
      setEditingProduct(null);
      setProdName('');
      setProdDesc('');
      setProdPrice(0);
      setProdSalePrice(null);
      setProdStock(50);
      setProdImage('🥝');
      setProdCategory(categories[0]?.name || '');
      setProdFeatured(false);
    }
    setIsProductFormOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim() || !prodCategory) {
      toast.error('Product title name and category are required fields.');
      return;
    }

    try {
      const targetId = editingProduct ? editingProduct.id : 'prod_' + Math.random().toString(36).substr(2, 9);
      const productObj: Product = {
        id: targetId,
        name: prodName.trim(),
        description: prodDesc.trim(),
        price: Number(prodPrice),
        salePrice: prodSalePrice === null ? null : Number(prodSalePrice),
        stock: Number(prodStock),
        image: prodImage.trim(),
        category: prodCategory,
        rating: editingProduct ? editingProduct.rating : 4.8,
        reviewsCount: editingProduct ? editingProduct.reviewsCount : 1,
        isFeatured: prodFeatured,
        isActive: true,
      };

      if (editingProduct) {
        await editProduct(productObj);
        toast.success(`👍 Updated ${prodName} details in products catalog.`);
      } else {
        await addProduct(productObj);
        toast.success(`🎉 Uploaded new product ${prodName} to the database!`);
      }
      setIsProductFormOpen(false);
    } catch (err) {
      toast.error('Could not save product specifications.');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Do you want to permanently delete "${name}" from listings?`)) {
      await deleteProduct(id);
      toast.info(`Deleted ${name} listings.`);
    }
  };

  // --- CRUD: QUICK CATEGORY SAVE ---
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const catObj: Category = {
        id: 'cat_' + Math.random().toString(36).substr(2, 9),
        name: newCatName.trim(),
        emoji: newCatEmoji,
        slug: newCatName.toLowerCase().trim().replace(/\s+/g, '-'),
      };
      await addCategory(catObj);
      toast.success(`🎉 Created Category: ${newCatEmoji} ${newCatName}`);
      setNewCatName('');
      if (!prodCategory) setProdCategory(catObj.name);
    } catch (err) {
      toast.error('Category write failure.');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (confirm(`Delete category "${name}"? Products mapped to this won't change but check your configurations.`)) {
      await deleteCategory(id);
      toast.info(`Deleted ${name} category mappings.`);
    }
  };

  // --- CRUD: COUPONS ---
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupCode.trim() || coupDiscount <= 0) return;
    try {
      const coup: Coupon = {
        id: 'coupon_' + Math.random().toString(36).substr(2, 9),
        code: coupCode.toUpperCase().trim(),
        discountPercentage: Number(coupDiscount),
        expiryDate: coupExpiry || new Date(Date.now() + 30 * 24 * 60 * 60 * 100).toISOString().split('T')[0],
        usageLimit: Number(coupLimit),
        usedCount: 0,
      };
      await addCoupon(coup);
      toast.success(`🎉 Created Promo Coupon ${coup.code} giving ${coup.discountPercentage}% OFF!`);
      setCoupCode('');
      setIsCouponFormOpen(false);
    } catch (err) {
      toast.error('Coupon write failure.');
    }
  };

  // --- ORDER NUMBER MANIPULATOR ---
  const handleSaveOrderNumber = async (orderId: string) => {
    if (!tempOrderNumber.trim()) return;
    try {
      await editOrderNumber(orderId, tempOrderNumber.trim());
      toast.success(`Order suffix changed to "${tempOrderNumber.trim()}" successfully.`);
      setSelectedOrderIdToEdit(null);
    } catch (err) {
      toast.error('Order edit failure.');
    }
  };

  // --- CMS GLOBAL CONFIG SAVER ---
  const handleSaveBrandingCMS = async () => {
    try {
      const current = {
        ...siteSettings,
        websiteName: brandName,
        logoEmoji: brandLogo,
        heroBadge: heroBadgeText,
        heroTitleLine1: heroLine1,
        heroTitleLine2: heroLine2,
        heroSubtitle: heroSubText,
        heroButtonText: heroBtnText,
        heroTimeBadge: heroHours,
        footerText: footerCopy,
        contactPhone: footerPhone,
        contactEmail: footerMail,
        contactAddress: footerLoc,
        trademarkText: trademarkTextVal,
        promoBannerEnabled: promoActive,
        promoBannerText: promoTextVal,
        socialFacebook: socialFB,
        socialInstagram: socialIG,
        socialTwitter: socialTW,
      };
      await saveSiteSettings(current);
      toast.success('🎨 Branding & design system properties updated instantly on storefront!');
    } catch (err) {
      toast.error('Branding CMS update failure.');
    }
  };

  const handleSaveSMTPCMS = async () => {
    try {
      const current = {
        isEnabled: smtpEnabled,
        host: smtpHost,
        port: smtpPort,
        email: smtpEmailVal,
        password: smtpPassVal,
      };
      await saveSMTPSettings(current);
      toast.success('📧 SMTP Mail servers keys initialized successfully!');
    } catch (err) {
      toast.error('SMTP CMS update failure.');
    }
  };

  const handleSavePaymentsCMS = async () => {
    try {
      const current = {
        codEnabled: payCod,
        bKashEnabled: payBkash,
        bKashNo: payBkashNo,
        bKashInstructions: payBkashGuide,
        bKashLogoEmoji: payBkashLogoEmoji,
        bKashQrCodeUrl: payBkashQrCodeUrl,
        nagadEnabled: payNagad,
        nagadNo: payNagadNo,
        nagadInstructions: payNagadGuide,
        nagadLogoEmoji: payNagadLogoEmoji,
        nagadQrCodeUrl: payNagadQrCodeUrl,
        rocketEnabled: payRocket,
        rocketNo: payRocketNo,
        rocketInstructions: payRocketGuide,
        rocketLogoEmoji: payRocketLogoEmoji,
        rocketQrCodeUrl: payRocketQrCodeUrl,
        bankEnabled: payBank,
        bankNo: payBankNo,
        bankInstructions: payBankGuide,
        bankLogoEmoji: payBankLogoEmoji,
        bankQrCodeUrl: payBankQrCodeUrl,
        bankName: payBankName,
        bankHolder: payBankHolder,
        creditManualEnabled: payCreditManual,
        creditManualNo: payCreditManualNo,
        creditManualInstructions: payCreditManualGuide,
        creditManualLogoEmoji: payCreditManualLogoEmoji,
        creditManualQrCodeUrl: payCreditManualQrCodeUrl,
        stripeEnabled: payStripe,
        stripePublicKey: payStripeKey,
        stripeSecretKey: payStripeSecret,
        stripeSandboxMode: payStripeSandbox,
        sslCommerzEnabled: paySsl,
        sslCommerzStoreId: paySslStoreId,
        sslCommerzStorePassword: paySslStorePass,
        sslCommerzSandboxMode: paySslSandbox,
        razorpayEnabled: payRazor,
        razorpayKeyId: payRazorKeyId,
        razorpayKeySecret: payRazorKeySecret,
        razorpaySandboxMode: payRazorSandbox,
        cardPaymentEnabled: paymentSettings.cardPaymentEnabled,
        shippingFee: Number(payFee),
        taxPercentage: Number(payTax),
      };
      await savePaymentSettings(current);
      toast.success('💵 Comprehensive Payment configurations (COD, manual bKash/Nagad/Rocket/Bank/Cards + Stripe/SSLCommerz/Razorpay dynamic gateways) updated!');
    } catch (err) {
      toast.error('Payment CMS update failure.');
    }
  };

  const handleSaveSecurityCMS = async () => {
    if (!secUsername.trim() || !secPass.trim()) {
      toast.error('Credential fields cannot be left empty.');
      return;
    }
    try {
      const current = {
        username: secUsername.trim(),
        password: secPass.trim(),
      };
      await saveAdminSettings(current);
      toast.success('🔒 Credentials updated securely! Use these keys on next login.');
    } catch (err) {
      toast.error('Security CMS credential updating failed.');
    }
  };

  const handleSaveSupportCMS = async () => {
    try {
      await saveSupportSettings({
        isEnabled: supportEnabled,
        tawkToId: supportId.trim(),
      });
      toast.success('💬 Live Tawk.to support chat widget configuration verified & injected!');
    } catch (err) {
      toast.error('Chat CMS widget update failure.');
    }
  };

  // --- RENDERING AUTH REQUIRED WALL ---
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex items-center justify-center p-6 bg-sleek-pattern">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-md self-center text-center">
          <div className="bg-emerald-50 text-emerald-600 rounded-full h-14 w-14 mx-auto flex items-center justify-center text-xl shadow-2xs mb-4">
            🔒
          </div>
          
          <h1 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Admin CMS Entrance</h1>
          <p className="text-xs text-slate-400 font-semibold uppercase mt-1 mb-6">Enter secure credentials to manage shop</p>

          <form onSubmit={handleAdminVerify} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Key Identification (Username)</label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter Username"
                className="w-full bg-slate-50 border border-slate-202 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Access Pass (Password)</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border border-slate-202 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full cursor-pointer py-3 bg-slate-900 hover:bg-slate-805 text-white font-semibold uppercase text-xs tracking-wider transition-all rounded-xl shadow-xs"
              >
                Sign In Authorized
              </button>
            </div>
            
            <a
              href="/"
              className="mt-4 block text-center text-xs font-semibold uppercase hover:underline text-slate-500"
            >
              ← Back to Shop Storefront
            </a>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16 flex flex-col">
      
      {/* CMS Header navigation */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row gap-4 items-center justify-between select-none shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 text-white p-2 rounded-xl text-xl shadow-sm">
            🍊
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-slate-800 flex items-center gap-1.5">
              <span>Admin Control Center</span>
              <span className="text-[9px] text-emerald-700 bg-emerald-55 px-2.5 py-0.5 rounded-full font-bold uppercase">
                Active CMS
              </span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Website Type: {brandName}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <a
            href="/"
            className="flex-1 sm:flex-none text-center px-4 py-2 bg-emerald-500 text-white font-semibold text-xs uppercase shadow-sm hover:bg-emerald-600 rounded-xl"
            target="_blank"
          >
            🛰️ Go to Storefront
          </a>
          <button
            onClick={handleLogout}
            className="cursor-pointer p-2 rounded-xl bg-slate-105 border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-150"
            title="Terminate secure session logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 flex-1">
        
        {/* Navigation Sidebar Panel */}
        <nav className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible py-2 select-none border-b lg:border-b-0 border-slate-200 pb-4 mb-4" id="admin-sidebar">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold uppercase transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-emerald-600 text-white border-transparent shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Package className="w-4.5 h-4.5" />
            <span>Products & stock</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold uppercase transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-emerald-600 text-white border-transparent shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            <span>Client Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold uppercase transition-all cursor-pointer ${
              activeTab === 'coupons'
                ? 'bg-emerald-600 text-white border-transparent shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Ticket className="w-4.5 h-4.5" />
            <span>Discount Coupons ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold uppercase transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-emerald-600 text-white border-transparent shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Star className="w-4.5 h-4.5" />
            <span>Moderation ({reviews.filter(r => !r.isApproved).length} pending)</span>
          </button>

          <button
            onClick={() => setActiveTab('subscribers')}
            className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold uppercase transition-all cursor-pointer ${
              activeTab === 'subscribers'
                ? 'bg-emerald-600 text-white border-transparent shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4.5 h-4.5" />
            <span>Subscribers ({newsletterSubscribers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-semibold uppercase transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-emerald-600 text-white border-transparent shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4.5 h-4.5" />
            <span>CMS settings</span>
          </button>
        </nav>

        {/* Content Panel */}
        <main className="lg:col-span-9 bg-white border border-slate-200 rounded-2xl p-6 min-h-[500px] shadow-sm">
          
          {/* TAB 1: PRODUCTS DISPLAY LIST */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 uppercase">Products Catalog Inventory</h3>
                  <p className="text-xs text-slate-500 font-medium">Update prices, replenish stock counts, or add new beverages.</p>
                </div>
                <button
                  onClick={() => handleOpenProductForm(null)}
                  className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-550 hover:bg-emerald-600 hover:translate-y-[-0.5px] text-white font-sans font-semibold uppercase text-xs rounded-xl shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* PRODUCTS MANAGEMENT POPUP MODAL BLOCK */}
              {isProductFormOpen && (
                <div className="bg-slate-55 border border-slate-205 p-5 rounded-2xl relative mb-6 shadow-xs">
                  <h4 className="text-sm font-bold text-slate-800 uppercase mb-4 border-b border-slate-200 pb-2 animate-pulse">
                    {editingProduct ? 'Edit Product Details' : 'Create New Product listing'}
                  </h4>

                  <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Product Title *</label>
                      <input
                        type="text"
                        required
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        placeholder="e.g. Avocado Smoothie Shake"
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none font-medium focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Category Mapped *</label>
                      <select
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none font-medium capitalize focus:ring-1 focus:ring-emerald-400"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name} className="text-slate-900 bg-white font-medium">{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Recipe / Ingredient Description</label>
                      <textarea
                        rows={2}
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
                        placeholder="Active descriptive profile copy text..."
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none font-medium resize-none focus:ring-1 focus:ring-emerald-400"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">List Price ($USD) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={prodPrice}
                        onChange={(e) => setProdPrice(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none font-medium focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Active Sale Price ($USD - Optional)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={prodSalePrice === null ? '' : prodSalePrice}
                        onChange={(e) => setProdSalePrice(e.target.value === '' ? null : Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none font-medium focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Stock Count *</label>
                      <input
                        type="number"
                        required
                        value={prodStock}
                        onChange={(e) => setProdStock(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none font-medium focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vibe Image representation (Emoji) *</label>
                      <input
                        type="text"
                        required
                        value={prodImage}
                        onChange={(e) => setProdImage(e.target.value)}
                        placeholder="e.g. 🍒"
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none font-medium focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-4">
                      <input
                        type="checkbox"
                        id="prod-feat"
                        checked={prodFeatured}
                        onChange={(e) => setProdFeatured(e.target.checked)}
                        className="scale-110 accent-emerald-500 cursor-pointer"
                      />
                      <label htmlFor="prod-feat" className="text-xs font-bold text-slate-600 uppercase cursor-pointer select-none">Highlight as Featured</label>
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-2 border-t border-slate-200 pt-3">
                      <button
                        type="button"
                        onClick={() => setIsProductFormOpen(false)}
                        className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold uppercase cursor-pointer bg-white text-slate-600 hover:bg-slate-55"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 hover:bg-emerald-600 bg-emerald-500 text-white rounded-lg text-xs font-semibold uppercase cursor-pointer shadow-xs"
                      >
                        Save Product Listing
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* QUICK CATEGORIES MANAGER PANEL */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xs">
                <form onSubmit={handleCreateCategory} className="flex gap-2 w-full md:max-w-md">
                  <input
                    type="text"
                    required
                    maxLength={1}
                    placeholder="🍕"
                    value={newCatEmoji}
                    onChange={(e) => setNewCatEmoji(e.target.value)}
                    className="w-12 text-center bg-white border border-slate-200 rounded-lg font-bold text-sm outline-none focus:ring-1 focus:ring-emerald-400"
                    title="Category Icon representation"
                  />
                  <input
                    type="text"
                    required
                    placeholder="NEW CATEGORY NAME (e.g. Coffee)"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-semibold text-xs text-slate-700 uppercase tracking-wide outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 cursor-pointer bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold uppercase border border-transparent"
                  >
                    + Add
                  </button>
                </form>

                <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                  {categories.map((c) => (
                    <span
                      key={c.id}
                      className="bg-white px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 flex items-center gap-1.5 shadow-2xs select-none"
                    >
                      <span>{c.emoji}</span>
                      <span className="uppercase text-slate-600">{c.name}</span>
                      <button
                        onClick={() => handleDeleteCategory(c.id, c.name)}
                        className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer text-[10px]"
                        title="Delete category"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Table Products listings */}
              <div className="overflow-x-auto border border-slate-200 rounded-xl scrollbar-thin shadow-2xs">
                <table className="w-full border-collapse text-left text-xs text-slate-700 bg-white">
                  <thead>
                    <tr className="bg-slate-900 text-white font-sans uppercase font-semibold tracking-wider text-[10px]">
                      <th className="p-3">Item</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Active Stock</th>
                      <th className="p-3 text-center">Featured</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => {
                      const isLowStock = p.stock > 0 && p.stock < 10;
                      const isOutOfStock = p.stock <= 0;
                      return (
                        <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                          <td className="p-3 font-semibold flex items-center gap-2.5">
                            <span className="text-lg bg-slate-50 border border-slate-150 p-1.5 rounded-md">{p.image}</span>
                            <span className="truncate uppercase font-bold max-w-[150px] text-slate-800">{p.name}</span>
                          </td>
                          <td className="p-3 font-semibold uppercase text-slate-450">{p.category}</td>
                          <td className="p-3 font-bold text-slate-800">
                            <span>${(p.salePrice || p.price).toFixed(2)}</span>
                            {p.salePrice !== null && (
                              <span className="text-[10px] text-slate-400 line-through ml-1">${p.price.toFixed(2)}</span>
                            )}
                          </td>
                          <td className="p-3">
                            {isOutOfStock ? (
                              <span className="bg-slate-100 text-slate-400 font-bold px-1.5 py-0.5 rounded uppercase text-[9px]">OUT</span>
                            ) : isLowStock ? (
                              <span className="bg-red-50 text-red-700 font-bold px-1.5 py-0.5 rounded text-[9px] animate-pulse">
                                LOW ({p.stock})
                              </span>
                            ) : (
                              <span className="bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded text-[9px]">
                                {p.stock} units
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-center text-sm">
                            {p.isFeatured ? '⭐' : '—'}
                          </td>
                          <td className="p-3 text-right space-x-1">
                            <button
                              onClick={() => handleOpenProductForm(p)}
                              className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-650 cursor-pointer"
                              title="Edit product parameters"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-150 text-rose-655 cursor-pointer"
                              title="Delete catalog index"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS LIST tracker */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 uppercase">Incoming Client Orders List</h3>
                <p className="text-xs text-slate-450 font-medium">Verify reference indices, update delivery states, or print receipts.</p>
              </div>

              {orders.length === 0 ? (
                <div className="bg-slate-50 p-8 rounded-xl font-semibold text-center text-slate-400 border border-slate-100">
                  No orders placed in records database yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs space-y-3"
                    >
                      {/* Accordion header card details */}
                      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex flex-wrap items-center gap-2">
                          
                          {/* Suffix editor trigger */}
                          {selectedOrderIdToEdit === o.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={tempOrderNumber}
                                onChange={(e) => setTempOrderNumber(e.target.value)}
                                className="border border-slate-250 bg-white rounded-lg px-2 py-0.5 text-xs font-semibold text-slate-800 w-28 capitalize"
                              />
                              <button
                                onClick={() => handleSaveOrderNumber(o.id)}
                                className="bg-emerald-50 text-emerald-600 p-1 border border-emerald-200 rounded-lg text-xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setSelectedOrderIdToEdit(null)}
                                className="bg-rose-50 text-rose-600 p-1 border border-rose-200 rounded-lg text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <span
                              onClick={() => {
                                setSelectedOrderIdToEdit(o.id);
                                setTempOrderNumber(o.orderNumber);
                              }}
                              className="text-xs font-bold text-slate-700 hover:text-emerald-600 cursor-pointer border border-slate-200 bg-slate-50 px-2.5 py-0.5 rounded-md"
                              title="Click to override order indices or suffix values"
                            >
                              #{o.orderNumber}
                            </span>
                          )}

                          <span className="text-[10px] text-slate-400 font-bold">{new Date(o.createdAt).toLocaleString()}</span>
                        </div>

                        {/* Dropdown status update buttons */}
                        <div className="flex flex-wrap items-center gap-1.5 leading-none">
                          <label className="text-[10px] font-bold uppercase text-slate-400 mr-1.5">Delivery Status:</label>
                          <select
                            value={o.orderStatus}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-700 cursor-pointer focus:ring-1 focus:ring-emerald-400"
                          >
                            <option value="Pending" className="text-slate-900 bg-white font-medium">Pending</option>
                            <option value="Processing" className="text-slate-900 bg-white font-medium">Processing</option>
                            <option value="Confirmed" className="text-slate-900 bg-white font-medium">Confirmed</option>
                            <option value="Shipped" className="text-slate-900 bg-white font-medium">Shipped</option>
                            <option value="Delivered" className="text-slate-900 bg-white font-medium">Delivered</option>
                            <option value="Cancelled" className="text-slate-900 bg-white font-medium">Cancelled</option>
                            <option value="Refunded" className="text-slate-900 bg-white font-medium">Refunded</option>
                          </select>

                          <label className="text-[10px] font-bold uppercase text-slate-400 ml-2.5">Billed:</label>
                          <select
                            value={o.paymentStatus}
                            onChange={(e) => updateOrderPaymentStatus(o.id, e.target.value as any)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase text-slate-700 cursor-pointer focus:ring-1 focus:ring-emerald-400"
                          >
                            <option value="Pending" className="text-slate-900 bg-white font-medium">Unpaid (COD)</option>
                            <option value="Paid" className="text-slate-900 bg-white font-medium">Paid (Confirmed)</option>
                          </select>

                          <button
                            onClick={async () => {
                              if (confirm('Delete order row permanently?')) {
                                await deleteOrder(o.id);
                                toast.info('Order destroyed.');
                              }
                            }}
                            className="p-1.5 hover:text-rose-605 border border-slate-200 rounded-md cursor-pointer ml-2 bg-slate-50 text-slate-400 hover:border-rose-150"
                            title="Purge transaction history row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Items grid info column breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                        
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Recipient Delivery Details</p>
                          <p className="font-bold text-slate-800 mt-1">{o.customerName}</p>
                          <p className="text-slate-500">Tel: {o.phone}</p>
                          <p className="text-slate-500">Email: {o.email}</p>
                          <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-150 mt-1.5 leading-snug">
                            {o.address}, {o.city} {o.postalCode ? `[ZIP:${o.postalCode}]` : ''}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Products purchased</p>
                          <ul className="space-y-1 mt-1 font-semibold text-slate-700 uppercase">
                            {o.items.map((it, idx) => (
                              <li key={idx} className="flex gap-1.5">
                                <span className="text-emerald-500">✔</span> <span>{it.quantity}x {it.name} (${it.price.toFixed(2)})</span>
                              </li>
                            ))}
                          </ul>
                          {o.deliveryNote && (
                            <p className="text-[10px] italic text-emerald-600 font-semibold mt-1.5">Note: "{o.deliveryNote}"</p>
                          )}
                        </div>

                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Financial calculation</p>
                          <p className="mt-1 text-slate-600">Subtotal: ${o.subtotal.toFixed(2)}</p>
                          {o.discount > 0 && <p className="text-rose-600 font-semibold">Discount: -${o.discount.toFixed(2)}</p>}
                          <p className="text-slate-600">Delivery Fee: ${o.deliveryFee.toFixed(2)}</p>
                          <p className="font-bold text-sm text-emerald-600 mt-1 border-t border-slate-100 pt-1">
                            GRAND TOTAL: ${o.total.toFixed(2)}
                          </p>
                          <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mt-1">
                            Paid via: {o.paymentMethod}
                          </p>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COUPONS ENGINE Setup */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 uppercase">Promo Code Coupons setup</h3>
                  <p className="text-xs text-slate-450 font-medium">Configure active checkouts discount percentages.</p>
                </div>
                <button
                  onClick={() => setIsCouponFormOpen(!isCouponFormOpen)}
                  className="px-4 py-2 bg-emerald-550 hover:bg-emerald-600 text-white font-sans font-semibold uppercase text-xs rounded-lg shadow-2xs cursor-pointer"
                >
                  {isCouponFormOpen ? 'Close Form' : '+ Add Coupon'}
                </button>
              </div>

              {isCouponFormOpen && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <h4 className="text-xs font-bold uppercase text-slate-700 mb-3">Add Custom Promo Code</h4>
                  <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Coupon Code *</label>
                      <input
                        type="text"
                        required
                        value={coupCode}
                        onChange={(e) => setCoupCode(e.target.value)}
                        placeholder="e.g. SAVINGS20"
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 text-xs font-semibold py-1.5 uppercase outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Discount (%) *</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        required
                        value={coupDiscount}
                        onChange={(e) => setCoupDiscount(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 text-xs font-semibold py-1.5 outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold uppercase text-slate-500 mb-1">Expiry Date *</label>
                      <input
                        type="date"
                        required
                        value={coupExpiry}
                        onChange={(e) => setCoupExpiry(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 text-xs font-semibold py-1 outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full cursor-pointer py-1.5 hover:bg-emerald-700 bg-emerald-600 text-white rounded-lg text-xs font-semibold uppercase transition-colors shadow-2xs"
                    >
                      Create Promo
                    </button>
                  </form>
                </div>
              )}

              {coupons.length === 0 ? (
                <div className="font-semibold text-slate-400 text-center py-6 bg-slate-50 border rounded-xl">
                  No active coupon campaigns configured.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coupons.map((c) => (
                    <div
                      key={c.id}
                      className="bg-white border border-slate-200 p-4 rounded-xl shadow-2xs flex items-center justify-between hover:border-slate-300 transition-all"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                          <span>Code:</span>
                          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono font-bold border border-emerald-100">{c.code}</span>
                        </h4>
                        <p className="text-xs text-slate-505 font-bold mt-1.5">Discount Rate: {c.discountPercentage}% OFF</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase">Limits: {c.usedCount} / {c.usageLimit} uses</p>
                        <p className="text-[10px] text-slate-400 uppercase mt-0.5">Expires on: {c.expiryDate}</p>
                      </div>

                      <button
                        onClick={async () => {
                          if (confirm(`Remove custom coupon "${c.code}"?`)) {
                            await deleteCoupon(c.id);
                            toast.info(`Purged coupon ${c.code}.`);
                          }
                        }}
                        className="p-2 border border-rose-300 hover:bg-rose-100 rounded-xl cursor-pointer text-rose-700"
                        title="Delete promo parameter row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REVIEWS MODERATION LIST */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 uppercase">Product Star Rating Reviews Moderation</h3>
                <p className="text-xs text-slate-450 font-medium">Verify submissions, approve content, or reject comments.</p>
              </div>

              {reviews.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-semibold bg-slate-50 rounded-xl border border-slate-100">
                  No submission ratings stored in database index yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => {
                    const mappedItem = products.find((p) => p.id === r.productId);
                    return (
                      <div
                        key={r.id}
                        className="bg-white border border-slate-200 p-4 rounded-xl flex flex-col sm:flex-row gap-4 justify-between items-start shadow-2xs hover:border-slate-300 transition-all"
                      >
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-700 uppercase">{r.reviewerName}</span>
                            <span className="text-[10px] text-slate-400 font-bold">({new Date(r.createdAt || Date.now()).toLocaleDateString()})</span>
                            {r.isApproved ? (
                              <span className="text-[8px] bg-emerald-50 text-emerald-800 border border-emerald-300 rounded font-bold uppercase px-1.5 py-0.5">APPROVED</span>
                            ) : (
                              <span className="text-[8px] bg-amber-50 text-amber-800 border border-amber-300 rounded font-bold uppercase px-1.5 py-0.5 animate-pulse">PENDING IN BOX</span>
                            )}
                          </div>
                          <div className="flex text-amber-400">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-350 stroke-amber-400" />
                            ))}
                          </div>
                          <p className="text-xs text-slate-500 italic font-semibold leading-relaxed">
                            "{r.comment}"
                          </p>
                          {mappedItem && (
                            <p className="text-[9px] text-[#ff5c35] font-bold uppercase mt-1">
                              Linked listing item: {mappedItem.image} {mappedItem.name}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-1.5">
                          {!r.isApproved && (
                            <button
                              onClick={async () => {
                                await approveReview(r.id, true);
                                toast.success('🎨 Approved review comment! Displayed on testimonials widget.');
                              }}
                              className="px-3 py-1.5 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold uppercase rounded-lg shadow-2xs transition-colors"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              if (confirm('Bin review comments permanently?')) {
                                await deleteReview(r.id);
                                toast.info('Destroyed review comment.');
                              }
                            }}
                            className="px-3 py-1.5 hover:bg-rose-50 border border-rose-200 rounded-lg text-rose-600 text-[10px] uppercase font-semibold transition-colors"
                            title="Delete comment rating"
                          >
                            Purge
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SUBSCRIBERS TABLE */}
          {activeTab === 'subscribers' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 uppercase">Newsletter Subscribers</h3>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Subscribers Count: {newsletterSubscribers.length}</p>
              </div>

              {newsletterSubscribers.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-semibold bg-slate-55 rounded-xl border border-slate-100">
                  No active subscribers registered yet.
                </div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Subscriber CSV list utility */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200 text-[10px] font-semibold text-slate-600 uppercase select-all break-all cursor-copy">
                    CSV EXPORT: {newsletterSubscribers.map(sub => sub.email).join(', ')}
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                    <table className="w-full border-collapse text-left text-xs bg-white text-slate-705">
                      <thead>
                        <tr className="bg-slate-900 border-b border-slate-250 text-[10px] font-bold uppercase text-white">
                          <th className="p-3">Subscriber Address (Email)</th>
                          <th className="p-3">Subscribed date</th>
                          <th className="p-3 text-right">Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newsletterSubscribers.map((item) => (
                          <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-55">
                            <td className="p-3 font-semibold text-slate-800">{item.email}</td>
                            <td className="p-3 font-semibold text-slate-400">{new Date(item.subscribedAt).toLocaleString()}</td>
                            <td className="p-3 text-right">
                              <button
                                onClick={async () => {
                                  if (confirm(`Remove subscriber "${item.email}"?`)) {
                                    await deleteSubscriber(item.id);
                                    toast.info(`Emailed subscriber wiped from database.`);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded cursor-pointer transition-colors"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: GLOBAL CMS SITE SETTINGS MULTI SECTIONS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              {/* Settings segment selectors */}
              <div className="flex flex-wrap gap-1.5 border-b pb-4 mb-4 select-none border-slate-105">
                <button
                  onClick={() => setSettingsSection('general')}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase cursor-pointer transition-all ${
                    settingsSection === 'general'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  🎨 Site Branding
                </button>
                <button
                  onClick={() => setSettingsSection('smtp')}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase cursor-pointer transition-all ${
                    settingsSection === 'smtp'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  📧 SMTP Mail keys
                </button>
                <button
                  onClick={() => setSettingsSection('payment')}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase cursor-pointer transition-all ${
                    settingsSection === 'payment'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  💵 Checkout channels
                </button>
                <button
                  onClick={() => setSettingsSection('support')}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase cursor-pointer transition-all ${
                    settingsSection === 'support'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  💬 Live Support Chat
                </button>
                <button
                  onClick={() => setSettingsSection('security')}
                  className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase cursor-pointer transition-all ${
                    settingsSection === 'security'
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  🔒 credentials keys
                </button>
              </div>

              {/* SECTION: GENERAL BRANDING SETTINGS */}
              {settingsSection === 'general' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-slate-400">🎨 STOREFRONT BRANDING PROVISIONS</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Website Title Name</label>
                      <input
                        type="text"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-hidden transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Logo Character Emoji</label>
                      <input
                        type="text"
                        value={brandLogo}
                        onChange={(e) => setBrandLogo(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Hero Badge Text</label>
                      <input
                        type="text"
                        value={heroBadgeText}
                        onChange={(e) => setHeroBadgeText(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-hidden transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Hero Store Hours Label</label>
                      <input
                        type="text"
                        value={heroHours}
                        onChange={(e) => setHeroHours(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Hero Display Title - Segment 1</label>
                      <input
                        type="text"
                        value={heroLine1}
                        onChange={(e) => setHeroLine1(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-hidden transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Hero Display Title - Segment 2</label>
                      <input
                        type="text"
                        value={heroLine2}
                        onChange={(e) => setHeroLine2(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Hero Subtitle Paragraph Description</label>
                    <textarea
                      rows={2}
                      value={heroSubText}
                      onChange={(e) => setHeroSubText(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold resize-none outline-hidden transition-all"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Hero Order Button Label Texts</label>
                      <input
                        type="text"
                        value={heroBtnText}
                        onChange={(e) => setHeroBtnText(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-hidden transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Footer Copyright Trademark phrase</label>
                      <input
                        type="text"
                        value={trademarkTextVal}
                        onChange={(e) => setTrademarkTextVal(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Branding Contact Mail</label>
                      <input
                        type="email"
                        value={footerMail}
                        onChange={(e) => setFooterMail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-hidden transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Branding Contact Phone</label>
                      <input
                        type="text"
                        value={footerPhone}
                        onChange={(e) => setFooterPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-hidden transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Branding Store Physical Location</label>
                      <input
                        type="text"
                        value={footerLoc}
                        onChange={(e) => setFooterLoc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Facebook URL</label>
                      <input
                        type="text"
                        value={socialFB}
                        onChange={(e) => setSocialFB(e.target.value)}
                        placeholder="https://facebook.com/brand"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-hidden transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Instagram URL</label>
                      <input
                        type="text"
                        value={socialIG}
                        onChange={(e) => setSocialIG(e.target.value)}
                        placeholder="https://instagram.com/brand"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-hidden transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Twitter/X URL</label>
                      <input
                        type="text"
                        value={socialTW}
                        onChange={(e) => setSocialTW(e.target.value)}
                        placeholder="https://twitter.com/brand"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="promo-en"
                        checked={promoActive}
                        onChange={(e) => setPromoActive(e.target.checked)}
                        className="scale-110 accent-emerald-600 rounded cursor-pointer"
                      />
                      <label htmlFor="promo-en" className="text-xs font-bold uppercase cursor-pointer text-slate-700">Enable Header Announcement Promotion Banner</label>
                    </div>
                    {promoActive && (
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Announcement Promo Text Content</label>
                        <input
                          type="text"
                          value={promoTextVal}
                          onChange={(e) => setPromoTextVal(e.target.value)}
                          placeholder="e.g. 🎉 Grand Opening Special Promo: Save 20% on any Smoothie with SAVINGS20!"
                          className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold uppercase text-slate-800 outline-hidden"
                        />
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={handleSaveBrandingCMS}
                      className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-semibold uppercase text-xs shadow-2xs rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Site Branding Properties</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION: SMTP MAIL CONFIG */}
              {settingsSection === 'smtp' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-slate-400">📧 SMTP CLIENT EMAIL SERVER</h4>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">SMTP server handles checkout receipt invoices delivery to your customers directly upon checkout verification. Standard offline simulations run when disabled.</p>
                  
                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      id="smtp-en"
                      checked={smtpEnabled}
                      onChange={(e) => setSmtpEnabled(e.target.checked)}
                      className="scale-110 accent-emerald-600 rounded cursor-pointer"
                    />
                    <label htmlFor="smtp-en" className="text-xs font-bold uppercase cursor-pointer text-slate-700">Enable SMTP active client delivery</label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Mail Host Carrier Address</label>
                      <input
                        type="text"
                        value={smtpHost}
                        onChange={(e) => setSmtpHost(e.target.value)}
                        placeholder="e.g. smtp.gmail.com"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-hidden transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">TLS / SSL Port</label>
                      <input
                        type="text"
                        value={smtpPort}
                        onChange={(e) => setSmtpPort(e.target.value)}
                        placeholder="e.g. 465 or 587"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Authentication Mail Address</label>
                      <input
                        type="email"
                        value={smtpEmailVal}
                        onChange={(e) => setSmtpEmailVal(e.target.value)}
                        placeholder="e.g. sender@gmail.com"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-hidden transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">SMTP Secret App Password</label>
                      <input
                        type="password"
                        value={smtpPassVal}
                        onChange={(e) => setSmtpPassVal(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-hidden transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={handleSaveSMTPCMS}
                      className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-semibold uppercase text-xs shadow-2xs rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Configure Server Credentials</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION: PAYMENTS METHOD SETUP */}
              {settingsSection === 'payment' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-slate-400">💵 PAYMENT CHANNELS SETUP</h4>
                    <p className="text-xs text-slate-455 font-medium">Control dynamic configurations for offline manual transfers (bKash/Nagad/Rocket/Bank) and automatic gateways (Stripe/SSLCommerz/Razorpay).</p>
                  </div>

                  {/* 1. MANUAL CHANNELS SECTION */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-4">
                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b pb-1.5 border-slate-200">1. Manual Mobile & Bank Payment Options</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="pay-cod-en"
                          checked={payCod}
                          onChange={(e) => setPayCod(e.target.checked)}
                          className="scale-110 accent-emerald-600 rounded cursor-pointer"
                        />
                        <div>
                          <label htmlFor="pay-cod-en" className="text-xs font-bold uppercase cursor-pointer text-slate-700 block">COD Option</label>
                          <span className="text-[9px] text-slate-450 block font-semibold text-slate-500">Cash On Delivery</span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="pay-bkash-en"
                          checked={payBkash}
                          onChange={(e) => setPayBkash(e.target.checked)}
                          className="scale-110 accent-pink-600 rounded cursor-pointer"
                        />
                        <div>
                          <label htmlFor="pay-bkash-en" className="text-xs font-bold uppercase cursor-pointer text-pink-600 block">bKash Option</label>
                          <span className="text-[9px] block font-semibold text-slate-500">bKash mobile wallet</span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="pay-nagad-en"
                          checked={payNagad}
                          onChange={(e) => setPayNagad(e.target.checked)}
                          className="scale-110 accent-orange-600 rounded cursor-pointer"
                        />
                        <div>
                          <label htmlFor="pay-nagad-en" className="text-xs font-bold uppercase cursor-pointer text-orange-60 block">Nagad Option</label>
                          <span className="text-[9px] block font-semibold text-slate-500">Nagad mobile wallet</span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="pay-rocket-en"
                          checked={payRocket}
                          onChange={(e) => setPayRocket(e.target.checked)}
                          className="scale-110 accent-purple-600 rounded cursor-pointer"
                        />
                        <div>
                          <label htmlFor="pay-rocket-en" className="text-xs font-bold uppercase cursor-pointer text-purple-750 block">Rocket Option</label>
                          <span className="text-[9px] block font-semibold text-slate-500">Rocket mobile wallet</span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="pay-bank-en"
                          checked={payBank}
                          onChange={(e) => setPayBank(e.target.checked)}
                          className="scale-110 accent-blue-600 rounded cursor-pointer"
                        />
                        <div>
                          <label htmlFor="pay-bank-en" className="text-xs font-bold uppercase cursor-pointer text-blue-700 block">Bank Transfer</label>
                          <span className="text-[9px] block font-semibold text-slate-500">Direct bank details</span>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="pay-credit-manual-en"
                          checked={payCreditManual}
                          onChange={(e) => setPayCreditManual(e.target.checked)}
                          className="scale-110 accent-emerald-600 rounded cursor-pointer"
                        />
                        <div>
                          <label htmlFor="pay-credit-manual-en" className="text-xs font-bold uppercase cursor-pointer text-emerald-800 block">Manual Cards</label>
                          <span className="text-[9px] block font-semibold text-slate-500">Offline credit reference</span>
                        </div>
                      </div>
                    </div>

                    {/* Manual inputs fields expansion */}
                    {payBkash && (
                      <div className="bg-pink-50/20 border border-dashed border-pink-200 rounded-xl p-3.5 space-y-3">
                        <div className="text-[10px] font-bold text-pink-600 uppercase">bKash Merchant Target Setup</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase">bKash Active Number</label>
                            <input type="text" value={payBkashNo} onChange={(e) => setPayBkashNo(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase">bKash Logo/Emoji</label>
                            <input type="text" value={payBkashLogoEmoji} onChange={(e) => setPayBkashLogoEmoji(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase">QR Code URL Link</label>
                            <input type="text" value={payBkashQrCodeUrl} onChange={(e) => setPayBkashQrCodeUrl(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-500 uppercase mb-0.5">Instructions for customer</label>
                          <input type="text" value={payBkashGuide} onChange={(e) => setPayBkashGuide(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800" />
                        </div>
                      </div>
                    )}

                    {payNagad && (
                      <div className="bg-orange-50/20 border border-dashed border-orange-200 rounded-xl p-3.5 space-y-3">
                        <div className="text-[10px] font-bold text-orange-600 uppercase">Nagad Wallet Target Setup</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase">Nagad Active Number</label>
                            <input type="text" value={payNagadNo} onChange={(e) => setPayNagadNo(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase">Nagad Logo/Emoji</label>
                            <input type="text" value={payNagadLogoEmoji} onChange={(e) => setPayNagadLogoEmoji(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase">QR Code URL Link</label>
                            <input type="text" value={payNagadQrCodeUrl} onChange={(e) => setPayNagadQrCodeUrl(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-500 uppercase mb-0.5">Instructions</label>
                          <input type="text" value={payNagadGuide} onChange={(e) => setPayNagadGuide(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800" />
                        </div>
                      </div>
                    )}

                    {payRocket && (
                      <div className="bg-purple-50/20 border border-dashed border-purple-200 rounded-xl p-3.5 space-y-3">
                        <div className="text-[10px] font-bold text-purple-700 uppercase font-sans">Rocket Target Setup</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase">Rocket Active Number</label>
                            <input type="text" value={payRocketNo} onChange={(e) => setPayRocketNo(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase">Rocket Logo/Emoji</label>
                            <input type="text" value={payRocketLogoEmoji} onChange={(e) => setPayRocketLogoEmoji(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase">QR Code URL Link</label>
                            <input type="text" value={payRocketQrCodeUrl} onChange={(e) => setPayRocketQrCodeUrl(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-500 uppercase mb-0.5">Instructions</label>
                          <input type="text" value={payRocketGuide} onChange={(e) => setPayRocketGuide(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800" />
                        </div>
                      </div>
                    )}

                    {payBank && (
                      <div className="bg-blue-50/25 border border-dashed border-blue-200 rounded-xl p-3.5 space-y-3">
                        <div className="text-[10px] font-bold text-blue-700 uppercase font-sans">Direct Bank account Setup</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase">Bank Name</label>
                            <input type="text" value={payBankName} onChange={(e) => setPayBankName(e.target.value)} placeholder="e.g. Dhaka Bank Ltd" className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase">Account Number</label>
                            <input type="text" value={payBankNo} onChange={(e) => setPayBankNo(e.target.value)} placeholder="102-xxxxx" className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase">Account Holder Title</label>
                            <input type="text" value={payBankHolder} onChange={(e) => setPayBankHolder(e.target.value)} placeholder="e.g. Quirky Fruity Ltd" className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase">Bank Symbol Logo Emoji</label>
                            <input type="text" value={payBankLogoEmoji} onChange={(e) => setPayBankLogoEmoji(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase">QR Code Url Link</label>
                            <input type="text" value={payBankQrCodeUrl} onChange={(e) => setPayBankQrCodeUrl(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-500 uppercase mb-0.5">Wire instructions for users</label>
                          <input type="text" value={payBankGuide} onChange={(e) => setPayBankGuide(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800" />
                        </div>
                      </div>
                    )}

                    {payCreditManual && (
                      <div className="bg-emerald-50/20 border border-dashed border-emerald-200 rounded-xl p-3.5 space-y-3">
                        <div className="text-[10px] font-bold text-emerald-700 uppercase">Offline Cards Deposit Target Setup</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase">Manual Reference No.</label>
                            <input type="text" value={payCreditManualNo} onChange={(e) => setPayCreditManualNo(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase">Logo Emoji Icon</label>
                            <input type="text" value={payCreditManualLogoEmoji} onChange={(e) => setPayCreditManualLogoEmoji(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800" />
                          </div>
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase">Instruction Sheet Image Url</label>
                            <input type="text" value={payCreditManualQrCodeUrl} onChange={(e) => setPayCreditManualQrCodeUrl(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-500 uppercase mb-0.5">Credit manual payment instructions</label>
                          <input type="text" value={payCreditManualGuide} onChange={(e) => setPayCreditManualGuide(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. AUTOMATIC PAYMENT GATEWAYS SECTION */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-5">
                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b pb-1.5 border-slate-200">2. Automatic Core Payment Gateways</h5>
                    
                    {/* GATEWAY 1: STRIPE */}
                    <div className="space-y-3.5 border-b pb-4 border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="pay-stripe-en"
                            checked={payStripe}
                            onChange={(e) => setPayStripe(e.target.checked)}
                            className="scale-110 accent-blue-600 rounded cursor-pointer"
                          />
                          <label htmlFor="pay-stripe-en" className="text-xs font-bold uppercase cursor-pointer text-slate-700">Stripe Payment Gateway</label>
                        </div>
                        {payStripe && (
                          <div className="flex items-center gap-1.5 bg-white border px-2 py-1 rounded-lg">
                            <span className="text-[9px] font-extrabold text-slate-500 uppercase">Sandbox Mode:</span>
                            <input
                              type="checkbox"
                              checked={payStripeSandbox}
                              onChange={(e) => setPayStripeSandbox(e.target.checked)}
                              className="accent-slate-900 cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                      
                      {payStripe && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-fade-in">
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase mb-0.5">Stripe Publishable API Key</label>
                            <input
                              type="text"
                              required
                              placeholder="pk_test_..."
                              value={payStripeKey}
                              onChange={(e) => setPayStripeKey(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase mb-0.5">Stripe Secret Encryption Key</label>
                            <input
                              type="password"
                              required
                              placeholder="sk_test_..."
                              value={payStripeSecret}
                              onChange={(e) => setPayStripeSecret(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* GATEWAY 2: SSLCOMMERZ */}
                    <div className="space-y-3.5 border-b pb-4 border-slate-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="pay-ssl-en"
                            checked={paySsl}
                            onChange={(e) => setPaySsl(e.target.checked)}
                            className="scale-110 accent-emerald-600 rounded cursor-pointer"
                          />
                          <label htmlFor="pay-ssl-en" className="text-xs font-bold uppercase cursor-pointer text-slate-700">SSLCommerz Digital Gateway</label>
                        </div>
                        {paySsl && (
                          <div className="flex items-center gap-1.5 bg-white border px-2 py-1 rounded-lg">
                            <span className="text-[9px] font-extrabold text-slate-500 uppercase">Sandbox Mode:</span>
                            <input
                              type="checkbox"
                              checked={paySslSandbox}
                              onChange={(e) => setPaySslSandbox(e.target.checked)}
                              className="accent-slate-900 cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                      
                      {paySsl && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-fade-in">
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase mb-0.5">SSLCommerz Store ID</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. store_xxxx"
                              value={paySslStoreId}
                              onChange={(e) => setPaySslStoreId(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase mb-0.5">SSLCommerz Store Password</label>
                            <input
                              type="password"
                              required
                              placeholder="e.g. password_xxxx"
                              value={paySslStorePass}
                              onChange={(e) => setPaySslStorePass(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* GATEWAY 3: RAZORPAY */}
                    <div className="space-y-3.5 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="pay-razor-en"
                            checked={payRazor}
                            onChange={(e) => setPayRazor(e.target.checked)}
                            className="scale-110 accent-blue-600 rounded cursor-pointer"
                          />
                          <label htmlFor="pay-razor-en" className="text-xs font-bold uppercase cursor-pointer text-slate-700">Razorpay Digital Gateway</label>
                        </div>
                        {payRazor && (
                          <div className="flex items-center gap-1.5 bg-white border px-2 py-1 rounded-lg">
                            <span className="text-[9px] font-extrabold text-slate-500 uppercase">Sandbox Mode:</span>
                            <input
                              type="checkbox"
                              checked={payRazorSandbox}
                              onChange={(e) => setPayRazorSandbox(e.target.checked)}
                              className="accent-slate-900 cursor-pointer"
                            />
                          </div>
                        )}
                      </div>
                      
                      {payRazor && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-fade-in">
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase mb-0.5">Razorpay Key ID</label>
                            <input
                              type="text"
                              required
                              placeholder="rzp_test_..."
                              value={payRazorKeyId}
                              onChange={(e) => setPayRazorKeyId(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-500 uppercase mb-0.5">Razorpay Key Secret</label>
                            <input
                              type="password"
                              required
                              placeholder="e.g. key_secret_xxxxx"
                              value={payRazorKeySecret}
                              onChange={(e) => setPayRazorKeySecret(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Fee, Taxes and Action */}
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Global Base Shipping & Delivery Fee ($USD)</label>
                      <input
                        type="number"
                        value={payFee}
                        onChange={(e) => setPayFee(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Tax Percentage (represented in decimal, e.g. 0.05 for 5%)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={payTax}
                        onChange={(e) => setPayTax(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={handleSavePaymentsCMS}
                      className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-semibold uppercase text-xs shadow-2xs rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Payments Configuration</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION: TAWK.TO LIVE SUPPORT ID CHAT */}
              {settingsSection === 'support' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-slate-400">💬 LIVE SUPPORT CHAT</h4>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">Directly inject your Tawk.to static chat widgets to enable shoppers write to your customer support teams in real time.</p>
                  
                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <input
                      type="checkbox"
                      id="supp-en"
                      checked={supportEnabled}
                      onChange={(e) => setSupportEnabled(e.target.checked)}
                      className="scale-110 accent-emerald-650 rounded cursor-pointer"
                    />
                    <label htmlFor="supp-en" className="text-xs font-bold uppercase cursor-pointer text-slate-700">Activate Tawk.to support widget</label>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Tawk.to Property ID / Widget link ID (e.g. 642xxxx/1gxxxxx)</label>
                    <input
                      type="text"
                      value={supportId}
                      onChange={(e) => setSupportId(e.target.value)}
                      placeholder="e.g. 642a42dfacxxxx/default"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-semibold outline-hidden transition-all"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={handleSaveSupportCMS}
                      className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-semibold uppercase text-xs shadow-2xs rounded-lg transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Initialize support widget</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SECTION: SECURITY & CREDENTIALS UPDATES */}
              {settingsSection === 'security' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-slate-400">🔒 RE-KEY CREDENTIALS KEYS</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-505 mb-1">New Administrator Username</label>
                      <input
                        type="text"
                        value={secUsername}
                        onChange={(e) => setSecUsername(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-lg px-2.5 py-1.5 text-xs font-semibold uppercase text-rose-600 transition-all outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-505 mb-1">New Administrator Password</label>
                      <input
                        type="password"
                        value={secPass}
                        onChange={(e) => setSecPass(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:ring-1 focus:ring-rose-400 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition-all outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <button
                      onClick={handleSaveSecurityCMS}
                      className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-1.5 px-6 py-2.5 bg-rose-650 hover:bg-rose-700 text-white font-sans font-semibold uppercase text-xs shadow-2xs rounded-lg transition-colors"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Reset Secure Keys</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </main>

      </div>
    </div>
  );
};
