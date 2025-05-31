
import { v4 as uuidv4 } from "uuid";
import { Quote, QuoteItem } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { QuoteItemInput } from "./items/QuoteItemInput";
import { QuoteTotalSection } from "./items/QuoteTotalSection";

interface QuoteItemsSectionProps {
  quote: Quote;
  setQuote: (quote: Quote) => void;
}

export function QuoteItemsSection({ quote, setQuote }: QuoteItemsSectionProps) {
  const { toast } = useToast();

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
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Offertvaror</CardTitle>
        <CardDescription>
          Lägg till varor eller tjänster i offerten
        </CardDescription>
      </CardHeader>
      <CardContent className="card-content-scroll overflow-x-auto">
        <div className="space-y-4">
          {/* Desktop header - only show on xl screens and above */}
          <div className="hidden xl:grid grid-cols-12 gap-4 font-medium text-sm">
            <div className="col-span-5">Beskrivning</div>
            <div className="col-span-1">Antal</div>
            <div className="col-span-1">Enhet</div>
            <div className="col-span-2">Á pris</div>
            <div className="col-span-2">Rabatt</div>
            <div className="col-span-1">ROT</div>
          </div>
          
          {quote.items.map((item) => (
            <QuoteItemInput
              key={item.id}
              item={item}
              onUpdate={updateItem}
              onRemove={removeItem}
              canRemove={quote.items.length > 1}
            />
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addItem}
            className="mt-4 w-full xl:w-auto"
          >
            <Plus className="h-5 w-5 xl:h-4 xl:w-4 mr-2" />
            Lägg till rad
          </Button>

          <QuoteTotalSection quote={quote} setQuote={setQuote} />
        </div>
      </CardContent>
    </Card>
  );
}
