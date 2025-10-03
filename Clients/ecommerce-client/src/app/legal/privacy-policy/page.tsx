import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Calendar, Users, AlertTriangle, Lock, Eye, Mail, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật - AsiaShop',
  description: 'Chính sách bảo mật thông tin cá nhân của AsiaShop. Cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.',
  keywords: 'bảo mật, thông tin cá nhân, dữ liệu, privacy, AsiaShop',
};

const privacySections = [
  {
    id: 'chap-1',
    title: 'Chương 1: Giới thiệu',
    content: [
      {
        subtitle: 'Điều 1: Cam kết bảo mật',
        text: 'AsiaShop cam kết bảo vệ thông tin cá nhân của người dùng theo quy định của pháp luật Việt Nam và các tiêu chuẩn quốc tế về bảo mật dữ liệu. Chúng tôi hiểu rằng sự tin tưởng của bạn là quan trọng nhất.'
      },
      {
        subtitle: 'Điều 2: Phạm vi áp dụng',
        text: 'Chính sách bảo mật này áp dụng cho tất cả thông tin cá nhân thu thập thông qua website asiashop.vn, ứng dụng di động, và các kênh liên quan của AsiaShop.'
      }
    ]
  },
  {
    id: 'chap-2',
    title: 'Chương 2: Thu thập thông tin',
    content: [
      {
        subtitle: 'Điều 3: Thông tin thu thập',
        text: 'Chúng tôi thu thập các loại thông tin sau:\n- Thông tin cá nhân: Họ tên, ngày sinh, giới tính, địa chỉ email, số điện thoại, địa chỉ\n- Thông tin tài khoản: Tên đăng nhập, mật khẩu (đã mã hóa)\n- Thông tin giao dịch: Lịch sử mua hàng, phương thức thanh toán, địa chỉ giao hàng\n- Thông tin thiết bị: Địa chỉ IP, loại trình duyệt, hệ điều hành, thông tin thiết bị\n- Thông tin sử dụng: Lịch sử duyệt web, tìm kiếm, sản phẩm đã xem'
      },
      {
        subtitle: 'Điều 4: Phương thức thu thập',
        text: 'Thông tin được thu thập thông qua:\n- Đăng ký tài khoản\n- Đặt hàng và thanh toán\n- Tương tác với website\n- Cookie và các công nghệ tương tự\n- Khảo sát và phản hồi của khách hàng'
      }
    ]
  },
  {
    id: 'chap-3',
    title: 'Chương 3: Sử dụng thông tin',
    content: [
      {
        subtitle: 'Điều 5: Mục đích sử dụng',
        text: 'Chúng tôi sử dụng thông tin của bạn cho các mục đích sau:\n- Xử lý và hoàn tất đơn hàng\n- Cung cấp dịch vụ khách hàng\n- Cá nhân hóa trải nghiệm mua sắm\n- Gửi thông tin khuyến mãi và tin tức\n- Cải thiện sản phẩm và dịch vụ\n- Bảo mật và phòng chống gian lận'
      },
      {
        subtitle: 'Điều 6: Cơ sở pháp lý',
        text: 'Việc xử lý thông tin cá nhân dựa trên các cơ sở pháp lý sau:\n- Sự đồng ý của người dùng\n- Thực hiện hợp đồng mua bán\n- Tuân thủ nghĩa vụ pháp lý\n- Bảo vệ lợi ích chính đáng của các bên'
      }
    ]
  },
  {
    id: 'chap-4',
    title: 'Chương 4: Chia sẻ và tiết lộ thông tin',
    content: [
      {
        subtitle: 'Điều 7: Các bên nhận thông tin',
        text: 'Chúng tôi có thể chia sẻ thông tin của bạn với:\n- Đơn vị vận chuyển để giao hàng\n- Đơn vị thanh toán để xử lý giao dịch\n- Đối tác kinh doanh để cung cấp dịch vụ\n- Cơ quan nhà nước khi có yêu cầu pháp lý\n- Các bên thứ ba được ủy quyền'
      },
      {
        subtitle: 'Điều 8: Bán thông tin',
        text: 'AsiaShop cam kết không bán, cho thuê hoặc chuyển nhượng thông tin cá nhân của bạn cho bên thứ ba mà không có sự đồng ý của bạn, trừ các trường hợp theo quy định của pháp luật.'
      }
    ]
  },
  {
    id: 'chap-5',
    title: 'Chương 5: Bảo mật thông tin',
    content: [
      {
        subtitle: 'Điều 9: Biện pháp bảo mật',
        text: 'Chúng tôi áp dụng các biện pháp bảo mật sau:\n- Mã hóa dữ liệu với SSL/TLS\n- Tường lửa và hệ thống chống xâm nhập\n- Kiểm soát truy cập dựa trên vai trò\n- Sao lưu dữ liệu định kỳ\n- Đào tạo nhân viên về bảo mật\n- Kiểm tra và đánh giá bảo mật thường xuyên'
      },
      {
        subtitle: 'Điều 10: Lưu trữ thông tin',
        text: 'Thông tin cá nhân được lưu trữ trong thời gian cần thiết để thực hiện các mục đích thu thập hoặc theo yêu cầu của pháp luật. Thời gian lưu trữ tối đa là 10 năm kể từ ngày kết thúc quan hệ với người dùng.'
      }
    ]
  },
  {
    id: 'chap-6',
    title: 'Chương 6: Quyền của người dùng',
    content: [
      {
        subtitle: 'Điều 11: Quyền truy cập',
        text: 'Bạn có quyền yêu cầu truy cập thông tin cá nhân mà chúng tôi lưu trữ về bạn. Chúng tôi sẽ cung cấp thông tin này trong vòng 15 ngày làm việc kể từ ngày nhận yêu cầu.'
      },
      {
        subtitle: 'Điều 12: Quyền chỉnh sửa và xóa',
        text: 'Bạn có quyền yêu cầu chỉnh sửa hoặc xóa thông tin cá nhân không chính xác hoặc không còn cần thiết. Chúng tôi sẽ xử lý yêu cầu này trong vòng 15 ngày làm việc.'
      },
      {
        subtitle: 'Điều 13: Quyền phản đối',
        text: 'Bạn có quyền phản đối việc xử lý thông tin cá nhân của mình cho các mục đích marketing hoặc các mục đích khác theo quy định của pháp luật.'
      }
    ]
  },
  {
    id: 'chap-7',
    title: 'Chương 7: Cookie và công nghệ tương tự',
    content: [
      {
        subtitle: 'Điều 14: Sử dụng Cookie',
        text: 'Chúng tôi sử dụng cookie để:\n- Ghi nhớ thông tin đăng nhập\n- Cá nhân hóa trải nghiệm\n- Phân tích hành vi người dùng\n- Hiển thị quảng cáo phù hợp\nBạn có thể quản lý cookie trong cài đặt trình duyệt.'
      },
      {
        subtitle: 'Điều 15: Các công nghệ khác',
        text: 'Ngoài cookie, chúng tôi có thể sử dụng các công nghệ theo dõi như web beacons, pixel tags và localStorage để cải thiện dịch vụ.'
      }
    ]
  },
  {
    id: 'chap-8',
    title: 'Chương 8: Thay đổi chính sách',
    content: [
      {
        subtitle: 'Điều 16: Cập nhật chính sách',
        text: 'Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. Mọi thay đổi sẽ được thông báo trên website và có hiệu lực sau 7 ngày kể từ ngày thông báo.'
      },
      {
        subtitle: 'Điều 17: Liên hệ',
        text: 'Nếu bạn có câu hỏi về chính sách bảo mật này, vui lòng liên hệ:\n- Email: privacy@asiashop.vn\n- Điện thoại: 1900 1234\n- Địa chỉ: 123 Nguyễn Huệ, Quận 1, TP.HCM'
      }
    ]
  }
];

const tableOfContents = privacySections.map((section, index) => ({
  id: section.id,
  title: `${index + 1}. ${section.title}`,
  subsections: section.content.map(item => item.subtitle)
}));

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumbs />
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Chính sách bảo mật
            </h1>
            <p className="text-lg text-gray-600">
              AsiaShop cam kết bảo vệ thông tin cá nhân của bạn. Tìm hiểu cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Shield className="h-5 w-5" />
              Cam kết bảo mật
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <Lock className="h-8 w-8 text-green-600" />
                <span className="text-sm font-medium text-green-800">Mã hóa SSL/TLS</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Eye className="h-8 w-8 text-green-600" />
                <span className="text-sm font-medium text-green-800">Kiểm soát truy cập</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Users className="h-8 w-8 text-green-600" />
                <span className="text-sm font-medium text-green-800">Tuân thủ pháp luật</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Cập nhật lần cuối: 01 tháng 10 năm 2024
            </div>
          </CardContent>
        </Card>

        {/* Table of Contents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Mục lục
            </CardTitle>
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

        {/* Privacy Content */}
        <div className="space-y-8">
          {privacySections.map((section, sectionIndex) => (
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

        {/* Important Notice */}
        <Card className="mt-12 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              Lưu ý quan trọng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-amber-700">
              <p>
                Bằng cách sử dụng dịch vụ của AsiaShop, bạn đồng ý với việc thu thập và sử dụng thông tin cá nhân theo chính sách này.
              </p>
              <p>
                Chúng tôi khuyên bạn không nên chia sẻ thông tin đăng nhập với người khác và nên đăng xuất sau khi sử dụng dịch vụ trên các thiết bị công cộng.
              </p>
              <p>
                Nếu bạn phát hiện bất kỳ hoạt động đáng ngờ nào liên quan đến tài khoản của mình, vui lòng liên hệ ngay với chúng tôi.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Cần hỗ trợ về bảo mật?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="font-medium">Email bảo mật:</p>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>privacy@asiashop.vn</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Hotline bảo mật:</p>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>1900 1234 (nhánh 2)</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                Yêu cầu quyền riêng tư
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
              <Link href="/legal/cookie-policy" className="block text-sm hover:text-primary">
                • Chính sách Cookie
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