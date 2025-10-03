import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Calendar, Users, AlertTriangle, Clock, MapPin, Package, Mail, Phone, CreditCard } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chính sách vận chuyển - AsiaShop',
  description: 'Chính sách vận chuyển và giao hàng của AsiaShop. Phương thức vận chuyển, thời gian và chi phí.',
  keywords: 'vận chuyển, giao hàng, shipping, chính sách, AsiaShop',
};

const shippingSections = [
  {
    id: 'chap-1',
    title: 'Chương 1: Phạm vi vận chuyển',
    content: [
      {
        subtitle: 'Điều 1: Khu vực giao hàng',
        text: 'AsiaShop giao hàng trên toàn lãnh thổ Việt Nam, bao gồm:\n- 63 tỉnh thành phố\n- Các hải đảo lớn (Phú Quốc, Côn Đảo, Bà Lụa)\n- Các khu vực đặc biệt (khu công nghiệp, khu chế xuất)\n- Các khu vực nông thôn, miền núi xa xôi'
      },
      {
        subtitle: 'Điều 2: Hạn chế giao hàng',
        text: 'Chúng tôi không thể giao hàng đến các khu vực sau:\n- Các vùng biên giới hạn chế\n- Các khu vực quân sự, an ninh đặc biệt\n- Các hải đảo nhỏ không có dịch vụ vận chuyển thường xuyên\n- Các khu vực đang bị thiên tai, dịch bệnh'
      }
    ]
  },
  {
    id: 'chap-2',
    title: 'Chương 2: Phương thức vận chuyển',
    content: [
      {
        subtitle: 'Điều 3: Vận chuyển tiêu chuẩn',
        text: 'Phương thức vận chuyển phổ biến nhất:\n- Thời gian giao hàng: 2-5 ngày làm việc\n- Phí vận chuyển: 15.000 - 35.000 VNĐ\n- Đối tác: Viettel Post, Giao Hàng Nhanh, J&T Express\n- Áp dụng cho đơn hàng dưới 2kg'
      },
      {
        subtitle: 'Điều 4: Vận chuyển nhanh',
        text: 'Phương thức giao hàng nhanh chóng:\n- Thời gian giao hàng: 1-2 ngày làm việc\n- Phí vận chuyển: 25.000 - 55.000 VNĐ\n- Đối tác: Giao Hàng Nhanh, J&T Express\n- Áp dụng cho các thành phố lớn'
      },
      {
        subtitle: 'Điều 5: Vận chuyển hỏa tốc',
        text: 'Phương thức giao hàng khẩn cấp:\n- Thời gian giao hàng: 4-8 giờ\n- Phí vận chuyển: 50.000 - 150.000 VNĐ\n- Đối tác: Ahamove, Grab Express\n- Chỉ áp dụng nội thành Hà Nội, TP.HCM'
      },
      {
        subtitle: 'Điều 6: Nhận hàng tại cửa hàng',
        text: 'Khách hàng có thể nhận hàng tại:\n- Cửa hàng chính: 123 Nguyễn Huệ, Q1, TP.HCM\n- Cửa hàng chi nhánh: 456 Trần Hưng Đạo, Q5, TP.HCM\n- Thời gian chuẩn bị: 2-4 giờ sau khi đặt hàng\n- Miễn phí vận chuyển'
      }
    ]
  },
  {
    id: 'chap-3',
    title: 'Chương 3: Thời gian giao hàng',
    content: [
      {
        subtitle: 'Điều 7: Thời gian xử lý đơn hàng',
        text: 'Thời gian xử lý đơn hàng trước khi giao:\n- Đơn hàng thường: 12-24 giờ\n- Đơn hàng có sản phẩm điện tử: 24-48 giờ\n- Đơn hàng đặt trước: Theo thông báo\n- Đơn hàng trong ngày: Trước 12h trưa'
      },
      {
        subtitle: 'Điều 8: Thời gian giao hàng theo khu vực',
        text: 'Thời gian giao hàng ước tính:\n- Nội thành Hà Nội, TP.HCM: 1-2 ngày\n- Các thành phố lớn khác: 2-3 ngày\n- Tỉnh thành đồng bằng: 3-4 ngày\n- Tỉnh thành miền núi: 4-6 ngày\n- Hải đảo: 5-7 ngày'
      }
    ]
  },
  {
    id: 'chap-4',
    title: 'Chương 4: Chi phí vận chuyển',
    content: [
      {
        subtitle: 'Điều 9: Bảng giá vận chuyển',
        text: 'Chi phí vận chuyển được tính theo:\n- Trọng lượng sản phẩm\n- Khoảng cách giao hàng\n- Phương thức vận chuyển\n- Đơn hàng trên 500.000 VNĐ: Miễn phí vận chuyển tiêu chuẩn\n- Đơn hàng trên 1.000.000 VNĐ: Miễn phí vận chuyển nhanh'
      },
      {
        subtitle: 'Điều 10: Phụ thu vận chuyển',
        text: 'Các loại phí phụ thu có thể áp dụng:\n- Phụ thu khu vực xa xôi: 10.000 - 30.000 VNĐ\n- Phụ thu hàng hóa dễ vỡ: 5.000 - 15.000 VNĐ\n- Phụ thu vận chuyển vào Chủ nhật: 10.000 VNĐ\n- Phụ thu giao hàng theo giờ yêu cầu: 20.000 VNĐ'
      }
    ]
  },
  {
    id: 'chap-5',
    title: 'Chương 5: Quy trình giao hàng',
    content: [
      {
        subtitle: 'Điều 11: Các bước giao hàng',
        text: 'Quy trình giao hàng tiêu chuẩn:\n1. AsiaShop xác nhận đơn hàng\n2. Đóng gói sản phẩm cẩn thận\n3. Giao cho đơn vị vận chuyển\n4. Cung cấp mã vận đơn cho khách\n5. Nhân viên giao hàng liên hệ trước khi giao\n6. Khách hàng kiểm tra và ký nhận hàng'
      },
      {
        subtitle: 'Điều 12: Yêu cầu khi nhận hàng',
        text: 'Khách hàng nên:\n- Kiểm tra tình trạng bên ngoài gói hàng\n- Quay video unboxing (đặc biệt sản phẩm đắt tiền)\n- Kiểm tra sản phẩm trước khi thanh toán\n- Yêu cầu đổi trả nếu sản phẩm bị hư hỏng\n- Lưu lại hóa đơn, phiếu giao hàng'
      }
    ]
  },
  {
    id: 'chap-6',
    title: 'Chương 6: Các trường hợp đặc biệt',
    content: [
      {
        subtitle: 'Điều 13: Giao hàng không thành công',
        text: 'Các trường hợp giao hàng không thành công:\n- Khách hàng không có tại địa chỉ\n- Số điện thoại không liên lạc được\n- Khách hàng từ chối nhận hàng\n- Địa chỉ không chính xác hoặc không tìm thấy\n\nAsiaShop sẽ liên hệ lại để thống nhất thời gian giao hàng mới.'
      },
      {
        subtitle: 'Điều 14: Mất mát, hư hỏng trong vận chuyển',
        text: 'Trong trường hợp hàng hóa bị mất mát hoặc hư hỏng:\n- AsiaShop sẽ chịu trách nhiệm 100%\n- Hoàn tiền ngay lập tức hoặc gửi lại hàng mới\n- Không thu thêm chi phí nào từ khách hàng\n- Yêu cầu bằng chứng khi nhận hàng (nếu có)'
      }
    ]
  }
];

const shippingMethods = [
  {
    name: 'Tiêu chuẩn',
    description: 'Giao hàng trong 2-5 ngày',
    price: '15.000 - 35.000 VNĐ',
    areas: 'Toàn quốc',
    icon: Truck,
    popular: false
  },
  {
    name: 'Nhanh',
    description: 'Giao hàng trong 1-2 ngày',
    price: '25.000 - 55.000 VNĐ',
    areas: 'Thành phố lớn',
    icon: Package,
    popular: true
  },
  {
    name: 'Hỏa tốc',
    description: 'Giao hàng trong 4-8 giờ',
    price: '50.000 - 150.000 VNĐ',
    areas: 'Nội thành',
    icon: Clock,
    popular: false
  },
  {
    name: 'Tại cửa hàng',
    description: 'Nhận tại cửa hàng',
    price: 'Miễn phí',
    areas: 'TP.HCM',
    icon: MapPin,
    popular: false
  }
];

const shippingTimeline = [
  {
    area: 'Nội thành Hà Nội, TP.HCM',
    time: '1-2 ngày',
    icon: '🏙️'
  },
  {
    area: 'Thành phố lớn khác',
    time: '2-3 ngày',
    icon: '🌆'
  },
  {
    area: 'Tỉnh thành đồng bằng',
    time: '3-4 ngày',
    icon: '🏘️'
  },
  {
    area: 'Tỉnh thành miền núi',
    time: '4-6 ngày',
    icon: '⛰️'
  },
  {
    area: 'Hải đảo',
    time: '5-7 ngày',
    icon: '🏝️'
  }
];

const tableOfContents = shippingSections.map((section, index) => ({
  id: section.id,
  title: `${index + 1}. ${section.title}`,
  subsections: section.content.map(item => item.subtitle)
}));

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumbs />
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Chính sách vận chuyển
            </h1>
            <p className="text-lg text-gray-600">
              AsiaShop cung cấp dịch vụ vận chuyển nhanh chóng, an toàn trên toàn quốc với chi phí hợp lý.
            </p>
          </div>
        </div>

        {/* Shipping Methods */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Phương thức vận chuyển</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shippingMethods.map((method, index) => (
              <Card key={index} className={`${method.popular ? 'border-blue-200 bg-blue-50' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <method.icon className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">{method.name}</h3>
                    </div>
                    {method.popular && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded">
                        Phổ biến
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Chi phí:</span>
                      <span className="font-medium">{method.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Khu vực:</span>
                      <span className="font-medium">{method.areas}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Shipping Timeline */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Thời gian giao hàng theo khu vực
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shippingTimeline.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h4 className="font-medium text-sm">{item.area}</h4>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
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

        {/* Shipping Policy Content */}
        <div className="space-y-8">
          {shippingSections.map((section, sectionIndex) => (
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

        {/* Free Shipping Info */}
        <Card className="mt-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Package className="h-5 w-5" />
              Miễn phí vận chuyển
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-700">
              <div>
                <h4 className="font-medium mb-2">Đơn hàng từ 500.000 VNĐ</h4>
                <p className="text-sm">Miễn phí vận chuyển tiêu chuẩn trên toàn quốc</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Đơn hàng từ 1.000.000 VNĐ</h4>
                <p className="text-sm">Miễn phí vận chuyển nhanh cho các thành phố lớn</p>
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
                Thời gian giao hàng có thể thay đổi do điều kiện thời tiết, thiên tai hoặc các yếu tố bất khả kháng khác.
              </p>
              <p>
                Khách hàng nên kiểm tra kỹ sản phẩm trước khi nhận hàng và ký nhận. AsiaShop sẽ không chịu trách nhiệm cho các khiếu nại sau khi đã ký nhận hàng.
              </p>
              <p>
                Trong trường hợp không có mặt tại thời điểm giao hàng, vui lòng liên hệ với đơn vị vận chuyển để sắp xếp lại thời gian giao hàng.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Cần hỗ trợ vận chuyển?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="font-medium">Hotline vận chuyển:</p>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>1900 1234 (nhánh 4)</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Email hỗ trợ:</p>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>shipping@asiashop.vn</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                Theo dõi đơn hàng
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
              <Link href="/legal/refund-policy" className="block text-sm hover:text-primary">
                • Chính sách đổi trả
              </Link>
              <Link href="/legal/terms-of-service" className="block text-sm hover:text-primary">
                • Điều khoản sử dụng
              </Link>
              <Link href="/help/shipping" className="block text-sm hover:text-primary">
                • Hướng dẫn theo dõi đơn hàng
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