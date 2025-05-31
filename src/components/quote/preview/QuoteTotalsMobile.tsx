
import { Quote } from "@/types";
import { calculateSubtotal, calculateTotal, calculateTotalRotDeduction } from "@/utils/quoteUtils";
import { CircleCheck } from "lucide-react";

interface QuoteTotalsMobileProps {
  quote: Quote;
}

export function QuoteTotalsMobile({ quote }: QuoteTotalsMobileProps) {
  return (
    <div className="space-y-3 pt-4 border-t border-border">
      <div className="flex justify-between items-center">
        <div className="font-medium">Delsumma:</div>
        <div>{calculateSubtotal(quote.items).toLocaleString()} kr</div>
      </div>
      
      {(quote.totalDiscountValue && quote.totalDiscountValue > 0) && (
        <div className="flex justify-between items-center">
          <div className="font-medium">Rabatt:</div>
          <div>
            {quote.totalDiscountType === "percentage" 
              ? `${quote.totalDiscountValue}% (${(calculateSubtotal(quote.items) * quote.totalDiscountValue / 100).toLocaleString()} kr)`
              : `${quote.totalDiscountValue.toLocaleString()} kr`}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t border-border">
        <div>Totalt:</div>
        <div>{calculateTotal(quote.items, quote.totalDiscountType, quote.totalDiscountValue).toLocaleString()} kr</div>
      </div>
      
      {calculateTotalRotDeduction(quote.items) > 0 && (
        <>
          <div className="flex justify-between items-center text-green-600 dark:text-green-400">
            <div className="flex items-center">
              <CircleCheck className="h-4 w-4 mr-2" />
              <div className="font-medium">ROT-avdrag:</div>
            </div>
            <div>{calculateTotalRotDeduction(quote.items).toLocaleString()} kr</div>
          </div>
          <div className="flex justify-between items-center text-green-600 dark:text-green-400 font-semibold">
            <div>Att betala efter ROT:</div>
            <div>
              {(calculateTotal(quote.items, quote.totalDiscountType, quote.totalDiscountValue) - 
                calculateTotalRotDeduction(quote.items)).toLocaleString()} kr
            </div>
          </div>
        </>
      )}
    </div>
  );
}
