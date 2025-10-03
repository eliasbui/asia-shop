import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Calendar, Users, AlertTriangle, Clock, CheckCircle, XCircle, Mail, Phone, CreditCard } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính sách đổi trả - AsiaShop',
  description: 'Chính sách đổi trả và hoàn tiền của AsiaShop. Điều kiện và quy trình đổi trả sản phẩm.',
  keywords: 'đổi trả, hoàn tiền, refund, chính sách, AsiaShop',
};

const refundSections = [
  {
    id: 'chap-1',
    title: 'Chương 1: Quy định chung',
    content: [
      {
        subtitle: 'Điều 1: Nguyên tắc đổi trả',
        text: 'AsiaShop cam kết mang đến sự hài lòng cho khách hàng. Chúng tôi áp dụng chính sách đổi trả linh hoạt, minh bạch và thuận tiện cho tất cả sản phẩm bán ra.'
      },
      {
        subtitle: 'Điều 2: Thời gian đổi trả',
        text: 'Khách hàng có quyền đổi trả sản phẩm trong vòng 30 ngày kể từ ngày nhận hàng. Đối với các sản phẩm điện tử, thời gian đổi trả có thể khác nhau theo chính sách của nhà sản xuất.'
      }
    ]
  },
  {
    id: 'chap-2',
    title: 'Chương 2: Điều kiện đổi trả',
    content: [
      {
        subtitle: 'Điều 3: Điều kiện chung',
        text: 'Sản phẩm có thể được đổi trả khi đáp ứng các điều kiện sau:\n- Sản phẩm còn nguyên tem, mác, nhãn hiệu\n- Sản phẩm chưa qua sử dụng hoặc bị hư hỏng\n- Còn đầy đủ phụ kiện, quà tặng đi kèm\n- Còn nguyên hộp đựng và bao bì\n- Cung cấp đầy đủ hóa đơn, chứng từ mua hàng'
      },
      {
        subtitle: 'Điều 4: Các trường hợp không áp dụng đổi trả',
        text: 'Các sản phẩm sau đây không được áp dụng chính sách đổi trả:\n- Sản phẩm đã qua sử dụng, có dấu hiệu hư hỏng\n- Sản phẩm bị trầy xước, móp méo nghiêm trọng\n- Thiếu phụ kiện hoặc quà tặng đi kèm\n- Các sản phẩm theo yêu cầu (đặt riêng)\n- Sản phẩm khuyến mãi, giảm giá sâu\n- Hàng hóa dễ hỏng, có hạn sử dụng ngắn\n- Sản phẩm vệ sinh cá nhân, nội y'
      }
    ]
  },
  {
    id: 'chap-3',
    title: 'Chương 3: Quy trình đổi trả',
    content: [
      {
        subtitle: 'Điều 5: Các bước thực hiện',
        text: 'Quy trình đổi trả sản phẩm gồm các bước sau:\n1. Liên hệ với AsiaShop qua hotline 1900 1234\n2. Cung cấp thông tin đơn hàng và lý do đổi trả\n3. Chụp ảnh sản phẩm (nếu cần)\n4. Nhân viên xác nhận yêu cầu đổi trả\n5. Gửi sản phẩm về kho của AsiaShop\n6. AsiaShop kiểm tra và xác nhận sản phẩm\n7. Xử lý đổi trả hoặc hoàn tiền'
      },
      {
        subtitle: 'Điều 6: Chi phí vận chuyển',
        text: 'Chi phí vận chuyển đổi trả:\n- Trường hợp lỗi từ AsiaShop: AsiaShop chịu toàn bộ chi phí\n- Trường hợp khách hàng đổi ý: Khách hàng chịu chi phí vận chuyển\n- Chi phí được hoàn trả cùng với tiền hàng (nếu áp dụng)'
      }
    ]
  },
  {
    id: 'chap-4',
    title: 'Chương 4: Phương thức hoàn tiền',
    content: [
      {
        subtitle: 'Điều 7: Các phương thức hoàn tiền',
        text: 'AsiaShop hỗ trợ các phương thức hoàn tiền sau:\n- Hoàn tiền vào tài khoản ngân hàng\n- Hoàn tiền vào ví điện tử (MoMo, ZaloPay, VNPay)\n- Tạo mã giảm giá cho lần mua tiếp theo\n- Đổi sản phẩm tương tự (nếu có hàng)\n\nThời gian xử lý hoàn tiền: 3-7 ngày làm việc.'
      },
      {
        subtitle: 'Điều 8: Lưu ý về hoàn tiền',
        text: 'Khi hoàn tiền, chúng tôi sẽ:\n- Trừ các chi phí phát sinh (nếu có)\n- Hoàn tiền theo giá trị tại thời điểm mua hàng\n- Gửi email xác nhận khi hoàn tiền thành công\n- Cung cấp mã giao dịch để bạn kiểm tra'
      }
    ]
  },
  {
    id: 'chap-5',
    title: 'Chương 5: Đổi trả sản phẩm lỗi',
    content: [
      {
        subtitle: 'Điều 9: Sản phẩm lỗi từ nhà sản xuất',
        text: 'Đối với sản phẩm lỗi từ nhà sản xuất:\n- Được bảo hành theo chính sách của hãng\n- Đổi trả miễn phí trong vòng 7 ngày\n- Hỗ trợ sửa chữa tại trung tâm bảo hành\n- Hoàn tiền 100% nếu không thể sửa chữa'
      },
      {
        subtitle: 'Điều 10: Sản phẩm giao nhầm',
        text: 'Nếu AsiaShop giao nhầm sản phẩm:\n- Chúng tôi sẽ đổi đúng sản phẩm miễn phí\n- Giao hàng nhanh nhất có thể\n- Tặng voucher giảm giá cho lần mua sau\n- Xin lỗi về sự bất tiện này'
      }
    ]
  },
  {
    id: 'chap-6',
    title: 'Chương 6: Các trường hợp đặc biệt',
    content: [
      {
        subtitle: 'Điều 11: Sản phẩm điện tử',
        text: 'Đối với sản phẩm điện tử:\n- Thời gian đổi trả: 7 ngày kể từ ngày mua\n- Phải còn nguyên hộp, đầy đủ phụ kiện\n- Không bị trầy xước, va đập\n- Cung cấp hóa đơn mua hàng'
      },
      {
        subtitle: 'Điều 12: Quần áo, thời trang',
        text: 'Đối với sản phẩm thời trang:\n- Thời gian đổi trả: 30 ngày\n- Chưa qua giặt ủi, không có mùi lạ\n- Còn nguyên tag, tem mác\n- Không bị bẩn, rách'
      }
    ]
  }
];

const returnProcess = [
  {
    step: 1,
    title: 'Liên hệ hỗ trợ',
    description: 'Gọi hotline 1900 1234 hoặc email support@asiashop.vn',
    icon: Phone,
    time: '5 phút'
  },
  {
    step: 2,
    title: 'Xác nhận yêu cầu',
    description: 'Nhân viên xác nhận thông tin và tạo yêu cầu đổi trả',
    icon: CheckCircle,
    time: '1-2 giờ'
  },
  {
    step: 3,
    title: 'Gửi sản phẩm',
    description: 'Gửi sản phẩm về địa chỉ chỉ định của AsiaShop',
    icon: RefreshCw,
    time: '1-3 ngày'
  },
  {
    step: 4,
    title: 'Kiểm tra sản phẩm',
    description: 'AsiaShop kiểm tra tình trạng sản phẩm',
    icon: Users,
    time: '1 ngày'
  },
  {
    step: 5,
    title: 'Xử lý đổi trả',
    description: 'Đổi sản phẩm mới hoặc hoàn tiền',
    icon: CreditCard,
    time: '3-5 ngày'
  }
];

const faqs = [
  {
    question: 'Tôi có thể đổi trả nếu sản phẩm không vừa size?',
    answer: 'Có, bạn có thể đổi trả sản phẩm không vừa size trong vòng 30 ngày nếu sản phẩm còn nguyên tem, tag và chưa qua sử dụng.'
  },
  {
    question: 'Chi phí vận chuyển đổi trả là bao nhiêu?',
    answer: 'Nếu lỗi từ phía AsiaShop, chúng tôi sẽ chịu toàn bộ chi phí. Nếu bạn đổi ý, bạn sẽ chịu chi phí vận chuyển.'
  },
  {
    question: 'Thời gian hoàn tiền mất bao lâu?',
    answer: 'Thời gian hoàn tiền thường từ 3-7 ngày làm việc, tùy thuộc vào phương thức hoàn tiền bạn chọn.'
  },
  {
    question: 'Tôi cần những giấy tờ gì để đổi trả?',
    answer: 'Bạn cần cung cấp hóa đơn mua hàng, phiếu bảo hành (nếu có) và giấy tờ tùy thân của người mua.'
  }
];

const tableOfContents = refundSections.map((section, index) => ({
  id: section.id,
  title: `${index + 1}. ${section.title}`,
  subsections: section.content.map(item => item.subtitle)
}));

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumbs />
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Chính sách đổi trả
            </h1>
            <p className="text-lg text-gray-600">
              AsiaShop cam kết mang đến sự hài lòng cho khách hàng với chính sách đổi trả linh hoạt và minh bạch.
            </p>
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold">30 ngày</h3>
              <p className="text-sm text-muted-foreground">Thời gian đổi trả</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <RefreshCw className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold">Miễn phí</h3>
              <p className="text-sm text-muted-foreground">Nếu lỗi từ AsiaShop</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <CreditCard className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold">3-7 ngày</h3>
              <p className="text-sm text-muted-foreground">Thời gian hoàn tiền</p>
            </CardContent>
          </Card>
          </div>

        {/* Last Updated */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Cập nhật lần cuối: 01 tháng 10 năm 2024
            </div>
          </CardContent>
        </Card>

        {/* Return Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Quy trình đổi trả
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {returnProcess.map((process) => (
                <div key={process.step} className="text-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold mx-auto mb-2">
                    {process.step}
                  </div>
                  <h4 className="font-medium text-sm mb-1">{process.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{process.description}</p>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{process.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Table of Contents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Mục lục</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tableOfContents.map((section) => (
                <div key={section.id} className="space-y-1">
                  <Link
                    href={`#${section.id}`}
                    className="block text-sm font-medium hover:text-primary transition-colors"
                  >
                    {section.title}
                  </Link>
                  {section.subsections.map((subsection, index) => (
                    <Link
                      key={index}
                      href={`#${section.id}-${index + 1}`}
                      className="block pl-4 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {index + 1}.1 {subsection}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Refund Policy Content */}
        <div className="space-y-8">
          {refundSections.map((section, sectionIndex) => (
            <div key={section.id} className="space-y-6">
              <div id={section.id} className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {sectionIndex + 1}. {section.title}
                </h2>
              </div>

              {section.content.map((item, itemIndex) => (
                <div
                  key={`${section.id}-${itemIndex + 1}`}
                  id={`${section.id}-${itemIndex + 1}`}
                  className="scroll-mt-24"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {sectionIndex + 1}.{itemIndex + 1} {item.subtitle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        {item.text.split('\n').map((paragraph, pIndex) => (
                          <p key={pIndex} className="mb-2 text-gray-600 leading-relaxed">
                            {paragraph.startsWith('-') ? (
                              <span className="ml-4">• {paragraph.substring(1).trim()}</span>
                            ) : paragraph.includes('\n') ? (
                              <span className="whitespace-pre-line">{paragraph}</span>
                            ) : (
                              paragraph
                            )}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Câu hỏi thường gặp về đổi trả</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b pb-4 last:border-0">
                  <h4 className="font-medium mb-2">{faq.question}</h4>
                  <p className="text-sm text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="mt-8 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              Lưu ý quan trọng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-amber-700">
              <p>
                Vui lòng kiểm tra kỹ sản phẩm trước khi nhận hàng. AsiaShop không chịu trách nhiệm cho các sản phẩm đã bị hư hỏng sau khi nhận hàng.
              </p>
              <p>
                Số lượng đổi trả bị giới hạn trong một số trường hợp để đảm bảo công bằng cho tất cả khách hàng.
              </p>
              <p>
                AsiaShop có quyền từ chối yêu cầu đổi trả nếu không đáp ứng đủ điều kiện quy định.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Cần hỗ trợ đổi trả?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="font-medium">Hotline đổi trả:</p>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>1900 1234 (nhánh 3)</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Email hỗ trợ:</p>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>returns@asiashop.vn</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                Tạo yêu cầu đổi trả
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Related Policies */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Chính sách liên quan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/legal/shipping-policy" className="block text-sm hover:text-primary">
                • Chính sách vận chuyển
              </Link>
              <Link href="/legal/terms-of-service" className="block text-sm hover:text-primary">
                • Điều khoản sử dụng
              </Link>
              <Link href="/help/contact" className="block text-sm hover:text-primary">
                • Liên hệ hỗ trợ
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Back to Legal */}
        <div className="mt-8 text-center">
          <Button variant="ghost" asChild>
            <Link href="/legal">
              ← Quay lại trang pháp lý
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}