import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle,
  Zap,
  Phone,
  Mail
} from "lucide-react";

export default function StillNeedHelp(){
    return(
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
                        Can&apos;t find what you&apos;re looking for? Our support team is ready to help you with any questions.
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
    )
}