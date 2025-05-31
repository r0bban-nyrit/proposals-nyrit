
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { Quote, BusinessProfile } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import QuotePreview from "./QuotePreview";
import { Button } from "@/components/ui/button";
import { BasicInfoSection } from "./quote/BasicInfoSection";
import { RecipientSection } from "./quote/RecipientSection";
import { QuoteItemsSection } from "./quote/QuoteItemsSection";
import { AdditionalInfoSection } from "./quote/AdditionalInfoSection";

interface QuoteFormProps {
  initialQuote?: Quote;
  businessProfile?: BusinessProfile;
  onSave?: (quote: Quote) => void;
  readonly?: boolean;
}

export default function QuoteForm({ initialQuote, businessProfile, onSave, readonly = false }: QuoteFormProps) {
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

  const handleSendQuote = () => {
    if (readonly) return;
    
    const updatedQuote = { ...quote, status: "sent" as const };
    
    // Here you would normally send the quote via email or other means
    if (onSave) {
      onSave(updatedQuote);
    }
    
    // Save to localStorage for demo purposes
    const quotes = JSON.parse(localStorage.getItem("quotes") || "[]");
    const updatedQuotes = [...quotes.filter((q: Quote) => q.id !== quote.id), updatedQuote];
    localStorage.setItem("quotes", JSON.stringify(updatedQuotes));
    
    // Update the local state
    setQuote(updatedQuote);
    
    toast({
      title: "Offert skickad",
      description: "Din offert har markerats som skickad.",
    });
  };

  const handleSave = (saveQuote: Quote = quote) => {
    if (readonly) return;
    
    if (onSave) {
      onSave(saveQuote);
    }
    
    // Save to localStorage for demo purposes
    const quotes = JSON.parse(localStorage.getItem("quotes") || "[]");
    const updatedQuotes = [...quotes.filter((q: Quote) => q.id !== saveQuote.id), saveQuote];
    localStorage.setItem("quotes", JSON.stringify(updatedQuotes));
  };

  // If readonly, only show preview tab
  if (readonly) {
    return (
      <div className="w-full">
        <QuotePreview quote={quote} businessProfile={businessProfile} />
        
        <div className="mt-4 flex flex-col md:flex-row gap-4 justify-end">
          <Button variant="outline" onClick={() => window.print()} className="w-full md:w-auto">
            Skriv ut / Spara PDF
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue="editor" className="w-full">
      <TabsList className="mb-4 w-full md:w-auto">
        <TabsTrigger value="editor" className="flex-1 md:flex-none">Redigera</TabsTrigger>
        <TabsTrigger value="preview" className="flex-1 md:flex-none">Förhandsgranska</TabsTrigger>
      </TabsList>
      
      <TabsContent value="editor">
        <form className="space-y-8">
          <BasicInfoSection quote={quote} setQuote={setQuote} />
          <RecipientSection quote={quote} setQuote={setQuote} />
          <QuoteItemsSection quote={quote} setQuote={setQuote} />
          <AdditionalInfoSection 
            quote={quote} 
            setQuote={setQuote} 
            onSave={handleSave} 
            onSend={handleSendQuote}
          />
        </form>
      </TabsContent>
      
      <TabsContent value="preview">
        <QuotePreview quote={quote} businessProfile={businessProfile} />
        
        <div className="mt-4 flex flex-col md:flex-row gap-4 justify-end">
          <Button variant="outline" onClick={() => window.print()} className="w-full md:w-auto">
            Skriv ut / Spara PDF
          </Button>
          <Button variant="default" onClick={handleSendQuote} className="w-full md:w-auto">
            Skicka offert
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
