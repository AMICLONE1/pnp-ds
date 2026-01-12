"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, HelpCircle, Sparkles, MessageCircle } from "lucide-react";

interface AccordionItem {
  id?: string;
  question: string;
  answer: string | ReactNode;
  category?: string;
}

interface FAQAccordionProps {
  items: AccordionItem[];
  className?: string;
  allowMultiple?: boolean;
  searchable?: boolean;
  variant?: "light" | "dark";
  showCategories?: boolean;
}

export function FAQAccordion({
  items: rawItems,
  className = "",
  allowMultiple = false,
  searchable = false,
  variant = "light",
  showCategories = true,
}: FAQAccordionProps) {
  // Normalize items to ensure id exists
  const items = rawItems.map((item, index) => ({
    ...item,
    id: item.id || `faq-${index}`,
  }));

  const [openItems, setOpenItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenItems((prev) =>
        prev.includes(id)
          ? prev.filter((item) => item !== id)
          : [...prev, id]
      );
    } else {
      setOpenItems((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (typeof item.answer === "string" &&
        item.answer.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !activeCategory || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(items.map((item) => item.category).filter(Boolean))];

  const handleCategoryClick = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
    setSearchQuery("");
  };

  // Theme-based styles
  const styles = {
    light: {
      searchBg: "bg-gray-50 border-gray-200 focus:border-forest focus:ring-forest/20",
      searchText: "text-charcoal placeholder:text-gray-400",
      searchIcon: "text-gray-400",
      categoryBg: "bg-gray-100 border-gray-200 text-gray-600 hover:bg-forest/10 hover:text-forest hover:border-forest/30",
      categoryActive: "bg-forest text-white border-forest",
      itemBg: "bg-white border-gray-200 hover:border-forest/30 hover:shadow-md",
      itemBgOpen: "bg-forest/5 border-forest/30 shadow-lg shadow-forest/5",
      questionText: "text-charcoal",
      answerText: "text-gray-600",
      chevronColor: "text-forest",
      highlightBg: "bg-gold/20 text-charcoal",
      emptyText: "text-gray-400",
      numberBg: "bg-forest/10 text-forest",
    },
    dark: {
      searchBg: "bg-white/5 border-white/10 focus:border-gold/50 focus:ring-gold/20",
      searchText: "text-white placeholder:text-gray-400",
      searchIcon: "text-gray-400",
      categoryBg: "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-gold/30",
      categoryActive: "bg-gold text-charcoal border-gold",
      itemBg: "bg-white/[0.02] border-white/10 hover:bg-white/5",
      itemBgOpen: "bg-white/5 border-gold/30",
      questionText: "text-white",
      answerText: "text-gray-300",
      chevronColor: "text-gold",
      highlightBg: "bg-gold/30 text-white",
      emptyText: "text-gray-400",
      numberBg: "bg-gold/20 text-gold",
    },
  };

  const s = styles[variant];

  if (!mounted) {
    return <div className={className} />;
  }

  return (
    <div className={className}>
      {/* Search Bar - Enhanced */}
      {searchable && (
        <div className="relative mb-6">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center">
            <Search className={`h-5 w-5 ${variant === "light" ? "text-forest" : "text-gold"}`} />
          </div>
          <input
            type="text"
            placeholder="Search for a question..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveCategory(null);
            }}
            className={`w-full pl-16 pr-4 py-4 border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 ${s.searchBg} ${s.searchText}`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="text-sm">Clear</span>
            </button>
          )}
        </div>
      )}

      {/* Category Pills - Enhanced */}
      {showCategories && categories.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className={`w-4 h-4 ${variant === "light" ? "text-forest" : "text-gold"}`} />
            <span className={`text-sm font-medium ${variant === "light" ? "text-gray-500" : "text-gray-400"}`}>
              Filter by topic
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2.5 border rounded-xl text-sm font-medium transition-all duration-300 ${
                !activeCategory ? s.categoryActive : s.categoryBg
              }`}
            >
              All Questions
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(category || "")}
                className={`px-4 py-2.5 border rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeCategory === category ? s.categoryActive : s.categoryBg
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Results count */}
      {(searchQuery || activeCategory) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 text-sm ${variant === "light" ? "text-gray-500" : "text-gray-400"}`}
        >
          Showing {filteredItems.length} of {items.length} questions
          {activeCategory && <span className="font-medium"> in {activeCategory}</span>}
        </motion.div>
      )}

      {/* Accordion items - Enhanced */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.03, duration: 0.3 }}
              className="overflow-hidden"
            >
              <motion.div
                className={`border-2 rounded-2xl transition-all duration-300 ${
                  openItems.includes(item.id) ? s.itemBgOpen : s.itemBg
                }`}
                layout
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex items-center gap-4 p-5 text-left group"
                >
                  {/* Question Number */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-semibold text-sm transition-all duration-300 ${
                    openItems.includes(item.id) 
                      ? (variant === "light" ? "bg-forest text-white" : "bg-gold text-charcoal")
                      : s.numberBg
                  }`}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  
                  {/* Question Text */}
                  <span className={`flex-1 text-lg font-medium ${s.questionText} pr-4 group-hover:${variant === "light" ? "text-forest" : "text-gold"} transition-colors`}>
                    {highlightText(item.question, searchQuery, s.highlightBg)}
                  </span>
                  
                  {/* Chevron with animation */}
                  <motion.div
                    animate={{ 
                      rotate: openItems.includes(item.id) ? 180 : 0,
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      openItems.includes(item.id)
                        ? (variant === "light" ? "bg-forest text-white" : "bg-gold text-charcoal")
                        : (variant === "light" ? "bg-gray-100 text-gray-400 group-hover:bg-forest/10 group-hover:text-forest" : "bg-white/10 text-gray-400 group-hover:bg-gold/20 group-hover:text-gold")
                    }`}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openItems.includes(item.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className={`px-5 pb-5 ml-14 ${s.answerText} leading-relaxed text-base`}>
                        <div className={`p-4 rounded-xl ${variant === "light" ? "bg-gray-50" : "bg-white/5"}`}>
                          {typeof item.answer === "string"
                            ? highlightText(item.answer, searchQuery, s.highlightBg)
                            : item.answer}
                        </div>
                        {item.category && (
                          <div className="mt-3 flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${variant === "light" ? "bg-forest/10 text-forest" : "bg-gold/20 text-gold"}`}>
                              {item.category}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center py-16 ${variant === "light" ? "bg-gray-50" : "bg-white/5"} rounded-2xl`}
        >
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${variant === "light" ? "bg-gray-100" : "bg-white/10"}`}>
            <HelpCircle className={`w-8 h-8 ${s.emptyText}`} />
          </div>
          <p className={`text-lg font-medium ${variant === "light" ? "text-charcoal" : "text-white"} mb-2`}>
            No questions found
          </p>
          <p className={s.emptyText}>
            Try searching for something else or{" "}
            <button 
              onClick={() => { setSearchQuery(""); setActiveCategory(null); }}
              className={`font-medium ${variant === "light" ? "text-forest hover:underline" : "text-gold hover:underline"}`}
            >
              view all questions
            </button>
          </p>
        </motion.div>
      )}

      {/* Contact CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`mt-8 p-6 rounded-2xl border-2 border-dashed ${variant === "light" ? "border-gray-200 bg-gray-50/50" : "border-white/10 bg-white/5"}`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${variant === "light" ? "bg-forest/10" : "bg-gold/20"}`}>
            <MessageCircle className={`w-6 h-6 ${variant === "light" ? "text-forest" : "text-gold"}`} />
          </div>
          <div className="flex-1">
            <p className={`font-semibold ${variant === "light" ? "text-charcoal" : "text-white"}`}>
              Still have questions?
            </p>
            <p className={`text-sm ${variant === "light" ? "text-gray-500" : "text-gray-400"}`}>
              Can&apos;t find what you&apos;re looking for? Our team is here to help.
            </p>
          </div>
          <button className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
            variant === "light" 
              ? "bg-forest text-white hover:bg-forest-light" 
              : "bg-gold text-charcoal hover:bg-gold-light"
          }`}>
            Contact Us
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function highlightText(text: string, query: string, highlightClass: string) {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark key={index} className={`${highlightClass} rounded px-1`}>
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

// Simple accordion for other uses
interface SimpleAccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function SimpleAccordion({
  title,
  children,
  defaultOpen = false,
  className = "",
}: SimpleAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={className}>
        <div className="font-medium">{title}</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left"
        whileTap={{ scale: 0.99 }}
      >
        <span className="font-medium">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
