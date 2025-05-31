
import { Button } from "@/components/ui/button";
import { Quote } from "@/types";
import { FileText, Send, Check, X, ArrowRight, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface QuoteItemActionsProps {
  quote: Quote;
  onStatusChange?: (id: string, status: Quote["status"]) => void;
}

export function QuoteItemActions({ quote, onStatusChange }: QuoteItemActionsProps) {
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

  const isEditable = quote.status === "draft";

  return (
    <div className="flex gap-2 justify-end">
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
    </div>
  );
}
