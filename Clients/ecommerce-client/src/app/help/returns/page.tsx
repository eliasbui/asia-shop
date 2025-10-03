import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { HelpNavigation } from '@/components/help/HelpNavigation';
import { FAQSection } from '@/components/FAQSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Clock, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Đổi trả và Hoàn tiền - AsiaShop',
  description: 'Chính sách đổi trả sản phẩm, điều kiện đổi trả, quy trình hoàn tiền và các câu hỏi thường gặp tại AsiaShop.',
  keywords: 'đổi trả, hoàn tiền, chính sách đổi hàng, AsiaShop returns, refund policy',
};

const returnPolicy = {
  eligible: [
    'Sản phẩm bị lỗi từ nhà sản xuất',
    'Sản phẩm không đúng mô tả hoặc hình ảnh',
    'Sản phẩm sai size, màu sắc so với đơn đặt hàng',
    'Sản phẩm bị hư hỏng trong quá trình vận chuyển',
  ],
  notEligible: [
    'Quá 30 ngày kể từ ngày nhận hàng',
    'Sản phẩm đã qua sử dụng, bị trầy xước',
    'Thiếu tem nhãn, hộp đựng hoặc phụ kiện',
    'Sản phẩm khuyến mãi, giảm giá đặc biệt',
    'Sản phẩm nội y, đồ bơi (vì lý do vệ sinh)',
  ],
  timeline: '30 ngày kể từ ngày nhận hàng',
  condition: 'Sản phẩm chưa qua sử dụng, còn đầy đủ phụ kiện, tem nhãn và bao bì gốc',
};

const returnProcess = [
  {
    step: 1,
    title: 'Đơn đăng ký đổi trả',
    description: 'Điền vào form đăng ký đổi trả online hoặc gọi hotline',
    icon: FileText,
  },
  {
    step: 2,
    title: 'Xác nhận yêu cầu',
    description: 'AsiaShop xác nhận yêu cầu trong vòng 24 giờ',
    icon: CheckCircle,
  },
  {
    step: 3,
    title: 'Gửi sản phẩm',
    description: 'Gửi sản phẩm về AsiaShop theo hướng dẫn',
    icon: RefreshCw,
  },
  {
    step: 4,
    title: 'Kiểm tra sản phẩm',
    description: 'AsiaShop kiểm tra tình trạng sản phẩm',
    icon: AlertCircle,
  },
  {
    step: 5,
    title: 'Xử lý đổi trả',
    description: 'Gửi sản phẩm mới hoặc hoàn tiền',
    icon: CheckCircle,
  },
];

const refundMethods = [
  {
    method: 'Hoàn tiền vào tài khoản ngân hàng',
    time: '3-5 ngày làm việc',
    description: 'Tiền sẽ được chuyển về tài khoản bạn đã cung cấp',
    fee: 'Miễn phí',
  },
  {
    method: 'Hoàn tiền vào ví AsiaShop',
    time: 'Ngay lập tức',
    description: 'Tiền được cộng vào ví điện tử AsiaShop để dùng cho lần mua sau',
    fee: 'Miễn phí',
  },
  {
    method: 'Đổi sản phẩm mới',
    time: '5-7 ngày',
    description: 'Nhận sản phẩm mới tương tự hoặc cùng giá trị',
    fee: 'Miễn phí vận chuyển',
  },
];

const returnFAQs = [
  {
    question: 'Trong bao lâu tôi có thể yêu cầu đổi trả?',
    answer: 'Bạn có thể yêu cầu đổi trả trong vòng 30 ngày kể từ ngày nhận hàng. Điều kiện áp dụng: sản phẩm chưa qua sử dụng, còn đầy đủ tem nhãn, phụ kiện và bao bì gốc. Đối với sản phẩm điện tử, thời gian đổi trả lỗi là 7 ngày kể từ ngày mua.',
  },
  {
    question: 'Làm thế nào để yêu cầu đổi trả?',
    answer: 'Bạn có thể yêu cầu đổi trả bằng các cách sau: 1) Đăng nhập tài khoản và chọn "Đổi trả" trong đơn hàng tương ứng, 2) Điền form đăng ký đổi trả online, 3) Gọi hotline 1900 1234, 4) Email đến support@asiashop.vn. Chúng tôi sẽ phản hồi trong vòng 24 giờ.',
  },
  {
    question: 'Tôi có thể đổi trả sản phẩm đã qua sử dụng không?',
    answer: 'Sản phẩm đã qua sử dụng thường không được chấp nhận đổi trả, trừ trường hợp sản phẩm bị lỗi từ nhà sản xuất hoặc bị hư hỏng ngay khi nhận hàng. Sản phẩm phải còn đầy đủ phụ kiện, tem nhãn và không có dấu hiệu sử dụng.',
  },
  {
    question: 'Chi phí vận chuyển đổi trả là bao nhiêu?',
    answer: 'Nếu đổi trả do lỗi từ AsiaShop hoặc nhà sản xuất, chi phí vận chuyển hoàn toàn miễn phí. Nếu đổi trả do lý do cá nhân (không vừa size, không thích...), bạn sẽ phải chịu chi phí vận chuyển hai chiều.',
  },
  {
    question: 'Khi nào tôi sẽ nhận được tiền hoàn lại?',
    answer: 'Thời gian hoàn tiền phụ thuộc vào phương thức bạn chọn: Ví AsiaShop: ngay lập tức, Tài khoản ngân hàng: 3-5 ngày làm việc, Thẻ tín dụng/ghi nợ: 7-10 ngày làm việc. Thời gian có thể lâu hơn nếu cần thêm thời gian xác minh.',
  },
  {
    question: 'Tôi có thể đổi lấy sản phẩm khác không?',
    answer: 'Có, bạn có thể đổi lấy sản phẩm khác có giá trị cao hơn (trả thêm phần chênh lệch) hoặc thấp hơn (được hoàn lại phần chênh lệch). Sản phẩm đổi phải cùng loại hoặc có giá trị tương đương sản phẩm ban đầu.',
  },
];

export default function ReturnsHelpPage() {
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
                Đổi trả và Hoàn tiền
              </h1>
              <p className="text-lg text-gray-600">
                Chính sách đổi trả linh hoạt và quy trình hoàn tiền minh bạch
              </p>
            </div>

            {/* Return Policy Overview */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Chính sách đổi trả</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      Điều kiện được đổi trả
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {returnPolicy.eligible.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                      <XCircle className="h-5 w-5" />
                      Trường hợp không được đổi trả
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {returnPolicy.notEligible.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-900">Thời gian đổi trả</div>
                        <div className="text-sm text-blue-700">{returnPolicy.timeline}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-green-900">Tình trạng sản phẩm</div>
                        <div className="text-sm text-green-700">{returnPolicy.condition}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Return Process */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Quy trình đổi trả</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {returnProcess.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="relative mb-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto">
                          <Icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        {index < returnProcess.length - 1 && (
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

            {/* Refund Methods */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Phương thức hoàn tiền</h2>
              <div className="space-y-4">
                {refundMethods.map((method, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{method.method}</CardTitle>
                          <CardDescription className="mt-1">{method.description}</CardDescription>
                        </div>
                        <Badge variant={method.time === 'Ngay lập tức' ? 'default' : 'secondary'}>
                          {method.time}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Phí dịch vụ:</span>
                        <span className="font-medium text-green-600">{method.fee}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                      Lưu ý khi đổi trả
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Giữ lại hóa đơn mua hàng và phiếu bảo hành (nếu có)</li>
                      <li>• Chụp ảnh sản phẩm trước khi gửi trả để làm bằng chứng</li>
                      <li>• Đóng gói sản phẩm cẩn thận để tránh hư hỏng khi vận chuyển</li>
                      <li>• Sử dụng dịch vụ vận chuyển được AsiaShop chỉ định</li>
                      <li>• Lưu mã tracking để theo dõi hành trình trả hàng</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* FAQ Section */}
            <section>
              <FAQSection
                title="Câu hỏi thường gặp về đổi trả"
                items={returnFAQs}
              />
            </section>

            {/* CTA Section */}
            <section className="bg-muted/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Sẵn sàng đổi trả?</h2>
              <p className="text-muted-foreground mb-4">
                Nếu bạn muốn yêu cầu đổi trả, hãy bắt đầu bằng việc điền vào đơn đăng ký của chúng tôi.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-primary">
                  Đăng ký đổi trả online
                </Button>
                <Button variant="outline" asChild>
                  <a href="tel:19001234">Gọi hotline hỗ trợ</a>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}