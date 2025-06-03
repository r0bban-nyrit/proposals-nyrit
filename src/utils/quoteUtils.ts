
import { QuoteItem } from "@/types";

export const serviceDescriptionSuggestions = [
  // Låsservice
  "Akut låsöppning - dygnet runt",
  "Låsbyte - säkerhetslås",
  "Låsinstallation - ny dörr",
  "Låsreparation - mekanism",
  "Cylinderbyte - högskydd",
  "Nyckelkopiering - säkerhetsnycklar",
  "Låsning av lägenhetsdörr",
  "Bilupplåsning - utan skada",
  "Säkerhetskontroll av lås",
  "Montering av extralås",
  
  // Säkerhetslösningar
  "Installation av överfallslarm",
  "Montering av säkerhetsdörr",
  "Installation av dörrkedja",
  "Säkerhetsbesiktning av fastighet",
  "Passersystem installation",
  "Kodlås installation",
  "Fingeravtryckslås montering",
  "Säkerhetsglas installation",
  
  // Specialtjänster
  "Kassaskåpsöppning",
  "Bilnyckelprogrammering",
  "Transpondernycklar",
  "Matlåda/brevlådeöppning",
  "Garagelås service",
  "Dörrstängare justering",
  "Nödsituationsupplåsning",
  "Låskonsultation"
];

export const quoteTitleSuggestions = [
  // Allmänna offerter
  "Offert - Låsservice",
  "Offert - Säkerhetslösning",
  "Offert - Akut låsöppning",
  "Offert - Låsbyte och installation",
  
  // Specifika tjänster
  "Offert - Säkerhetsdörr med lås",
  "Offert - Komplett låssystem",
  "Offert - Nyckelservice och kopiering",
  "Offert - Bilupplåsning och nycklar",
  "Offert - Fastighetsbesiktning säkerhet",
  "Offert - Passersystem installation",
  
  // Nödsituationer
  "Offert - Akutinsats dygnet runt",
  "Offert - Nödöppning och reparation",
  "Offert - Säkerhetsuppdatering",
  
  // Kommersiella
  "Offert - Företagssäkerhet",
  "Offert - Kontorslås och säkerhet",
  "Offert - Butikssäkerhet",
  "Offert - Industriella låslösningar"
];

export function calculateItemPrice(item: QuoteItem): number {
  const basePrice = (item.quantity || 0) * (item.price || 0);
  
  if (!item.discountValue) {
    return basePrice;
  }
  
  if (item.discountType === "percentage") {
    return basePrice - (basePrice * (item.discountValue / 100));
  } else {
    return Math.max(0, basePrice - item.discountValue);
  }
}

export function calculateSubtotal(items: QuoteItem[]): number {
  return items.reduce((sum, item) => sum + calculateItemPrice(item), 0);
}

export function calculateTotal(
  items: QuoteItem[], 
  totalDiscountType?: 'percentage' | 'amount', 
  totalDiscountValue?: number
): number {
  const subtotal = calculateSubtotal(items);
  
  if (!totalDiscountValue) {
    return subtotal;
  }
  
  if (totalDiscountType === "percentage") {
    return subtotal - (subtotal * (totalDiscountValue / 100));
  } else {
    return Math.max(0, subtotal - totalDiscountValue);
  }
}

export function calculateTotalRotDeduction(items: QuoteItem[]): number {
  return items
    .filter(item => item.hasRotDeduction)
    .reduce((sum, item) => sum + (calculateItemPrice(item) * 0.3), 0);
}
