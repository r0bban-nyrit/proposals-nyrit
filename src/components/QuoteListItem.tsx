
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Quote } from "@/types";
import { parseISO, format } from "date-fns";
import { QuoteStatusBadge } from "./quote/list/QuoteStatusBadge";
import { QuoteItemActions } from "./quote/list/QuoteItemActions";

interface QuoteListItemProps {
  quote: Quote;
  onStatusChange?: (id: string, status: Quote["status"]) => void;
}

export function QuoteListItem({ quote, onStatusChange }: QuoteListItemProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "yyyy-MM-dd");
    } catch (error) {
      return dateString;
    }
  };

  const calculateTotal = () => {
    return quote.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-semibold text-lg text-foreground">{quote.title}</div>
            <div className="text-sm text-muted-foreground">
              #{quote.number} | {formatDate(quote.createdAt)}
            </div>
            <div className="mt-2">
              <QuoteStatusBadge quote={quote} />
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Kund</div>
            <div className="text-foreground">{quote.recipient.name}</div>
            {quote.recipient.companyName && (
              <div className="text-sm text-muted-foreground">{quote.recipient.companyName}</div>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-between items-end">
          <div>
            <div className="text-sm text-muted-foreground">Giltig till</div>
            <div className="text-foreground">{formatDate(quote.validUntil)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Totalt</div>
            <div className="font-semibold text-lg text-foreground">
              {calculateTotal().toLocaleString()} kr
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end border-t px-6 py-4 bg-muted/30">
        <QuoteItemActions quote={quote} onStatusChange={onStatusChange} />
      </CardFooter>
    </Card>
  );
}
