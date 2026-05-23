/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  stock: number;
  image: string; // URL or emoji-icon
  category: string;
  ingredients?: string[];
  rating: number;
  reviewsCount: number;
  isFeatured: boolean;
  isActive: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Confirmed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'
  | 'Refunded';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  deliveryNote?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  couponApplied: string | null;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: OrderStatus;
  createdAt: string;
  transactionId?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface SiteSettings {
  websiteName: string;
  logoUrl?: string;
  logoEmoji: string;
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroTimeBadge: string;
  footerText: string;
  footerLinks: { label: string; url: string }[];
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialTwitter?: string;
  promoBannerEnabled: boolean;
  promoBannerText: string;
  themePrimaryColor: string; // hex
  themeBgColor: string; // hex or tailwind class
  themeHeaderFont: string; // 'Space Grotesk' | 'Inter' | 'Playfair Display'
  trademarkText: string;
}

export interface SMTPSettings {
  host: string;
  port: string | number;
  email: string;
  password?: string;
  isEnabled: boolean;
}

export interface PaymentSettings {
  codEnabled: boolean;
  bKashEnabled: boolean;
  bKashNo: string;
  bKashInstructions: string;
  bKashLogoEmoji: string;
  bKashQrCodeUrl?: string;
  nagadEnabled: boolean;
  nagadNo: string;
  nagadInstructions: string;
  nagadLogoEmoji: string;
  nagadQrCodeUrl?: string;
  rocketEnabled: boolean;
  rocketNo: string;
  rocketInstructions: string;
  rocketLogoEmoji: string;
  rocketQrCodeUrl?: string;
  bankEnabled: boolean;
  bankNo: string;
  bankInstructions: string;
  bankLogoEmoji: string;
  bankQrCodeUrl?: string;
  bankName: string;
  bankHolder: string;
  creditManualEnabled: boolean;
  creditManualNo: string;
  creditManualInstructions: string;
  creditManualLogoEmoji: string;
  creditManualQrCodeUrl?: string;
  paypalEnabled?: boolean;
  paypalClientId?: string;
  paypalSandboxMode?: boolean;
  bKashAutoEnabled?: boolean;
  nagadAutoEnabled?: boolean;
  stripeEnabled: boolean;
  stripePublicKey: string;
  stripeSecretKey: string;
  stripeSandboxMode: boolean;
  sslCommerzEnabled: boolean;
  sslCommerzStoreId: string;
  sslCommerzStorePassword: string;
  sslCommerzSandboxMode: boolean;
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  razorpaySandboxMode: boolean;
  cardPaymentEnabled: boolean;
  shippingFee: number;
  taxPercentage: number;
}

export interface AdminCredentials {
  username: string;
  password?: string;
  passwordHash?: string;
}

export interface SupportSettings {
  tawkToId: string;
  isEnabled: boolean;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  slug: string;
}
