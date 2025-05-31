
import { BusinessProfile, Quote } from "@/types";
import { format, parseISO } from "date-fns";
import { sv } from "date-fns/locale";

interface QuoteHeaderProps {
  quote: Quote;
  businessProfile?: BusinessProfile;
}

export function QuoteHeader({ quote, businessProfile }: QuoteHeaderProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "d MMMM yyyy", { locale: sv });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl md:text-3xl font-bold text-card-foreground break-words">
          {quote.title || "Offert"}
        </h1>
        <div className="mt-2 text-muted-foreground space-y-1">
          <div>Offertnummer: {quote.number}</div>
          <div>Datum: {formatDate(quote.createdAt)}</div>
          <div>Giltig till: {formatDate(quote.validUntil)}</div>
        </div>
      </div>
      {businessProfile?.logo && (
        <div className="flex-shrink-0">
          <img 
            src={businessProfile.logo} 
            alt={businessProfile.companyName} 
            className="h-12 md:h-16 object-contain max-w-full"
          />
        </div>
      )}
    </div>
  );
}
