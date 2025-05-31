
import { Quote } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateSubtotal, calculateTotal, calculateTotalRotDeduction } from "@/utils/quoteUtils";
import { CircleCheck, Percent, Tag } from "lucide-react";

interface QuoteTotalSectionProps {
  quote: Quote;
  setQuote: (quote: Quote) => void;
}

export function QuoteTotalSection({ quote, setQuote }: QuoteTotalSectionProps) {
  return (
    <div className="mt-6 pt-4 border-t overflow-x-hidden">
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium">Delsumma:</div>
        <div>{calculateSubtotal(quote.items).toLocaleString()} kr</div>
      </div>
      
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-2">
        <div className="flex flex-col xl:flex-row xl:items-center mb-2 xl:mb-0 xl:space-x-2 w-full xl:w-auto">
          <div className="font-medium mb-1 xl:mb-0">Total rabatt:</div>
          <div className="flex items-center space-x-1">
            <Select
              value={quote.totalDiscountType || "amount"}
              onValueChange={(value: 'percentage' | 'amount') => setQuote({ ...quote, totalDiscountType: value })}
            >
              <SelectTrigger className="w-[60px] text-base xl:text-sm">
                <SelectValue>
                  {quote.totalDiscountType === "percentage" ? <Percent className="h-4 w-4" /> : <Tag className="h-4 w-4" />}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="amount"><div className="flex items-center"><Tag className="h-4 w-4 mr-2" /> kr</div></SelectItem>
                <SelectItem value="percentage"><div className="flex items-center"><Percent className="h-4 w-4 mr-2" /> %</div></SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              min="0"
              value={quote.totalDiscountValue || ""}
              onChange={(e) => setQuote({ ...quote, totalDiscountValue: e.target.value ? parseFloat(e.target.value) : undefined })}
              placeholder="0"
              className="w-[100px] text-base xl:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
        <div className="break-words">
          {quote.totalDiscountValue ? (
            quote.totalDiscountType === "percentage" 
              ? `${(calculateSubtotal(quote.items) * quote.totalDiscountValue / 100).toLocaleString()} kr`
              : `${quote.totalDiscountValue.toLocaleString()} kr`
          ) : "0 kr"}
        </div>
      </div>
      
      {calculateTotalRotDeduction(quote.items) > 0 && (
        <div className="flex justify-between items-center mb-2 text-green-600">
          <div className="flex items-center">
            <CircleCheck className="h-4 w-4 mr-2" />
            <div className="font-medium">ROT-avdrag:</div>
          </div>
          <div>{calculateTotalRotDeduction(quote.items).toLocaleString()} kr</div>
        </div>
      )}
      
      <div className="flex justify-between items-center text-xl font-medium mt-2 pt-2 border-t">
        <div>Totalsumma:</div>
        <div className="break-words">{calculateTotal(quote.items, quote.totalDiscountType, quote.totalDiscountValue).toLocaleString()} kr</div>
      </div>
      
      {calculateTotalRotDeduction(quote.items) > 0 && (
        <div className="flex justify-between items-center text-sm text-green-600">
          <div>Efter ROT-avdrag:</div>
          <div className="break-words">{(calculateTotal(quote.items, quote.totalDiscountType, quote.totalDiscountValue) - calculateTotalRotDeduction(quote.items)).toLocaleString()} kr</div>
        </div>
      )}
    </div>
  );
}
