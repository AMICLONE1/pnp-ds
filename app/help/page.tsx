"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Search,
} from "lucide-react";
import { faqs } from "@/lib/utils/help/data";
import QuickLinks from "@/components/help/QuickLinks";
import Categories from "@/components/help/Categories";
import FAQ from "@/components/help/FAQ";
import StillNeedHelp from "@/components/help/StillNeedHelp";
import Hero from "@/components/help/Hero";


export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-offwhite via-white to-offwhite">
      <Header />
      <main className="flex-1 pt-28 pb-16">
        {/* Hero Section */}
        <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} resultCount={filteredFAQs.length} />

        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Quick Links */}
            <QuickLinks/>

            {/* Categories */}
            <Categories selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

            {/* FAQs */}
            <FAQ filteredFAQs={filteredFAQs} />

            {filteredFAQs.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-black mb-2">No results found</h3>
                    <p className="text-black mb-4">Try a different search term or browse by category</p>
                    <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
                      Clear filters
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Still Need Help Section */}
            <StillNeedHelp/>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
