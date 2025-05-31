
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote, BusinessProfile } from "@/types";
import { QuoteListItem } from "@/components/QuoteListItem";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { ExternalLink } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from localStorage (in a real app, this would be an API call)
    const storedQuotes = localStorage.getItem("quotes");
    const storedProfile = localStorage.getItem("businessProfile");
    
    if (storedQuotes) {
      setQuotes(JSON.parse(storedQuotes));
    }
    
    if (storedProfile) {
      setBusinessProfile(JSON.parse(storedProfile));
    }
    
    setLoading(false);
  }, []);

  // Get counts for the dashboard
  const draftCount = quotes.filter(q => q.status === "draft").length;
  const sentCount = quotes.filter(q => q.status === "sent").length;
  const acceptedCount = quotes.filter(q => q.status === "accepted").length;
  const totalValue = quotes
    .filter(q => q.status === "accepted")
    .reduce((sum, quote) => 
      sum + quote.items.reduce((itemSum, item) => 
        itemSum + (item.quantity * item.price), 0), 0);

  // Get recent quotes
  const recentQuotes = [...quotes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const handleStatusChange = (id: string, status: Quote["status"]) => {
    const updatedQuotes = quotes.map(quote => 
      quote.id === id ? { ...quote, status } : quote
    );
    
    setQuotes(updatedQuotes);
    localStorage.setItem("quotes", JSON.stringify(updatedQuotes));
  };

  // Navigate to filtered quotes
  const navigateToFilteredQuotes = (status: Quote["status"]) => {
    navigate(`/offerter?status=${status}`);
  };

  return (
    <AppLayout>
      <Header 
        title="Översikt" 
        description="Välkommen till din offerthantering"
      />
      
      <div className="grid gap-4 md:gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow" 
            onClick={() => navigateToFilteredQuotes("draft")}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">Offertutkast</CardTitle>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{draftCount}</div>
              <p className="text-xs text-muted-foreground pt-1">
                Antal osända offerter
              </p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow" 
            onClick={() => navigateToFilteredQuotes("sent")}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">Skickade</CardTitle>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{sentCount}</div>
              <p className="text-xs text-muted-foreground pt-1">
                Antal offerter som väntar på svar
              </p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow" 
            onClick={() => navigateToFilteredQuotes("accepted")}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">Accepterade</CardTitle>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{acceptedCount}</div>
              <p className="text-xs text-muted-foreground pt-1">
                Antal accepterade offerter
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Totalt värde</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalValue.toLocaleString()} kr</div>
              <p className="text-xs text-muted-foreground pt-1">
                Värde av accepterade offerter
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <CardTitle>Senaste offerterna</CardTitle>
                <CardDescription>
                  De senaste offerterna du har skapat
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate("/offerter")}
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <span>Visa alla</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Laddar...</div>
            ) : recentQuotes.length > 0 ? (
              recentQuotes.map(quote => (
                <QuoteListItem 
                  key={quote.id} 
                  quote={quote} 
                  onStatusChange={handleStatusChange}
                />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Inga offerter skapade än
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <FloatingActionButton />
    </AppLayout>
  );
}
