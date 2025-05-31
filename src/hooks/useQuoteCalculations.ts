
import { Quote } from "@/types";
import { calculateTotal, calculateSubtotal, calculateTotalRotDeduction } from "@/utils/quoteUtils";

export function useQuoteCalculations(quote: Quote) {
  const subtotal = calculateSubtotal(quote.items);
  const total = calculateTotal(quote.items, quote.totalDiscountType, quote.totalDiscountValue);
  const rotDeduction = calculateTotalRotDeduction(quote.items);
  const totalAfterRot = total - rotDeduction;
  const hasRotItems = quote.items.some(item => item.hasRotDeduction);

  return {
    subtotal,
    total,
    rotDeduction,
    totalAfterRot,
    hasRotItems
  };
}
