export interface Category {
  id: number;
  name: string;
  image: string;
  bgColor: string;
  hasNotification?: boolean;
}

export interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface Cake {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
  category?: string;
}

export interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  category?: string;
}

export interface CheckoutDetails {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  postalCode?: string;
  notes?: string;
}

export interface FeaturedSpecial {
  titleLine1: string;
  titleLine2: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  image: string;
}
