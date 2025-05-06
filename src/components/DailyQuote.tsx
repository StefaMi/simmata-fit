
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

type MotivationalQuote = {
  id: string;
  quoteGerman: string;
  author: string;
};

const quotes: MotivationalQuote[] = [
  {
    id: "q1",
    quoteGerman: "Durch Gebet und Meditation erlangen wir Kraft",
    author: "Simmata-Weisheit"
  },
  {
    id: "q2",
    quoteGerman: "Wer Gutes erfahren will, muss selbst Gutes tun",
    author: "Assyrisches Sprichwort"
  },
  {
    id: "q3",
    quoteGerman: "Trage keinen Schmerz gegen deinen Bruder",
    author: "Traditionelle Weisheit"
  },
  {
    id: "q4",
    quoteGerman: "Mit einer Hand kann man nicht klatschen",
    author: "Assyrisches Sprichwort"
  },
  {
    id: "q5",
    quoteGerman: "Alles was wahr ist, ist auch schön",
    author: "Nesma-Philosophie"
  }
];

const DailyQuote = () => {
  const [quote, setQuote] = useState<MotivationalQuote | null>(null);
  
  useEffect(() => {
    // Check if we already have a quote for today
    const today = new Date().toDateString();
    const savedQuote = localStorage.getItem("dailyQuote");
    const savedDate = localStorage.getItem("dailyQuoteDate");
    
    if (savedQuote && savedDate === today) {
      setQuote(JSON.parse(savedQuote));
    } else {
      // Select a random quote
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const newQuote = quotes[randomIndex];
      
      // Save to localStorage
      localStorage.setItem("dailyQuote", JSON.stringify(newQuote));
      localStorage.setItem("dailyQuoteDate", today);
      
      setQuote(newQuote);
    }
  }, []);
  
  if (!quote) return null;
  
  return (
    <Card className="bg-slate-50 dark:bg-slate-900/60 border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <Quote className="h-5 w-5 text-fitness-primary mt-1" />
          <div className="space-y-2">
            <p className="text-lg font-medium">
              {quote.quoteGerman}
            </p>
            {quote.author && (
              <p className="text-sm text-fitness-primary">
                — {quote.author}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyQuote;
