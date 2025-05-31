
import { Quote } from "@/types";
import { calculateItemPrice, calculateSubtotal, calculateTotal, calculateTotalRotDeduction } from "@/utils/quoteUtils";
import { CircleCheck } from "lucide-react";

interface QuoteItemsTableProps {
  quote: Quote;
  hasRotItems: boolean;
}

export function QuoteItemsTable({ quote, hasRotItems }: QuoteItemsTableProps) {
  const renderDiscount = (type?: 'percentage' | 'amount', value?: number) => {
    if (!value || value <= 0) return null;
    
    return type === 'percentage' 
      ? `${value}%`
      : `${value.toLocaleString()} kr`;
  };

  return (
    <table className="w-full text-card-foreground">
      <thead>
        <tr className="border-b border-border">
          <th className="py-2 text-left">Beskrivning</th>
          <th className="py-2 text-right">Antal</th>
          <th className="py-2 text-left pl-4">Enhet</th>
          <th className="py-2 text-right">Á pris</th>
          <th className="py-2 text-right">Rabatt</th>
          {hasRotItems && <th className="py-2 text-center">ROT</th>}
          <th className="py-2 text-right">Summa</th>
        </tr>
      </thead>
      <tbody>
        {quote.items.map((item) => (
          <tr key={item.id} className="border-b border-border/50">
            <td className="py-3">{item.description}</td>
            <td className="py-3 text-right">{item.quantity}</td>
            <td className="py-3 text-left pl-4">{item.unit}</td>
            <td className="py-3 text-right">{item.price.toLocaleString()} kr</td>
            <td className="py-3 text-right">
              {renderDiscount(item.discountType, item.discountValue)}
            </td>
            {hasRotItems && (
              <td className="py-3 text-center">
                {item.hasRotDeduction && <CircleCheck className="h-4 w-4 mx-auto text-green-600" />}
              </td>
            )}
            <td className="py-3 text-right">
              {calculateItemPrice(item).toLocaleString()} kr
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={hasRotItems ? 5 : 4}></td>
          <td className="pt-4 font-semibold text-right">Delsumma:</td>
          <td className="pt-4 font-semibold text-right">
            {calculateSubtotal(quote.items).toLocaleString()} kr
          </td>
        </tr>
        
        {(quote.totalDiscountValue && quote.totalDiscountValue > 0) && (
          <tr>
            <td colSpan={hasRotItems ? 5 : 4}></td>
            <td className="py-1 text-right">Rabatt:</td>
            <td className="py-1 text-right">
              {quote.totalDiscountType === "percentage" 
                ? `${quote.totalDiscountValue}% (${(calculateSubtotal(quote.items) * quote.totalDiscountValue / 100).toLocaleString()} kr)`
                : `${quote.totalDiscountValue.toLocaleString()} kr`}
            </td>
          </tr>
        )}
        
        <tr>
          <td colSpan={hasRotItems ? 5 : 4}></td>
          <td className="pt-2 font-semibold text-right border-t border-border">Totalt:</td>
          <td className="pt-2 font-semibold text-right border-t border-border">
            {calculateTotal(quote.items, quote.totalDiscountType, quote.totalDiscountValue).toLocaleString()} kr
          </td>
        </tr>
        
        {calculateTotalRotDeduction(quote.items) > 0 && (
          <>
            <tr>
              <td colSpan={hasRotItems ? 5 : 4}></td>
              <td className="py-1 text-right text-green-600 dark:text-green-400">ROT-avdrag:</td>
              <td className="py-1 text-right text-green-600 dark:text-green-400">
                {calculateTotalRotDeduction(quote.items).toLocaleString()} kr
              </td>
            </tr>
            <tr>
              <td colSpan={hasRotItems ? 5 : 4}></td>
              <td className="pt-2 font-semibold text-right text-green-600 dark:text-green-400 border-t border-border">
                Att betala efter ROT:
              </td>
              <td className="pt-2 font-semibold text-right text-green-600 dark:text-green-400 border-t border-border">
                {(calculateTotal(quote.items, quote.totalDiscountType, quote.totalDiscountValue) - 
                  calculateTotalRotDeduction(quote.items)).toLocaleString()} kr
              </td>
            </tr>
          </>
        )}
      </tfoot>
    </table>
  );
}
