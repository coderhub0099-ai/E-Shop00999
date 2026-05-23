/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  db,
  isFirebaseConfigured,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import {
  Product,
  Order,
  Coupon,
  NewsletterSubscriber,
  Review,
  SiteSettings,
  SMTPSettings,
  PaymentSettings,
  AdminCredentials,
  SupportSettings,
  Category,
} from './types';

// ==========================================
// INITIAL POLISHED DATA
// ==========================================

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'smoothies', name: 'Smoothies', emoji: '🥤', slug: 'smoothies' },
  { id: 'fresh-juice', name: 'Fresh Juice', emoji: '🍹', slug: 'fresh-juice' },
  { id: 'snacks', name: 'Healthy Snacks', emoji: '🍎', slug: 'snacks' },
];

const DEFAULT_PRODUCTS: Product[] = [
  // Smoothies
  {
    id: 'p1',
    name: 'Papaya Smoothie',
    description: 'Creamy master blend of fresh ripe papayas, soy milk, and honey.',
    price: 2.30,
    salePrice: null,
    stock: 25,
    image: '🥭',
    category: 'Smoothies',
    ingredients: ['Papaya', 'Soy Milk', 'Honey'],
    rating: 4.8,
    reviewsCount: 12,
    isFeatured: true,
    isActive: true,
  },
  {
    id: 'p2',
    name: 'Apple Smoothie',
    description: 'Crisp red apples blended with low-fat greek yogurt and cinnamon.',
    price: 2.30,
    salePrice: null,
    stock: 8, // Low Stock (< 10) for testing warning color
    image: '🍎',
    category: 'Smoothies',
    ingredients: ['Apple', 'Greek Yogurt', 'Cinnamon'],
    rating: 4.5,
    reviewsCount: 6,
    isFeatured: true,
    isActive: true,
  },
  {
    id: 'p3',
    name: 'Pineapple Smoothie',
    description: 'Tropical getaway in a glass. Blended pineapple, coconut cream, and banana.',
    price: 2.30,
    salePrice: 1.99, // On Sale
    stock: 14,
    image: '🍍',
    category: 'Smoothies',
    ingredients: ['Pineapple', 'Coconut Cream', 'Banana'],
    rating: 4.9,
    reviewsCount: 22,
    isFeatured: true,
    isActive: true,
  },
  {
    id: 'p4',
    name: 'Cherry Smoothie',
    description: 'Indulge in rich sweet cherries blended with chia seeds and almond milk.',
    price: 2.30,
    salePrice: null,
    stock: 19,
    image: '🍒',
    category: 'Smoothies',
    ingredients: ['Sweet Cherries', 'Chia Seeds', 'Almond Milk'],
    rating: 4.7,
    reviewsCount: 15,
    isFeatured: false,
    isActive: true,
  },
  {
    id: 'p5',
    name: 'Avocado Smoothie',
    description: 'Super food delight! Blended buttery rich avocados, spinach, and direct maple syrup.',
    price: 2.30,
    salePrice: null,
    stock: 12,
    image: '🥑',
    category: 'Smoothies',
    ingredients: ['Avocado', 'Spinach', 'Maple Syrup'],
    rating: 4.6,
    reviewsCount: 9,
    isFeatured: false,
    isActive: true,
  },
  {
    id: 'p6',
    name: 'Kiwi Smoothie',
    description: 'Zesty combination of fresh green kiwi, green grapes, and crushed mint lines.',
    price: 2.30,
    salePrice: null,
    stock: 5, // Low stock
    image: '🥝',
    category: 'Smoothies',
    ingredients: ['Kiwi', 'Green Grapes', 'Mint'],
    rating: 4.4,
    reviewsCount: 7,
    isFeatured: false,
    isActive: true,
  },
  {
    id: 'p7',
    name: 'Banana Smoothie',
    description: 'Classic rich fuel. Loaded sweet bananas blended with peanut butter and oat milk.',
    price: 2.30,
    salePrice: null,
    stock: 32,
    image: '🍌',
    category: 'Smoothies',
    ingredients: ['Banana', 'Peanut Butter', 'Oat Milk'],
    rating: 4.9,
    reviewsCount: 31,
    isFeatured: true,
    isActive: true,
  },

  // Fresh Juice
  {
    id: 'p8',
    name: 'Papaya Fresh Juice',
    description: 'Cold-pressed standard pure sweet papaya. No sugar added.',
    price: 2.30,
    salePrice: null,
    stock: 15,
    image: '🍈',
    category: 'Fresh Juice',
    ingredients: ['Pure Papaya'],
    rating: 4.7,
    reviewsCount: 14,
    isFeatured: true,
    isActive: true,
  },
  {
    id: 'p9',
    name: 'Apple Fresh Juice',
    description: 'Double cold-pressed organic gala apples. Fresh and crisp.',
    price: 2.30,
    salePrice: null,
    stock: 22,
    image: '🍎',
    category: 'Fresh Juice',
    ingredients: ['Organic Gala Apples'],
    rating: 4.6,
    reviewsCount: 8,
    isFeatured: true,
    isActive: true,
  },
  {
    id: 'p10',
    name: 'Pineapple Fresh Juice',
    description: 'Sweet and tangy press. A tropical shot of energy.',
    price: 2.30,
    salePrice: 1.99,
    stock: 3, // Low stock
    image: '🍍',
    category: 'Fresh Juice',
    ingredients: ['Pure Pineapple'],
    rating: 4.8,
    reviewsCount: 18,
    isFeatured: true,
    isActive: true,
  },
  {
    id: 'p11',
    name: 'Cherry Fresh Juice',
    description: 'Pure anti-oxidant power. Cherry press with a splash of soda water.',
    price: 2.30,
    salePrice: null,
    stock: 17,
    image: '🍒',
    category: 'Fresh Juice',
    ingredients: ['Cherries', 'Sparkling Water'],
    rating: 4.5,
    reviewsCount: 11,
    isFeatured: false,
    isActive: true,
  },
  {
    id: 'p12',
    name: 'Avocado Fresh Juice',
    description: 'Lite dynamic extraction, cold pressed. Extremely creamy and clean.',
    price: 2.30,
    salePrice: null,
    stock: 11,
    image: '🥑',
    category: 'Fresh Juice',
    ingredients: ['Avocado', 'Squeeze of Lime'],
    rating: 4.4,
    reviewsCount: 4,
    isFeatured: false,
    isActive: true,
  },
  {
    id: 'p13',
    name: 'Kiwi Fresh Juice',
    description: 'Vibrant active kiwi, cold pressed to conserve nutrients.',
    price: 2.30,
    salePrice: null,
    stock: 16,
    image: '🥝',
    category: 'Fresh Juice',
    ingredients: ['Kiwi Juice'],
    rating: 4.7,
    reviewsCount: 9,
    isFeatured: false,
    isActive: true,
  },
  {
    id: 'p14',
    name: 'Banana Fresh Juice',
    description: 'Smooth extraction of ripe bananas with water and organic agave syrup.',
    price: 2.30,
    salePrice: null,
    stock: 24,
    image: '🍌',
    category: 'Fresh Juice',
    ingredients: ['Banana', 'Agave'],
    rating: 4.5,
    reviewsCount: 16,
    isFeatured: true,
    isActive: true,
  }
];

const DEFAULT_COUPONS: Coupon[] = [
  { id: 'c1', code: 'FRUITY20', discountPercentage: 20, expiryDate: '2028-12-31', usageLimit: 100, usedCount: 5 },
  { id: 'c2', code: 'HEALTHY10', discountPercentage: 10, expiryDate: '2028-12-31', usageLimit: 500, usedCount: 12 },
  { id: 'c3', code: 'FRESH50', discountPercentage: 50, expiryDate: '2028-06-01', usageLimit: 10, usedCount: 2 },
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  websiteName: 'quirky-fruity',
  logoEmoji: '🍊',
  heroBadge: 'Deliciously Fresh menu!',
  heroTitleLine1: 'Treat yourself',
  heroTitleLine2: 'with something fresh & tasty!',
  heroSubtitle: 'Handcrafted with premium fresh organic ingredients, serving smiles with every vibrant drop.',
  heroButtonText: 'SEE MENU & ORDER',
  heroTimeBadge: 'open from 8 am – 10 pm',
  footerText: 'quirky-fruity: serving dynamic organic fuel to nourish your daily vibrant self.',
  footerLinks: [
    { label: 'Home', url: '/' },
    { label: 'Menu', url: '#menu' },
    { label: 'Reviews', url: '#reviews' },
    { label: 'Newsletter', url: '#newsletter' },
  ],
  contactPhone: '+880 1711-223344',
  contactEmail: 'hello@quirkyfruity.com',
  contactAddress: '42 Orchard Lane, Gulshan, Dhaka, Bangladesh',
  socialFacebook: 'https://facebook.com/quirkyfruity',
  socialInstagram: 'https://instagram.com/quirkyfruity',
  socialTwitter: 'https://twitter.com/quirkyfruity',
  promoBannerEnabled: true,
  promoBannerText: '🎉 SPECIAL LAUNCH PROMO: Apply code FRUITY20 to get 20% off all orders!',
  themePrimaryColor: '#ff5c35', // Warm outline orange/coral
  themeBgColor: '#fcf3e3', // Retro cream background
  themeHeaderFont: 'Space Grotesk',
  trademarkText: '© 2026 quirky-fruity Ltd. All rights reserved.',
};

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  codEnabled: true,
  bKashEnabled: true,
  bKashNo: '01711000222',
  bKashInstructions: 'Pay to our Merchant bKash wallet and submit the Transaction ID.',
  bKashLogoEmoji: '💸',
  bKashQrCodeUrl: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=400',
  nagadEnabled: true,
  nagadNo: '01911333444',
  nagadInstructions: 'Send Money to our personal Nagad number and input Transaction ID.',
  nagadLogoEmoji: '🟠',
  nagadQrCodeUrl: '',
  rocketEnabled: true,
  rocketNo: '01511555666_7',
  rocketInstructions: 'Send Money to our agent Rocket dial *322# and input Txn Ref.',
  rocketLogoEmoji: '🟣',
  rocketQrCodeUrl: '',
  bankEnabled: true,
  bankNo: '102.345.6789.01',
  bankInstructions: 'Transfer amount directly to our Bank. Specify order reference in transfer description.',
  bankLogoEmoji: '🏦',
  bankQrCodeUrl: '',
  bankName: 'Dhaka Bank Ltd',
  bankHolder: 'Quirky Fruity Solutions Ltd',
  creditManualEnabled: true,
  creditManualNo: '4111-2222-3333-4444',
  creditManualInstructions: 'Submit details of bank memo transfer receipt photo or number.',
  creditManualLogoEmoji: '💳',
  creditManualQrCodeUrl: '',
  paypalEnabled: true,
  paypalClientId: 'sb-paypal-client-id-9988',
  paypalSandboxMode: true,
  bKashAutoEnabled: true,
  nagadAutoEnabled: true,
  stripeEnabled: true,
  stripePublicKey: 'pk_test_51O7...',
  stripeSecretKey: 'sk_test_51O7...',
  stripeSandboxMode: true,
  sslCommerzEnabled: true,
  sslCommerzStoreId: 'quirky_fruity_ssl',
  sslCommerzStorePassword: 'ssl_test_password',
  sslCommerzSandboxMode: true,
  razorpayEnabled: true,
  razorpayKeyId: 'rzp_test_key_123',
  razorpayKeySecret: 'rzp_secret_secret_123',
  razorpaySandboxMode: true,
  cardPaymentEnabled: true,
  shippingFee: 5,
  taxPercentage: 0.05
};

export const DEFAULT_SMTP_SETTINGS: SMTPSettings = {
  host: 'smtp.gmail.com',
  port: 587,
  email: 'notifications@quirkyfruity.com',
  password: '',
  isEnabled: false,
};

export const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  username: 'admin',
  password: 'admin123', // Clean, easily managed password config
};

export const DEFAULT_SUPPORT_SETTINGS: SupportSettings = {
  tawkToId: '65cb1234abcd...',
  isEnabled: false,
};

const DEFAULT_REVIEWS: Review[] = [
  { id: 'r1', productId: 'p1', reviewerName: 'Christian Amon', rating: 5, comment: 'Hands down the best smoothies in town! The textures are unbelievably rich and the delivery is always super fast. Truly fresh and tasty! ⭐⭐⭐⭐⭐', isApproved: true, createdAt: '2026-05-20T10:15:00Z' },
  { id: 'r2', productId: 'p3', reviewerName: 'Samantha Ray', rating: 5, comment: 'The Pineapple Smoothie has a perfect balance of tropical sweetness and citrus punch. Highly recommend this store!', isApproved: true, createdAt: '2026-05-21T14:22:00Z' },
  { id: 'r3', productId: 'p8', reviewerName: 'David K.', rating: 4, comment: 'Organic, purely fresh, high quality. No artificial sweetners. Will order again.', isApproved: true, createdAt: '2026-05-22T08:05:00Z' },
];

// ==========================================
// LOCAL STORAGE & FIRESTORE SYNCHRONIZATION
// ==========================================

function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function setLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("Local storage write failed: ", e);
  }
}

// In-Memory Fallbacks (Hydrated from local storage)
const store = {
  products: getLocalStorage<Product[]>('qf_products', DEFAULT_PRODUCTS),
  categories: getLocalStorage<Category[]>('qf_categories', DEFAULT_CATEGORIES),
  orders: getLocalStorage<Order[]>('qf_orders', []),
  coupons: getLocalStorage<Coupon[]>('qf_coupons', DEFAULT_COUPONS),
  newsletter: getLocalStorage<NewsletterSubscriber[]>('qf_newsletter', []),
  reviews: getLocalStorage<Review[]>('qf_reviews', DEFAULT_REVIEWS),
  siteSettings: getLocalStorage<SiteSettings>('qf_siteSettings', DEFAULT_SITE_SETTINGS),
  smtpSettings: getLocalStorage<SMTPSettings>('qf_smtpSettings', DEFAULT_SMTP_SETTINGS),
  paymentSettings: getLocalStorage<PaymentSettings>('qf_paymentSettings', DEFAULT_PAYMENT_SETTINGS),
  adminSettings: getLocalStorage<AdminCredentials>('qf_adminSettings', DEFAULT_ADMIN_CREDENTIALS),
  supportSettings: getLocalStorage<SupportSettings>('qf_supportSettings', DEFAULT_SUPPORT_SETTINGS),
};

// ==========================================
// EXPOSED API BRIDGES
// ==========================================

export const dbService = {
  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsList: Product[] = [];
        querySnapshot.forEach((docSnap) => {
          productsList.push({ id: docSnap.id, ...docSnap.data() } as Product);
        });
        if (productsList.length > 0) {
          store.products = productsList;
          setLocalStorage('qf_products', productsList);
          return productsList;
        }
      } catch (error) {
        console.warn("Firestore products get failed, using local storage. Error: ", error);
      }
    }
    return store.products;
  },

  async saveProduct(product: Product): Promise<void> {
    const index = store.products.findIndex((p) => p.id === product.id);
    if (index > -1) {
      store.products[index] = product;
    } else {
      store.products.push(product);
    }
    setLocalStorage('qf_products', store.products);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'products', product.id), product);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `products/${product.id}`);
      }
    }
  },

  async deleteProduct(productId: string): Promise<void> {
    store.products = store.products.filter((p) => p.id !== productId);
    setLocalStorage('qf_products', store.products);

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'products', productId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
      }
    }
  },

  // --- CATEGORIES ---
  async getCategories(): Promise<Category[]> {
    return store.categories;
  },

  async saveCategory(category: Category): Promise<void> {
    const index = store.categories.findIndex((c) => c.id === category.id);
    if (index > -1) {
      store.categories[index] = category;
    } else {
      store.categories.push(category);
    }
    setLocalStorage('qf_categories', store.categories);
  },

  async deleteCategory(categoryId: string): Promise<void> {
    store.categories = store.categories.filter((c) => c.id !== categoryId);
    setLocalStorage('qf_categories', store.categories);
  },

  // --- ORDERS ---
  async getOrders(): Promise<Order[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'orders'));
        const ordersList: Order[] = [];
        querySnapshot.forEach((docSnap) => {
          ordersList.push({ id: docSnap.id, ...docSnap.data() } as Order);
        });
        ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        if (ordersList.length > 0) {
          store.orders = ordersList;
          setLocalStorage('qf_orders', ordersList);
          return ordersList;
        }
      } catch (error) {
        console.warn("Firestore orders get failed. Error: ", error);
      }
    }
    // Return sorted
    return [...store.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async saveOrder(order: Order): Promise<void> {
    const index = store.orders.findIndex((o) => o.id === order.id);
    if (index > -1) {
      store.orders[index] = order;
    } else {
      store.orders.push(order);
    }
    setLocalStorage('qf_orders', store.orders);

    // Deduct stock from products
    for (const item of order.items) {
      const pIndex = store.products.findIndex(p => p.id === item.productId);
      if (pIndex > -1) {
        const originalStock = store.products[pIndex].stock;
        store.products[pIndex].stock = Math.max(0, originalStock - item.quantity);
        this.saveProduct(store.products[pIndex]);
      }
    }

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'orders', order.id), order);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `orders/${order.id}`);
      }
    }
  },

  async updateOrderStatus(orderId: string, status: Order['orderStatus']): Promise<void> {
    const orderIndex = store.orders.findIndex(o => o.id === orderId);
    if (orderIndex > -1) {
      store.orders[orderIndex].orderStatus = status;
      if (status === 'Delivered') {
        store.orders[orderIndex].paymentStatus = 'Paid';
      }
      setLocalStorage('qf_orders', store.orders);

      if (isFirebaseConfigured && db) {
        try {
          await setDoc(doc(db, 'orders', orderId), store.orders[orderIndex]);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `orders/${orderId}`);
        }
      }
    }
  },

  async updateOrderPaymentStatus(orderId: string, status: Order['paymentStatus']): Promise<void> {
    const orderIndex = store.orders.findIndex(o => o.id === orderId);
    if (orderIndex > -1) {
      store.orders[orderIndex].paymentStatus = status;
      setLocalStorage('qf_orders', store.orders);

      if (isFirebaseConfigured && db) {
        try {
          await setDoc(doc(db, 'orders', orderId), store.orders[orderIndex]);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `orders/${orderId}`);
        }
      }
    }
  },

  async deleteOrder(orderId: string): Promise<void> {
    store.orders = store.orders.filter((o) => o.id !== orderId);
    setLocalStorage('qf_orders', store.orders);

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'orders', orderId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `orders/${orderId}`);
      }
    }
  },

  // --- COUPONS ---
  async getCoupons(): Promise<Coupon[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'coupons'));
        const couponsList: Coupon[] = [];
        querySnapshot.forEach((docSnap) => {
          couponsList.push({ id: docSnap.id, ...docSnap.data() } as Coupon);
        });
        if (couponsList.length > 0) {
          store.coupons = couponsList;
          setLocalStorage('qf_coupons', couponsList);
          return couponsList;
        }
      } catch (error) {
        console.warn("Firestore coupons get failed. Error: ", error);
      }
    }
    return store.coupons;
  },

  async saveCoupon(coupon: Coupon): Promise<void> {
    const index = store.coupons.findIndex((c) => c.id === coupon.id);
    if (index > -1) {
      store.coupons[index] = coupon;
    } else {
      store.coupons.push(coupon);
    }
    setLocalStorage('qf_coupons', store.coupons);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'coupons', coupon.id), coupon);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `coupons/${coupon.id}`);
      }
    }
  },

  async deleteCoupon(couponId: string): Promise<void> {
    store.coupons = store.coupons.filter((c) => c.id !== couponId);
    setLocalStorage('qf_coupons', store.coupons);

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'coupons', couponId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `coupons/${couponId}`);
      }
    }
  },

  // --- NEWSLETTER ---
  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'newsletter'));
        const list: NewsletterSubscriber[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as NewsletterSubscriber);
        });
        if (list.length > 0) {
          store.newsletter = list;
          setLocalStorage('qf_newsletter', list);
          return list;
        }
      } catch (error) {
        console.warn("Firestore subscribers get failed. Error: ", error);
      }
    }
    return store.newsletter;
  },

  async subscribeNewsletter(email: string): Promise<boolean> {
    const cleaned = email.trim().toLowerCase();
    if (!cleaned) return false;

    const exists = store.newsletter.some(s => s.email.toLowerCase() === cleaned);
    if (exists) return false;

    const newSub: NewsletterSubscriber = {
      id: 'sub_' + Math.random().toString(36).substr(2, 9),
      email: cleaned,
      subscribedAt: new Date().toISOString()
    };

    store.newsletter.push(newSub);
    setLocalStorage('qf_newsletter', store.newsletter);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'newsletter', newSub.id), newSub);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `newsletter/${newSub.id}`);
      }
    }
    return true;
  },

  async deleteSubscriber(id: string): Promise<void> {
    store.newsletter = store.newsletter.filter((s) => s.id !== id);
    setLocalStorage('qf_newsletter', store.newsletter);

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'newsletter', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `newsletter/${id}`);
      }
    }
  },

  // --- REVIEWS ---
  async getReviews(): Promise<Review[]> {
    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'reviews'));
        const list: Review[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Review);
        });
        if (list.length > 0) {
          store.reviews = list;
          setLocalStorage('qf_reviews', list);
          return list;
        }
      } catch (error) {
         console.warn("Firestore reviews get failed. Error: ", error);
      }
    }
    return store.reviews;
  },

  async addReview(productId: string, name: string, rating: number, comment: string): Promise<void> {
    const newRev: Review = {
      id: 'rev_' + Math.random().toString(36).substr(2, 9),
      productId,
      reviewerName: name || 'Anonymous Guest',
      rating: rating || 5,
      comment: comment || '',
      isApproved: true, // Default true to allow instant mock updates, admin can manage
      createdAt: new Date().toISOString(),
    };

    store.reviews.push(newRev);
    setLocalStorage('qf_reviews', store.reviews);

    // Update product reviews count and score
    const prodIndex = store.products.findIndex(p => p.id === productId);
    if (prodIndex > -1) {
      const pReviews = store.reviews.filter(r => r.productId === productId && r.isApproved);
      store.products[prodIndex].reviewsCount = pReviews.length;
      store.products[prodIndex].rating = Number((pReviews.reduce((sum, r) => sum + r.rating, 0) / Math.max(1, pReviews.length)).toFixed(1));
      this.saveProduct(store.products[prodIndex]);
    }

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'reviews', newRev.id), newRev);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `reviews/${newRev.id}`);
      }
    }
  },

  async approveReview(reviewId: string, isApproved: boolean): Promise<void> {
    const index = store.reviews.findIndex(r => r.id === reviewId);
    if (index > -1) {
      store.reviews[index].isApproved = isApproved;
      setLocalStorage('qf_reviews', store.reviews);

      if (isFirebaseConfigured && db) {
        try {
          await setDoc(doc(db, 'reviews', reviewId), store.reviews[index]);
        } catch (error) {
           handleFirestoreError(error, OperationType.WRITE, `reviews/${reviewId}`);
        }
      }
    }
  },

  async deleteReview(reviewId: string): Promise<void> {
    store.reviews = store.reviews.filter(r => r.id !== reviewId);
    setLocalStorage('qf_reviews', store.reviews);

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'reviews', reviewId));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `reviews/${reviewId}`);
      }
    }
  },

  // --- SETTINGS (DYNAMIC BRANDING) ---
  async getSiteSettings(): Promise<SiteSettings> {
    if (isFirebaseConfigured && db) {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'siteSettings'));
        if (docSnap.exists()) {
          const settings = docSnap.data() as SiteSettings;
          store.siteSettings = settings;
          setLocalStorage('qf_siteSettings', settings);
          return settings;
        }
      } catch (error) {
         console.warn("Firestore siteSettings pull failed. Error: ", error);
      }
    }
    return store.siteSettings;
  },

  async saveSiteSettings(settings: SiteSettings): Promise<void> {
    store.siteSettings = settings;
    setLocalStorage('qf_siteSettings', settings);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'settings', 'siteSettings'), settings);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'settings/siteSettings');
      }
    }
  },

  // --- SMTP SETTINGS ---
  async getSMTPSettings(): Promise<SMTPSettings> {
    if (isFirebaseConfigured && db) {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'smtpSettings'));
        if (docSnap.exists()) {
          const settings = docSnap.data() as SMTPSettings;
          store.smtpSettings = settings;
          setLocalStorage('qf_smtpSettings', settings);
          return settings;
        }
      } catch (error) {
        console.warn("Firestore smtpSettings pull failed.", error);
      }
    }
    return store.smtpSettings;
  },

  async saveSMTPSettings(settings: SMTPSettings): Promise<void> {
    store.smtpSettings = settings;
    setLocalStorage('qf_smtpSettings', settings);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'settings', 'smtpSettings'), settings);
      } catch (error) {
         handleFirestoreError(error, OperationType.WRITE, 'settings/smtpSettings');
      }
    }
  },

  // --- PAYMENT SETTINGS ---
  async getPaymentSettings(): Promise<PaymentSettings> {
    if (isFirebaseConfigured && db) {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'paymentSettings'));
        if (docSnap.exists()) {
          const settings = docSnap.data() as PaymentSettings;
          store.paymentSettings = settings;
          setLocalStorage('qf_paymentSettings', settings);
          return settings;
        }
      } catch (error) {
         console.warn("Firestore paymentSettings pull failed.", error);
      }
    }
    return store.paymentSettings;
  },

  async savePaymentSettings(settings: PaymentSettings): Promise<void> {
    store.paymentSettings = settings;
    setLocalStorage('qf_paymentSettings', settings);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'settings', 'paymentSettings'), settings);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'settings/paymentSettings');
      }
    }
  },

  // --- ADMIN SETTINGS (CREDENTIALS) ---
  async getAdminSettings(): Promise<AdminCredentials> {
    if (isFirebaseConfigured && db) {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'adminSettings'));
        if (docSnap.exists()) {
          const settings = docSnap.data() as AdminCredentials;
          store.adminSettings = settings;
          setLocalStorage('qf_adminSettings', settings);
          return settings;
        }
      } catch (error) {
         console.warn("Firestore adminSettings pull failed.", error);
      }
    }
    return store.adminSettings;
  },

  async saveAdminSettings(settings: AdminCredentials): Promise<void> {
    store.adminSettings = settings;
    setLocalStorage('qf_adminSettings', settings);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'settings', 'adminSettings'), settings);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'settings/adminSettings');
      }
    }
  },

  // --- SUPPORT SETTINGS ---
  async getSupportSettings(): Promise<SupportSettings> {
    if (isFirebaseConfigured && db) {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'supportSettings'));
        if (docSnap.exists()) {
          const settings = docSnap.data() as SupportSettings;
          store.supportSettings = settings;
          setLocalStorage('qf_supportSettings', settings);
          return settings;
        }
      } catch (error) {
        console.warn("Firestore supportSettings pull failed.", error);
      }
    }
    return store.supportSettings;
  },

  async saveSupportSettings(settings: SupportSettings): Promise<void> {
    store.supportSettings = settings;
    setLocalStorage('qf_supportSettings', settings);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'settings', 'supportSettings'), settings);
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, 'settings/supportSettings');
      }
    }
  }
};
