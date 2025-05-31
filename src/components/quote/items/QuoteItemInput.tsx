
import { useState } from "react";
import { QuoteItem } from "@/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Tag, Percent, AlertTriangle } from "lucide-react";
import { calculateItemPrice, serviceDescriptionSuggestions } from "@/utils/quoteUtils";

interface QuoteItemInputProps {
  item: QuoteItem;
  onUpdate: (id: string, field: keyof QuoteItem, value: string | number | boolean) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export function QuoteItemInput({ item, onUpdate, onRemove, canRemove }: QuoteItemInputProps) {
  const [inputValue, setInputValue] = useState<string>(item.description);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  const filterSuggestions = (value: string) => {
    if (!value) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    const filtered = serviceDescriptionSuggestions.filter(
      suggestion => suggestion.toLowerCase().includes(value.toLowerCase())
    );
    
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleDescriptionSelect = (description: string) => {
    onUpdate(item.id, "description", description);
    setInputValue(description);
    setShowSuggestions(false);
  };

  const handleDescriptionInputChange = (value: string) => {
    setInputValue(value);
    onUpdate(item.id, "description", value);
    filterSuggestions(value);
  };

  const handleNumberInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value === "0" || event.target.value === "") {
      event.target.select();
    }
  };

  const isQuantityInvalid = (quantity: number | string): boolean => {
    return quantity === 0 || quantity === "" || isNaN(Number(quantity));
  };

  const isPriceInvalid = (price: number | string): boolean => {
    return price === 0 || price === "" || isNaN(Number(price));
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="xl:hidden space-y-3 border-b pb-4">
        <div className="w-full">
          <div className="mb-1 font-medium text-sm">Beskrivning</div>
          <div className="relative w-full">
            <Textarea
              value={inputValue}
              onChange={(e) => handleDescriptionInputChange(e.target.value)}
              onFocus={() => filterSuggestions(inputValue)}
              placeholder="Beskrivning av vara/tjänst"
              required
              className="w-full text-base resize-none overflow-hidden"
              rows={1}
              style={{
                height: 'auto',
                minHeight: '40px'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-[200px] overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion}
                    onClick={() => handleDescriptionSelect(suggestion)}
                    className={`px-4 py-3 text-base cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                      suggestion === inputValue ? 'bg-gray-50' : ''
                    }`}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-1 font-medium text-sm">Antal</div>
            <div className="relative">
              <Input
                type="number"
                min="1"
                value={item.quantity || ""}
                onChange={(e) => onUpdate(item.id, "quantity", parseFloat(e.target.value) || 0)}
                onFocus={handleNumberInputFocus}
                className="text-base pr-8 min-w-0 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {isQuantityInvalid(item.quantity) && (
                <AlertTriangle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500" />
              )}
            </div>
          </div>
          
          <div>
            <div className="mb-1 font-medium text-sm">Enhet</div>
            <Input
              value={item.unit || ""}
              onChange={(e) => onUpdate(item.id, "unit", e.target.value)}
              className="text-base min-w-0 w-full"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <div>
            <div className="mb-1 font-medium text-sm">Á pris</div>
            <div className="relative">
              <Input
                type="number"
                min="0"
                value={item.price || ""}
                onChange={(e) => onUpdate(item.id, "price", parseFloat(e.target.value) || 0)}
                onFocus={handleNumberInputFocus}
                className="text-base pr-8 min-w-0 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              {isPriceInvalid(item.price) && (
                <AlertTriangle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500" />
              )}
            </div>
          </div>
          
          <div className="col-span-2">
            <div className="mb-1 font-medium text-sm">Rabatt</div>
            <div className="flex space-x-1">
              <Select
                value={item.discountType || "amount"}
                onValueChange={(value: 'percentage' | 'amount') => onUpdate(item.id, "discountType", value)}
              >
                <SelectTrigger className="w-[50px] text-base">
                  <SelectValue>
                    {item.discountType === "percentage" ? <Percent className="h-4 w-4" /> : <Tag className="h-4 w-4" />}
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
                value={item.discountValue || ""}
                onChange={(e) => onUpdate(item.id, "discountValue", e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="0"
                className="min-w-0 flex-1 text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="mb-1 font-medium text-sm text-center">ROT</div>
              <Checkbox
                checked={item.hasRotDeduction}
                onCheckedChange={(checked) => onUpdate(item.id, "hasRotDeduction", !!checked)}
                className="h-5 w-5"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-border">
          <div className="text-sm min-w-0 flex-1 mr-2">
            <span className="break-words">Summa: {calculateItemPrice(item).toLocaleString()} kr</span>
            {item.hasRotDeduction && (
              <span className="ml-2 text-green-600 break-words">(ROT-avdrag: {(calculateItemPrice(item) * 0.3).toLocaleString()} kr)</span>
            )}
          </div>
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(item.id)}
              className="flex-shrink-0"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden xl:grid grid-cols-12 gap-4 items-start border-b pb-4">
        <div className="col-span-5 w-full">
          <div className="relative w-full">
            <Textarea
              value={inputValue}
              onChange={(e) => handleDescriptionInputChange(e.target.value)}
              onFocus={() => filterSuggestions(inputValue)}
              placeholder="Beskrivning av vara/tjänst"
              required
              className="w-full text-sm resize-none overflow-hidden"
              rows={1}
              style={{
                height: 'auto',
                minHeight: '40px'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-[200px] overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion}
                    onClick={() => handleDescriptionSelect(suggestion)}
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                      suggestion === inputValue ? 'bg-gray-50' : ''
                    }`}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="col-span-1 w-full">
          <div className="relative">
            <Input
              type="number"
              min="1"
              value={item.quantity || ""}
              onChange={(e) => onUpdate(item.id, "quantity", parseFloat(e.target.value) || 0)}
              onFocus={handleNumberInputFocus}
              className="text-sm pr-8 min-w-0 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            {isQuantityInvalid(item.quantity) && (
              <AlertTriangle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500" />
            )}
          </div>
        </div>
        
        <div className="col-span-1 w-full">
          <Input
            value={item.unit || ""}
            onChange={(e) => onUpdate(item.id, "unit", e.target.value)}
            className="text-sm min-w-0 w-full"
          />
        </div>
        
        <div className="col-span-2 w-full">
          <div className="relative">
            <Input
              type="number"
              min="0"
              value={item.price || ""}
              onChange={(e) => onUpdate(item.id, "price", parseFloat(e.target.value) || 0)}
              onFocus={handleNumberInputFocus}
              className="text-sm pr-8 min-w-0 w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            {isPriceInvalid(item.price) && (
              <AlertTriangle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-orange-500" />
            )}
          </div>
        </div>
        
        <div className="col-span-2 w-full">
          <div className="flex space-x-1">
            <Select
              value={item.discountType || "amount"}
              onValueChange={(value: 'percentage' | 'amount') => onUpdate(item.id, "discountType", value)}
            >
              <SelectTrigger className="w-[60px] text-sm">
                <SelectValue>
                  {item.discountType === "percentage" ? <Percent className="h-4 w-4" /> : <Tag className="h-4 w-4" />}
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
              value={item.discountValue || ""}
              onChange={(e) => onUpdate(item.id, "discountValue", e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="0"
              className="min-w-0 flex-1 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>
        
        <div className="col-span-1 flex items-center justify-center w-full">
          <Checkbox
            checked={item.hasRotDeduction}
            onCheckedChange={(checked) => onUpdate(item.id, "hasRotDeduction", !!checked)}
            className="h-4 w-4"
          />
        </div>
        
        <div className="col-span-12 flex justify-between items-center w-full">
          <div className="text-sm min-w-0 flex-1 mr-2">
            <span className="break-words">Summa: {calculateItemPrice(item).toLocaleString()} kr</span>
            {item.hasRotDeduction && (
              <span className="ml-2 text-green-600 break-words">(ROT-avdrag: {(calculateItemPrice(item) * 0.3).toLocaleString()} kr)</span>
            )}
          </div>
          {canRemove && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(item.id)}
              className="flex-shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
