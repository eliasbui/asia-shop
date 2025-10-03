import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { HelpNavigation } from '@/components/help/HelpNavigation';
import { FAQSection } from '@/components/help/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, Shield, CheckCircle, AlertCircle, Banknote, PiggyBank } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Phương thức thanh toán - AsiaShop',
  description: 'Tìm hiểu về các phương thức thanh toán được chấp nhận tại AsiaShop, bao gồm thẻ tín dụng, ví điện tử, COD và trả góp.',
  keywords: 'thanh toán, phương thức thanh toán, trả góp, AsiaShop payment, COD, ví điện tử',
};

const paymentMethods = [
  {
    name: 'Thẻ tín dụng/ghi nợ',
    icon: CreditCard,
    description: 'Visa, Mastercard, JCB, AMEX',
    features: ['An toàn 100%', 'Xử lý nhanh chóng', 'Bảo mật theo chuẩn PCI-DSS'],
    processingTime: 'Ngay lập tức',
    available: true,
  },
  {
    name: 'Ví điện tử',
    icon: Smartphone,
    description: 'MoMo, ZaloPay, VNPay, ShopeePay',
    features: ['Tiện lợi', 'Nhiều ưu đãi', 'Giao dịch nhanh'],
    processingTime: 'Ngay lập tức',
    available: true,
  },
  {
    name: 'Thanh toán khi nhận hàng (COD)',
    icon: Banknote,
    description: 'Thanh toán bằng tiền mặt khi nhận hàng',
    features: ['An tâm khi nhận hàng', 'Không cần thông tin thẻ', 'Thanh toán linh hoạt'],
    processingTime: 'Khi nhận hàng',
    available: true,
  },
  {
    name: 'Chuyển khoản ngân hàng',
    icon: PiggyBank,
    description: 'Chuyển khoản qua Internet Banking',
    features: ['An toàn', 'Minh bạch', 'Phù hợp đơn hàng lớn'],
    processingTime: '5-15 phút',
    available: true,
  },
  {
    name: 'Trả góp 0% lãi suất',
    icon: Shield,
    description: 'Trả góp qua thẻ tín dụng',
    features: ['0% lãi suất', 'Kỳ hạn linh hoạt', 'Duyệt nhanh'],
    processingTime: '1-2 phút',
    available: true,
  },
];

const installmentInfo = {
  banks: [
    { name: 'Sacombank', periods: [3, 6, 9, 12], minAmount: '3.000.000đ' },
    { name: 'Techcombank', periods: [3, 6, 9, 12], minAmount: '3.000.000đ' },
    { name: 'VPBank', periods: [3, 6, 9, 12], minAmount: '3.000.000đ' },
    { name: 'Vietcombank', periods: [3, 6, 9, 12], minAmount: '5.000.000đ' },
    { name: 'HSBC', periods: [6, 12, 18, 24], minAmount: '10.000.000đ' },
    { name: 'Citibank', periods: [3, 6, 9, 12], minAmount: '3.000.000đ' },
  ],
  requirements: [
    'Độ tuổi từ 18-60 tuổi',
    'Thu nhập ổn định tối thiểu 5.000.000đ/tháng',
    'CMND/CCCD còn hiệu lực',
    'Sổ hộ khẩu hoặc KT3 (đối với một số ngân hàng)',
  ],
};

const paymentFAQs = [
  {
    question: 'Thông tin thẻ tín dụng của tôi có an toàn không?',
    answer: 'Chắc chắn! AsiaShop sử dụng công nghệ mã hóa SSL và tuân thủ tiêu chuẩn bảo mật PCI-DSS quốc tế. Thông tin thẻ của bạn được mã hóa ngay khi nhập và không được lưu trữ trên hệ thống của chúng tôi. Chúng tôi hợp tác với các cổng thanh toán uy tín như VNPay, MoMo để đảm bảo an toàn tuyệt đối.',
  },
  {
    question: 'Làm thế nào để thanh toán trả góp 0%?',
    answer: 'Để thanh toán trả góp 0%: 1) Chọn sản phẩm có biểu tượng "Trả góp 0%", 2) Thêm vào giỏ hàng và tiến hành thanh toán, 3) Chọn phương thức "Trả góp 0%", 4) Điền thông tin thẻ tín dụng và CMND, 5) Chờ hệ thống duyệt (1-2 phút), 6) Xác nhận hoàn tất đơn hàng.',
  },
  {
    question: 'Tôi có thể sử dụng nhiều phương thức thanh toán không?',
    answer: 'Hiện tại AsiaShop chưa hỗ trợ thanh toán kết hợp nhiều phương thức. Tuy nhiên, bạn có thể: Sử dụng voucher giảm giá, Áp dụng điểm thưởng AsiaShop, Sử dụng ví AsiaShop để thanh toán phần còn lại sau khi trừ các khoản giảm giá.',
  },
  {
    question: 'Tại sao thanh toán của tôi bị từ chối?',
    answer: 'Thanh toán có thể bị từ chối vì các lý do: Thẻ hết hạn hoặc hết hạn mức, Thẻ không được kích hoạt thanh toán online, Sai thông tin thẻ (số, CVV, ngày hết hạn), Kết nối mạng không ổn định, Hệ thống ngân hàng đang bảo trì. Hãy kiểm tra lại thông tin hoặc thử phương thức thanh toán khác.',
  },
  {
    question: 'AsiaShop có chấp nhận tiền mặt không?',
    answer: 'Có, bạn có thể thanh toán bằng tiền mặt khi nhận hàng (COD) cho tất cả đơn hàng dưới 20.000.000đ. Đối với đơn hàng lớn hơn, vui lòng sử dụng các phương thức thanh toán khác để đảm bảo an toàn.',
  },
  {
    question: 'Làm thế nào để nhận được hóa đơn GTGT?',
    answer: 'Bạn có thể yêu cầu xuất hóa đơn GTGT khi: Đặt hàng (chọn "Xuất hóa đơn GTGT" và điền thông tin công ty), Sau khi đặt hàng (gọi hotline 1900 1234 hoặc email support@asiashop.vn), Hóa đơn GTGT sẽ được gửi qua email trong vòng 24-48 giờ sau khi đơn hàng được hoàn tất.',
  },
];

const securityFeatures = [
  {
    title: 'Mã hóa SSL',
    description: 'Mọi thông tin được mã hóa với chuẩn SSL 256-bit',
    icon: Shield,
  },
  {
    title: 'Bảo mật PCI-DSS',
    description: 'Tuân thủ tiêu chuẩn bảo mật ngành thẻ quốc tế',
    icon: Shield,
  },
  {
    title: 'Xác thực 2 yếu tố',
    description: 'Bảo mật tài khoản với lớp bảo vệ thêm',
    icon: Shield,
  },
  {
    title: 'Theo dõi giao dịch',
    description: 'Xem lại lịch sử tất cả giao dịch của bạn',
    icon: Shield,
  },
];

export default function PaymentHelpPage() {
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
                Phương thức thanh toán
              </h1>
              <p className="text-lg text-gray-600">
                Đa dạng phương thức thanh toán an toàn và tiện lợi
              </p>
            </div>

            {/* Payment Methods */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Các phương thức được chấp nhận</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{method.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{method.description}</p>
                          </div>
                          {method.available && (
                            <Badge variant="default" className="text-xs">
                              Available
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-1">
                            {method.features.map((feature, featureIndex) => (
                              <Badge key={featureIndex} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Thời gian xử lý:</span>
                            <span className="font-medium">{method.processingTime}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Installment Information */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Trả góp 0% lãi suất</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ngân hàng đối tác</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {installmentInfo.banks.map((bank, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div>
                            <div className="font-medium">{bank.name}</div>
                            <div className="text-muted-foreground">
                              {bank.periods.join(', ')} tháng
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Tối thiểu</div>
                            <div className="font-medium">{bank.minAmount}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Điều kiện trả góp</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {installmentInfo.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Security Features */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Bảo mật thanh toán</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {securityFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index}>
                      <CardContent className="p-4 text-center">
                        <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                        <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </CardContent>
                    </Card>
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
                      Hướng dẫn thanh toán an toàn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Không chia sẻ thông tin thẻ tín dụng với người khác</li>
                      <li>• Kiểm tra kỹ URL có phải asiashop.vn trước khi nhập thông tin</li>
                      <li>• Sử dụng mật khẩu mạnh và bật xác thực 2 yếu tố</li>
                      <li>• Kiểm tra lại thông tin đơn hàng trước khi thanh toán</li>
                      <li>• Lưu lại xác nhận đơn hàng sau khi thanh toán thành công</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* FAQ Section */}
            <section>
              <FAQSection
                title="Câu hỏi thường gặp về thanh toán"
                items={paymentFAQs}
              />
            </section>

            {/* Contact Support */}
            <section className="bg-muted/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Cần hỗ trợ thanh toán?</h2>
              <p className="text-muted-foreground mb-4">
                Nếu bạn gặp vấn đề với thanh toán, đội ngũ hỗ trợ của chúng tôi sẵn sàng giúp đỡ.
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
                  Chat với hỗ trợ
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
