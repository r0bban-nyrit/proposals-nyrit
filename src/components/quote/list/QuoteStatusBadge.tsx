
import { Badge } from "@/components/ui/badge";
import { Quote } from "@/types";
import { parseISO, isAfter } from "date-fns";

interface QuoteStatusBadgeProps {
  quote: Quote;
}

export function QuoteStatusBadge({ quote }: QuoteStatusBadgeProps) {
  const getBadgeVariant = () => {
    const isExpired = isAfter(new Date(), parseISO(quote.validUntil));
    
    if (isExpired && quote.status === "draft") {
      return "destructive";
    }
    
    switch (quote.status) {
      case "draft":
        return "outline";
      case "sent":
        return "default";
      case "accepted":
        return "secondary";
      case "rejected":
        return "destructive";
      case "expired":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getBadgeClassName = () => {
    const isExpired = isAfter(new Date(), parseISO(quote.validUntil));
    
    if (isExpired && quote.status === "draft") {
      return "";
    }
    
    switch (quote.status) {
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700";
      case "sent":
        return "bg-blue-100 text-blue-800 border-blue-400 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-600 dark:hover:bg-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800 border-green-400 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-600 dark:hover:bg-green-800";
      case "rejected":
        return "";
      case "expired":
        return "";
      default:
        return "";
    }
  };

  const getStatusText = () => {
    const isExpired = isAfter(new Date(), parseISO(quote.validUntil));
    
    if (isExpired && quote.status === "draft") {
      return "Utgången";
    }
    
    switch (quote.status) {
      case "draft":
        return "Utkast";
      case "sent":
        return "Skickad";
      case "accepted":
        return "Accepterad";
      case "rejected":
        return "Avvisad";
      case "expired":
        return "Utgången";
      default:
        return quote.status;
    }
  };

  return (
    <Badge 
      variant={getBadgeVariant()} 
      className={getBadgeClassName()}
    >
      {getStatusText()}
    </Badge>
  );
}
