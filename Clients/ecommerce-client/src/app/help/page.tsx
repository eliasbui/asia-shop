import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { HelpSearch } from '@/components/help/HelpSearch';
import { FAQSection } from '@/components/FAQSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Truck,
  RefreshCw,
  CreditCard,
  Shield,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  Phone,
  Mail,
  Clock
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trung tâm hỗ trợ - AsiaShop',
  description: 'Tìm câu trả lời cho các câu hỏi thường gặp về đặt hàng, vận chuyển, thanh toán và nhiều hơn nữa tại Trung tâm hỗ trợ AsiaShop.',
  keywords: 'hỗ trợ, giúp đỡ, câu hỏi thường gặp, FAQ, AsiaShop hỗ trợ',
};

const quickActions = [
  {
    title: 'Theo dõi đơn hàng',
    description: 'Kiểm tra tình trạng đơn hàng của bạn',
    href: '/help/shipping',
    icon: Truck,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Đổi trả sản phẩm',
    description: 'Hướng dẫn đổi trả và hoàn tiền',
    href: '/help/returns',
    icon: RefreshCw,
    color: 'bg-green-100 text-green-600',
  },
  {
    title: 'Phương thức thanh toán',
    description: 'Các phương thức thanh toán được chấp nhận',
    href: '/help/payment',
    icon: CreditCard,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Bảo hành sản phẩm',
    description: 'Chính sách bảo hành và hỗ trợ kỹ thuật',
    href: '/help/warranty',
    icon: Shield,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    title: 'Liên hệ hỗ trợ',
    description: 'Chat với đội ngũ hỗ trợ của chúng tôi',
    href: '/help/contact',
    icon: MessageSquare,
    color: 'bg-red-100 text-red-600',
  },
  {
    title: 'Hướng dẫn mua hàng',
    description: 'Cách đặt hàng và sử dụng website',
    href: '/help',
    icon: HelpCircle,
    color: 'bg-cyan-100 text-cyan-600',
  },
];

const generalFAQs = [
  {
    question: 'Làm thế nào để đặt hàng trên AsiaShop?',
    answer: 'Để đặt hàng trên AsiaShop, bạn có thể: 1) Tìm sản phẩm mong muốn sử dụng thanh tìm kiếm hoặc duyệt qua danh mục. 2) Nhấn vào sản phẩm để xem chi tiết và thêm vào giỏ hàng. 3) Tiến hành thanh toán và điền thông tin giao hàng. 4) Chọn phương thức thanh toán và xác nhận đơn hàng.',
  },
  {
    question: 'AsiaShop có những phương thức thanh toán nào?',
    answer: 'AsiaShop chấp nhận các phương thức thanh toán sau: Thẻ tín dụng/ghi nợ (Visa, Mastercard, JCB), Ví điện tử (MoMo, ZaloPay, VNPay), Thanh toán khi nhận hàng (COD), Chuyển khoản ngân hàng, và Trả góp 0% lãi suất với các ngân hàng đối tác.',
  },
  {
    question: 'Thời gian giao hàng thường mất bao lâu?',
    answer: 'Thời gian giao hàng phụ thuộc vào khu vực: Hà Nội và TP.HCM: 1-2 ngày làm việc, Các thành phố lớn khác: 2-3 ngày làm việc, Các tỉnh thành khác: 3-5 ngày làm việc. Bạn có thể theo dõi đơn hàng trực tiếp trên website hoặc ứng dụng.',
  },
  {
    question: 'Làm thế nào để theo dõi đơn hàng của tôi?',
    answer: 'Bạn có thể theo dõi đơn hàng bằng cách: 1) Đăng nhập vào tài khoản AsiaShop, 2) Vào mục "Đơn hàng của tôi", 3) Nhấn vào đơn hàng bạn muốn theo dõi, 4) Xem tình trạng và lịch trình giao hàng. Bạn cũng sẽ nhận được thông báo qua email và SMS về trạng thái đơn hàng.',
  },
];

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumbs />
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Trung tâm hỗ trợ
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Chúng tôi ở đây để giúp bạn! Tìm câu trả lời cho các câu hỏi thường gặp hoặc liên hệ trực tiếp với đội ngũ hỗ trợ của chúng tôi.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <HelpSearch className="max-w-2xl mx-auto" />
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Chủ đề phổ biến</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} href={action.href}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center text-primary group-hover:text-primary/80">
                        <span className="text-sm font-medium">Xem chi tiết</span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* FAQ Section */}
            <FAQSection
              title="Câu hỏi thường gặp"
              items={generalFAQs}
              maxItems={5}
            />

            {/* Additional Help Topics */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Chủ đề khác</h2>
              <div className="space-y-4">
                <Link href="/help/shipping">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-3">
                        <Truck className="h-5 w-5 text-blue-600" />
                        Vận chuyển và Giao hàng
                      </CardTitle>
                      <CardDescription>
                        Thông tin về phương thức vận chuyển, thời gian giao hàng và phí vận chuyển
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/help/returns">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-3">
                        <RefreshCw className="h-5 w-5 text-green-600" />
                        Đổi trả và Hoàn tiền
                      </CardTitle>
                      <CardDescription>
                        Chính sách đổi trả, điều kiện và quy trình hoàn tiền
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/help/payment">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-purple-600" />
                        Thanh toán
                      </CardTitle>
                      <CardDescription>
                        Phương thức thanh toán, bảo mật và các chương trình trả góp
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Support Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Cần hỗ trợ thêm?
                </CardTitle>
                <CardDescription>
                  Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Hotline</div>
                      <div className="text-muted-foreground">1900 1234</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-muted-foreground">support@asiashop.vn</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Giờ làm việc</div>
                      <div className="text-muted-foreground">8:00 - 22:00 (T2 - CN)</div>
                    </div>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/help/contact">Liên hệ ngay</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Popular Articles */}
            <Card>
              <CardHeader>
                <CardTitle>Bài viết phổ biến</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/help/shipping" className="block text-sm hover:text-primary">
                    • Cách theo dõi đơn hàng
                  </Link>
                  <Link href="/help/returns" className="block text-sm hover:text-primary">
                    • Điều kiện đổi trả sản phẩm
                  </Link>
                  <Link href="/help/payment" className="block text-sm hover:text-primary">
                    • Hướng dẫn thanh toán trả góp
                  </Link>
                  <Link href="/help/warranty" className="block text-sm hover:text-primary">
                    • Chính sách bảo hành điện tử
                  </Link>
                  <Link href="/help/contact" className="block text-sm hover:text-primary">
                    • Các kênh liên hệ hỗ trợ
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}