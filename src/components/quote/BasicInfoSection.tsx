
import { useState } from "react";
import { Quote } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { quoteTitleSuggestions } from "@/utils/quoteUtils";

interface BasicInfoSectionProps {
  quote: Quote;
  setQuote: (quote: Quote) => void;
}

export function BasicInfoSection({ quote, setQuote }: BasicInfoSectionProps) {
  const [titleInputValue, setTitleInputValue] = useState<string>(quote.title);
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [showTitleSuggestions, setShowTitleSuggestions] = useState<boolean>(false);

  const filterTitleSuggestions = (value: string) => {
    if (!value) {
      setTitleSuggestions([]);
      setShowTitleSuggestions(false);
      return;
    }
    
    const filtered = quoteTitleSuggestions.filter(
      suggestion => suggestion.toLowerCase().includes(value.toLowerCase())
    );
    
    setTitleSuggestions(filtered);
    setShowTitleSuggestions(filtered.length > 0);
  };

  const handleTitleSelect = (title: string) => {
    setQuote({ ...quote, title });
    setTitleInputValue(title);
    setShowTitleSuggestions(false);
  };

  const handleTitleInputChange = (value: string) => {
    setTitleInputValue(value);
    setQuote({ ...quote, title: value });
    filterTitleSuggestions(value);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Grundinformation</CardTitle>
        <CardDescription>
          Grundläggande information om offerten
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="offerNumber">Offertnummer</Label>
            <Input
              id="offerNumber"
              value={quote.number}
              onChange={(e) => setQuote({ ...quote, number: e.target.value })}
              readOnly
              className="text-base md:text-sm"
            />
          </div>
          <div>
            <Label htmlFor="offerTitle">Titel *</Label>
            <div className="relative">
              <Input
                id="offerTitle"
                value={titleInputValue}
                onChange={(e) => handleTitleInputChange(e.target.value)}
                onFocus={() => filterTitleSuggestions(titleInputValue)}
                placeholder="Offert för..."
                required
                className="text-base md:text-sm"
              />
              {showTitleSuggestions && titleSuggestions.length > 0 && (
                <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-[200px] overflow-y-auto">
                  {titleSuggestions.map((suggestion) => (
                    <div
                      key={suggestion}
                      onClick={() => handleTitleSelect(suggestion)}
                      className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                        suggestion === titleInputValue ? 'bg-gray-50' : ''
                      }`}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="createdAt">Utfärdad</Label>
            <Input
              id="createdAt"
              type="date"
              value={quote.createdAt}
              onChange={(e) => setQuote({ ...quote, createdAt: e.target.value })}
              className="text-base md:text-sm"
            />
          </div>
          <div>
            <Label htmlFor="validUntil">Giltig till</Label>
            <Input
              id="validUntil"
              type="date"
              value={quote.validUntil}
              onChange={(e) => setQuote({ ...quote, validUntil: e.target.value })}
              className="text-base md:text-sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
