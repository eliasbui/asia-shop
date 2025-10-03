import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { HelpNavigation } from '@/components/help/HelpNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Clock,
  Send,
  Headphones,
  Users,
  Globe,
  Facebook,
  Zalo,
  MessageCircle
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Liên hệ hỗ trợ - AsiaShop',
  description: 'Liên hệ đội ngũ hỗ trợ AsiaShop để được giải đáp thắc mắc và hỗ trợ nhanh chóng.',
  keywords: 'liên hệ, hỗ trợ, customer service, AsiaShop',
};

const contactMethods = [
  {
    id: 'hotline',
    title: 'Hotline',
    description: 'Hỗ trợ 24/7',
    icon: Phone,
    value: '1900 1234',
    status: 'online',
    responseTime: 'Ngay lập tức',
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 'email',
    title: 'Email',
    description: 'Phản hồi trong 24 giờ',
    icon: Mail,
    value: 'support@asiashop.vn',
    status: 'online',
    responseTime: '2-4 giờ',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'livechat',
    title: 'Live Chat',
    description: 'Hỗ trợ trực tuyến',
    icon: MessageSquare,
    value: 'Bắt đầu chat',
    status: 'online',
    responseTime: '5-10 phút',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: 'social',
    title: 'Mạng xã hội',
    description: 'Kết nối nhanh',
    icon: Globe,
    value: 'Facebook, Zalo',
    status: 'online',
    responseTime: '15-30 phút',
    color: 'bg-orange-100 text-orange-600',
  },
];

const supportDepartments = [
  {
    name: 'Hỗ trợ khách hàng',
    email: 'support@asiashop.vn',
    phone: '1900 1234 (nhánh 1)',
    hours: '8:00 - 22:00 (T2 - CN)',
    description: 'Đặt hàng, đổi trả, vận chuyển'
  },
  {
    name: 'Kỹ thuật',
    email: 'tech@asiashop.vn',
    phone: '1900 1234 (nhánh 2)',
    hours: '8:00 - 18:00 (T2 - T6)',
    description: 'Lỗi website, ứng dụng, thanh toán'
  },
  {
    name: 'Bảo hành',
    email: 'warranty@asiashop.vn',
    phone: '1900 1234 (nhánh 3)',
    hours: '8:00 - 18:00 (T2 - T6)',
    description: 'Bảo hành, sửa chữa, đổi mới'
  },
  {
    name: 'Đối tác',
    email: 'partner@asiashop.vn',
    phone: '1900 1234 (nhánh 4)',
    hours: '9:00 - 17:00 (T2 - T6)',
    description: 'Hợp tác kinh doanh, marketing'
  },
];

const socialChannels = [
  {
    name: 'Facebook',
    icon: Facebook,
    handle: '@AsiaShopVN',
    link: 'https://facebook.com/asiashopvn',
    color: 'text-blue-600',
  },
  {
    name: 'Zalo',
    icon: MessageCircle,
    handle: '090 123 4567',
    link: 'https://zalo.me/0901234567',
    color: 'text-blue-500',
  },
  {
    name: 'Website',
    icon: Globe,
    handle: 'asiashop.vn',
    link: 'https://asiashop.vn',
    color: 'text-gray-600',
  },
];

const storeLocations = [
  {
    name: 'Chi nhánh chính - TP.HCM',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    phone: '(028) 3821 2345',
    hours: '8:00 - 22:00 hàng ngày',
  },
  {
    name: 'Chi nhánh Hà Nội',
    address: '456 Trần Hưng Đạo, Quận Hoàn Kiếm, Hà Nội',
    phone: '(024) 3771 2345',
    hours: '8:00 - 22:00 hàng ngày',
  },
  {
    name: 'Chi nhận Đà Nẵng',
    address: '789 Lê Duẩn, Quận Hải Châu, Đà Nẵng',
    phone: '(0236) 3821 2345',
    hours: '8:00 - 21:00 hàng ngày',
  },
];

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <HelpNavigation />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Header */}
            <div>
              <Breadcrumbs />
              <div className="mt-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Liên hệ hỗ trợ
                </h1>
                <p className="text-lg text-gray-600">
                  Đội ngũ hỗ trợ AsiaShop luôn sẵn sàng giúp đỡ bạn 24/7. Hãy chọn phương thức liên hệ phù hợp nhất.
                </p>
              </div>
            </div>

            {/* Quick Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactMethods.map((method) => (
                <Card key={method.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-lg ${method.color} flex items-center justify-center`}>
                        <method.icon className="h-6 w-6" />
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded">
                        {method.status}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <p className="font-medium">{method.value}</p>
                      <p className="text-sm text-muted-foreground">
                        Thời gian phản hồi: {method.responseTime}
                      </p>
                    </div>
                    <Button className="w-full mt-3">
                      {method.id === 'livechat' ? 'Bắt đầu chat' : 'Liên hệ ngay'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Gửi yêu cầu hỗ trợ
                </CardTitle>
                <CardDescription>
                  Điền thông tin chi tiết để chúng tôi có thể hỗ trợ bạn tốt nhất
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Họ và tên *</Label>
                    <Input id="name" placeholder="Nhập họ và tên của bạn" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="email@example.com" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" placeholder="090 123 4567" />
                  </div>
                  <div>
                    <Label htmlFor="order">Mã đơn hàng (nếu có)</Label>
                    <Input id="order" placeholder="AS123456" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Chủ đề *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chủ đề" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order">Đặt hàng & Thanh toán</SelectItem>
                      <SelectItem value="shipping">Vận chuyển & Giao hàng</SelectItem>
                      <SelectItem value="returns">Đổi trả & Hoàn tiền</SelectItem>
                      <SelectItem value="warranty">Bảo hành & Sửa chữa</SelectItem>
                      <SelectItem value="account">Tài khoản & Bảo mật</SelectItem>
                      <SelectItem value="technical">Lỗi kỹ thuật</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority">Mức độ ưu tiên</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn mức độ ưu tiên" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Thấp - Không khẩn cấp</SelectItem>
                      <SelectItem value="medium">Trung bình - Cần hỗ trợ</SelectItem>
                      <SelectItem value="high">Cao - Khẩn cấp</SelectItem>
                      <SelectItem value="critical">Rất cao - Rất khẩn cấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Nội dung *</Label>
                  <Textarea
                    id="message"
                    placeholder="Mô tả chi tiết vấn đề của bạn..."
                    rows={5}
                  />
                </div>

                <div>
                  <Label htmlFor="file">Tệp đính kèm (nếu có)</Label>
                  <Input id="file" type="file" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Chấp nhận các định dạng: JPG, PNG, PDF (Tối đa 5MB)
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1">
                    Gửi yêu cầu
                  </Button>
                  <Button variant="outline">
                    Lưu nháp
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Support Departments */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Phòng ban hỗ trợ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supportDepartments.map((dept, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{dept.name}</CardTitle>
                      <CardDescription>{dept.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{dept.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{dept.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{dept.hours}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Social Channels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Kết nối qua mạng xã hội
                </CardTitle>
                <CardDescription>
                  Theo dõi chúng tôi trên mạng xã hội để nhận thông tin khuyến mãi và hỗ trợ nhanh
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {socialChannels.map((social, index) => (
                    <Link key={index} href={social.link} className="block">
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3">
                            <social.icon className={`h-6 w-6 ${social.color}`} />
                            <div>
                              <p className="font-medium">{social.name}</p>
                              <p className="text-sm text-muted-foreground">{social.handle}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Store Locations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Hệ thống cửa hàng
                </CardTitle>
                <CardDescription>
                  Ghé thăm cửa hàng gần nhất để được hỗ trợ trực tiếp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {storeLocations.map((store, index) => (
                    <div key={index} className="border-b pb-4 last:border-0">
                      <h4 className="font-medium mb-2">{store.name}</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{store.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{store.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{store.hours}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}