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
      searchBg: "bg-gray-50 border-gray-200 focus:border-gray-200 focus:ring-forest/20",
      searchText: "text-black placeholder:text-gray-400",
      searchIcon: "text-gray-400",
      categoryBg: "bg-gray-100 border-gray-200 text-black hover:bg-white/10 hover:text-black hover:border-gray-200/30",
      categoryActive: "bg-gold text-black border-gold",
      itemBg: "bg-white border-gray-200 hover:border-gray-200/30 hover:shadow-md",
      itemBgOpen: "bg-white/5 border-gray-200/30 shadow-lg shadow-forest/5",
      questionText: "text-black",
      answerText: "text-black",
      chevronColor: "text-black",
      highlightBg: "bg-gold/20 text-black",
      emptyText: "text-gray-400",
      numberBg: "bg-white/10 text-black",
    },
    dark: {
      searchBg: "bg-white/5 border-white/10 focus:border-gold/50 focus:ring-gold/20",
      searchText: "text-white placeholder:text-gray-400",
      searchIcon: "text-gray-400",
      categoryBg: "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-gold/30",
      categoryActive: "bg-gold text-black border-gold",
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
        <motion.div 
          className="relative mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div 
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            <Search className={`h-5 w-5 ${variant === "light" ? "text-gold" : "text-gold"}`} />
          </motion.div>
          <input
            type="text"
            placeholder="Search for a question..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveCategory(null);
            }}
            className={`w-full pl-16 pr-4 py-4 border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 shadow-sm hover:shadow-md ${s.searchBg} ${s.searchText}`}
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          />
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold transition-colors px-3 py-1.5 rounded-lg hover:bg-gold/10"
            >
              <span className="text-sm font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>Clear</span>
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Category Pills - Enhanced */}
      {showCategories && categories.length > 0 && (
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className={`w-4 h-4 ${variant === "light" ? "text-gold" : "text-gold"}`} />
            <span className={`text-sm font-semibold ${variant === "light" ? "text-gray-700" : "text-gray-400"}`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Filter by topic
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveCategory(null)}
              className={`px-5 py-2.5 border-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${
                !activeCategory ? s.categoryActive : s.categoryBg
              }`}
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              All Questions
            </motion.button>
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + (index + 1) * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(category || "")}
                className={`px-5 py-2.5 border-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${
                  activeCategory === category ? s.categoryActive : s.categoryBg
                }`}
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>
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
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ 
                delay: index * 0.05, 
                duration: 0.4,
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
              className="overflow-hidden"
            >
              <motion.div
                className={`border-2 rounded-2xl transition-all duration-300 ${
                  openItems.includes(item.id) ? s.itemBgOpen : s.itemBg
                }`}
                layout
                whileHover={{ 
                  boxShadow: openItems.includes(item.id) 
                    ? "0 20px 40px -10px rgba(0,0,0,0.15)" 
                    : "0 8px 24px -6px rgba(0,0,0,0.08)"
                }}
              >
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex items-center gap-4 p-6 text-left group"
                >
                  {/* Question Number */}
                  <motion.div 
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-base transition-all duration-300 shadow-sm ${
                      openItems.includes(item.id) 
                        ? (variant === "light" ? "bg-gold text-black shadow-gold/20" : "bg-gold text-black")
                        : s.numberBg
                    }`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </motion.div>
                  
                  {/* Question Text */}
                  <span className={`flex-1 text-lg font-semibold ${s.questionText} pr-4 group-hover:${variant === "light" ? "text-gold" : "text-gold"} transition-colors`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    {highlightText(item.question, searchQuery, s.highlightBg)}
                  </span>
                  
                  {/* Chevron with animation */}
                  <motion.div
                    animate={{ 
                      rotate: openItems.includes(item.id) ? 180 : 0,
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.1 }}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-sm ${
                      openItems.includes(item.id)
                        ? (variant === "light" ? "bg-gold text-black shadow-gold/20" : "bg-gold text-black")
                        : (variant === "light" ? "bg-gray-100 text-gray-500 group-hover:bg-gold/20 group-hover:text-gold" : "bg-white/10 text-gray-400 group-hover:bg-gold/20 group-hover:text-gold")
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
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <motion.div 
                        className={`px-6 pb-6 ml-16 ${s.answerText} leading-relaxed text-base`}
                        initial={{ y: -10 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        <div className={`p-5 rounded-xl border ${variant === "light" ? "bg-gray-50/80 border-gray-100" : "bg-white/5 border-white/5"}`}>
                          {typeof item.answer === "string"
                            ? highlightText(item.answer, searchQuery, s.highlightBg)
                            : item.answer}
                        </div>
                        {item.category && (
                          <motion.div 
                            className="mt-4 flex items-center gap-2"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${variant === "light" ? "bg-gold/20 text-gold border border-gold/20" : "bg-gold/20 text-gold"}`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
                              {item.category}
                            </span>
                          </motion.div>
                        )}
                      </motion.div>
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
          <p className={`text-lg font-medium ${variant === "light" ? "text-black" : "text-white"} mb-2`}>
            No questions found
          </p>
          <p className={s.emptyText}>
            Try searching for something else or{" "}
            <button 
              onClick={() => { setSearchQuery(""); setActiveCategory(null); }}
              className={`font-medium ${variant === "light" ? "text-black hover:underline" : "text-gold hover:underline"}`}
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
        transition={{ delay: 0.2 }}
        className={`mt-10 p-6 rounded-2xl border-2 border-dashed ${variant === "light" ? "border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-sm" : "border-white/10 bg-white/5"}`}
      >
        <div className="flex items-center gap-5">
          <motion.div 
            className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-sm ${variant === "light" ? "bg-gold/20" : "bg-gold/20"}`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <MessageCircle className={`w-7 h-7 ${variant === "light" ? "text-gold" : "text-gold"}`} />
          </motion.div>
          <div className="flex-1">
            <p className={`font-bold text-base mb-1 ${variant === "light" ? "text-black" : "text-white"}`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Still have questions?
            </p>
            <p className={`text-sm ${variant === "light" ? "text-gray-600" : "text-gray-400"}`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Can&apos;t find what you&apos;re looking for? Our team is here to help.
            </p>
          </div>
          <motion.button 
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg ${
              variant === "light" 
                ? "bg-gold text-black hover:bg-amber-500" 
                : "bg-gold text-black hover:bg-gold-light"
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Contact Us
          </motion.button>
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
