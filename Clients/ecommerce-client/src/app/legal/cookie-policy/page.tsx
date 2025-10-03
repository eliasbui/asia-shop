import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie, Calendar, Users, AlertTriangle, Settings, Shield, Eye, Mail, Phone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính sách Cookie - AsiaShop',
  description: 'Chính sách sử dụng cookie của AsiaShop. Tìm hiểu về các loại cookie và cách chúng tôi sử dụng chúng.',
  keywords: 'cookie, chính sách cookie, bảo mật, dữ liệu, AsiaShop',
};

const cookieSections = [
  {
    id: 'chap-1',
    title: 'Chương 1: Giới thiệu về Cookie',
    content: [
      {
        subtitle: 'Điều 1: Cookie là gì?',
        text: 'Cookie là các tệp văn bản nhỏ được lưu trữ trên thiết bị của bạn khi bạn truy cập website. Chúng chứa thông tin giúp website nhận ra thiết bị của bạn và ghi nhớ các tùy chọn của bạn.'
      },
      {
        subtitle: 'Điều 2: Mục đích sử dụng Cookie',
        text: 'AsiaShop sử dụng cookie để:\n- Cải thiện trải nghiệm người dùng\n- Ghi nhớ thông tin đăng nhập\n- Cá nhân hóa nội dung\n- Phân tích hành vi sử dụng\n- Hiển thị quảng cáo phù hợp\n- Đảm bảo bảo mật website'
      }
    ]
  },
  {
    id: 'chap-2',
    title: 'Chương 2: Các loại Cookie',
    content: [
      {
        subtitle: 'Điều 3: Cookie thiết yếu',
        text: 'Đây là các cookie cần thiết để website hoạt động đúng cách. Chúng bao gồm:\n- Cookie xác thực người dùng\n- Cookie bảo mật\n- Cookie quản lý giỏ hàng\n- Cookie quản lý phiên làm việc\n\nBạn không thể từ chối các cookie này vì chúng cần thiết cho dịch vụ.'
      },
      {
        subtitle: 'Điều 4: Cookie hiệu suất',
        text: 'Các cookie này giúp chúng tôi hiểu cách website được sử dụng:\n- Cookie Google Analytics\n- Cookie theo dõi thời gian trang\n- Cookie theo dõi lỗi\n- Cookie đo lường hiệu suất'
      },
      {
        subtitle: 'Điều 5: Cookie chức năng',
        text: 'Các cookie này cho phép website cung cấp các tính năng nâng cao:\n- Cookie ghi nhớ ngôn ngữ\n- Cookie ghi nhớ khu vực\n- Cookie tùy chọn giao diện\n- Cookie video và media'
      },
      {
        subtitle: 'Điều 6: Cookie mục tiêu và quảng cáo',
        text: 'Các cookie này được sử dụng để hiển thị quảng cáo phù hợp:\n- Cookie Google Ads\n- Cookie Facebook Pixel\n- Cookie theo dõi chuyển đổi\n- Cookie nhận dạng đối tượng'
      }
    ]
  },
  {
    id: 'chap-3',
    title: 'Chương 3: Quản lý Cookie',
    content: [
      {
        subtitle: 'Điều 7: Đồng ý sử dụng Cookie',
        text: 'Khi bạn truy cập AsiaShop lần đầu tiên, chúng tôi sẽ hiển thị banner cookie để bạn có thể lựa chọn:\n- Chấp nhận tất cả cookie\n- Từ chối cookie không thiết yếu\n- Tùy chỉnh cài đặt cookie\n\nBạn có thể thay đổi lựa chọn bất kỳ lúc nào.'
      },
      {
        subtitle: 'Điều 8: Cách quản lý Cookie',
        text: 'Bạn có thể quản lý cookie thông qua:\n- Cài đặt trình duyệt web\n- Công cụ quản lý cookie của chúng tôi\n- Tiện ích mở rộng chống theo dõi\n- Cài đặt riêng tư trên thiết bị di động'
      }
    ]
  },
  {
    id: 'chap-4',
    title: 'Chương 4: Cookie của bên thứ ba',
    content: [
      {
        subtitle: 'Điều 9: Các đối tác Cookie',
        text: 'AsiaShop sử dụng cookie từ các đối tác sau:\n- Google (Analytics, Ads)\n- Facebook/Meta (Pixel, Ads)\n- Zalo (Analytics, Ads)\n- MoMo (Thanh toán)\n- Các đối tác vận chuyển và logistics'
      },
      {
        subtitle: 'Điều 10: Chính sách của bên thứ ba',
        text: 'Mỗi đối tác có chính sách riêng về việc thu thập và sử dụng dữ liệu. Chúng tôi khuyến khích bạn đọc kỹ chính sách của họ để hiểu rõ hơn về cách dữ liệu của bạn được sử dụng.'
      }
    ]
  },
  {
    id: 'chap-5',
    title: 'Chương 5: Thời gian lưu trữ',
    content: [
      {
        subtitle: 'Điều 11: Thời gian lưu trữ Cookie',
        text: 'Các loại cookie có thời gian lưu trữ khác nhau:\n- Cookie phiên: Xóa khi đóng trình duyệt\n- Cookie cố định: Lưu trữ từ vài ngày đến vài năm\n- Cookie xác thực: Thường 30 ngày\n- Cookie tùy chọn: Thường 365 ngày'
      },
      {
        subtitle: 'Điều 12: Cập nhật chính sách',
        text: 'Chính sách cookie có thể được cập nhật khi chúng tôi thay đổi cách sử dụng cookie hoặc khi có yêu cầu pháp lý. Mọi thay đổi sẽ được thông báo trên website.'
      }
    ]
  }
];

const cookieTypes = [
  {
    name: 'Cookie Thiết Yếu',
    description: 'Cần thiết cho hoạt động website',
    examples: ['Xác thực', 'Giỏ hàng', 'Bảo mật'],
    required: true,
    duration: 'Phiên hoặc 30 ngày'
  },
  {
    name: 'Cookie Hiệu Suất',
    description: 'Giúp cải thiện website',
    examples: ['Google Analytics', 'Theo dõi lỗi'],
    required: false,
    duration: '2 năm'
  },
  {
    name: 'Cookie Chức Năng',
    description: 'Cung cấp tính năng nâng cao',
    examples: ['Ngôn ngữ', 'Khu vực', 'Giao diện'],
    required: false,
    duration: '1 năm'
  },
  {
    name: 'Cookie Quảng Cáo',
    description: 'Hiển thị quảng cáo phù hợp',
    examples: ['Google Ads', 'Facebook Pixel'],
    required: false,
    duration: '90 ngày'
  }
];

const tableOfContents = cookieSections.map((section, index) => ({
  id: section.id,
  title: `${index + 1}. ${section.title}`,
  subsections: section.content.map(item => item.subtitle)
}));

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumbs />
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Chính sách Cookie
            </h1>
            <p className="text-lg text-gray-600">
              Tìm hiểu về cách AsiaShop sử dụng cookie để cải thiện trải nghiệm của bạn.
            </p>
          </div>
        </div>

        {/* Cookie Banner Preview */}
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Cookie className="h-5 w-5" />
              Banner Cookie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-3">
                AsiaShop sử dụng cookie để cải thiện trải nghiệm của bạn. Vui lòng chọn tùy chọn của bạn:
              </p>
              <div className="flex gap-2">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Chấp nhận tất cả
                </Button>
                <Button size="sm" variant="outline">
                  Tùy chỉnh
                </Button>
                <Button size="sm" variant="ghost">
                  Từ chối
                </Button>
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

        {/* Cookie Types Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Các loại Cookie chúng tôi sử dụng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cookieTypes.map((type, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium">{type.name}</h3>
                    {type.required && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded">
                        Bắt buộc
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Ví dụ:</p>
                    <div className="flex flex-wrap gap-1">
                      {type.examples.map((example, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-xs rounded">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Thời gian lưu trữ: {type.duration}
                  </p>
                </div>
              ))}
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

        {/* Cookie Policy Content */}
        <div className="space-y-8">
          {cookieSections.map((section, sectionIndex) => (
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

        {/* How to Manage Cookies */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Cách quản lý Cookie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Trên trình duyệt desktop</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Chrome:</strong> Cài đặt → Quyền riêng tư và bảo mật → Cookie</p>
                  <p><strong>Firefox:</strong> Tùy chọn → Quyền riêng tư & Bảo mật → Cookie</p>
                  <p><strong>Safari:</strong> Tùy chọn → Quyền riêng tư → Cookie</p>
                  <p><strong>Edge:</strong> Cài đặt → Quyền riêng tư, tìm kiếm và dịch vụ → Cookie</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">Trên thiết bị di động</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>iOS Safari:</strong> Cài đặt → Safari → Chặn cookie</p>
                  <p><strong>Android Chrome:</strong> Cài đặt → Quyền riêng tư → Xóa dữ liệu duyệt web</p>
                  <p><strong>App Settings:</strong> Cài đặt ứng dụng → Xóa cache/cookie</p>
                </div>
              </div>
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
                Việc từ chối cookie có thể ảnh hưởng đến trải nghiệm sử dụng website một số tính năng có thể không hoạt động đúng cách.
              </p>
              <p>
                Chúng tôi thường xuyên cập nhật chính sách cookie. Vui lòng kiểm tra lại định kỳ để biết về những thay đổi mới nhất.
              </p>
              <p>
                Nếu bạn có câu hỏi về cách chúng tôi sử dụng cookie, vui lòng liên hệ với chúng tôi.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Cần hỗ trợ về Cookie?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="font-medium">Email hỗ trợ:</p>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>privacy@asiashop.vn</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Hotline hỗ trợ:</p>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>1900 1234</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                Cài đặt Cookie
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
              <Link href="/legal/privacy-policy" className="block text-sm hover:text-primary">
                • Chính sách bảo mật
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