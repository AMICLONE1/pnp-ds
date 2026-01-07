import Link from "next/link";
import { Sun } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Sun className="h-6 w-6 text-gold" />
              <span className="text-xl font-heading font-bold text-forest">
                PowerNetPro
              </span>
            </Link>
            <p className="text-gray-600 text-sm max-w-md">
              All in one Energy Trading Platform. The infrastructure for the next generation of energy trading.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-charcoal mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/reserve" className="hover:text-forest">
                  Join Projects
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-forest">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/bills" className="hover:text-forest">
                  Bills
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-charcoal mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/about" className="hover:text-forest">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-forest">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} PowerNetPro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

