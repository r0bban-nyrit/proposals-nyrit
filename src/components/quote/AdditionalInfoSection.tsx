
import { Quote } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface AdditionalInfoSectionProps {
  quote: Quote;
  setQuote: (quote: Quote) => void;
  onSave: (quote: Quote) => void;
  onSend: () => void;
}

export function AdditionalInfoSection({ quote, setQuote, onSave, onSend }: AdditionalInfoSectionProps) {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you'd normally save to backend or state management
    onSave(quote);
    
    toast({
      title: "Offert sparad",
      description: "Din offert har sparats som utkast.",
    });
  };

  return (
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
            className="text-base md:text-sm"
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
            className="text-base md:text-sm"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col md:flex-row justify-between gap-2">
        <Button type="submit" onClick={handleSubmit} className="w-full md:w-auto">Spara utkast</Button>
        <Button type="button" variant="default" onClick={onSend} className="w-full md:w-auto">
          Skicka offert
        </Button>
      </CardFooter>
    </Card>
  );
}
