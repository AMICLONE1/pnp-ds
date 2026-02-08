import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronDown,
  HelpCircle,
  Sun,
  CreditCard,
} from "lucide-react";

interface FAQItem {
  category: string;
  question: string;
  answer: string;
}

interface FAQProps {
  filteredFAQs: FAQItem[];
}

export default function FAQ({ filteredFAQs }: FAQProps){
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

    return(
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
    )
}
