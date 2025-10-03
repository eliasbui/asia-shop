import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { FAQSection } from '@/components/help/FAQSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Shield,
  MapPin,
  Package,
  Key,
  Bell,
  AlertTriangle,
  Settings,
  UserPlus,
  Edit3,
  Trash2,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Save,
  CheckCircle,
  XCircle,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Download,
  Upload,
  FileText,
  Clock,
  Star,
  Heart,
  CreditCard,
  History,
  Phone,
  MessageSquare,
  Truck,
  RefreshCw
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quản lý tài khoản - Hướng dẫn sử dụng | AsiaShop',
  description: 'Hướng dẫn chi tiết về quản lý tài khoản AsiaShop: tạo tài khoản, cập nhật thông tin, quản lý địa chỉ, đơn hàng, cài đặt bảo mật và nhiều hơn nữa.',
  keywords: 'quản lý tài khoản, hướng dẫn tài khoản, AsiaShop tài khoản, cập nhật hồ sơ, bảo mật tài khoản',
};

// Account Setup Guide Data
const accountSetupSteps = [
  {
    step: 1,
    title: 'Đăng ký tài khoản mới',
    description: 'Bắt đầu hành trình mua sắm của bạn bằng cách tạo tài khoản AsiaShop.',
    icon: UserPlus,
    actions: [
      'Truy cập trang đăng ký',
      'Điền thông tin cá nhân',
      'Xác nhận email',
      'Đặt mật khẩu mạnh'
    ],
    link: '/register'
  },
  {
    step: 2,
    title: 'Hoàn thiện hồ sơ cá nhân',
    description: 'Cập nhật thông tin cá nhân để trải nghiệm mua sắm tốt hơn.',
    icon: Edit3,
    actions: [
      'Cập nhật ảnh đại diện',
      'Thêm số điện thoại',
      'Nhập ngày sinh',
      'Cài đặt giới tính'
    ],
    link: '/account/profile'
  },
  {
    step: 3,
    title: 'Thêm địa chỉ giao hàng',
    description: 'Lưu địa chỉ để quá trình thanh toán nhanh chóng hơn.',
    icon: MapPin,
    actions: [
      'Nhập tên người nhận',
      'Điền địa chỉ chi tiết',
      'Số điện thoại liên hệ',
      'Đặt làm địa chỉ mặc định'
    ],
    link: '/account/addresses'
  },
  {
    step: 4,
    title: 'Cài đặt phương thức thanh toán',
    description: 'Lưu thông tin thanh toán để mua sắm dễ dàng.',
    icon: CreditCard,
    actions: [
      'Thêm thẻ tín dụng/ghi nợ',
      'Kết nối ví điện tử',
      'Cài đặt thanh toán mặc định',
      'Xác thực phương thức'
    ],
    link: '/account/payment'
  }
];

// Profile Management Data
const profileSections = [
  {
    title: 'Thông tin cá nhân',
    description: 'Quản lý thông tin cơ bản của tài khoản',
    icon: User,
    items: [
      { label: 'Họ và tên', description: 'Cập nhật tên đầy đủ của bạn' },
      { label: 'Email', description: 'Địa chỉ email dùng để đăng nhập' },
      { label: 'Số điện thoại', description: 'Nhận thông báo và xác nhận' },
      { label: 'Ngày sinh', description: 'Nhận ưu đãi đặc biệt vào sinh nhật' }
    ]
  },
  {
    title: 'Ảnh đại diện',
    description: 'Cá nhân hóa tài khoản với ảnh của bạn',
    icon: Camera,
    items: [
      { label: 'Tải ảnh lên', description: 'Chọn ảnh từ thiết bị' },
      { label: 'Cắt ảnh', description: 'Điều chỉnh kích thước phù hợp' },
      { label: 'Xem trước', description: 'Kiểm tra trước khi lưu' }
    ]
  },
  {
    title: 'Tùy chọn hiển thị',
    description: 'Cá nhân hóa giao diện tài khoản',
    icon: Settings,
    items: [
      { label: 'Ngôn ngữ', description: 'Chọn ngôn ngữ hiển thị' },
      { label: 'Múi giờ', description: 'Cài đặt giờ địa phương' },
      { label: 'Đơn vị tiền tệ', description: 'Chọn tiền tệ mặc định' }
    ]
  }
];

// Address Management Data
const addressSteps = [
  {
    title: 'Thêm địa chỉ mới',
    steps: [
      'Đăng nhập và vào "Tài khoản" > "Sổ địa chỉ"',
      'Nhấn "Thêm địa chỉ mới"',
      'Điền thông tin người nhận',
      'Nhập địa chỉ chi tiết',
      'Chọn tỉnh/thành phố, quận/huyện, phường/xã',
      'Đặt làm địa chỉ mặc định (nếu muốn)',
      'Nhấn "Lưu địa chỉ"'
    ]
  },
  {
    title: 'Chỉnh sửa địa chỉ',
    steps: [
      'Vào "Tài khoản" > "Sổ địa chỉ"',
      'Tìm địa chỉ cần chỉnh sửa',
      'Nhấn biểu tượng chỉnh sửa',
      'Cập nhật thông tin cần thay đổi',
      'Nhấn "Cập nhật địa chỉ"'
    ]
  },
  {
    title: 'Xóa địa chỉ',
    steps: [
      'Vào "Tài khoản" > "Sổ địa chỉ"',
      'Tìm địa chỉ cần xóa',
      'Nhấn biểu tượng xóa',
      'Xác nhận xóa địa chỉ'
    ]
  }
];

// Order History Data
const orderFeatures = [
  {
    title: 'Xem lịch sử đơn hàng',
    description: 'Truy cập tất cả đơn hàng đã đặt',
    icon: History,
    features: [
      'Lọc theo trạng thái đơn hàng',
      'Tìm kiếm theo mã đơn hàng',
      'Sắp xếp theo thời gian',
      'Xem chi tiết sản phẩm'
    ]
  },
  {
    title: 'Theo dõi đơn hàng',
    description: 'Kiểm tra tình trạng đơn hàng hiện tại',
    icon: Package,
    features: [
      'Xem trạng thái vận chuyển',
      'Cập nhật thời gian giao hàng dự kiến',
      'Theo dõi lộ trình giao hàng',
      'Nhận thông báo tự động'
    ]
  },
  {
    title: 'Quản lý đơn hàng',
    description: 'Thực hiện các hành động với đơn hàng',
    icon: Settings,
    features: [
      'Yêu cầu hủy đơn hàng',
      'Đổi trả sản phẩm',
      'Viết đánh giá sản phẩm',
      'Đặt lại đơn hàng tương tự'
    ]
  }
];

// Security Settings Data
const securityFeatures = [
  {
    title: 'Quản lý mật khẩu',
    description: 'Bảo vệ tài khoản với mật khẩu mạnh',
    icon: Lock,
    steps: [
      'Đăng nhập và vào "Tài khoản" > "Bảo mật"',
      'Chọn "Đổi mật khẩu"',
      'Nhập mật khẩu hiện tại',
      'Tạo mật khẩu mới (ít nhất 8 ký tự)',
      'Xác nhận mật khẩu mới',
      'Nhấn "Cập nhật mật khẩu"'
    ],
    tips: [
      'Sử dụng kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt',
      'Không sử dụng thông tin cá nhân dễ đoán',
      'Thay đổi mật khẩu định kỳ 3-6 tháng'
    ]
  },
  {
    title: 'Xác thực hai yếu tố (2FA)',
    description: 'Thêm lớp bảo mật bổ sung cho tài khoản',
    icon: Smartphone,
    steps: [
      'Vào "Tài khoản" > "Bảo mật" > "Xác thực hai yếu tố"',
      'Chọn phương thức xác thực (SMS hoặc Authenticator)',
      'Làm theo hướng dẫn thiết lập',
      'Lưu mã dự phòng ở nơi an toàn',
      'Kiểm tra xác thực'
    ],
    benefits: [
      'Bảo vệ tài khoản khỏi truy cập trái phép',
      'Nhận cảnh báo khi có đăng nhập mới',
      'Yêu cầu xác minh khi đăng nhập từ thiết bị mới'
    ]
  },
  {
    title: 'Quản lý phiên đăng nhập',
    description: 'Kiểm soát các thiết bị đã đăng nhập',
    icon: Eye,
    steps: [
      'Vào "Tài khoản" > "Bảo mật" > "Phiên đăng nhập"',
      'Xem danh sách thiết bị đã đăng nhập',
      'Xóa phiên đăng nhập không quen thuộc',
      'Đăng xuất khỏi tất cả thiết bị nếu cần'
    ]
  }
];

// Privacy Settings Data
const privacyOptions = [
  {
    title: 'Quản lý email',
    description: 'Kiểm soát loại email bạn nhận',
    icon: Mail,
    options: [
      { label: 'Khuyến mãi và ưu đãi', description: 'Nhận thông tin về các chương trình giảm giá' },
      { label: 'Cập nhật đơn hàng', description: 'Thông báo về trạng thái đơn hàng' },
      { label: 'Tin tức sản phẩm', description: 'Thông tin về sản phẩm mới' },
      { label: 'Bản tin hàng tuần', description: 'Tóm tắt các ưu đãi hàng tuần' }
    ]
  },
  {
    title: 'Quyền riêng tư',
    description: 'Kiểm soát cách thông tin của bạn được sử dụng',
    icon: Shield,
    options: [
      { label: 'Hiển thị hồ sơ công khai', description: 'Cho phép người khác xem hồ sơ của bạn' },
      { label: 'Chia sẻ dữ liệu', description: 'Chia sẻ thông tin để cải thiện dịch vụ' },
      { label: 'Nhắm mục tiêu quảng cáo', description: 'Hiển thị quảng cáo dựa trên sở thích' }
    ]
  },
  {
    title: 'Xóa dữ liệu',
    description: 'Quản lý dữ liệu cá nhân của bạn',
    icon: Trash2,
    options: [
      { label: 'Lịch sử duyệt web', description: 'Xóa lịch sử tìm kiếm và duyệt' },
      { label: 'Dữ liệu vị trí', description: 'Xóa thông tin vị trí đã lưu' },
      { label: 'Tệp đính kèm', description: 'Xóa các tệp đã tải lên' }
    ]
  }
];

// Troubleshooting FAQs
const troubleshootingFAQs = [
  {
    id: '1',
    question: 'Quên mật khẩu, làm thế nào để đặt lại?',
    answer: 'Bạn có thể đặt lại mật khẩu bằng cách: 1) Vào trang đăng nhập và nhấn "Quên mật khẩu", 2) Nhập email đăng ký tài khoản, 3) Kiểm tra email và nhấp vào liên kết đặt lại, 4) Tạo mật khẩu mới và xác nhận, 5) Đăng nhập bằng mật khẩu mới. Liên hệ hỗ trợ nếu không nhận được email sau 5 phút.',
    category: 'Đăng nhập',
    tags: ['mật khẩu', 'đăng nhập', 'khôi phục']
  },
  {
    id: '2',
    question: 'Không nhận được email xác nhận đăng ký?',
    answer: 'Nếu không nhận được email xác nhận: 1) Kiểm tra hộp thư spam/quảng cáo, 2) Đảm bảo email nhập đúng, 3) Chờ 5-10 phút để email được gửi, 4) Yêu cầu gửi lại email xác nhận, 5) Thêm noreply@asiashop.vn vào danh sách an toàn. Vẫn không nhận được? Liên hệ hỗ trợ với email đăng ký của bạn.',
    category: 'Đăng ký',
    tags: ['email', 'xác nhận', 'đăng ký']
  },
  {
    id: '3',
    question: 'Tài khoản bị khóa, làm sao để mở lại?',
    answer: 'Tài khoản có thể bị khóa vì: 1) Đăng nhập sai nhiều lần, 2) Hoạt động đáng ngờ, 3) Vi phạm điều khoản sử dụng. Để mở khóa: 1) Chờ 30 phút và thử lại (đăng nhập sai), 2) Liên hệ hỗ trợ để xác minh danh tính, 3) Cung cấp thông tin xác thực khi được yêu cầu. Thời gian mở khóa thường từ 1-24 giờ.',
    category: 'Bảo mật',
    tags: ['khóa tài khoản', 'mở khóa', 'bảo mật']
  },
  {
    id: '4',
    question: 'Làm thế nào để thay đổi email đăng nhập?',
    answer: 'Để thay đổi email đăng nhập: 1) Đăng nhập vào tài khoản, 2) Vào "Tài khoản" > "Cài đặt tài khoản", 3) Chọn "Thay đổi email", 4) Nhập email mới, 5) Xác nhận bằng mật khẩu hiện tại, 6) Kiểm tra email mới để xác nhận thay đổi. Email mới sẽ trở thành email đăng nhập chính.',
    category: 'Cài đặt',
    tags: ['email', 'đăng nhập', 'thay đổi']
  },
  {
    id: '5',
    question: 'Không thể cập nhật thông tin cá nhân?',
    answer: 'Nếu gặp lỗi khi cập nhật thông tin: 1) Kiểm tra kết nối internet, 2) Đảm bảo điền đầy đủ các trường bắt buộc, 3) Xóa cache và cookie trình duyệt, 4) Thử cập nhật từng thông tin riêng lẻ, 5) Sử dụng trình duyệt khác. Liên hệ hỗ trợ nếu vấn đề tiếp diễn.',
    category: 'Cài đặt',
    tags: ['cập nhật', 'thông tin', 'lỗi']
  },
  {
    id: '6',
    question: 'Làm sao để xóa tài khoản vĩnh viễn?',
    answer: 'Để xóa tài khoản: 1) Đăng nhập vào tài khoản, 2) Vào "Tài khoản" > "Cài đặt tài khoản", 3) Chọn "Xóa tài khoản", 4) Đọc kỹ cảnh báo và hậu quả, 5) Xác nhận xóa tài khoản. Lưu ý: Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu. Chờ 30 ngày để khôi phục nếu thay đổi quyết định.',
    category: 'Xóa tài khoản',
    tags: ['xóa', 'vĩnh viễn', 'dữ liệu']
  }
];

// Account Deletion Steps
const deletionSteps = [
  {
    title: 'Lưu dữ liệu quan trọng',
    description: 'Trước khi xóa tài khoản, hãy lưu lại thông tin cần thiết',
    icon: Download,
    items: [
      'Lịch sử đơn hàng và hóa đơn',
      'Thông tin bảo hành còn hiệu lực',
      'Địa chỉ và thông tin liên lạc',
      'Điểm tích lũy và ưu đãi'
    ]
  },
  {
    title: 'Hủy các dịch vụ đang hoạt động',
    description: 'Dừng các dịch vụ và đăng ký tự động',
    icon: XCircle,
    items: [
      'Hủy các đơn hàng đang xử lý',
      'Dừng đăng ký trả góp',
      'Hủy các gói thành viên',
      'Rút tiền từ ví điện tử'
    ]
  },
  {
    title: 'Xác nhận xóa tài khoản',
    description: 'Thực hiện các bước cuối cùng để xóa tài khoản',
    icon: AlertTriangle,
    items: [
      'Đăng nhập vào tài khoản',
      'Vào "Cài đặt tài khoản" > "Xóa tài khoản"',
      'Đọc kỹ điều khoản và hậu quả',
      'Xác nhận mật khẩu',
      'Nhấn "Xóa tài khoản vĩnh viễn"'
    ]
  }
];

const deletionWarnings = [
  'Mọi dữ liệu sẽ bị xóa vĩnh viễn và không thể phục hồi',
  'Lịch sử mua hàng, điểm thưởng và ưu đãi sẽ mất',
  'Không thể sử dụng email đã xóa để đăng ký lại',
  'Các đơn hàng đang xử lý sẽ bị hủy tự động',
  'Thông tin bảo hành có thể bị ảnh hưởng'
];

export default function AccountHelpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumbs />
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Quản lý tài khoản AsiaShop
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Hướng dẫn chi tiết về quản lý tài khoản, từ việc tạo và thiết lập tài khoản mới đến quản lý thông tin cá nhân, bảo mật và xóa tài khoản khi cần.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/register">
                <UserPlus className="h-4 w-4 mr-2" />
                Đăng ký ngay
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">
                <Lock className="h-4 w-4 mr-2" />
                Đăng nhập
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/account/profile">
                <Settings className="h-4 w-4 mr-2" />
                Cài đặt tài khoản
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/help/contact">
                <HelpCircle className="h-4 w-4 mr-2" />
                Cần hỗ trợ?
              </Link>
            </Button>
          </div>
        </div>

        {/* Account Setup Guide */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Hướng dẫn thiết lập tài khoản</h2>
            <p className="text-gray-600">
              Bốn bước đơn giản để bắt đầu hành trình mua sắm của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {accountSetupSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {step.actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                          {action}
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full" variant="outline">
                      <Link href={step.link}>
                        Thực hiện ngay
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Profile Management */}
        <section className="mb-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Quản lý hồ sơ cá nhân</h2>
            <p className="text-gray-600">
              Cập nhật và quản lý thông tin cá nhân để trải nghiệm mua sắm tốt hơn
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {profileSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {section.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm">{item.label}</div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Mẹo chuyên nghiệp</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Cập nhật thông tin thường xuyên giúp chúng tôi phục vụ bạn tốt hơn và đảm bảo bạn nhận được các ưu đãi phù hợp.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Address Book Management */}
        <section className="mb-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Quản lý sổ địa chỉ</h2>
            <p className="text-gray-600">
              Thêm, chỉnh sửa và quản lý địa chỉ giao hàng để mua sắm nhanh chóng hơn
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {addressSteps.map((step, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {step.steps.map((instruction, stepIndex) => (
                      <li key={stepIndex} className="flex items-start gap-2 text-sm">
                        <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {stepIndex + 1}
                        </span>
                        <span className="text-gray-700">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Button asChild>
              <Link href="/account/addresses">
                <MapPin className="h-4 w-4 mr-2" />
                Quản lý địa chỉ của bạn
              </Link>
            </Button>
          </div>
        </section>

        {/* Order History */}
        <section className="mb-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Lịch sử đơn hàng</h2>
            <p className="text-gray-600">
              Theo dõi và quản lý tất cả đơn hàng của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {orderFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.features.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Security Settings */}
        <section className="mb-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Cài đặt bảo mật</h2>
            <p className="text-gray-600">
              Bảo vệ tài khoản của bạn với các tính năng bảo mật tiên tiến
            </p>
          </div>

          <div className="space-y-6">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {feature.steps && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-3">Các bước thực hiện:</h4>
                        <ol className="space-y-2">
                          {feature.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start gap-3">
                              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                                {stepIndex + 1}
                              </span>
                              <span className="text-sm text-gray-700">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {feature.tips && (
                      <div className="p-3 bg-amber-50 rounded-lg">
                        <h5 className="font-medium text-amber-900 mb-2">Lưu ý quan trọng:</h5>
                        <ul className="space-y-1">
                          {feature.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start gap-2 text-sm text-amber-700">
                              <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {feature.benefits && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <h5 className="font-medium text-green-900 mb-2">Lợi ích:</h5>
                        <ul className="space-y-1">
                          {feature.benefits.map((benefit, benefitIndex) => (
                            <li key={benefitIndex} className="flex items-start gap-2 text-sm text-green-700">
                              <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 mb-2">Bảo mật là ưu tiên hàng đầu</h4>
                <p className="text-red-700">
                  Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn bằng các công nghệ bảo mật tiên tiến nhất.
                  Tuy nhiên, hãy luôn bảo vệ tài khoản của bạn bằng cách sử dụng mật khẩu mạnh và không chia sẻ thông tin đăng nhập cho người khác.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Settings */}
        <section className="mb-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Cài đặt riêng tư</h2>
            <p className="text-gray-600">
              Kiểm soát cách thông tin của bạn được sử dụng và chia sẻ
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {privacyOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{option.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {option.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {option.options.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            id={`${index}-${itemIndex}`}
                            className="mt-1"
                            defaultChecked={itemIndex < 2}
                          />
                          <div>
                            <label
                              htmlFor={`${index}-${itemIndex}`}
                              className="text-sm font-medium cursor-pointer"
                            >
                              {item.label}
                            </label>
                            <p className="text-xs text-gray-500">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Account Troubleshooting */}
        <section className="mb-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Giải quyết sự cố tài khoản</h2>
            <p className="text-gray-600">
              Tìm giải pháp cho các vấn đề thường gặp với tài khoản của bạn
            </p>
          </div>

          <FAQSection
            faqs={troubleshootingFAQs}
            title="Câu hỏi thường gặp về tài khoản"
            showSearch={true}
          />
        </section>

        {/* Account Deletion */}
        <section className="mb-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Xóa tài khoản</h2>
            <p className="text-gray-600">
              Hướng dẫn chi tiết về cách xóa tài khoản vĩnh viễn
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Cảnh báo quan trọng</h3>
                <p className="text-red-700 mb-3">
                  Xóa tài khoản là hành động không thể hoàn tác. Hãy cân nhắc kỹ trước khi quyết định.
                </p>
                <ul className="space-y-1">
                  {deletionWarnings.map((warning, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-red-600">
                      <XCircle className="h-3 w-3 mt-1 flex-shrink-0" />
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {deletionSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </div>
                    <CardDescription>{step.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {step.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="p-6 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-3">Tìm hiểu thêm về quyền của bạn</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/help/privacy" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                <FileText className="h-4 w-4" />
                Chính sách bảo mật
                <ExternalLink className="h-3 w-3" />
              </Link>
              <Link href="/help/terms" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                <FileText className="h-4 w-4" />
                Điều khoản sử dụng
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-8">
              <div className="text-center">
                <HelpCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Cần thêm hỗ trợ?</h3>
                <p className="text-gray-600 mb-6">
                  Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn 24/7
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link href="/help/contact">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat với hỗ trợ
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="mailto:support@asiashop.vn">
                      <Mail className="h-4 w-4 mr-2" />
                      Gửi email
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="tel:19001234">
                      <Phone className="h-4 w-4 mr-2" />
                      Gọi hotline
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Related Links */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Chủ đề liên quan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/help/payment">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-sm">Thanh toán</div>
                      <div className="text-xs text-gray-500">Phương thức thanh toán</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/help/shipping">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-sm">Vận chuyển</div>
                      <div className="text-xs text-gray-500">Theo dõi đơn hàng</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/help/returns">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-sm">Đổi trả</div>
                      <div className="text-xs text-gray-500">Chính sách đổi trả</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/help/security">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-red-600" />
                    <div>
                      <div className="font-medium text-sm">Bảo mật</div>
                      <div className="text-xs text-gray-500">Bảo vệ tài khoản</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}