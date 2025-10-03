import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { HelpNavigation } from '@/components/help/HelpNavigation';
import { FAQSection } from '@/components/FAQSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Clock, MapPin, Shield, CheckCircle, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Thông tin vận chuyển - AsiaShop',
  description: 'Tìm hiểu về phương thức vận chuyển, thời gian giao hàng, phí vận chuyển và theo dõi đơn hàng tại AsiaShop.',
  keywords: 'vận chuyển, giao hàng, theo dõi đơn hàng, phí vận chuyển, AsiaShop shipping',
};

const shippingMethods = [
  {
    name: 'Giao hàng nhanh',
    time: '1-2 ngày',
    price: '30.000đ',
    freeCondition: 'Miễn phí cho đơn từ 500.000đ',
    areas: 'Hà Nội, TP.HCM, Đà Nẵng',
    icon: '🚀',
  },
  {
    name: 'Giao hàng tiêu chuẩn',
    time: '3-5 ngày',
    price: '20.000đ',
    freeCondition: 'Miễn phí cho đơn từ 300.000đ',
    areas: 'Toàn quốc',
    icon: '📦',
  },
  {
    name: 'Giao hàng siêu tốc',
    time: '2-4 giờ',
    price: '50.000đ',
    freeCondition: 'Không áp dụng',
    areas: 'Nội thành Hà Nội, TP.HCM',
    icon: '⚡',
  },
];

const shippingFAQs = [
  {
    question: 'Làm thế nào để theo dõi đơn hàng của tôi?',
    answer: 'Bạn có thể theo dõi đơn hàng bằng cách: 1) Đăng nhập vào tài khoản AsiaShop, 2) Vào mục "Đơn hàng của tôi", 3) Chọn đơn hàng muốn theo dõi, 4) Xem chi tiết tình trạng và lịch trình giao hàng. Bạn cũng sẽ nhận được thông báo qua email và SMS khi có cập nhật.',
  },
  {
    question: 'Tôi có thể thay đổi địa chỉ giao hàng sau khi đặt hàng không?',
    answer: 'Bạn có thể thay đổi địa chỉ giao hàng trong vòng 1 giờ sau khi đặt hàng, miễn là đơn hàng chưa được xử lý. Hãy liên hệ ngay với đội ngũ hỗ trợ qua hotline 1900 1234 hoặc email support@asiashop.vn để được hỗ trợ nhanh nhất.',
  },
  {
    question: 'AsiaShop giao hàng đến những khu vực nào?',
    answer: 'AsiaShop giao hàng trên toàn lãnh thổ Việt Nam, bao gồm 63 tỉnh thành. Tuy nhiên, thời gian giao hàng có thể khác nhau tùy thuộc vào khu vực: Các thành phố lớn: 1-2 ngày, Các tỉnh thành khác: 3-5 ngày, Các vùng sâu vùng xa: 5-7 ngày.',
  },
  {
    question: 'Phí vận chuyển được tính như thế nào?',
    answer: 'Phí vận chuyển phụ thuộc vào: Khu vực giao hàng, Khối lượng và kích thước sản phẩm, Phương thức vận chuyển lựa chọn, Giá trị đơn hàng. Các đơn hàng có giá trị từ 300.000đ sẽ được miễn phí vận chuyển tiêu chuẩn.',
  },
  {
    question: 'Tôi nhận hàng khi vắng nhà thì sao?',
    answer: 'Nếu bạn vắng nhà khi shipper giao hàng: Shipper sẽ gọi điện cho bạn để hẹn thời gian giao lại, Shipper có thể để hàng tại người thân/đồng nghiệp (nếu có sự đồng ý), Đơn hàng sẽ được giữ tại bưu cục trong 48 giờ, sau đó sẽ được hoàn về AsiaShop.',
  },
  {
    question: 'Tôi có thể yêu cầu giao hàng vào thời gian cụ thể không?',
    answer: 'Hiện tại AsiaShop chưa hỗ trợ chọn khung giờ giao hàng cụ thể. Tuy nhiên, với dịch vụ giao hàng siêu tốc tại Hà Nội và TP.HCM, bạn có thể nhận hàng trong vòng 2-4 giờ sau khi đặt hàng.',
  },
];

const deliveryProcess = [
  {
    step: 1,
    title: 'Xác nhận đơn hàng',
    description: 'Đơn hàng của bạn được xác nhận và bắt đầu xử lý',
    icon: CheckCircle,
  },
  {
    step: 2,
    title: 'Đóng gói sản phẩm',
    description: 'Sản phẩm được đóng gói cẩn thận tại kho',
    icon: Shield,
  },
  {
    step: 3,
    title: 'Bàn giao vận chuyển',
    description: 'Đơn hàng được bàn giao cho đối tác vận chuyển',
    icon: Truck,
  },
  {
    step: 4,
    title: 'Đang giao hàng',
    description: 'Shipper đang trên đường giao hàng đến địa chỉ của bạn',
    icon: MapPin,
  },
  {
    step: 5,
    title: 'Giao hàng thành công',
    description: 'Bạn đã nhận được sản phẩm',
    icon: CheckCircle,
  },
];

export default function ShippingHelpPage() {
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
                Vận chuyển và Giao hàng
              </h1>
              <p className="text-lg text-gray-600">
                Tất cả thông tin bạn cần biết về vận chuyển tại AsiaShop
              </p>
            </div>

            {/* Shipping Methods */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Phương thức vận chuyển</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {shippingMethods.map((method, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{method.icon}</span>
                        {method.freeCondition && (
                          <Badge variant="secondary" className="text-xs">
                            Miễn phí
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{method.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {method.time}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Phí vận chuyển:</span>
                          <span className="font-medium">{method.price}</span>
                        </div>
                        {method.freeCondition && (
                          <p className="text-xs text-green-600">{method.freeCondition}</p>
                        )}
                        <div className="text-xs text-muted-foreground">
                          <MapPin className="inline h-3 w-3 mr-1" />
                          {method.areas}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Delivery Process */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Quy trình giao hàng</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {deliveryProcess.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="relative mb-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto">
                          <Icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        {index < deliveryProcess.length - 1 && (
                          <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-border -translate-y-1/2" />
                        )}
                      </div>
                      <h3 className="font-medium text-sm mb-1">Bước {step.step}</h3>
                      <p className="text-xs text-muted-foreground">{step.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Important Notes */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Lưu ý quan trọng</h2>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                      Điều kiện giao hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Người nhận phải có mặt để ký nhận hàng hóa</li>
                      <li>• Kiểm tra kỹ sản phẩm trước khi ký nhận</li>
                      <li>• Chụp ảnh/video khi mở hàng (nếu cần)</li>
                      <li>• Báo cáo ngay cho AsiaShop nếu phát hiện vấn đề</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-500" />
                      Bảo hiểm vận chuyển
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Tất cả đơn hàng đều được bảo hiểm vận chuyển với giá trị tối đa:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Đơn hàng dưới 1.000.000đ: Bảo hiểm 100% giá trị</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Đơn hàng trên 1.000.000đ: Bảo hiểm tối đa 1.000.000đ</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Sản phẩm điện tử: Bảo hiểm theo chính sách hãng</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* FAQ Section */}
            <section>
              <FAQSection
                title="Câu hỏi thường gặp về vận chuyển"
                items={shippingFAQs}
              />
            </section>

            {/* Contact Support */}
            <section className="bg-muted/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Cần hỗ trợ thêm?</h2>
              <p className="text-muted-foreground mb-4">
                Nếu bạn có câu hỏi khác về vận chuyển, đừng ngần ngại liên hệ với chúng tôi.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:19001234"
                  className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Gọi hotline 1900 1234
                </a>
                <a
                  href="/help/contact"
                  className="inline-flex items-center justify-center px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                >
                  Liên hệ hỗ trợ
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}