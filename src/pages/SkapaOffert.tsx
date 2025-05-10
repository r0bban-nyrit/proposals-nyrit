
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Header } from "@/components/Header";
import QuoteForm from "@/components/QuoteForm";
import { BusinessProfile, Quote } from "@/types";

export default function SkapaOffert() {
  const { id } = useParams<{ id: string }>();
  const [quote, setQuote] = useState<Quote | undefined>(undefined);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load business profile
    const profileData = localStorage.getItem("businessProfile");
    if (profileData) {
      setBusinessProfile(JSON.parse(profileData));
    }
    
    // If we have an ID, try to find the quote
    if (id) {
      const quotesData = localStorage.getItem("quotes");
      if (quotesData) {
        const quotes: Quote[] = JSON.parse(quotesData);
        const foundQuote = quotes.find(q => q.id === id);
        if (foundQuote) {
          setQuote(foundQuote);
        }
      }
    }
    
    setLoading(false);
  }, [id]);

  const handleSave = (savedQuote: Quote) => {
    // Save the updated or new quote to localStorage
    const quotesData = localStorage.getItem("quotes");
    let quotes: Quote[] = quotesData ? JSON.parse(quotesData) : [];
    
    // Remove the old quote if it exists
    quotes = quotes.filter(q => q.id !== savedQuote.id);
    
    // Add the new/updated quote
    quotes.push(savedQuote);
    
    // Save back to localStorage
    localStorage.setItem("quotes", JSON.stringify(quotes));
  };

  return (
    <AppLayout>
      <Header 
        title={id ? "Redigera offert" : "Skapa ny offert"} 
        description={id ? "Uppdatera en befintlig offert" : "Skapa en ny offert för en kund"} 
      />
      
      {loading ? (
        <div className="text-center py-12">Laddar...</div>
      ) : (
        <QuoteForm 
          initialQuote={quote} 
          businessProfile={businessProfile} 
          onSave={handleSave}
        />
      )}
    </AppLayout>
  );
}
