
import { AppLayout } from "@/components/AppLayout";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/contexts/ThemeContext";

export default function Installningar() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [defaultTerms, setDefaultTerms] = useState(
    "Betalningsvillkor: 30 dagar\nOfferttid: 30 dagar"
  );

  useEffect(() => {
    // Load settings from localStorage
    const savedTerms = localStorage.getItem("defaultTerms");
    if (savedTerms) {
      setDefaultTerms(savedTerms);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("defaultTerms", defaultTerms);
    
    toast({
      title: "Inställningar sparade",
      description: "Dina ändringar har sparats.",
    });
  };

  const handleReset = () => {
    // Clear all data (for demonstration)
    if (confirm("Är du säker på att du vill återställa alla data? Detta tar bort alla offerter och inställningar.")) {
      localStorage.clear();
      
      toast({
        title: "Data återställd",
        description: "All data har återställts. Laddar om sidan...",
      });
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    toast({
      title: "Tema uppdaterat",
      description: `Tema ändrat till ${newTheme === 'light' ? 'ljust' : newTheme === 'dark' ? 'mörkt' : 'systemstandard'}.`,
    });
  };

  return (
    <AppLayout>
      <Header 
        title="Inställningar" 
        description="Hantera applikationsinställningar" 
      />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Utseende</CardTitle>
            <CardDescription>
              Välj hur applikationen ska se ut
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="theme">Tema</Label>
                <Select value={theme} onValueChange={handleThemeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Välj tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Ljust</SelectItem>
                    <SelectItem value="dark">Mörkt</SelectItem>
                    <SelectItem value="system">Systemstandard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Standardvillkor</CardTitle>
            <CardDescription>
              Ange standardvillkor som kommer att användas för nya offerter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="defaultTerms">Standardvillkor</Label>
                <Textarea
                  id="defaultTerms"
                  value={defaultTerms}
                  onChange={(e) => setDefaultTerms(e.target.value)}
                  placeholder="Ange standardvillkor för offerter"
                  rows={5}
                />
              </div>
              
              <Button onClick={handleSave}>Spara inställningar</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Datahantering</CardTitle>
            <CardDescription>
              Hantera applikationsdata (för demonstration)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                För denna demo-app lagras all data i din webbläsare.
                I en riktig app skulle detta hanteras via en säker databas.
              </p>
              
              <Button variant="destructive" onClick={handleReset}>
                Återställ all data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
