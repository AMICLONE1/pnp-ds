"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, ChevronUp, Video, BookOpen, MessageCircle } from "lucide-react";

interface FAQ {
  category: string;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    category: "General",
    question: "What is digital solar?",
    answer:
      "Digital Solar is a service that enables residential individuals and groups to reserve solar capacity from commercial scale pay-for-use solar projects to trade power for bill credits, and in doing so, allows individuals to use these credits to save up on their power bills.",
  },
  {
    category: "General",
    question: "Where are these digital solar capacity installed?",
    answer:
      "Digital Solar Projects can be installed in various locations in India where net metering and RESCO projects are permissible. Current systems are installed in Bengaluru and Mumbai.",
  },
  {
    category: "General",
    question: "Do I need any approval from my DISCOM to use your service?",
    answer:
      "Utilities that are listed on our platform are enabled for addition of credits to power bills. For them, no additional permissions or requirements are necessary nor needs any changes to the building power meter.",
  },
  {
    category: "Reserving Solar",
    question: "How do I get digital solar?",
    answer:
      "You can reserve Digital Solar capacity from one of our available projects. Once you reserve, the power generated from your reservation will be traded into bill credits which can be used to save up on your monthly power bill.",
  },
  {
    category: "Reserving Solar",
    question: "Can I make reservations in batches?",
    answer:
      "Yes. You can reserve from the same project or from multiple other projects (if available) in batches. This works great especially for reserving more if power bills increase or want to get accustomed to digital solar first with a smaller batch.",
  },
  {
    category: "Reserving Solar",
    question: "Can I exit my reservation before the term period?",
    answer:
      "Yes. As a service, this is one of the key highlights of digital solar from rooftop installations which are fixed. In case the user has to exit reservation due to shift of location to an area not serviceable by us or for other reasons, they could exit the project and get a refund processed based upon the tenure of their reservation.",
  },
  {
    category: "Using Credits",
    question: "How do I connect credits to my power bills?",
    answer:
      "Simply pay your power bill through PowerNetPro (the process is much like using payment apps such as Google Pay and Paytm to pay for power) and credits get automatically added to that due bill.",
  },
  {
    category: "Using Credits",
    question: "Can I withdraw my credits as cash?",
    answer:
      "On-bill credits are used to add on top of power bills to discount them and in present form can't be withdrawn or transferred to a bank account.",
  },
  {
    category: "Using Credits",
    question: "Can I pay multiple power bills or bills on others behalf?",
    answer:
      "Yes, credits can be used for multiple billing sessions; either for individual requirements or for others.",
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(faqs.map((f) => f.category)))];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-charcoal">
              Help Center
            </h1>
            <p className="text-xl text-gray-600">
              Find answers to common questions and learn how to use PowerNetPro
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 text-lg py-6"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Video className="h-12 w-12 text-forest mx-auto mb-4" />
                <h3 className="font-semibold text-charcoal mb-2">Video Library</h3>
                <p className="text-sm text-gray-600">Watch tutorials and guides</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 text-forest mx-auto mb-4" />
                <h3 className="font-semibold text-charcoal mb-2">Documentation</h3>
                <p className="text-sm text-gray-600">Read detailed guides</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-forest mx-auto mb-4" />
                <h3 className="font-semibold text-charcoal mb-2">Contact Support</h3>
                <p className="text-sm text-gray-600">Get help from our team</p>
              </CardContent>
            </Card>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "primary" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* FAQs */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <button
                    className="w-full flex items-center justify-between text-left"
                    onClick={() =>
                      setExpandedFAQ(expandedFAQ === index ? null : index)
                    }
                  >
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">{faq.category}</div>
                      <h3 className="text-lg font-semibold text-charcoal">{faq.question}</h3>
                    </div>
                    {expandedFAQ === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" />
                    )}
                  </button>
                  {expandedFAQ === index && (
                    <p className="mt-4 text-gray-700 leading-relaxed">{faq.answer}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-600">No results found. Try a different search term.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

