import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Sun,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { faqs } from "@/lib/utils/help/data";

interface CategoriesProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export default function Categories({ selectedCategory, setSelectedCategory }: CategoriesProps){
    const categories = ["All", ...Array.from(new Set(faqs.map((f) => f.category)))];

    const categoryIcons: Record<string, React.ElementType> = {
        "All": Sparkles,
        "General": HelpCircle,
        "Reserving Solar": Sun,
        "Using Credits": CreditCard,
    };

    return(
        <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {categories.map((category) => {
                const Icon = categoryIcons[category] || HelpCircle;
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={`transition-all duration-200 ${
                      selectedCategory === category
                        ? "shadow-lg shadow-forest/20"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-1.5" />
                    {category}
                    {selectedCategory !== category && (
                      <span className="ml-1.5 text-xs opacity-60">
                        ({faqs.filter(f => category === "All" || f.category === category).length})
                      </span>
                    )}
                  </Button>
                );
              })}
        </motion.div>
    )
}
