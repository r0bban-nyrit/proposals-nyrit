
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote, BusinessProfile } from "@/types";
import { QuoteListItem } from "@/components/QuoteListItem";
import { FileText, Plus, ClipboardList, Settings } from "lucide-react";

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

  return (
    <AppLayout>
      <Header 
        title="Översikt" 
        description="Välkommen till din offerthantering"
      />
      
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Offertutkast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{draftCount}</div>
              <p className="text-xs text-muted-foreground pt-1">
                Antal osända offerter
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Skickade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{sentCount}</div>
              <p className="text-xs text-muted-foreground pt-1">
                Antal offerter som väntar på svar
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Accepterade</CardTitle>
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Senaste offerterna</CardTitle>
              <CardDescription>
                De senaste offerterna du har skapat
              </CardDescription>
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
          
          <Card>
            <CardHeader>
              <CardTitle>Snabbåtgärder</CardTitle>
              <CardDescription>
                Vanliga uppgifter du kanske vill utföra
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full justify-start" 
                onClick={() => navigate("/skapa-offert")}
              >
                <Plus className="h-4 w-4 mr-2" /> Skapa ny offert
              </Button>
              
              <Button 
                className="w-full justify-start" 
                variant="outline" 
                onClick={() => navigate("/offerter")}
              >
                <ClipboardList className="h-4 w-4 mr-2" /> Visa alla offerter
              </Button>
              
              <Button 
                className="w-full justify-start" 
                variant="outline" 
                onClick={() => navigate("/profil")}
              >
                <Settings className="h-4 w-4 mr-2" /> Redigera företagsprofil
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
