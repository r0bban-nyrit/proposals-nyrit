
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Quote } from "@/types";
import { QuoteListItem } from "@/components/QuoteListItem";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Offerter() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load quotes from localStorage
    const storedQuotes = localStorage.getItem("quotes");
    
    if (storedQuotes) {
      setQuotes(JSON.parse(storedQuotes));
    }
    
    setLoading(false);
  }, []);

  const handleStatusChange = (id: string, status: Quote["status"]) => {
    const updatedQuotes = quotes.map(quote => 
      quote.id === id ? { ...quote, status } : quote
    );
    
    setQuotes(updatedQuotes);
    localStorage.setItem("quotes", JSON.stringify(updatedQuotes));
  };

  // Filter quotes by status
  const draftQuotes = quotes.filter(q => q.status === "draft");
  const sentQuotes = quotes.filter(q => q.status === "sent");
  const acceptedQuotes = quotes.filter(q => q.status === "accepted");
  const rejectedQuotes = quotes.filter(q => q.status === "rejected");

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <Header title="Offerter" description="Hantera dina offerter" />
        <Button onClick={() => navigate("/skapa-offert")}>
          <Plus className="h-4 w-4 mr-2" />
          Skapa ny offert
        </Button>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Alla ({quotes.length})</TabsTrigger>
          <TabsTrigger value="draft">Utkast ({draftQuotes.length})</TabsTrigger>
          <TabsTrigger value="sent">Skickade ({sentQuotes.length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepterade ({acceptedQuotes.length})</TabsTrigger>
          <TabsTrigger value="rejected">Avvisade ({rejectedQuotes.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {loading ? (
            <div className="text-center py-12">Laddar offerter...</div>
          ) : quotes.length > 0 ? (
            <div className="space-y-4">
              {quotes
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map(quote => (
                  <QuoteListItem 
                    key={quote.id} 
                    quote={quote} 
                    onStatusChange={handleStatusChange}
                  />
                ))
              }
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">Inga offerter än</h3>
              <p className="text-muted-foreground mt-1">
                Kom igång genom att skapa din första offert
              </p>
              <Button onClick={() => navigate("/skapa-offert")} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Skapa ny offert
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="draft" className="mt-6">
          {draftQuotes.length > 0 ? (
            <div className="space-y-4">
              {draftQuotes
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map(quote => (
                  <QuoteListItem 
                    key={quote.id} 
                    quote={quote} 
                    onStatusChange={handleStatusChange}
                  />
                ))
              }
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">Inga utkast</h3>
              <p className="text-muted-foreground mt-1">
                Du har inga sparade offertutkast
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="sent" className="mt-6">
          {sentQuotes.length > 0 ? (
            <div className="space-y-4">
              {sentQuotes
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map(quote => (
                  <QuoteListItem 
                    key={quote.id} 
                    quote={quote} 
                    onStatusChange={handleStatusChange}
                  />
                ))
              }
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">Inga skickade offerter</h3>
              <p className="text-muted-foreground mt-1">
                Du har inte skickat några offerter än
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="accepted" className="mt-6">
          {acceptedQuotes.length > 0 ? (
            <div className="space-y-4">
              {acceptedQuotes
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map(quote => (
                  <QuoteListItem 
                    key={quote.id} 
                    quote={quote} 
                    onStatusChange={handleStatusChange}
                  />
                ))
              }
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">Inga accepterade offerter</h3>
              <p className="text-muted-foreground mt-1">
                Du har inga accepterade offerter än
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-6">
          {rejectedQuotes.length > 0 ? (
            <div className="space-y-4">
              {rejectedQuotes
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map(quote => (
                  <QuoteListItem 
                    key={quote.id} 
                    quote={quote} 
                    onStatusChange={handleStatusChange}
                  />
                ))
              }
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">Inga avvisade offerter</h3>
              <p className="text-muted-foreground mt-1">
                Du har inga avvisade offerter
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
