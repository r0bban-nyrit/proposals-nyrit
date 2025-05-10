
import { Quote } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicInfoSectionProps {
  quote: Quote;
  setQuote: (quote: Quote) => void;
}

export function BasicInfoSection({ quote, setQuote }: BasicInfoSectionProps) {
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
            <Input
              id="offerTitle"
              value={quote.title}
              onChange={(e) => setQuote({ ...quote, title: e.target.value })}
              placeholder="Offert för..."
              required
              className="text-base md:text-sm"
            />
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
