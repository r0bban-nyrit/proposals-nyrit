
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Quote } from "@/types";
import { FileText, Send, Check, X } from "lucide-react";
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
        return "secondary";
      case "accepted":
        return "default";
      case "rejected":
        return "destructive";
      case "expired":
        return "destructive";
      default:
        return "outline";
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
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-semibold text-lg">{quote.title}</div>
            <div className="text-sm text-gray-500">
              #{quote.number} | {formatDate(quote.createdAt)}
            </div>
            <div className="mt-2">
              <Badge variant={getBadgeVariant()}>{getStatusText()}</Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Kund</div>
            <div>{quote.recipient.name}</div>
            {quote.recipient.companyName && (
              <div className="text-sm text-gray-500">{quote.recipient.companyName}</div>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-between items-end">
          <div>
            <div className="text-sm text-gray-500">Giltig till</div>
            <div>{formatDate(quote.validUntil)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Totalt</div>
            <div className="font-semibold text-lg">
              {calculateTotal().toLocaleString()} kr
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end border-t px-6 py-4 bg-gray-50">
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
        {(quote.status === "accepted" || quote.status === "rejected") && (
          <Button onClick={handleEdit} variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" /> Visa
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
