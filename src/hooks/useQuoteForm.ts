
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Quote } from "@/types";
import { format } from "date-fns";

export function useQuoteForm(initialQuote?: Quote) {
  const today = new Date();
  const monthLater = new Date(today);
  monthLater.setMonth(monthLater.getMonth() + 1);
  
  const [quote, setQuote] = useState<Quote>(
    initialQuote || {
      id: uuidv4(),
      number: `OFF-${format(today, "yyyyMMdd")}-${Math.floor(Math.random() * 1000)}`,
      title: "",
      createdAt: format(today, "yyyy-MM-dd"),
      validUntil: format(monthLater, "yyyy-MM-dd"),
      status: "draft",
      recipient: {
        name: "",
        companyName: "",
        email: "",
        phone: "",
        address: "",
      },
      items: [
        {
          id: uuidv4(),
          description: "",
          quantity: 1,
          unit: "st",
          price: 0,
        },
      ],
      notes: "",
      terms: "Betalningsvillkor: 30 dagar\nOfferttid: 30 dagar",
    }
  );

  const saveQuote = (saveQuote: Quote = quote) => {
    const quotes = JSON.parse(localStorage.getItem("quotes") || "[]");
    const updatedQuotes = [...quotes.filter((q: Quote) => q.id !== saveQuote.id), saveQuote];
    localStorage.setItem("quotes", JSON.stringify(updatedQuotes));
  };

  return {
    quote,
    setQuote,
    saveQuote
  };
}
