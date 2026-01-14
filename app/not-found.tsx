"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Home, ArrowLeft, Search, Sun, Zap, Wind } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-cloud-white via-primary-soft/20 to-cloud-white px-4 py-16 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute"
            style={{ left: "10%", top: "15%" }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sun className="w-16 h-16 text-solar/20" />
          </motion.div>
          <motion.div
            className="absolute"
            style={{ right: "15%", top: "25%" }}
            animate={{
              y: [0, 15, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Zap className="w-20 h-20 text-primary/15" />
          </motion.div>
          <motion.div
            className="absolute"
            style={{ left: "20%", bottom: "20%" }}
            animate={{
              x: [0, 10, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Wind className="w-14 h-14 text-eco/20" />
          </motion.div>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* 404 Number with gradient */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="mb-6"
            >
              <h1 className="text-[120px] md:text-[180px] font-heading font-bold leading-none bg-gradient-to-r from-primary via-eco to-solar bg-clip-text text-transparent mb-0">
                404
              </h1>
              <motion.div
                className="h-1 w-24 mx-auto bg-gradient-to-r from-primary via-eco to-solar rounded-full"
                initial={{ width: 0 }}
                animate={{ width: 96 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-3xl md:text-4xl font-heading font-bold mb-4 text-slate"
            >
              Oops! Page Not Found
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg text-slate-gray mb-8 max-w-md mx-auto"
            >
              The page you're looking for seems to have wandered off the grid.
              Don't worry, we'll help you get back on track!
            </motion.p>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-primary-deep hover:from-primary-deep hover:to-primary text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-primary/30 group"
                  >
                    <Home className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Back to Home
                  </Button>
                </motion.div>
              </Link>

              <Link href="/#contact">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg font-semibold group"
                  >
                    <Search className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                    Contact Support
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Quick links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 pt-8 border-t border-gray-200"
            >
              <p className="text-sm text-slate-gray mb-4">Or try these popular pages:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { href: "/reserve", label: "Reserve Solar" },
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/#how-it-works", label: "How It Works" },
                  { href: "/#faq", label: "FAQ" },
                ].map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                  >
                    <Link href={link.href}>
                      <button className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-deep bg-primary/5 hover:bg-primary/10 rounded-lg transition-all duration-200 hover:shadow-md">
                        {link.label}
                      </button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
