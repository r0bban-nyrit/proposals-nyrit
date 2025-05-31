
import { Card } from "@/components/ui/card";
import { Quote, BusinessProfile } from "@/types";
import { format, parseISO } from "date-fns";
import { sv } from "date-fns/locale";
import { calculateItemPrice, calculateTotal, calculateSubtotal, calculateTotalRotDeduction } from "@/utils/quoteUtils";
import { CircleCheck, Percent, Tag } from "lucide-react";

interface QuotePreviewProps {
  quote: Quote;
  businessProfile?: BusinessProfile;
}

export default function QuotePreview({ quote, businessProfile }: QuotePreviewProps) {
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

  return (
    <div className="quote-paper px-8 py-10 bg-card text-card-foreground rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-card-foreground">{quote.title || "Offert"}</h1>
          <div className="mt-2 text-muted-foreground">
            <div>Offertnummer: {quote.number}</div>
            <div>Datum: {formatDate(quote.createdAt)}</div>
            <div>Giltig till: {formatDate(quote.validUntil)}</div>
          </div>
        </div>
        {businessProfile?.logo && (
          <img 
            src={businessProfile.logo} 
            alt={businessProfile.companyName} 
            className="h-16 object-contain"
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        <div>
          <h2 className="font-semibold text-card-foreground mb-2">Från:</h2>
          {businessProfile ? (
            <div className="text-card-foreground">
              <div className="font-bold">{businessProfile.companyName}</div>
              <div>Org.nr: {businessProfile.organizationNumber}</div>
              <div>{businessProfile.address}</div>
              <div>{businessProfile.postalCode} {businessProfile.city}</div>
              <div className="mt-2">{businessProfile.email}</div>
              <div>{businessProfile.phoneNumber}</div>
              {businessProfile.website && <div>{businessProfile.website}</div>}
            </div>
          ) : (
            <div className="text-muted-foreground italic">
              Din företagsinformation kommer att visas här
            </div>
          )}
        </div>
        
        <div>
          <h2 className="font-semibold text-card-foreground mb-2">Till:</h2>
          <div className="text-card-foreground">
            <div className="font-bold">{quote.recipient.name}</div>
            {quote.recipient.companyName && (
              <div>{quote.recipient.companyName}</div>
            )}
            {quote.recipient.address && (
              <div>{quote.recipient.address}</div>
            )}
            <div className="mt-2">{quote.recipient.email}</div>
            {quote.recipient.phone && (
              <div>{quote.recipient.phone}</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <table className="w-full text-card-foreground">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-left">Beskrivning</th>
              <th className="py-2 text-right">Antal</th>
              <th className="py-2 text-left pl-4">Enhet</th>
              <th className="py-2 text-right">Á pris</th>
              <th className="py-2 text-right">Rabatt</th>
              <th className="py-2 text-center">ROT</th>
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
                <td className="py-3 text-center">
                  {item.hasRotDeduction && <CircleCheck className="h-4 w-4 mx-auto text-green-600" />}
                </td>
                <td className="py-3 text-right">
                  {calculateItemPrice(item).toLocaleString()} kr
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5}></td>
              <td className="pt-4 font-semibold text-right">Delsumma:</td>
              <td className="pt-4 font-semibold text-right">
                {calculateSubtotal(quote.items).toLocaleString()} kr
              </td>
            </tr>
            
            {(quote.totalDiscountValue && quote.totalDiscountValue > 0) && (
              <tr>
                <td colSpan={5}></td>
                <td className="py-1 text-right">Rabatt:</td>
                <td className="py-1 text-right">
                  {quote.totalDiscountType === "percentage" 
                    ? `${quote.totalDiscountValue}% (${(calculateSubtotal(quote.items) * quote.totalDiscountValue / 100).toLocaleString()} kr)`
                    : `${quote.totalDiscountValue.toLocaleString()} kr`}
                </td>
              </tr>
            )}
            
            <tr>
              <td colSpan={5}></td>
              <td className="pt-2 font-semibold text-right border-t border-border">Totalt:</td>
              <td className="pt-2 font-semibold text-right border-t border-border">
                {calculateTotal(quote.items, quote.totalDiscountType, quote.totalDiscountValue).toLocaleString()} kr
              </td>
            </tr>
            
            {calculateTotalRotDeduction(quote.items) > 0 && (
              <>
                <tr>
                  <td colSpan={5}></td>
                  <td className="py-1 text-right text-green-600 dark:text-green-400">ROT-avdrag:</td>
                  <td className="py-1 text-right text-green-600 dark:text-green-400">
                    {calculateTotalRotDeduction(quote.items).toLocaleString()} kr
                  </td>
                </tr>
                <tr>
                  <td colSpan={5}></td>
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
      </div>
      
      {quote.notes && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2 text-card-foreground">Meddelande:</h3>
          <div className="bg-muted p-4 rounded whitespace-pre-line text-muted-foreground">
            {quote.notes}
          </div>
        </div>
      )}
      
      {quote.terms && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2 text-card-foreground">Villkor:</h3>
          <div className="bg-muted p-4 rounded whitespace-pre-line text-muted-foreground">
            {quote.terms}
          </div>
        </div>
      )}
      
      {quote.items.some(item => item.hasRotDeduction) && (
        <div className="mt-8 text-sm bg-green-50 dark:bg-green-900/20 p-4 rounded border border-green-200 dark:border-green-800">
          <h3 className="font-semibold mb-2 text-green-800 dark:text-green-300">Information om ROT-avdrag:</h3>
          <p className="text-green-800 dark:text-green-300">
            ROT-avdraget är ett skatteavdrag som ger privatpersoner möjlighet att få skattereduktion för arbetskostnader vid reparation, underhåll samt om- och tillbyggnad av bostäder. 
            Avdraget uppgår till 30% av arbetskostnaden, upp till maximalt 50 000 kr per person och år.
          </p>
        </div>
      )}
    </div>
  );
}
