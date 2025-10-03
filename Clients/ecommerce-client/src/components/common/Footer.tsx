'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const t = useTranslations('common');

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-primary" />
              <span className="font-bold text-xl">AsiaShop</span>
            </div>
            <p className="text-gray-300 text-sm">
              Cửa hàng trực tuyến hàng đầu Đông Nam Á với đa dạng sản phẩm chất lượng cao.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-white hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white text-sm">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white text-sm">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white text-sm">
                  Trung tâm hỗ trợ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Dịch vụ khách hàng</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help/shipping" className="text-gray-300 hover:text-white text-sm">
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link href="/help/returns" className="text-gray-300 hover:text-white text-sm">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link href="/help/payment" className="text-gray-300 hover:text-white text-sm">
                  Phương thức thanh toán
                </Link>
              </li>
              <li>
                <Link href="/help/warranty" className="text-gray-300 hover:text-white text-sm">
                  Bảo hành
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-gray-300">1900 1234</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-gray-300">support@asiashop.vn</span>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-gray-300">
                  123 Nguyễn Huệ, Quận 1, TP.HCM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 AsiaShop. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/legal/privacy" className="text-gray-400 hover:text-white text-sm">
                Chính sách bảo mật
              </Link>
              <Link href="/legal/terms" className="text-gray-400 hover:text-white text-sm">
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}