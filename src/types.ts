export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'PROCESSED' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';

export type PaymentMethod = 'QRIS' | 'VA_BCA' | 'VA_MANDIRI' | 'GOPAY' | 'OVO';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in IDR
  category: string;
  imageUrl: string;
  stock: number;
  rating: number;
  salesCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentDetails: {
    vaNumber?: string;
    qrData?: string;
    phoneNumber?: string;
    expiryTime: string; // ISO string
  };
  createdAt: string;
  notes?: string;
}

export interface EmailNotification {
  id: string;
  orderId: string;
  to: string;
  subject: string;
  body: string;
  sentAt: string;
  status: OrderStatus;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  is2FAEnabled: boolean;
  secret2FA: string; // The TOTP secret for the simulator
}
