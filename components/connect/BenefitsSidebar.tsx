import { motion } from "framer-motion";
import { 
  Shield, 
  TrendingDown,
  Sparkles,
  Clock,
  Receipt
} from "lucide-react";

export default function BenefitsSidebar(){
    return(
        <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 space-y-4"
            >
              <div className="bg-gradient-to-br from-white via-white to-white-light rounded-2xl p-6 text-black">
                <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-gold" />
                  Why Connect?
                </h3>
                <div className="space-y-4">
                  {[
                    { icon: TrendingDown, title: "Auto-apply Credits", desc: "Solar credits applied to your bills automatically" },
                    { icon: Receipt, title: "Track Bills", desc: "View all your electricity bills in one place" },
                    { icon: Clock, title: "Real-time Updates", desc: "Get notified when new bills arrive" },
                    { icon: Shield, title: "Secure & Private", desc: "Your data is encrypted and never shared" },
                  ].map((benefit, index) => (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="p-2 rounded-lg bg-white/10 shrink-0">
                        <benefit.icon className="h-4 w-4 text-gold" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{benefit.title}</h4>
                        <p className="text-black/70 text-xs">{benefit.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-50">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-black text-sm">BBPS Certified</p>
                    <p className="text-xs text-gray-500">Authorized bill payment partner</p>
                  </div>
                </div>
              </motion.div>
        </motion.div>
    )
}