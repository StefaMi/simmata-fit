
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { MotivationalQuote } from "@/types";

const quotes: MotivationalQuote[] = [
  {
    id: "q1",
    quoteAssyrian: "ܒܨܠܘܬܐ ܘܒܡܚܫܒܬܐ ܩܢܝܢܢ ܚܝܠܐ",
    quoteGerman: "Durch Gebet und Meditation erlangen wir Kraft",
    author: "Simmata-Weisheit"
  },
  {
    id: "q2",
    quoteAssyrian: "ܐܝܢܐ ܕܒܥܐ ܛܒܬܐ ܥܠܘܗܝ ܕܢܥܒܕ ܛܒܬܐ",
    quoteGerman: "Wer Gutes erfahren will, muss selbst Gutes tun",
    author: "Assyrisches Sprichwort"
  },
  {
    id: "q3",
    quoteAssyrian: "ܠܐ ܬܢܛܪ ܟܐܒܐ ܠܐܚܐ ܕܝܠܟ",
    quoteGerman: "Trage keinen Schmerz gegen deinen Bruder",
    author: "Traditionelle Weisheit"
  },
  {
    id: "q4",
    quoteAssyrian: "ܒܐܝܕܐ ܚܕܐ ܠܐ ܡܨܐ ܐܢܫ ܕܢܡܚܐ ܨܦܩܐ",
    quoteGerman: "Mit einer Hand kann man nicht klatschen",
    author: "Assyrisches Sprichwort"
  },
  {
    id: "q5",
    quoteAssyrian: "ܟܠ ܕܫܪܝܪ ܐܝܬܘܗܝ ܫܦܝܪ",
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
    <Card className="bg-slate-50 border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <Quote className="h-5 w-5 text-fitness-primary mt-1" />
          <div className="space-y-2">
            <p className="text-lg font-medium" dir="rtl" lang="arc">
              {quote.quoteAssyrian}
            </p>
            <p className="text-muted-foreground">
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
