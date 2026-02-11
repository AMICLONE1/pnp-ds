import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Video, 
  BookOpen, 
  MessageCircle,
  ArrowRight,
} from "lucide-react";

export default function QuickLinks(){
    return(
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
    )
}