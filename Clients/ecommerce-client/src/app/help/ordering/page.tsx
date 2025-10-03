import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { HelpNavigation } from '@/components/help/HelpNavigation';
import { FAQSection } from '@/components/FAQSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Search,
  ShoppingCart,
  Filter,
  Package,
  CreditCard,
  Truck,
  CheckCircle,
  AlertCircle,
  Star,
  User,
  Clock,
  MapPin,
  Heart,
  ArrowRight,
  Plus,
  Minus,
  GitCompare,
  Ruler,
  TrendingUp,
  Shield,
  Smartphone,
  Banknote,
  PiggyBank,
  HelpCircle,
  Eye,
  Gift,
  Zap,
  Target,
  Award,
  Lightbulb,
  Phone,
  MessageSquare,
  Mail
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hướng dẫn đặt hàng - AsiaShop',
  description: 'Hướng dẫn chi tiết cách đặt hàng, tìm kiếm sản phẩm, thanh toán và theo dõi đơn hàng tại AsiaShop.',
  keywords: 'hướng dẫn đặt hàng, mua sắm, thanh toán, theo dõi đơn hàng, AsiaShop hướng dẫn',
};

const orderingSteps = [
  {
    step: 1,
    title: 'Tìm kiếm sản phẩm',
    description: 'Sử dụng thanh tìm kiếm hoặc duyệt qua danh mục',
    icon: Search,
    tips: ['Sử dụng từ khóa chính xác', 'Lọc theo danh mục', 'Sắp xếp theo giá/dánh giá'],
    color: 'bg-blue-100 text-blue-600',
  },
  {
    step: 2,
    title: 'Lựa chọn sản phẩm',
    description: 'Xem chi tiết và chọn biến thể phù hợp',
    icon: Package,
    tips: ['Đọc mô tả chi tiết', 'Xem hình ảnh sản phẩm', 'Kiểm tra đánh giá'],
    color: 'bg-green-100 text-green-600',
  },
  {
    step: 3,
    title: 'Thêm vào giỏ hàng',
    description: 'Chọn số lượng và thêm sản phẩm vào giỏ',
    icon: ShoppingCart,
    tips: ['Kiểm tra số lượng', 'Xem giá ưu đãi', 'Áp dụng mã giảm giá'],
    color: 'bg-purple-100 text-purple-600',
  },
  {
    step: 4,
    title: 'Quản lý giỏ hàng',
    description: 'Xem lại và chỉnh sửa các sản phẩm đã chọn',
    icon: Eye,
    tips: ['Kiểm tra lại sản phẩm', 'Cập nhật số lượng', 'Xóa sản phẩm không cần'],
    color: 'bg-orange-100 text-orange-600',
  },
  {
    step: 5,
    title: 'Thanh toán',
    description: 'Điền thông tin và chọn phương thức thanh toán',
    icon: CreditCard,
    tips: ['Điền thông tin chính xác', 'Chọn phương thức phù hợp', 'Kiểm tra lại đơn hàng'],
    color: 'bg-red-100 text-red-600',
  },
  {
    step: 6,
    title: 'Xác nhận đơn hàng',
    description: 'Hoàn tất đặt hàng và chờ xác nhận',
    icon: CheckCircle,
    tips: ['Lưu mã đơn hàng', 'Kiểm tra email xác nhận', 'Theo dõi tình trạng đơn hàng'],
    color: 'bg-cyan-100 text-cyan-600',
  },
];

const searchTips = [
  {
    title: 'Sử dụng từ khóa chính xác',
    description: 'Nhập tên sản phẩm, thương hiệu hoặc mã sản phẩm cụ thể',
    icon: Target,
    example: 'iPhone 15 Pro Max thay vì "điện thoại Apple"',
  },
  {
    title: 'Sử dụng bộ lọc',
    description: 'Lọc kết quả theo giá, thương hiệu, đánh giá',
    icon: Filter,
    example: 'Lọc điện thoại Samsung dưới 10 triệu',
  },
  {
    title: 'Sắp xếp kết quả',
    description: 'Sắp xếp theo giá, đánh giá, hoặc mức độ phổ biến',
    icon: TrendingUp,
    example: 'Sắp xếp theo đánh giá cao nhất',
  },
];

const comparisonFeatures = [
  'Giá sản phẩm',
  'Thông số kỹ thuật',
  'Đánh giá người dùng',
  'Tính năng nổi bật',
  'Chương trình khuyến mãi',
  'Thời gian bảo hành',
];

const sizeGuides = [
  {
    category: 'Quần áo',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    measurements: [
      { size: 'XS', chest: '84-88', waist: '68-72', hips: '90-94' },
      { size: 'S', chest: '88-92', waist: '72-76', hips: '94-98' },
      { size: 'M', chest: '92-96', waist: '76-80', hips: '98-102' },
      { size: 'L', chest: '96-100', waist: '80-84', hips: '102-106' },
      { size: 'XL', chest: '100-104', waist: '84-88', hips: '106-110' },
      { size: 'XXL', chest: '104-108', waist: '88-92', hips: '110-114' },
    ],
  },
  {
    category: 'Giày dép',
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43'],
    measurements: [
      { size: '36', length: '23.5', width: '8.5' },
      { size: '37', length: '24', width: '8.7' },
      { size: '38', length: '24.5', width: '8.9' },
      { size: '39', length: '25', width: '9.1' },
      { size: '40', length: '25.5', width: '9.3' },
      { size: '41', length: '26', width: '9.5' },
      { size: '42', length: '26.5', width: '9.7' },
      { size: '43', length: '27', width: '9.9' },
    ],
  },
];

const checkoutComparison = [
  {
    feature: 'Lưu thông tin',
    guest: '❌ Không lưu',
    registered: '✅ Tự động lưu',
  },
  {
    feature: 'Theo dõi đơn hàng',
    guest: '❌ Cần mã đơn hàng',
    registered: '✅ Theo dõi trực tiếp',
  },
  {
    feature: 'Lịch sử mua hàng',
    guest: '❌ Không có',
    registered: '✅ Lưu trữ đầy đủ',
  },
  {
    feature: 'Chương trình ưu đãi',
    guest: '❌ Không áp dụng',
    registered: '✅ Tích điểm & ưu đãi',
  },
  {
    feature: 'Quy trình thanh toán',
    guest: '⚠️ Điền đầy đủ thông tin',
    registered: '✅ Thanh toán nhanh',
  },
  {
    feature: 'Hỗ trợ đổi trả',
    guest: '✅ Hỗ trợ cơ bản',
    registered: '✅ Ưu tiên xử lý',
  },
];

const paymentMethods = [
  {
    name: 'Thẻ tín dụng/ghi nợ',
    icon: CreditCard,
    description: 'Visa, Mastercard, JCB, AMEX',
    features: ['An toàn 100%', 'Xử lý nhanh chóng', 'Bảo mật theo chuẩn PCI-DSS'],
    processingTime: 'Ngay lập tức',
    steps: [
      'Chọn "Thanh toán bằng thẻ"',
      'Nhập thông tin thẻ',
      'Xác nhận mã OTP',
      'Hoàn tất thanh toán'
    ],
  },
  {
    name: 'Ví điện tử',
    icon: Smartphone,
    description: 'MoMo, ZaloPay, VNPay, ShopeePay',
    features: ['Tiện lợi', 'Nhiều ưu đãi', 'Giao dịch nhanh'],
    processingTime: 'Ngay lập tức',
    steps: [
      'Chọn ví điện tử',
      'Quét mã QR',
      'Xác nhận trên ứng dụng',
      'Hoàn tất thanh toán'
    ],
  },
  {
    name: 'Thanh toán khi nhận hàng (COD)',
    icon: Banknote,
    description: 'Thanh toán bằng tiền mặt khi nhận hàng',
    features: ['An tâm khi nhận hàng', 'Không cần thông tin thẻ', 'Thanh toán linh hoạt'],
    processingTime: 'Khi nhận hàng',
    steps: [
      'Chọn "Thanh toán COD"',
      'Xác nhận đơn hàng',
      'Nhận hàng và thanh toán',
      'Lưu lại hóa đơn'
    ],
  },
];

const trackingSteps = [
  {
    status: 'Đã đặt hàng',
    description: 'Đơn hàng của bạn đã được ghi nhận',
    icon: CheckCircle,
    time: 'Ngay lập tức',
  },
  {
    status: 'Đã xác nhận',
    description: 'Đơn hàng đang được xử lý',
    icon: Package,
    time: '1-2 giờ',
  },
  {
    status: 'Đang giao hàng',
    description: 'Đơn hàng đang được vận chuyển',
    icon: Truck,
    time: '1-3 ngày',
  },
  {
    status: 'Đã giao hàng',
    description: 'Đơn hàng đã đến tay bạn',
    icon: CheckCircle,
    time: 'Theo lịch hẹn',
  },
];

const orderingFAQs = [
  {
    question: 'Làm thế nào để tìm sản phẩm tôi muốn?',
    answer: 'Bạn có thể tìm sản phẩm bằng nhiều cách: 1) Sử dụng thanh tìm kiếm ở đầu trang với từ khóa chính xác, 2) Duyệt qua các danh mục sản phẩm, 3) Sử dụng bộ lọc để thu hẹp kết quả, 4) Xem các sản phẩm nổi bật hoặc khuyến mãi. Gợi ý: Sử dụng tên thương hiệu hoặc mã sản phẩm để tìm kiếm chính xác hơn.',
  },
  {
    question: 'Tôi có thể hủy đơn hàng sau khi đã đặt không?',
    answer: 'Bạn có thể hủy đơn hàng trong vòng 30 phút sau khi đặt hàng, miễn là đơn hàng chưa được xử lý. Để hủy đơn hàng: 1) Đăng nhập vào tài khoản, 2) Vào "Đơn hàng của tôi", 3) Chọn đơn hàng muốn hủy, 4) Nhấn "Hủy đơn hàng". Nếu quá thời gian quy định, vui lòng liên hệ hotline 1900 1234 để được hỗ trợ.',
  },
  {
    question: 'Làm thế nào để biết size nào phù hợp với tôi?',
    answer: 'AsiaShop cung cấp bảng size chi tiết cho mỗi sản phẩm: 1) Xem bảng size trong mục "Thông tin sản phẩm", 2) Đo kích thước cơ thể và so sánh với bảng size, 3) Xem đánh giá của khách hàng khác, 4) Sử dụng tính năng "Hỏi & Đáp" để được tư vấn. Mẹo: Nếu không chắc chắn, hãy chọn size lớn hơn một chút.',
  },
  {
    question: 'Tôi có thể thay đổi thông tin đơn hàng sau khi đặt không?',
    answer: 'Bạn có thể thay đổi thông tin đơn hàng trong vòng 1 giờ sau khi đặt hàng: 1) Địa chỉ giao hàng, 2) Số lượng sản phẩm, 3) Thêm/bớt sản phẩm. Để thay đổi, vui lòng liên hệ ngay với đội ngũ hỗ trợ qua hotline 1900 1234. Sau thời gian này, đơn hàng sẽ được xử lý và không thể thay đổi.',
  },
  {
    question: 'Tại sao thanh toán của tôi bị từ chối?',
    answer: 'Thanh toán có thể bị từ chối vì các lý do: 1) Thẻ hết hạn hoặc hết hạn mức, 2) Thẻ không được kích hoạt thanh toán online, 3) Sai thông tin thẻ, 4) Kết nối mạng không ổn định, 5) Hệ thống ngân hàng bảo trì. Hãy kiểm tra lại thông tin hoặc thử phương thức thanh toán khác.',
  },
  {
    question: 'Làm thế nào để áp dụng mã giảm giá?',
    answer: 'Để áp dụng mã giảm giá: 1) Thêm sản phẩm vào giỏ hàng, 2) Nhấn "Thanh toán", 3) Nhập mã giảm giá vào ô "Mã khuyến mãi", 4) Nhấn "Áp dụng", 5) Kiểm tra lại giá đã giảm. Lưu ý: Mỗi mã giảm giá có điều kiện áp dụng khác nhau, vui lòng đọc kỹ điều kiện.',
  },
  {
    question: 'Tôi có thể đặt hàng qua điện thoại không?',
    answer: 'Có, bạn có thể đặt hàng qua hotline 1900 1234 trong giờ hành chính. Đội ngũ tư vấn sẽ giúp bạn: 1) Tìm sản phẩm phù hợp, 2) Tư vấn thông tin chi tiết, 3) Đặt hàng và xác nhận, 4) Hỗ trợ các vấn đề sau bán hàng.',
  },
];

const shoppingTips = [
  {
    title: 'Lên danh sách trước khi mua sắm',
    description: 'Viết danh sách sản phẩm cần mua để tránh mua sắm bộc phát',
    icon: CheckCircle,
    benefit: 'Tiết kiệm 30% chi phí',
  },
  {
    title: 'So sánh giá trước khi mua',
    description: 'Sử dụng tính năng so sánh để tìm sản phẩm tốt nhất',
    icon: GitCompare,
    benefit: 'Tìm được giá tốt nhất',
  },
  {
    title: 'Đọc đánh giá của khách hàng',
    description: 'Xem đánh giá và nhận xét từ người mua trước đó',
    icon: Star,
    benefit: 'Tránh mua sản phẩm kém chất lượng',
  },
  {
    title: 'Kiểm tra chương trình khuyến mãi',
    description: 'Xem các chương trình giảm giá, miễn phí vận chuyển',
    icon: Gift,
    benefit: 'Tiết kiệm thêm 10-20%',
  },
  {
    title: 'Mua vào đúng thời điểm',
    description: 'Mua hàng vào các dịp lễ, Black Friday, 11/11',
    icon: Clock,
    benefit: 'Giảm giá đến 50%',
  },
  {
    title: 'Tích điểm thành viên',
    description: 'Đăng ký tài khoản và tích điểm cho mỗi lần mua hàng',
    icon: Award,
    benefit: 'Đổi quà và giảm giá',
  },
];

export default function OrderingHelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <HelpNavigation className="sticky top-8" />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header */}
            <div>
              <Breadcrumbs />
              <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-4">
                Hướng dẫn đặt hàng
              </h1>
              <p className="text-lg text-gray-600">
                Tìm hiểu cách đặt hàng dễ dàng và nhanh chóng tại AsiaShop
              </p>
            </div>

            {/* Step-by-Step Ordering Process */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Quy trình đặt hàng 6 bước</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orderingSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-12 h-12 rounded-lg ${step.color} flex items-center justify-center`}>
                            <span className="text-white font-bold text-lg">{step.step}</span>
                          </div>
                          <Icon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <CardDescription>{step.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Mẹo:</p>
                          <ul className="space-y-1">
                            {step.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="text-xs text-muted-foreground flex items-start gap-1">
                                <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Product Search Guide */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Hướng dẫn tìm kiếm sản phẩm</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {searchTips.map((tip, index) => {
                  const Icon = tip.icon;
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <CardTitle className="text-lg">{tip.title}</CardTitle>
                        </div>
                        <CardDescription>{tip.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-muted-foreground mb-1">Ví dụ:</p>
                          <p className="text-sm font-medium">{tip.example}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Product Comparison */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">So sánh sản phẩm</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitCompare className="h-5 w-5" />
                    Tính năng so sánh sản phẩm
                  </CardTitle>
                  <CardDescription>
                    So sánh đến 4 sản phẩm cùng lúc để đưa ra lựa chọn tốt nhất
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {comparisonFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Mẹo:</strong> Chọn các sản phẩm muốn so sánh, nhấn "So sánh" và xem bảng so sánh chi tiết để đưa ra quyết định mua sắm thông minh.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Size and Fit Guides */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Hướng dẫn chọn size</h2>
              <Tabs defaultValue="clothing" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="clothing">Quần áo</TabsTrigger>
                  <TabsTrigger value="shoes">Giày dép</TabsTrigger>
                </TabsList>
                {sizeGuides.map((guide) => (
                  <TabsContent key={guide.category} value={guide.category.toLowerCase().includes('quần') ? 'clothing' : 'shoes'}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Ruler className="h-5 w-5" />
                          Bảng size {guide.category}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2">Size</th>
                                {Object.keys(guide.measurements[0]).filter(key => key !== 'size').map((key) => (
                                  <th key={key} className="text-left p-2">
                                    {key === 'chest' ? 'Vòng ngực (cm)' :
                                     key === 'waist' ? 'Vòng eo (cm)' :
                                     key === 'hips' ? 'Vòng mông (cm)' :
                                     key === 'length' ? 'Chiều dài (cm)' :
                                     key === 'width' ? 'Chiều rộng (cm)' : key}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {guide.measurements.map((measurement, index) => (
                                <tr key={index} className="border-b">
                                  <td className="p-2 font-medium">{measurement.size}</td>
                                  {Object.entries(measurement).filter(([key]) => key !== 'size').map(([key, value]) => (
                                    <td key={key} className="p-2">{value}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <Alert className="mt-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Lưu ý:</strong> Các số đo có thể chênh lệch 1-2cm tùy thuộc vào chất liệu và cách sản xuất.
                            Nếu bạn không chắc chắn, hãy chọn size lớn hơn hoặc liên hệ tư vấn để được hỗ trợ.
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </section>

            {/* Guest vs Registered Checkout */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Thanh toán khách vãng lai vs thành viên</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Khách vãng lai
                    </CardTitle>
                    <CardDescription>
                      Đặt hàng nhanh chóng không cần đăng ký
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {checkoutComparison.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{item.feature}</span>
                          <span className={item.guest.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                            {item.guest}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-blue-600" />
                      Thành viên AsiaShop
                    </CardTitle>
                    <CardDescription>
                      Trải nghiệm mua sắm tốt hơn với nhiều ưu đãi
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {checkoutComparison.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{item.feature}</span>
                          <span className={item.registered.includes('✅') ? 'text-green-600' : 'text-orange-600'}>
                            {item.registered}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      Đăng ký miễn phí
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Payment Methods Detailed */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Hướng dẫn thanh toán chi tiết</h2>
              <div className="space-y-4">
                {paymentMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <Icon className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{method.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{method.description}</p>
                          </div>
                          <Badge variant="outline">{method.processingTime}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium mb-2">Đặc điểm nổi bật:</h4>
                            <div className="space-y-1">
                              {method.features.map((feature, featureIndex) => (
                                <div key={featureIndex} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Các bước thực hiện:</h4>
                            <ol className="space-y-1">
                              {method.steps.map((step, stepIndex) => (
                                <li key={stepIndex} className="flex items-start gap-2 text-sm">
                                  <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                                    {stepIndex + 1}
                                  </span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Order Tracking */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Theo dõi đơn hàng</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Trạng thái đơn hàng
                  </CardTitle>
                  <CardDescription>
                    Theo dõi hành trình đơn hàng của bạn từ lúc đặt hàng đến khi nhận hàng
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {trackingSteps.map((step, index) => {
                      const Icon = step.icon;
                      return (
                        <div key={index} className="text-center">
                          <div className="relative mb-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                              <Icon className="h-6 w-6 text-blue-600" />
                            </div>
                            {index < trackingSteps.length - 1 && (
                              <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-blue-200 -translate-y-1/2" />
                            )}
                          </div>
                          <h3 className="font-medium text-sm mb-1">{step.status}</h3>
                          <p className="text-xs text-muted-foreground mb-1">{step.description}</p>
                          <p className="text-xs text-blue-600 font-medium">{step.time}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Cách theo dõi đơn hàng:</h4>
                    <ol className="space-y-1 text-sm">
                      <li>1. Đăng nhập vào tài khoản AsiaShop</li>
                      <li>2. Vào mục "Đơn hàng của tôi"</li>
                      <li>3. Chọn đơn hàng muốn theo dõi</li>
                      <li>4. Xem chi tiết tình trạng và lịch trình giao hàng</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Shopping Tips */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Mẹo mua sắm thông minh</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shoppingTips.map((tip, index) => {
                  const Icon = tip.icon;
                  return (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Icon className="h-5 w-5 text-orange-600" />
                          </div>
                          <Lightbulb className="h-5 w-5 text-yellow-500" />
                        </div>
                        <CardTitle className="text-lg">{tip.title}</CardTitle>
                        <CardDescription>{tip.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">{tip.benefit}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* FAQ Section */}
            <section>
              <FAQSection
                title="Câu hỏi thường gặp về đặt hàng"
                items={orderingFAQs}
              />
            </section>

            {/* Contact Support */}
            <section className="bg-muted/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Cần hỗ trợ đặt hàng?</h2>
              <p className="text-muted-foreground mb-4">
                Nếu bạn gặp bất kỳ vấn đề nào trong quá trình đặt hàng, đừng ngần ngại liên hệ với chúng tôi.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Hotline</div>
                    <div className="text-sm text-muted-foreground">1900 1234</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">Chat trực tuyến</div>
                    <div className="text-sm text-muted-foreground">24/7</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">support@asiashop.vn</div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
