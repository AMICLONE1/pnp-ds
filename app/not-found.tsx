import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-offwhite px-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h1 className="text-6xl font-heading font-bold mb-4 text-forest">
              404
            </h1>
            <h2 className="text-2xl font-heading font-bold mb-4 text-charcoal">
              Page Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link href="/">
              <Button variant="primary" size="lg">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

