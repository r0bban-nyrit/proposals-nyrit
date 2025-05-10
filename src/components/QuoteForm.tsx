import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { Quote, QuoteItem, QuoteRecipient, BusinessProfile } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import QuotePreview from "./QuotePreview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, Plus, Trash2, Tag, Percent, CircleCheck } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { serviceDescriptionSuggestions, calculateItemPrice, calculateTotal, calculateSubtotal, calculateTotalRotDeduction } from "@/utils/quoteUtils";

interface QuoteFormProps {
  initialQuote?: Quote;
  businessProfile?: BusinessProfile;
  onSave?: (quote: Quote) => void;
}

export default function QuoteForm({ initialQuote, businessProfile, onSave }: QuoteFormProps) {
  const { toast } = useToast();
  const today = new Date();
  const monthLater = new Date(today);
  monthLater.setMonth(monthLater.getMonth() + 1);
  
  const [quote, setQuote] = useState<Quote>(
    initialQuote || {
      id: uuidv4(),
      number: `OFF-${format(today, "yyyyMMdd")}-${Math.floor(Math.random() * 1000)}`,
      title: "",
      createdAt: format(today, "yyyy-MM-dd"),
      validUntil: format(monthLater, "yyyy-MM-dd"),
      status: "draft",
      recipient: {
        name: "",
        companyName: "",
        email: "",
        phone: "",
        address: "",
      },
      items: [
        {
          id: uuidv4(),
          description: "",
          quantity: 1,
          unit: "st",
          price: 0,
        },
      ],
      notes: "",
      terms: "Betalningsvillkor: 30 dagar\nOfferttid: 30 dagar",
    }
  );

  const [openDescDropdown, setOpenDescDropdown] = useState<string | null>(null);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>(serviceDescriptionSuggestions);

  const addItem = () => {
    setQuote({
      ...quote,
      items: [
        ...quote.items,
        {
          id: uuidv4(),
          description: "",
          quantity: 1,
          unit: "st",
          price: 0,
        },
      ],
    });
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
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: string | number | boolean) => {
    setQuote({
      ...quote,
      items: quote.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });

    // Update filtered suggestions when description changes
    if (field === "description" && typeof value === "string") {
      setFilteredSuggestions(filterSuggestions(value));
    }
  };

  const updateRecipient = (field: keyof QuoteRecipient, value: string) => {
    setQuote({
      ...quote,
      recipient: {
        ...quote.recipient,
        [field]: value,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you'd normally save to backend or state management
    if (onSave) {
      onSave(quote);
    }
    
    // Save to localStorage for demo purposes
    const quotes = JSON.parse(localStorage.getItem("quotes") || "[]");
    const updatedQuotes = [...quotes.filter((q: Quote) => q.id !== quote.id), quote];
    localStorage.setItem("quotes", JSON.stringify(updatedQuotes));
    
    toast({
      title: "Offert sparad",
      description: "Din offert har sparats som utkast.",
    });
  };

  const handleSendQuote = () => {
    const updatedQuote = { ...quote, status: "sent" as const };
    
    // Here you would normally send the quote via email or other means
    if (onSave) {
      onSave(updatedQuote);
    }
    
    // Save to localStorage for demo purposes
    const quotes = JSON.parse(localStorage.getItem("quotes") || "[]");
    const updatedQuotes = [...quotes.filter((q: Quote) => q.id !== quote.id), updatedQuote];
    localStorage.setItem("quotes", JSON.stringify(updatedQuotes));
    
    toast({
      title: "Offert skickad",
      description: "Din offert har markerats som skickad.",
    });
  };

  const filterSuggestions = (value: string) => {
    if (!value) return serviceDescriptionSuggestions;
    
    return serviceDescriptionSuggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(value.toLowerCase())
    );
  };

  const handleDescriptionSelect = (itemId: string, description: string) => {
    updateItem(itemId, "description", description);
    setOpenDescDropdown(null);
  };

  const calculateItemSubtotal = (item: QuoteItem): number => {
    return calculateItemPrice(item);
  };

  const calculateDiscountedTotal = (): number => {
    return calculateTotal(quote.items, quote.totalDiscountType, quote.totalDiscountValue);
  };

  return (
    <Tabs defaultValue="editor">
      <TabsList className="mb-4">
        <TabsTrigger value="editor">Redigera</TabsTrigger>
        <TabsTrigger value="preview">Förhandsgranska</TabsTrigger>
      </TabsList>
      
      <TabsContent value="editor">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Grundinformation</CardTitle>
              <CardDescription>
                Grundläggande information om offerten
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="offerNumber">Offertnummer</Label>
                  <Input
                    id="offerNumber"
                    value={quote.number}
                    onChange={(e) => setQuote({ ...quote, number: e.target.value })}
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="offerTitle">Titel *</Label>
                  <Input
                    id="offerTitle"
                    value={quote.title}
                    onChange={(e) => setQuote({ ...quote, title: e.target.value })}
                    placeholder="Offert för..."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="createdAt">Utfärdad</Label>
                  <Input
                    id="createdAt"
                    type="date"
                    value={quote.createdAt}
                    onChange={(e) => setQuote({ ...quote, createdAt: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="validUntil">Giltig till</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={quote.validUntil}
                    onChange={(e) => setQuote({ ...quote, validUntil: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mottagare</CardTitle>
              <CardDescription>
                Information om kunden som ska få offerten
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipientName">Namn *</Label>
                  <Input
                    id="recipientName"
                    value={quote.recipient.name}
                    onChange={(e) => updateRecipient("name", e.target.value)}
                    placeholder="Kundens namn"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="recipientCompany">Företag</Label>
                  <Input
                    id="recipientCompany"
                    value={quote.recipient.companyName || ""}
                    onChange={(e) => updateRecipient("companyName", e.target.value)}
                    placeholder="Företagsnamn (valfritt)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recipientEmail">E-post *</Label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    value={quote.recipient.email}
                    onChange={(e) => updateRecipient("email", e.target.value)}
                    placeholder="kund@exempel.se"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="recipientPhone">Telefon</Label>
                  <Input
                    id="recipientPhone"
                    value={quote.recipient.phone || ""}
                    onChange={(e) => updateRecipient("phone", e.target.value)}
                    placeholder="Telefonnummer (valfritt)"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="recipientAddress">Adress</Label>
                <Textarea
                  id="recipientAddress"
                  value={quote.recipient.address || ""}
                  onChange={(e) => updateRecipient("address", e.target.value)}
                  placeholder="Fullständig adress (valfritt)"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Offertvaror</CardTitle>
              <CardDescription>
                Lägg till varor eller tjänster i offerten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 font-medium text-sm">
                  <div className="col-span-4 sm:col-span-5">Beskrivning</div>
                  <div className="col-span-2 sm:col-span-1">Antal</div>
                  <div className="col-span-2 sm:col-span-1">Enhet</div>
                  <div className="col-span-2">Á pris</div>
                  <div className="col-span-2">Rabatt</div>
                  <div className="col-span-1">ROT</div>
                  <div className="col-span-1"></div>
                </div>
                
                {quote.items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4 sm:col-span-5">
                      <Popover 
                        open={openDescDropdown === item.id} 
                        onOpenChange={(open) => {
                          if (!open) {
                            setOpenDescDropdown(null);
                          }
                        }}
                      >
                        <PopoverTrigger asChild>
                          <div className="w-full">
                            <Input
                              value={item.description}
                              onChange={(e) => {
                                updateItem(item.id, "description", e.target.value);
                                setFilteredSuggestions(filterSuggestions(e.target.value));
                                // Only open dropdown if we have suggestions and user is typing
                                if (e.target.value) {
                                  setOpenDescDropdown(item.id);
                                }
                              }}
                              onFocus={() => {
                                if (item.description) {
                                  setFilteredSuggestions(filterSuggestions(item.description));
                                  setOpenDescDropdown(item.id);
                                }
                              }}
                              placeholder="Beskrivning av vara/tjänst"
                              required
                              className="w-full"
                            />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-[300px]" align="start">
                          <div className="max-h-[200px] overflow-y-auto">
                            {filteredSuggestions.length === 0 ? (
                              <div className="p-4 text-sm text-gray-500">Inga förslag hittades.</div>
                            ) : (
                              <div className="py-2">
                                {filteredSuggestions.map((suggestion) => (
                                  <div
                                    key={suggestion}
                                    onClick={() => handleDescriptionSelect(item.id, suggestion)}
                                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center justify-between ${
                                      suggestion === item.description ? 'bg-gray-50' : ''
                                    }`}
                                  >
                                    {suggestion}
                                    {suggestion === item.description && (
                                      <Check className="h-4 w-4" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <Input
                        value={item.unit}
                        onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="0"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="col-span-2">
                      <div className="flex space-x-1">
                        <Select
                          value={item.discountType || "amount"}
                          onValueChange={(value: 'percentage' | 'amount') => updateItem(item.id, "discountType", value)}
                        >
                          <SelectTrigger className="w-[60px]">
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
                          className="w-[80px]"
                        />
                      </div>
                    </div>
                    <div className="col-span-1 text-center">
                      <Checkbox
                        checked={item.hasRotDeduction}
                        onCheckedChange={(checked) => updateItem(item.id, "hasRotDeduction", !!checked)}
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="col-span-11 text-right text-sm text-gray-500">
                      Summa: {calculateItemSubtotal(item).toLocaleString()} kr
                      {item.hasRotDeduction && (
                        <span className="ml-2 text-green-600">(ROT-avdrag: {(calculateItemSubtotal(item) * 0.3).toLocaleString()} kr)</span>
                      )}
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addItem}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Lägg till rad
                </Button>

                <div className="mt-6 pt-4 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">Delsumma:</div>
                    <div>{calculateSubtotal(quote.items).toLocaleString()} kr</div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="font-medium">Total rabatt:</div>
                      <Select
                        value={quote.totalDiscountType || "amount"}
                        onValueChange={(value: 'percentage' | 'amount') => setQuote({ ...quote, totalDiscountType: value })}
                      >
                        <SelectTrigger className="w-[60px]">
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
                        className="w-[100px]"
                      />
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
                    <div>{calculateDiscountedTotal().toLocaleString()} kr</div>
                  </div>
                  
                  {calculateTotalRotDeduction(quote.items) > 0 && (
                    <div className="flex justify-between items-center text-sm text-green-600">
                      <div>Efter ROT-avdrag:</div>
                      <div>{(calculateDiscountedTotal() - calculateTotalRotDeduction(quote.items)).toLocaleString()} kr</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ytterligare information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes">Noter/Meddelande</Label>
                <Textarea
                  id="notes"
                  value={quote.notes || ""}
                  onChange={(e) => setQuote({ ...quote, notes: e.target.value })}
                  placeholder="Ytterligare information till kunden..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="terms">Villkor</Label>
                <Textarea
                  id="terms"
                  value={quote.terms || ""}
                  onChange={(e) => setQuote({ ...quote, terms: e.target.value })}
                  placeholder="Betalningsvillkor, offertvillkor..."
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="submit">Spara utkast</Button>
              <Button type="button" variant="default" onClick={handleSendQuote}>
                Skicka offert
              </Button>
            </CardFooter>
          </Card>
        </form>
      </TabsContent>
      
      <TabsContent value="preview">
        <QuotePreview quote={quote} businessProfile={businessProfile} />
        
        <div className="mt-4 flex gap-4 justify-end">
          <Button variant="outline" onClick={() => window.print()}>
            Skriv ut / Spara PDF
          </Button>
          <Button variant="default" onClick={handleSendQuote}>
            Skicka offert
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
