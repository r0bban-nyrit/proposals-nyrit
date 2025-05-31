
import { Card } from "@/components/ui/card";
import { Quote, BusinessProfile } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { QuoteHeader } from "./quote/preview/QuoteHeader";
import { QuoteAddresses } from "./quote/preview/QuoteAddresses";
import { QuoteItemsTable } from "./quote/preview/QuoteItemsTable";
import { QuoteItemsMobile } from "./quote/preview/QuoteItemsMobile";
import { QuoteTotalsMobile } from "./quote/preview/QuoteTotalsMobile";
import { QuoteNotes } from "./quote/preview/QuoteNotes";
import { QuoteRotInfo } from "./quote/preview/QuoteRotInfo";

interface QuotePreviewProps {
  quote: Quote;
  businessProfile?: BusinessProfile;
}

export default function QuotePreview({ quote, businessProfile }: QuotePreviewProps) {
  const isMobile = useIsMobile();
  const hasRotItems = quote.items.some(item => item.hasRotDeduction);

  return (
    <div className="quote-paper px-4 md:px-8 py-6 md:py-10 bg-card text-card-foreground rounded-lg shadow-md max-w-full overflow-x-hidden">
      <QuoteHeader quote={quote} businessProfile={businessProfile} />
      <QuoteAddresses quote={quote} businessProfile={businessProfile} />

      <div className="mt-8 md:mt-12 overflow-x-hidden">
        {isMobile ? (
          <>
            <QuoteItemsMobile quote={quote} />
            <QuoteTotalsMobile quote={quote} />
          </>
        ) : (
          <QuoteItemsTable quote={quote} hasRotItems={hasRotItems} />
        )}
      </div>
      
      <QuoteNotes quote={quote} />
      <QuoteRotInfo hasRotItems={hasRotItems} />
    </div>
  );
}
