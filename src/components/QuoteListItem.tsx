
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Quote } from "@/types";
import { FileText, Send, Check, X, ArrowRight, Eye } from "lucide-react";
import { parseISO, format, isAfter } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface QuoteListItemProps {
  quote: Quote;
  onStatusChange?: (id: string, status: Quote["status"]) => void;
}

export function QuoteListItem({ quote, onStatusChange }: QuoteListItemProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleEdit = () => {
    navigate(`/skapa-offert/${quote.id}`);
  };
  
  const handleView = () => {
    navigate(`/skapa-offert/${quote.id}?readonly=true`);
  };
  
  const handleSend = () => {
    if (onStatusChange) {
      onStatusChange(quote.id, "sent");
      toast({
        title: "Offert skickad",
        description: "Offerten har markerats som skickad.",
      });
    }
  };
  
  const handleAccept = () => {
    if (onStatusChange) {
      onStatusChange(quote.id, "accepted");
      toast({
        title: "Offert accepterad",
        description: "Offerten har markerats som accepterad.",
      });
    }
  };
  
  const handleReject = () => {
    if (onStatusChange) {
      onStatusChange(quote.id, "rejected");
      toast({
        title: "Offert avvisad",
        description: "Offerten har markerats som avvisad.",
      });
    }
  };

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

  const isEditable = quote.status === "draft";

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
              <Badge 
                variant={getBadgeVariant()} 
                className={getBadgeClassName()}
              >
                {getStatusText()}
              </Badge>
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
        {/* Visa knapp - för icke-redigerbara offerter blir det en "visa" knapp */}
        {!isEditable ? (
          <Button onClick={handleView} variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" /> Visa offert
          </Button>
        ) : (
          <Button onClick={handleEdit} variant="outline" size="sm">
            <ArrowRight className="h-4 w-4 mr-2" /> Visa offert
          </Button>
        )}

        {quote.status === "draft" && (
          <>
            <Button onClick={handleEdit} variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" /> Redigera
            </Button>
            <Button onClick={handleSend} size="sm">
              <Send className="h-4 w-4 mr-2" /> Skicka
            </Button>
          </>
        )}
        
        {quote.status === "sent" && (
          <>
            <Button onClick={handleReject} variant="outline" size="sm">
              <X className="h-4 w-4 mr-2" /> Avvisa
            </Button>
            <Button onClick={handleAccept} size="sm">
              <Check className="h-4 w-4 mr-2" /> Acceptera
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
