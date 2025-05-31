import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Header } from "@/components/Header";
import { Quote } from "@/types";
import { QuoteListItem } from "@/components/QuoteListItem";
import { Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { generateDemoQuotes } from "@/utils/demoData";

export default function Offerter() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Load quotes from localStorage
    const storedQuotes = localStorage.getItem("quotes");
    
    if (storedQuotes) {
      const parsedQuotes = JSON.parse(storedQuotes);
      if (parsedQuotes.length === 0) {
        // If no quotes exist, generate demo data
        const demoQuotes = generateDemoQuotes();
        setQuotes(demoQuotes);
        localStorage.setItem("quotes", JSON.stringify(demoQuotes));
      } else {
        setQuotes(parsedQuotes);
      }
    } else {
      // If no quotes storage exists, generate demo data
      const demoQuotes = generateDemoQuotes();
      setQuotes(demoQuotes);
      localStorage.setItem("quotes", JSON.stringify(demoQuotes));
    }
    
    setLoading(false);
    
    // Check for URL parameters
    const params = new URLSearchParams(location.search);
    const statusParam = params.get("status");
    
    if (statusParam) {
      setActiveTab(statusParam);
    }
  }, [location.search]);

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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL to reflect the current tab without refreshing the page
    if (value === "all") {
      navigate("/offerter", { replace: true });
    } else {
      navigate(`/offerter?status=${value}`, { replace: true });
    }
  };

  return (
    <AppLayout>
      <Header title="Offerter" description="Hantera dina offerter" />
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className={`w-full ${isMobile ? 'grid grid-cols-2' : ''}`}>
          <TabsTrigger value="all">Alla ({quotes.length})</TabsTrigger>
          <TabsTrigger value="draft">Utkast ({draftQuotes.length})</TabsTrigger>
          {!isMobile && (
            <>
              <TabsTrigger value="sent">Skickade ({sentQuotes.length})</TabsTrigger>
              <TabsTrigger value="accepted">Accepterade ({acceptedQuotes.length})</TabsTrigger>
              <TabsTrigger value="rejected">Avvisade ({rejectedQuotes.length})</TabsTrigger>
            </>
          )}
        </TabsList>
        
        {isMobile && (
          <TabsList className="w-full mt-2 grid grid-cols-3">
            <TabsTrigger value="sent">Skickade ({sentQuotes.length})</TabsTrigger>
            <TabsTrigger value="accepted">Accepterade ({acceptedQuotes.length})</TabsTrigger>
            <TabsTrigger value="rejected">Avvisade ({rejectedQuotes.length})</TabsTrigger>
          </TabsList>
        )}
        
        <TabsContent value="all" className="mt-4 md:mt-6">
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
      
      <FloatingActionButton />
    </AppLayout>
  );
}
