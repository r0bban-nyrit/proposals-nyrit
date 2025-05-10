
import { QuoteItem } from "@/types";

// Common service suggestions
export const serviceDescriptionSuggestions = [
  "Målning av innervägg",
  "Målning av tak",
  "Målning av snickerier",
  "Byte av golv",
  "Montering av kök",
  "Montering av badrum",
  "Installation av belysning",
  "Tapetsering",
  "Elinstallation",
  "VVS-installation",
  "Plattsättning",
  "Snickeriarbete",
  "Golvslipning",
  "Badrumsrenovering",
  "Köksrenovering",
  "Utomhusmålning",
  "Byggarbete",
  "Trädgårdsarbete",
  "Murning",
  "Plåtarbete",
];

// Calculate the item price after discount
export const calculateItemPrice = (item: QuoteItem): number => {
  const basePrice = item.quantity * item.price;
  
  if (!item.discountValue || item.discountValue <= 0) {
    return basePrice;
  }
  
  if (item.discountType === 'percentage') {
    return basePrice * (1 - item.discountValue / 100);
  } else {
    return Math.max(0, basePrice - item.discountValue);
  }
};

// Calculate ROT deduction for eligible item
export const calculateRotDeduction = (item: QuoteItem): number => {
  if (!item.hasRotDeduction) return 0;
  
  // ROT deduction is 30% of labor cost, up to certain limits
  const itemTotal = calculateItemPrice(item);
  return itemTotal * 0.3; // 30% of the labor cost
};

// Calculate the total before discount
export const calculateSubtotal = (items: QuoteItem[]): number => {
  return items.reduce((sum, item) => sum + calculateItemPrice(item), 0);
};

// Calculate the total after discount
export const calculateTotal = (
  items: QuoteItem[],
  totalDiscountType?: 'percentage' | 'amount',
  totalDiscountValue?: number
): number => {
  const subtotal = calculateSubtotal(items);
  
  if (!totalDiscountValue || totalDiscountValue <= 0) {
    return subtotal;
  }
  
  if (totalDiscountType === 'percentage') {
    return subtotal * (1 - totalDiscountValue / 100);
  } else {
    return Math.max(0, subtotal - totalDiscountValue);
  }
};

// Calculate the total ROT deduction
export const calculateTotalRotDeduction = (items: QuoteItem[]): number => {
  return items
    .filter(item => item.hasRotDeduction)
    .reduce((sum, item) => sum + calculateRotDeduction(item), 0);
};

