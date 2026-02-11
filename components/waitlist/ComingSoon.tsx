import { motion } from "framer-motion";
import { Sun, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Sun,
    title: "Digital Solar",
    desc: "Reserve solar capacity without installing panels on your roof",
  },
  {
    icon: Zap,
    title: "Bill Credits",
    desc: "Get solar credits applied directly to your electricity bill",
  },
  {
    icon: Shield,
    title: "Zero Risk",
    desc: "No upfront costs, no maintenance, cancel anytime",
  },
];

export default function ComingSoon() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-black mb-4">
            What&apos;s Coming
          </h2>
          <p className="text-gray-600">
            Here&apos;s what you&apos;ll get when we launch
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-bold text-black mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
