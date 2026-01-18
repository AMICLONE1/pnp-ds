"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  ChevronDown, 
  Video, 
  BookOpen, 
  MessageCircle,
  HelpCircle,
  Sparkles,
  Zap,
  Sun,
  CreditCard,
  ArrowRight,
  ExternalLink,
  Phone,
  Mail
} from "lucide-react";

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

  const categoryIcons: Record<string, React.ElementType> = {
    "All": Sparkles,
    "General": HelpCircle,
    "Reserving Solar": Sun,
    "Using Credits": CreditCard,
  };

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
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-white to-white-light py-16 mb-12">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 1px)`,
              backgroundSize: '32px 32px',
            }} />
          </div>
          
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-black/90 text-sm font-medium mb-6"
              >
                <HelpCircle className="h-4 w-4" />
                We're here to help
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 text-black">
                Help Center
              </h1>
              <p className="text-lg text-black/70 mb-8">
                Find answers to common questions and learn how to use PowerNetPro
              </p>

              {/* Search */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative max-w-2xl mx-auto"
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for help topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 h-14 text-lg rounded-2xl border-0 shadow-xl shadow-black/10 focus:ring-2 focus:ring-gold"
                />
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-400"
                  >
                    {filteredFAQs.length} results
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid md:grid-cols-3 gap-6 mb-12 -mt-8"
            >
              {[
                { 
                  icon: Video, 
                  title: "Video Tutorials", 
                  desc: "Watch step-by-step guides",
                  color: "from-blue-500 to-blue-600",
                  badge: "5 videos"
                },
                { 
                  icon: BookOpen, 
                  title: "Documentation", 
                  desc: "Read detailed guides",
                  color: "from-emerald-500 to-emerald-600",
                  badge: "12 articles"
                },
                { 
                  icon: MessageCircle, 
                  title: "Contact Support", 
                  desc: "Get help from our team",
                  color: "from-gold to-amber-500",
                  badge: "24/7"
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group cursor-pointer"
                >
                  <Card className="h-full bg-white border-0 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}>
                          <item.icon className="h-6 w-6 text-black" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-black group-hover:text-black transition-colors">
                              {item.title}
                            </h3>
                            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-sm text-black">{item.desc}</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Categories */}
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

            {/* FAQs */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={faq.question}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <Card className={`border-0 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
                      expandedFAQ === index ? "ring-2 ring-forest/20" : ""
                    }`}>
                      <CardContent className="p-0">
                        <button
                          className="w-full flex items-center justify-between text-left p-5 hover:bg-white/50 transition-colors"
                          onClick={() =>
                            setExpandedFAQ(expandedFAQ === index ? null : index)
                          }
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`p-2 rounded-lg transition-colors ${
                              expandedFAQ === index 
                                ? "bg-white text-white" 
                                : "bg-white/10 text-black"
                            }`}>
                              {faq.category === "General" && <HelpCircle className="h-4 w-4" />}
                              {faq.category === "Reserving Solar" && <Sun className="h-4 w-4" />}
                              {faq.category === "Using Credits" && <CreditCard className="h-4 w-4" />}
                            </div>
                            <div className="flex-1">
                              <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-1 ${
                                faq.category === "General" ? "bg-blue-100 text-blue-700" :
                                faq.category === "Reserving Solar" ? "bg-amber-100 text-amber-700" :
                                "bg-emerald-100 text-emerald-700"
                              }`}>
                                {faq.category}
                              </span>
                              <h3 className="text-base font-semibold text-black">{faq.question}</h3>
                            </div>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedFAQ === index ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className={`ml-4 p-1 rounded-full ${
                              expandedFAQ === index ? "bg-white text-white" : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            <ChevronDown className="h-5 w-5" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {expandedFAQ === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-5 pb-5 pt-0 ml-14">
                                <div className="p-4 bg-white rounded-xl">
                                  <p className="text-black leading-relaxed">{faq.answer}</p>
                                </div>
                                <div className="flex items-center gap-4 mt-4 text-sm">
                                  <span className="text-gray-400">Was this helpful?</span>
                                  <button className="text-black hover:underline font-medium">Yes</button>
                                  <button className="text-gray-500 hover:underline">No</button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-16"
            >
              <Card className="border-0 bg-gradient-to-br from-white via-white to-white-light text-black overflow-hidden">
                <CardContent className="p-8 md:p-12 relative">
                  {/* Background decorations */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                  
                  <div className="relative grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
                        Still have questions?
                      </h2>
                      <p className="text-black/70 mb-6">
                        Can't find what you're looking for? Our support team is ready to help you with any questions.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <a href="/contact">
                          <Button className="bg-gold hover:bg-gold-light text-black font-semibold">
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Contact Support
                          </Button>
                        </a>
                        <a href="mailto:omkarkolhe912@gmail.com">
                          <Button variant="outline" className="border-white/30 text-black hover:bg-white/10">
                            <Mail className="h-4 w-4 mr-2" />
                            Email Us
                          </Button>
                        </a>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                        <Phone className="h-6 w-6 text-gold mb-3" />
                        <h3 className="font-semibold mb-1">Call Us</h3>
                        <p className="text-sm text-black/70">+91 8180 861 415</p>
                        <p className="text-xs text-black/50 mt-1">Mon-Fri, 9AM-6PM IST</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                        <Zap className="h-6 w-6 text-gold mb-3" />
                        <h3 className="font-semibold mb-1">Quick Response</h3>
                        <p className="text-sm text-black/70">Under 2 hours</p>
                        <p className="text-xs text-black/50 mt-1">Average response time</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

