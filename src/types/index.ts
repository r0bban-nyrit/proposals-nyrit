
export interface BusinessProfile {
  companyName: string;
  organizationNumber: string;
  address: string;
  postalCode: string;
  city: string;
  phoneNumber: string;
  email: string;
  website?: string;
  logo?: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  price: number;
  discountType?: 'percentage' | 'amount';
  discountValue?: number;
  hasRotDeduction?: boolean;
}

export interface QuoteRecipient {
  name: string;
  companyName?: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Quote {
  id: string;
  number: string;
  title: string;
  createdAt: string;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  recipient: QuoteRecipient;
  items: QuoteItem[];
  notes?: string;
  terms?: string;
  totalDiscountType?: 'percentage' | 'amount';
  totalDiscountValue?: number;
}

