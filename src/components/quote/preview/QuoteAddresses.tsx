
import { BusinessProfile, Quote } from "@/types";

interface QuoteAddressesProps {
  quote: Quote;
  businessProfile?: BusinessProfile;
}

export function QuoteAddresses({ quote, businessProfile }: QuoteAddressesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mt-6 md:mt-10">
      <div className="min-w-0">
        <h2 className="font-semibold text-card-foreground mb-2">Från:</h2>
        {businessProfile ? (
          <div className="text-card-foreground space-y-1">
            <div className="font-bold break-words">{businessProfile.companyName}</div>
            <div>Org.nr: {businessProfile.organizationNumber}</div>
            <div className="break-words">{businessProfile.address}</div>
            <div>{businessProfile.postalCode} {businessProfile.city}</div>
            <div className="mt-2 break-words">{businessProfile.email}</div>
            <div>{businessProfile.phoneNumber}</div>
            {businessProfile.website && <div className="break-words">{businessProfile.website}</div>}
          </div>
        ) : (
          <div className="text-muted-foreground italic">
            Din företagsinformation kommer att visas här
          </div>
        )}
      </div>
      
      <div className="min-w-0">
        <h2 className="font-semibold text-card-foreground mb-2">Till:</h2>
        <div className="text-card-foreground space-y-1">
          <div className="font-bold break-words">{quote.recipient.name}</div>
          {quote.recipient.companyName && (
            <div className="break-words">{quote.recipient.companyName}</div>
          )}
          {quote.recipient.address && (
            <div className="break-words">{quote.recipient.address}</div>
          )}
          <div className="mt-2 break-words">{quote.recipient.email}</div>
          {quote.recipient.phone && (
            <div>{quote.recipient.phone}</div>
          )}
        </div>
      </div>
    </div>
  );
}
