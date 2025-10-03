import { Link } from './link';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/50 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-lg mb-4">About Asia Shop</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your trusted online marketplace for electronics, gadgets, and more.
              Quality products at competitive prices.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/c/smartphones"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Smartphones
                </Link>
              </li>
              <li>
                <Link
                  href="/c/laptops"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Laptops
                </Link>
              </li>
              <li>
                <Link
                  href="/c/audio"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Audio
                </Link>
              </li>
              <li>
                <Link
                  href="/c/wearables"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Wearables
                </Link>
              </li>
              <li>
                <Link
                  href="/deals"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/help"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/help/shipping"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/help/returns"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/help/warranty"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Warranty
                </Link>
              </li>
              <li>
                <Link
                  href="/help/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/legal/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/gdpr"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  GDPR
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Asia Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

