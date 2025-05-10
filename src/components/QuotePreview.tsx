
import { Card } from "@/components/ui/card";
import { Quote, BusinessProfile } from "@/types";
import { format, parseISO } from "date-fns";
import { sv } from "date-fns/locale";

interface QuotePreviewProps {
  quote: Quote;
  businessProfile?: BusinessProfile;
}

export default function QuotePreview({ quote, businessProfile }: QuotePreviewProps) {
  const calculateTotal = () => {
    return quote.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "d MMMM yyyy", { locale: sv });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="quote-paper px-8 py-10 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{quote.title || "Offert"}</h1>
          <div className="mt-2 text-gray-600">
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
          <h2 className="font-semibold text-gray-800 mb-2">Från:</h2>
          {businessProfile ? (
            <div>
              <div className="font-bold">{businessProfile.companyName}</div>
              <div>Org.nr: {businessProfile.organizationNumber}</div>
              <div>{businessProfile.address}</div>
              <div>{businessProfile.postalCode} {businessProfile.city}</div>
              <div className="mt-2">{businessProfile.email}</div>
              <div>{businessProfile.phoneNumber}</div>
              {businessProfile.website && <div>{businessProfile.website}</div>}
            </div>
          ) : (
            <div className="text-gray-500 italic">
              Din företagsinformation kommer att visas här
            </div>
          )}
        </div>
        
        <div>
          <h2 className="font-semibold text-gray-800 mb-2">Till:</h2>
          <div>
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
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 text-left">Beskrivning</th>
              <th className="py-2 text-right">Antal</th>
              <th className="py-2 text-left pl-4">Enhet</th>
              <th className="py-2 text-right">Á pris</th>
              <th className="py-2 text-right">Summa</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-3">{item.description}</td>
                <td className="py-3 text-right">{item.quantity}</td>
                <td className="py-3 text-left pl-4">{item.unit}</td>
                <td className="py-3 text-right">{item.price.toLocaleString()} kr</td>
                <td className="py-3 text-right">
                  {(item.quantity * item.price).toLocaleString()} kr
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3}></td>
              <td className="pt-4 font-semibold text-right">Totalt:</td>
              <td className="pt-4 font-semibold text-right">
                {calculateTotal().toLocaleString()} kr
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      {quote.notes && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Meddelande:</h3>
          <div className="bg-gray-50 p-4 rounded whitespace-pre-line">
            {quote.notes}
          </div>
        </div>
      )}
      
      {quote.terms && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Villkor:</h3>
          <div className="bg-gray-50 p-4 rounded whitespace-pre-line">
            {quote.terms}
          </div>
        </div>
      )}
    </div>
  );
}
