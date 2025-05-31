
import { Quote } from "@/types";

interface QuoteNotesProps {
  quote: Quote;
}

export function QuoteNotes({ quote }: QuoteNotesProps) {
  if (!quote.notes && !quote.terms) return null;

  return (
    <>
      {quote.notes && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2 text-card-foreground">Meddelande:</h3>
          <div className="bg-muted p-4 rounded whitespace-pre-line text-muted-foreground break-words">
            {quote.notes}
          </div>
        </div>
      )}
      
      {quote.terms && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2 text-card-foreground">Villkor:</h3>
          <div className="bg-muted p-4 rounded whitespace-pre-line text-muted-foreground break-words">
            {quote.terms}
          </div>
        </div>
      )}
    </>
  );
}
