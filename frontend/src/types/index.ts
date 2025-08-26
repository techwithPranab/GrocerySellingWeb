export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id?: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  discountedPrice?: number;
  discountPercentage?: number;
  stock: number;
  unit: ProductUnit;
  images: ProductImage[];
  isActive: boolean;
  isFeatured: boolean;
  nutritionInfo?: NutritionInfo;
  tags: string[];
  brand?: string;
  expiryDays: number;
  averageRating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  url: string;
  alt: string;
}

export interface NutritionInfo {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}

export type ProductCategory = 
  | 'fruits' 
  | 'vegetables' 
  | 'dairy' 
  | 'meat' 
  | 'grains' 
  | 'beverages' 
  | 'snacks' 
  | 'household';

export type ProductUnit = 'kg' | 'g' | 'l' | 'ml' | 'piece' | 'pack';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: ProductUnit;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  deliveryAddress: Address;
  deliveryPartnerId?: string;
  deliverySlot: DeliverySlot;
  notes?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  trackingUpdates: TrackingUpdate[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: ProductUnit;
}

export interface DeliverySlot {
  date: string;
  timeSlot: string;
}

export interface TrackingUpdate {
  status: string;
  message: string;
  timestamp: string;
  location?: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'packed' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type PaymentMethod = 'cod' | 'card' | 'upi' | 'wallet';

export interface Offer {
  _id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minimumOrder: number;
  maximumDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  validFrom: string;
  validUntil: string;
  applicableCategories?: string[];
  applicableProducts?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
  errors?: any[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationInfo & {
    totalProducts: number;
  };
}

export interface OrdersResponse {
  orders: Order[];
  pagination: PaginationInfo & {
    totalOrders: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface CheckoutFormData {
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  deliverySlot: DeliverySlot;
  notes?: string;
  offerCode?: string;
}

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  product: string | Product;
  order: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  isVisible: boolean;
  moderationStatus: 'pending' | 'approved' | 'rejected';
  images?: {
    url: string;
    alt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ReviewFormData {
  rating: number;
  title: string;
  comment: string;
  images?: {
    url: string;
    alt: string;
  }[];
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: PaginationInfo & {
    totalReviews: number;
  };
  ratingStats: {
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: Record<string, number>;
  };
}
