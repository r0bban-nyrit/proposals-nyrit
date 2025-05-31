
import { Quote } from "@/types";
import { calculateItemPrice } from "@/utils/quoteUtils";
import { CircleCheck } from "lucide-react";

interface QuoteItemsMobileProps {
  quote: Quote;
}

export function QuoteItemsMobile({ quote }: QuoteItemsMobileProps) {
  const renderDiscount = (type?: 'percentage' | 'amount', value?: number) => {
    if (!value || value <= 0) return null;
    
    return type === 'percentage' 
      ? `${value}%`
      : `${value.toLocaleString()} kr`;
  };

  return (
    <div className="space-y-4">
      {quote.items.map((item) => (
        <div key={item.id} className="border border-border rounded-lg p-4 space-y-3">
          <div>
            <div className="font-medium text-sm text-muted-foreground mb-1">Beskrivning</div>
            <div className="text-card-foreground">{item.description}</div>
          </div>
          
          <div className="grid grid-cols-5 gap-2 text-sm">
            <div>
              <div className="font-medium text-muted-foreground mb-1">Antal</div>
              <div className="text-card-foreground">{item.quantity}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground mb-1">Enhet</div>
              <div className="text-card-foreground">{item.unit}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground mb-1">Á pris</div>
              <div className="text-card-foreground">{item.price.toLocaleString()} kr</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground mb-1">Rabatt</div>
              <div className="text-card-foreground">
                {renderDiscount(item.discountType, item.discountValue) || "0 kr"}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-medium text-muted-foreground mb-1">ROT</div>
              {item.hasRotDeduction && (
                <CircleCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <div className="font-medium text-sm">Summa:</div>
            <div className="font-medium">
              {calculateItemPrice(item).toLocaleString()} kr
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
