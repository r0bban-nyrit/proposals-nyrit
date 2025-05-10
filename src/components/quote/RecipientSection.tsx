
import { Quote, QuoteRecipient } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RecipientSectionProps {
  quote: Quote;
  setQuote: (quote: Quote) => void;
}

export function RecipientSection({ quote, setQuote }: RecipientSectionProps) {
  const updateRecipient = (field: keyof QuoteRecipient, value: string) => {
    setQuote({
      ...quote,
      recipient: {
        ...quote.recipient,
        [field]: value,
      },
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Mottagare</CardTitle>
        <CardDescription>
          Information om kunden som ska få offerten
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="recipientName">Namn *</Label>
            <Input
              id="recipientName"
              value={quote.recipient.name}
              onChange={(e) => updateRecipient("name", e.target.value)}
              placeholder="Kundens namn"
              required
              className="text-base md:text-sm"
            />
          </div>
          <div>
            <Label htmlFor="recipientCompany">Företag</Label>
            <Input
              id="recipientCompany"
              value={quote.recipient.companyName || ""}
              onChange={(e) => updateRecipient("companyName", e.target.value)}
              placeholder="Företagsnamn (valfritt)"
              className="text-base md:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="recipientEmail">E-post *</Label>
            <Input
              id="recipientEmail"
              type="email"
              value={quote.recipient.email}
              onChange={(e) => updateRecipient("email", e.target.value)}
              placeholder="kund@exempel.se"
              required
              className="text-base md:text-sm"
            />
          </div>
          <div>
            <Label htmlFor="recipientPhone">Telefon</Label>
            <Input
              id="recipientPhone"
              value={quote.recipient.phone || ""}
              onChange={(e) => updateRecipient("phone", e.target.value)}
              placeholder="Telefonnummer (valfritt)"
              className="text-base md:text-sm"
            />
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="recipientAddress">Adress</Label>
          <Textarea
            id="recipientAddress"
            value={quote.recipient.address || ""}
            onChange={(e) => updateRecipient("address", e.target.value)}
            placeholder="Fullständig adress (valfritt)"
            className="text-base md:text-sm"
          />
        </div>
      </CardContent>
    </Card>
  );
}
