import { Card } from "@/components/ui/card";
import { Quote, BusinessProfile } from "@/types";
import { format, parseISO } from "date-fns";
import { sv } from "date-fns/locale";
import { calculateItemPrice, calculateTotal, calculateSubtotal, calculateTotalRotDeduction } from "@/utils/quoteUtils";
import { CircleCheck, Percent, Tag } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface QuotePreviewProps {
  quote: Quote;
  businessProfile?: BusinessProfile;
}

export default function QuotePreview({ quote, businessProfile }: QuotePreviewProps) {
  const isMobile = useIsMobile();
  const hasRotItems = quote.items.some(item => item.hasRotDeduction);
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "d MMMM yyyy", { locale: sv });
    } catch (error) {
      return dateString;
    }
  };

  const renderDiscount = (type?: 'percentage' | 'amount', value?: number) => {
    if (!value || value <= 0) return null;
    
    return type === 'percentage' 
      ? `${value}%`
      : `${value.toLocaleString()} kr`;
  };

  const MobileItemsView = () => (
    <div className="space-y-4">
      {quote.items.map((item) => (
        <div key={item.id} className="border border-border rounded-lg p-4 space-y-3">
          <div>
            <div className="font-medium text-sm text-muted-foreground mb-1">Beskrivning</div>
            <div className="text-card-foreground">{item.description}</div>
          </div>
          
          <div className="grid grid-cols-5 gap-2 text-sm">
            <div>
              <div className="font-medium text-muted-foreground mb-1">Antal</div>
              <div className="text-card-foreground">{item.quantity}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground mb-1">Enhet</div>
              <div className="text-card-foreground">{item.unit}</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground mb-1">Á pris</div>
              <div className="text-card-foreground">{item.price.toLocaleString()} kr</div>
            </div>
            <div>
              <div className="font-medium text-muted-foreground mb-1">Rabatt</div>
              <div className="text-card-foreground">
                {renderDiscount(item.discountType, item.discountValue) || "0 kr"}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="font-medium text-muted-foreground mb-1">ROT</div>
              {item.hasRotDeduction && (
                <CircleCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <div className="font-medium text-sm">Summa:</div>
            <div className="font-medium">
              {calculateItemPrice(item).toLocaleString()} kr
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const DesktopItemsView = () => (
    <table className="w-full text-card-foreground">
      <thead>
        <tr className="border-b border-border">
          <th className="py-2 text-left">Beskrivning</th>
          <th className="py-2 text-right">Antal</th>
          <th className="py-2 text-left pl-4">Enhet</th>
          <th className="py-2 text-right">Á pris</th>
          <th className="py-2 text-right">Rabatt</th>
          {hasRotItems && <th className="py-2 text-center">ROT</th>}
          <th className="py-2 text-right">Summa</th>
        </tr>
      </thead>
      <tbody>
        {quote.items.map((item) => (
          <tr key={item.id} className="border-b border-border/50">
            <td className="py-3">{item.description}</td>
            <td className="py-3 text-right">{item.quantity}</td>
            <td className="py-3 text-left pl-4">{item.unit}</td>
            <td className="py-3 text-right">{item.price.toLocaleString()} kr</td>
            <td className="py-3 text-right">
              {renderDiscount(item.discountType, item.discountValue)}
            </td>
            {hasRotItems && (
              <td className="py-3 text-center">
                {item.hasRotDeduction && <CircleCheck className="h-4 w-4 mx-auto text-green-600" />}
              </td>
            )}
            <td className="py-3 text-right">
              {calculateItemPrice(item).toLocaleString()} kr
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={hasRotItems ? 5 : 4}></td>
          <td className="pt-4 font-semibold text-right">Delsumma:</td>
          <td className="pt-4 font-semibold text-right">
            {calculateSubtotal(quote.items).toLocaleString()} kr
          </td>
        </tr>
        
        {(quote.totalDiscountValue && quote.totalDiscountValue > 0) && (
          <tr>
            <td colSpan={hasRotItems ? 5 : 4}></td>
            <td className="py-1 text-right">Rabatt:</td>
            <td className="py-1 text-right">
              {quote.totalDiscountType === "percentage" 
                ? `${quote.totalDiscountValue}% (${(calculateSubtotal(quote.items) * quote.totalDiscountValue / 100).toLocaleString()} kr)`
                : `${quote.totalDiscountValue.toLocaleString()} kr`}
            </td>
          </tr>
        )}
        
        <tr>
          <td colSpan={hasRotItems ? 5 : 4}></td>
          <td className="pt-2 font-semibold text-right border-t border-border">Totalt:</td>
          <td className="pt-2 font-semibold text-right border-t border-border">
            {calculateTotal(quote.items, quote.totalDiscountType, quote.totalDiscountValue).toLocaleString()} kr
          </td>
        </tr>
        
        {calculateTotalRotDeduction(quote.items) > 0 && (
          <>
            <tr>
              <td colSpan={hasRotItems ? 5 : 4}></td>
              <td className="py-1 text-right text-green-600 dark:text-green-400">ROT-avdrag:</td>
              <td className="py-1 text-right text-green-600 dark:text-green-400">
                {calculateTotalRotDeduction(quote.items).toLocaleString()} kr
              </td>
            </tr>
            <tr>
              <td colSpan={hasRotItems ? 5 : 4}></td>
              <td className="pt-2 font-semibold text-right text-green-600 dark:text-green-400 border-t border-border">
                Att betala efter ROT:
              </td>
              <td className="pt-2 font-semibold text-right text-green-600 dark:text-green-400 border-t border-border">
                {(calculateTotal(quote.items, quote.totalDiscountType, quote.totalDiscountValue) - 
                  calculateTotalRotDeduction(quote.items)).toLocaleString()} kr
              </td>
            </tr>
          </>
        )}
      </tfoot>
    </table>
  );

  const MobileTotalsView = () => (
    <div className="space-y-3 pt-4 border-t border-border">
      <div className="flex justify-between items-center">
        <div className="font-medium">Delsumma:</div>
        <div>{calculateSubtotal(quote.items).toLocaleString()} kr</div>
      </div>
      
      {(quote.totalDiscountValue && quote.totalDiscountValue > 0) && (
        <div className="flex justify-between items-center">
          <div className="font-medium">Rabatt:</div>
          <div>
            {quote.totalDiscountType === "percentage" 
              ? `${quote.totalDiscountValue}% (${(calculateSubtotal(quote.items) * quote.totalDiscountValue / 100).toLocaleString()} kr)`
              : `${quote.totalDiscountValue.toLocaleString()} kr`}
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t border-border">
        <div>Totalt:</div>
        <div>{calculateTotal(quote.items, quote.totalDiscountType, quote.totalDiscountValue).toLocaleString()} kr</div>
      </div>
      
      {calculateTotalRotDeduction(quote.items) > 0 && (
        <>
          <div className="flex justify-between items-center text-green-600 dark:text-green-400">
            <div className="flex items-center">
              <CircleCheck className="h-4 w-4 mr-2" />
              <div className="font-medium">ROT-avdrag:</div>
            </div>
            <div>{calculateTotalRotDeduction(quote.items).toLocaleString()} kr</div>
          </div>
          <div className="flex justify-between items-center text-green-600 dark:text-green-400 font-semibold">
            <div>Att betala efter ROT:</div>
            <div>
              {(calculateTotal(quote.items, quote.totalDiscountType, quote.totalDiscountValue) - 
                calculateTotalRotDeduction(quote.items)).toLocaleString()} kr
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="quote-paper px-4 md:px-8 py-6 md:py-10 bg-card text-card-foreground rounded-lg shadow-md max-w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-card-foreground break-words">{quote.title || "Offert"}</h1>
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

      <div className="mt-8 md:mt-12 overflow-x-hidden">
        {isMobile ? <MobileItemsView /> : <DesktopItemsView />}
        {isMobile && <MobileTotalsView />}
      </div>
      
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
      
      {hasRotItems && (
        <div className="mt-8 text-sm bg-green-50 dark:bg-green-900/20 p-4 rounded border border-green-200 dark:border-green-800">
          <h3 className="font-semibold mb-2 text-green-800 dark:text-green-300">Information om ROT-avdrag:</h3>
          <p className="text-green-800 dark:text-green-300 break-words">
            ROT-avdraget är ett skatteavdrag som ger privatpersoner möjlighet att få skattereduktion för arbetskostnader vid reparation, underhåll samt om- och tillbyggnad av bostäder. 
            Avdraget uppgår till 30% av arbetskostnaden, upp till maximalt 50 000 kr per person och år.
          </p>
        </div>
      )}
    </div>
  );
}
