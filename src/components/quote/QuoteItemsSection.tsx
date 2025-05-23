
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Quote, QuoteItem } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Tag, Percent, CircleCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateItemPrice, calculateSubtotal, calculateTotal, calculateTotalRotDeduction, serviceDescriptionSuggestions } from "@/utils/quoteUtils";

interface QuoteItemsSectionProps {
  quote: Quote;
  setQuote: (quote: Quote) => void;
}

export function QuoteItemsSection({ quote, setQuote }: QuoteItemsSectionProps) {
  const { toast } = useToast();
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>(
    quote.items.reduce((acc, item) => ({ ...acc, [item.id]: item.description }), {})
  );
  const [suggestions, setSuggestions] = useState<{ [key: string]: string[] }>(
    quote.items.reduce((acc, item) => ({ ...acc, [item.id]: [] }), {})
  );
  const [showSuggestions, setShowSuggestions] = useState<{ [key: string]: boolean }>(
    quote.items.reduce((acc, item) => ({ ...acc, [item.id]: false }), {})
  );

  const addItem = () => {
    const newItemId = uuidv4();
    setQuote({
      ...quote,
      items: [
        ...quote.items,
        {
          id: newItemId,
          description: "",
          quantity: 1,
          unit: "st",
          price: 0,
        },
      ],
    });
    setInputValues(prev => ({ ...prev, [newItemId]: "" }));
    setSuggestions(prev => ({ ...prev, [newItemId]: [] }));
    setShowSuggestions(prev => ({ ...prev, [newItemId]: false }));
  };

  const removeItem = (id: string) => {
    if (quote.items.length === 1) {
      toast({
        title: "Kan inte ta bort alla rader",
        description: "En offert måste innehålla minst en rad.",
        variant: "destructive",
      });
      return;
    }
    
    setQuote({
      ...quote,
      items: quote.items.filter((item) => item.id !== id),
    });
    
    // Clean up state for removed item
    const newInputValues = { ...inputValues };
    delete newInputValues[id];
    setInputValues(newInputValues);
    
    const newSuggestions = { ...suggestions };
    delete newSuggestions[id];
    setSuggestions(newSuggestions);
    
    const newShowSuggestions = { ...showSuggestions };
    delete newShowSuggestions[id];
    setShowSuggestions(newShowSuggestions);
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: string | number | boolean) => {
    setQuote({
      ...quote,
      items: quote.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });

    // Update input value and filter suggestions when description changes
    if (field === "description" && typeof value === "string") {
      setInputValues(prev => ({ ...prev, [id]: value }));
      filterSuggestionsForItem(id, value);
    }
  };

  const filterSuggestionsForItem = (itemId: string, value: string) => {
    if (!value) {
      setSuggestions(prev => ({ ...prev, [itemId]: [] }));
      setShowSuggestions(prev => ({ ...prev, [itemId]: false }));
      return;
    }
    
    const filtered = serviceDescriptionSuggestions.filter(
      suggestion => suggestion.toLowerCase().includes(value.toLowerCase())
    );
    
    setSuggestions(prev => ({ ...prev, [itemId]: filtered }));
    setShowSuggestions(prev => ({ ...prev, [itemId]: filtered.length > 0 }));
  };

  const handleDescriptionSelect = (itemId: string, description: string) => {
    updateItem(itemId, "description", description);
    setInputValues(prev => ({ ...prev, [itemId]: description }));
    setShowSuggestions(prev => ({ ...prev, [itemId]: false }));
  };

  const handleDescriptionInputChange = (itemId: string, value: string) => {
    setInputValues(prev => ({ ...prev, [itemId]: value }));
    updateItem(itemId, "description", value);
    filterSuggestionsForItem(itemId, value);
  };

  const calculateItemSubtotal = (item: QuoteItem): number => {
    return calculateItemPrice(item);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Offertvaror</CardTitle>
        <CardDescription>
          Lägg till varor eller tjänster i offerten
        </CardDescription>
      </CardHeader>
      <CardContent className="card-content-scroll">
        <div className="space-y-4">
          <div className="hidden md:grid grid-cols-12 gap-4 font-medium text-sm">
            <div className="col-span-5">Beskrivning</div>
            <div className="col-span-1">Antal</div>
            <div className="col-span-1">Enhet</div>
            <div className="col-span-2">Á pris</div>
            <div className="col-span-2">Rabatt</div>
            <div className="col-span-1">ROT</div>
          </div>
          
          {quote.items.map((item) => (
            <div key={item.id} className="md:grid grid-cols-12 gap-4 items-center flex flex-col space-y-2 md:space-y-0 border-b pb-4 md:border-0 md:pb-0">
              <div className="md:col-span-5 w-full">
                <div className="md:hidden mb-1 font-medium text-sm">Beskrivning</div>
                <div className="relative w-full">
                  <Input
                    value={inputValues[item.id] || ''}
                    onChange={(e) => handleDescriptionInputChange(item.id, e.target.value)}
                    onFocus={() => filterSuggestionsForItem(item.id, inputValues[item.id] || '')}
                    placeholder="Beskrivning av vara/tjänst"
                    required
                    className="w-full text-base md:text-sm"
                  />
                  {showSuggestions[item.id] && suggestions[item.id]?.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-[200px] overflow-y-auto">
                      {suggestions[item.id].map((suggestion) => (
                        <div
                          key={suggestion}
                          onClick={() => handleDescriptionSelect(item.id, suggestion)}
                          className={`px-4 py-3 md:py-2 text-base md:text-sm cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                            suggestion === inputValues[item.id] ? 'bg-gray-50' : ''
                          }`}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="md:col-span-1 w-full">
                <div className="md:hidden mb-1 font-medium text-sm">Antal</div>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value))}
                  className="text-base md:text-sm"
                />
              </div>
              <div className="md:col-span-1 w-full">
                <div className="md:hidden mb-1 font-medium text-sm">Enhet</div>
                <Input
                  value={item.unit}
                  onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                  className="text-base md:text-sm"
                />
              </div>
              <div className="md:col-span-2 w-full">
                <div className="md:hidden mb-1 font-medium text-sm">Á pris</div>
                <Input
                  type="number"
                  min="0"
                  value={item.price}
                  onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value))}
                  className="text-base md:text-sm"
                />
              </div>
              <div className="md:col-span-2 w-full">
                <div className="md:hidden mb-1 font-medium text-sm">Rabatt</div>
                <div className="flex space-x-1">
                  <Select
                    value={item.discountType || "amount"}
                    onValueChange={(value: 'percentage' | 'amount') => updateItem(item.id, "discountType", value)}
                  >
                    <SelectTrigger className="w-[60px] text-base md:text-sm">
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
                    onChange={(e) => updateItem(item.id, "discountValue", e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="0"
                    className="w-full md:w-[80px] text-base md:text-sm"
                  />
                </div>
              </div>
              <div className="md:col-span-1 flex items-center w-full">
                <div className="md:hidden mr-2 font-medium text-sm">ROT-avdrag</div>
                <Checkbox
                  checked={item.hasRotDeduction}
                  onCheckedChange={(checked) => updateItem(item.id, "hasRotDeduction", !!checked)}
                  className="h-5 w-5 md:h-4 md:w-4"
                />
              </div>
              <div className="md:col-span-12 flex justify-between items-center w-full">
                <div className="text-sm">
                  Summa: {calculateItemSubtotal(item).toLocaleString()} kr
                  {item.hasRotDeduction && (
                    <span className="ml-2 text-green-600">(ROT-avdrag: {(calculateItemSubtotal(item) * 0.3).toLocaleString()} kr)</span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-5 w-5 md:h-4 md:w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addItem}
            className="mt-4 w-full md:w-auto"
          >
            <Plus className="h-5 w-5 md:h-4 md:w-4 mr-2" />
            Lägg till rad
          </Button>

          <TotalSection quote={quote} setQuote={setQuote} />
        </div>
      </CardContent>
    </Card>
  );
}

interface TotalSectionProps {
  quote: Quote;
  setQuote: (quote: Quote) => void;
}

function TotalSection({ quote, setQuote }: TotalSectionProps) {
  return (
    <div className="mt-6 pt-4 border-t">
      <div className="flex justify-between items-center mb-2">
        <div className="font-medium">Delsumma:</div>
        <div>{calculateSubtotal(quote.items).toLocaleString()} kr</div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
        <div className="flex flex-col md:flex-row md:items-center mb-2 md:mb-0 md:space-x-2 w-full md:w-auto">
          <div className="font-medium mb-1 md:mb-0">Total rabatt:</div>
          <div className="flex items-center space-x-1">
            <Select
              value={quote.totalDiscountType || "amount"}
              onValueChange={(value: 'percentage' | 'amount') => setQuote({ ...quote, totalDiscountType: value })}
            >
              <SelectTrigger className="w-[60px] text-base md:text-sm">
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
              className="w-[100px] text-base md:text-sm"
            />
          </div>
        </div>
        <div>
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
        <div>{calculateTotal(quote.items, quote.totalDiscountType, quote.totalDiscountValue).toLocaleString()} kr</div>
      </div>
      
      {calculateTotalRotDeduction(quote.items) > 0 && (
        <div className="flex justify-between items-center text-sm text-green-600">
          <div>Efter ROT-avdrag:</div>
          <div>{(calculateTotal(quote.items, quote.totalDiscountType, quote.totalDiscountValue) - calculateTotalRotDeduction(quote.items)).toLocaleString()} kr</div>
        </div>
      )}
    </div>
  );
}
