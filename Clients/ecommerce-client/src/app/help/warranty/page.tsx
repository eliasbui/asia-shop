import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { HelpNavigation } from '@/components/help/HelpNavigation';
import { FAQSection } from '@/components/help/FAQSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  FileText,
  Search,
  Phone,
  Mail,
  Wrench,
  Package,
  Smartphone,
  Home,
  Shirt,
  Book,
  Star,
  Download,
  ExternalLink
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bảo hành sản phẩm - AsiaShop',
  description: 'Chính sách bảo hành chi tiết, quy trình bảo hành, trung tâm bảo hành uy tín và các câu hỏi thường gặp về bảo hành tại AsiaShop.',
  keywords: 'bảo hành, chính sách bảo hành, bảo hành điện tử, bảo hành sản phẩm, AsiaShop warranty',
};

const warrantyOverview = {
  standard: {
    title: 'Bảo hành tiêu chuẩn',
    period: '12 tháng',
    description: 'Bảo hành cho lỗi từ nhà sản xuất, bao gồm sửa chữa và thay thế linh kiện',
    coverage: 'Sửa chữa miễn phí các lỗi kỹ thuật, thay thế linh kiện chính hãng',
  },
  extended: {
    title: 'Bảo hành mở rộng',
    period: '24-36 tháng',
    description: 'Bảo hành tiêu chuẩn cộng thêm bảo vệ against tai nạn và hư hỏng do người dùng',
    coverage: 'Tất cả quyền lợi bảo hành tiêu chuẩn + bảo vệ rơi vỡ, vào nước, quá điện',
  },
  premium: {
    title: 'Bảo hành cao cấp',
    period: '48 tháng',
    description: 'Dịch vụ bảo hành ưu tiên với hỗ trợ tại nhà và đổi mới trong 24 giờ',
    coverage: 'Tất cả quyền lợi + hỗ trợ tại nhà, đổi mới sản phẩm tương đương',
  },
};

const productCategories = [
  {
    name: 'Điện tử & Điện thoại',
    icon: Smartphone,
    warrantyPeriod: '12-24 tháng',
    coverage: [
      'Lỗi nhà sản xuất (12 tháng)',
      'Pin và sạc (6 tháng)',
      'Màn hình cảm ứng (12 tháng)',
      'Phần cứng chính (24 tháng)',
    ],
    exclusions: [
      'Hư hỏng do rơi rớt, va đập',
      'Vào nước, tiếp xúc chất lỏng',
      'Sửa chữa không chính hãng',
      'Hao mòn tự nhiên',
    ],
    specialNotes: 'Sản phẩm Apple: bảo hành 12 tháng, hỗ trợ kỹ thuật 90 ngày',
  },
  {
    name: 'Gia dụng & Nội thất',
    icon: Home,
    warrantyPeriod: '24-36 tháng',
    coverage: [
      'Động cơ và bộ phận chuyển động (36 tháng)',
      'Bo mạch điện tử (24 tháng)',
      'Vỏ và các bộ phận cơ khí (12 tháng)',
      'Lắp đặt và hướng dẫn sử dụng',
    ],
    exclusions: [
      'Hư hỏng do sử dụng sai quy cách',
      'Tự ý tháo lắp, sửa chữa',
      'Tai nạn, thiên tai',
      'Hao mòn bình thường',
    ],
    specialNotes: 'Hỗ trợ tại nhà cho các sản phẩm lớn từ 2 triệu trở lên',
  },
  {
    name: 'Thời trang & Phụ kiện',
    icon: Shirt,
    warrantyPeriod: '6-12 tháng',
    coverage: [
      'Lỗi đường may (6 tháng)',
      'Đệm và phụ kiện (3 tháng)',
      'Màu sắc bền vững (không phai)',
      'Khóa kéo và các chi tiết kim loại',
    ],
    exclusions: [
      'Hư hỏng do sử dụng thông thường',
      'Giặt ủi sai quy cách',
      'Trầy xước, bẩn',
      'Thay đổi form dáng',
    ],
    specialNotes: 'Chỉ áp dụng cho sản phẩm giá trị trên 500.000đ',
  },
  {
    name: 'Sách & Văn phòng phẩm',
    icon: Book,
    warrantyPeriod: '3-6 tháng',
    coverage: [
      'Lỗi in ấn, thiếu trang',
      'Gáy sách, bìa cứng',
      'Lỗi sản xuất văn phòng phẩm',
    ],
    exclusions: [
      'Hư hỏng do sử dụng',
      'Bản viết, ghi chú',
      'Gấp, bẻ cong',
      'Bẩn, ố màu',
    ],
    specialNotes: 'Đổi mới trong 7 ngày nếu có lỗi từ nhà xuất bản',
  },
];

const warrantyProcess = [
  {
    step: 1,
    title: 'Kiểm tra tình trạng',
    description: 'Xác định lỗi và kiểm tra điều kiện bảo hành',
    icon: Search,
  },
  {
    step: 2,
    title: 'Chuẩn bị hồ sơ',
    description: 'Chuẩn bị hóa đơn, phiếu bảo hành và sản phẩm',
    icon: FileText,
  },
  {
    step: 3,
    title: 'Gửi bảo hành',
    description: 'Mang sản phẩm đến trung tâm bảo hành hoặc gửi qua bưu điện',
    icon: Package,
  },
  {
    step: 4,
    title: 'Tiếp nhận xử lý',
    description: 'Kỹ thuật viên kiểm tra và xác nhận lỗi',
    icon: Wrench,
  },
  {
    step: 5,
    title: 'Hoàn thành',
    description: 'Nhận sản phẩm đã sửa chữa hoặc sản phẩm thay thế',
    icon: CheckCircle,
  },
];

const serviceCenters = [
  {
    name: 'Trung tâm bảo hành AsiaShop - Hà Nội',
    address: 'Tòa nhà ABC, 123 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    phone: '024 1234 5678',
    email: 'hanoi@asiashop.vn',
    hours: '8:00 - 20:00 (T2 - CN)',
    services: ['Điện tử', 'Điện thoại', 'Gia dụng'],
  },
  {
    name: 'Trung tâm bảo hành AsiaShop - TP.HCM',
    address: 'Tầng 5, TTTM XYZ, 456 Lê Văn Viết, Quận 7, TP.HCM',
    phone: '028 2345 6789',
    email: 'hcmc@asiashop.vn',
    hours: '8:00 - 21:00 (T2 - CN)',
    services: ['Điện tử', 'Điện thoại', 'Thời trang'],
  },
  {
    name: 'Trung tâm bảo hành AsiaShop - Đà Nẵng',
    address: 'Khu công nghệ cao, 789 Nguyễn Văn Linh, Đà Nẵng',
    phone: '0236 3456 7890',
    email: 'danang@asiashop.vn',
    hours: '8:30 - 18:00 (T2 - T7)',
    services: ['Điện tử', 'Gia dụng'],
  },
];

const warrantyFAQs = [
  {
    id: 'warranty-check',
    question: 'Làm thế nào để kiểm tra tình trạng bảo hành của sản phẩm?',
    answer: 'Bạn có thể kiểm tra tình trạng bảo hành bằng các cách sau: 1) Nhập số serial sản phẩm vào công cụ kiểm tra bảo hành trên website, 2) Quét mã QR trên phiếu bảo hành, 3) Gọi hotline 1900 1234 và cung cấp số serial, 4) Mang sản phẩm và phiếu bảo hành đến trung tâm bảo hành gần nhất.',
    category: 'Kiểm tra bảo hành',
    tags: ['serial', 'QR', 'hotline']
  },
  {
    id: 'warranty-conditions',
    question: 'Những điều kiện nào để được hưởng chế độ bảo hành?',
    answer: 'Để được hưởng chế độ bảo hành, sản phẩm phải: 1) Còn trong thời hạn bảo hành, 2) Có phiếu bảo hành gốc và hóa đơn mua hàng, 3) Lỗi phát sinh do nhà sản xuất, 4) Không có dấu hiệu can thiệp, sửa chữa trái phép, 5) Sử dụng đúng theo hướng dẫn của nhà sản xuất.',
    category: 'Điều kiện bảo hành',
    tags: ['điều kiện', 'phiếu bảo hành', 'hóa đơn']
  },
  {
    id: 'warranty-time',
    question: 'Thời gian xử lý bảo hành thường mất bao lâu?',
    answer: 'Thời gian xử lý bảo hành phụ thuộc vào loại lỗi và sản phẩm: Lỗi đơn giản: 1-3 ngày làm việc, Lỗi phức tạp: 5-7 ngày làm việc, Cần đặt linh kiện: 10-15 ngày làm việc. Các sản phẩm cao cấp có dịch vụ ưu tiên sẽ được xử lý trong 24-48 giờ.',
    category: 'Thời gian xử lý',
    tags: ['thời gian', 'xử lý', 'lỗi']
  },
  {
    id: 'warranty-home-service',
    question: 'Tôi có thể được hỗ trợ tại nhà không?',
    answer: 'AsiaShop cung cấp dịch vụ hỗ trợ tại nhà cho: 1) Sản phẩm gia dụng lớn (tủ lạnh, máy giặt từ 10 triệu), 2) Khách hàng mua bảo hành cao cấp, 3) Khách hàng VIP, 4) Các sản phẩm trong khuyến mãi đặc biệt. Phí dịch vụ áp dụng theo khu vực.',
    category: 'Hỗ trợ tại nhà',
    tags: ['tại nhà', 'hỗ trợ', 'khách hàng VIP']
  },
  {
    id: 'warranty-replacement',
    question: 'Sản phẩm bị lỗi có được đổi mới không?',
    answer: 'Chính sách đổi mới áp dụng khi: 1) Lỗi nghiêm trọng không thể sửa chữa, 2) Lỗi lặp lại 3 lần trong vòng 6 tháng, 3) Sản phẩm mới mua dưới 7 ngày có lỗi từ nhà sản xuất, 4) Sản phẩm bảo hành cao cấp có quyền lợi đổi mới. Sản phẩm đổi mới sẽ có thông số kỹ thuật tương đương hoặc cao hơn.',
    category: 'Đổi mới',
    tags: ['đổi mới', 'lỗi nghiêm trọng', 'thay thế']
  },
  {
    id: 'warranty-extended',
    question: 'Tôi có thể mua bảo hành mở rộng không?',
    answer: 'Có, bạn có thể mua bảo hành mở rộng trong vòng 30 ngày kể từ ngày mua hàng. Gói bảo hành mở rộng: Gói Silver: +20% giá sản phẩm (bảo hành 24 tháng), Gói Gold: +35% giá sản phẩm (bảo hành 36 tháng + bảo vệ tai nạn), Gói Platinum: +50% giá sản phẩm (bảo hành 48 tháng + hỗ trợ tại nhà).',
    category: 'Bảo hành mở rộng',
    tags: ['mở rộng', 'Silver', 'Gold', 'Platinum']
  },
  {
    id: 'warranty-exclusions',
    question: 'Những trường hợp nào không được bảo hành?',
    answer: 'Các trường hợp không được bảo hành bao gồm: 1) Hết thời hạn bảo hành, 2) Không có phiếu bảo hành hoặc hóa đơn, 3) Lỗi do người dùng (rơi rớt, vào nước, quá điện), 4) Tự ý sửa chữa, thay thế linh kiện, 5) Sử dụng sai mục đích, không theo hướng dẫn, 6) Thiên tai, hỏa hoạn, chiến tranh, 7) Hao mòn tự nhiên.',
    category: 'Loại trừ',
    tags: ['loại trừ', 'hết hạn', 'người dùng']
  },
  {
    id: 'warranty-expired',
    question: 'Làm thế nào khi sản phẩm hết hạn bảo hành nhưng còn lỗi?',
    answer: 'Khi sản phẩm hết hạn bảo hành, AsiaShop vẫn hỗ trợ: 1) Kiểm tra và báo giá sửa chữa, 2) Cung cấp linh kiện chính hãng với giá ưu đãi, 3) Giảm 10% chi phí sửa chữa cho khách hàng thân thiết, 4) Chính sách thu cũ đổi mới với ưu đãi đặc biệt. Liên hệ trung tâm bảo hành để được tư vấn chi tiết.',
    category: 'Hết hạn bảo hành',
    tags: ['hết hạn', 'sửa chữa', 'linh kiện']
  },
];

const extendedWarrantyOptions = [
  {
    name: 'Bảo hành Silver',
    price: '+20%',
    duration: '24 tháng',
    features: [
      'Bảo hành tiêu chuẩn 24 tháng',
      'Sửa chữa miễn phí 100%',
      'Thay thế linh kiện chính hãng',
      'Hỗ trợ kỹ thuật online 24/7',
    ],
    suitableFor: 'Điện tử, gia dụng cơ bản',
  },
  {
    name: 'Bảo hành Gold',
    price: '+35%',
    duration: '36 tháng',
    features: [
      'Tất cả quyền lợi Silver',
      'Bảo vệ tai nạn (rơi vỡ, vào nước)',
      'Hỗ trợ tại nhà 1 lần/năm',
      'Đổi mới nếu sửa chữa > 10 ngày',
    ],
    suitableFor: 'Điện thoại, laptop, gia dụng cao cấp',
  },
  {
    name: 'Bảo hành Platinum',
    price: '+50%',
    duration: '48 tháng',
    features: [
      'Tất cả quyền lợi Gold',
      'Hỗ trợ tại_home không giới hạn',
      'Đổi mới trong 24 giờ',
      'Dịch vụ ưu tiên tại tất cả trung tâm',
    ],
    suitableFor: 'Sản phẩm cao cấp, doanh nghiệp',
  },
];

export default function WarrantyHelpPage() {
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
                Bảo hành sản phẩm
              </h1>
              <p className="text-lg text-gray-600">
                Chính sách bảo hành toàn diện và quy trình hỗ trợ chuyên nghiệp
              </p>
            </div>

            {/* Warranty Overview */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Các gói bảo hành</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(warrantyOverview).map(([key, warranty]) => (
                  <Card key={key} className={`relative overflow-hidden ${
                    key === 'premium' ? 'border-yellow-200 bg-yellow-50/30' : ''
                  }`}>
                    {key === 'premium' && (
                      <div className="absolute top-4 right-4">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className={`h-5 w-5 ${
                          key === 'standard' ? 'text-blue-600' :
                          key === 'extended' ? 'text-purple-600' : 'text-yellow-600'
                        }`} />
                        <CardTitle className="text-lg">{warranty.title}</CardTitle>
                      </div>
                      <Badge variant="secondary" className="w-fit">
                        {warranty.period}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        {warranty.description}
                      </p>
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Điều kiện bảo hành:</div>
                        <p className="text-xs text-muted-foreground">
                          {warranty.coverage}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Warranty by Product Category */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Bảo hành theo danh mục sản phẩm</h2>
              <div className="space-y-6">
                {productCategories.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Icon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{category.name}</CardTitle>
                              <Badge variant="outline" className="mt-1">
                                {category.warrantyPeriod}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              Điều kiện bảo hành
                            </h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              {category.coverage.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red-500" />
                              Không bảo hành
                            </h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              {category.exclusions.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        {category.specialNotes && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Lưu ý:</strong> {category.specialNotes}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Warranty Claim Process */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Quy trình bảo hành</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {warrantyProcess.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="relative mb-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto">
                          <Icon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        {index < warrantyProcess.length - 1 && (
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

            {/* Warranty Check Tool */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Kiểm tra bảo hành</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Kiểm tra tình trạng bảo hành sản phẩm
                  </CardTitle>
                  <CardDescription>
                    Nhập số serial hoặc mã sản phẩm để kiểm tra thông tin bảo hành
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="serial">Số serial sản phẩm</Label>
                      <Input
                        id="serial"
                        placeholder="Nhập số serial..."
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Danh mục sản phẩm</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electronics">Điện tử & Điện thoại</SelectItem>
                          <SelectItem value="home">Gia dụng & Nội thất</SelectItem>
                          <SelectItem value="fashion">Thời trang & Phụ kiện</SelectItem>
                          <SelectItem value="books">Sách & Văn phòng phẩm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Button className="bg-primary">
                      Kiểm tra bảo hành
                    </Button>
                    <Button variant="outline">
                      Quét mã QR
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Service Center Locations */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Trung tâm bảo hành</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceCenters.map((center, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{center.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <span>{center.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{center.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{center.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{center.hours}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2">Dịch vụ hỗ trợ:</div>
                        <div className="flex flex-wrap gap-1">
                          {center.services.map((service, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <MapPin className="h-4 w-4 mr-2" />
                        Xem bản đồ
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Warranty Exclusions */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Các trường hợp không bảo hành</h2>
              <Card className="border-red-200 bg-red-50/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                    <XCircle className="h-5 w-5" />
                    Lưu ý quan trọng về bảo hành
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm mb-3">Không được bảo hành khi:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>Hết thời hạn bảo hành</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>Không có phiếu bảo hành hoặc hóa đơn</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>Lỗi do người dùng (rơi, va đập, vào nước)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>Tự ý sửa chữa, thay thế linh kiện</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>Sử dụng sai mục đích, không theo hướng dẫn</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-3">Các trường hợp đặc biệt:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span>Thiên tai, hỏa hoạn, chiến tranh</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span>Hao mòn tự nhiên (pin, bộ phận tiêu hao)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span>Phụ kiện đi kèm (sạc, tai nghe, cáp)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span>Phần mềm (trừ lỗi từ nhà sản xuất)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                          <span>Aesthetic changes (trầy xước, đổi màu)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Extended Warranty Options */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Gói bảo hành mở rộng</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {extendedWarrantyOptions.map((option, index) => (
                  <Card key={index} className={`relative overflow-hidden ${
                    index === 2 ? 'border-yellow-200 bg-yellow-50/30' : ''
                  }`}>
                    {index === 2 && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-yellow-500 text-white">Phổ biến nhất</Badge>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg">{option.name}</CardTitle>
                      <Badge variant="secondary" className="w-fit">
                        {option.duration}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <span className="text-2xl font-bold text-primary">{option.price}</span>
                          <span className="text-sm text-muted-foreground"> giá sản phẩm</span>
                        </div>
                        <ul className="space-y-2">
                          {option.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground mb-3">
                            Phù hợp cho: {option.suitableFor}
                          </p>
                          <Button className="w-full" variant={index === 2 ? "default" : "outline"}>
                            Chọn gói này
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Download Forms */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Tài liệu và biểu mẫu</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Đơn bảo hành</div>
                        <div className="text-xs text-muted-foreground">Biểu mẫu đăng ký bảo hành</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Chính sách bảo hành</div>
                        <div className="text-xs text-muted-foreground">Chi tiết điều khoản</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Hướng dẫn bảo hành</div>
                        <div className="text-xs text-muted-foreground">Quy trình chi tiết</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* FAQ Section */}
            <section>
              <FAQSection
                title="Câu hỏi thường gặp về bảo hành"
                faqs={warrantyFAQs}
                maxItems={6}
              />
            </section>

            {/* CTA Section */}
            <section className="bg-muted/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Cần hỗ trợ bảo hành?</h2>
              <p className="text-muted-foreground mb-4">
                Đội ngũ hỗ trợ bảo hành của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-primary">
                  Gửi yêu cầu bảo hành
                </Button>
                <Button variant="outline" asChild>
                  <a href="tel:19001234">Gọi hotline bảo hành</a>
                </Button>
                <Button variant="outline">
                  Tìm trung tâm gần nhất
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}