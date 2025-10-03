import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { HelpNavigation } from '@/components/help/HelpNavigation';
import { HelpSearch } from '@/components/help/HelpSearch';
import { FAQSection } from '@/components/FAQSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Wrench,
  User,
  Lock,
  ShoppingCart,
  CreditCard,
  Package,
  Smartphone,
  Monitor,
  Wifi,
  WifiOff,
  RefreshCw,
  HelpCircle,
  Search,
  MessageSquare,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Info,
  Zap,
  Shield,
  Database,
  Server,
  Globe,
  Settings,
  Download,
  Upload,
  Terminal,
  Activity,
  Check
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Khắc phục sự cố - Trung tâm hỗ trợ | AsiaShop',
  description: 'Hướng dẫn chi tiết khắc phục các sự cố thường gặp khi sử dụng AsiaShop: đăng nhập, thanh toán, giỏ hàng, đơn hàng và các vấn đề kỹ thuật khác.',
  keywords: 'khắc phục sự cố, troubleshooting, hỗ trợ kỹ thuật, lỗi thường gặp, giải pháp vấn đề, AsiaShop hỗ trợ',
};

// Severity levels for issues
type Severity = 'low' | 'medium' | 'high' | 'critical';

interface TroubleshootingIssue {
  id: string;
  title: string;
  description: string;
  symptoms: string[];
  causes: string[];
  solutions: string[];
  prevention: string[];
  severity: Severity;
  category: string;
  estimatedTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  relatedLinks?: { title: string; href: string }[];
}

// Common Technical Issues
const technicalIssues: TroubleshootingIssue[] = [
  {
    id: 'login-issues',
    title: 'Không thể đăng nhập tài khoản',
    description: 'Vấn đề đăng nhập là một trong những sự cố phổ biến nhất. Nguyên nhân có thể do sai mật khẩu, tài khoản bị khóa hoặc lỗi kỹ thuật.',
    symptoms: [
      'Thông báo "Sai mật khẩu hoặc email"',
      'Trang tải vô hạn sau khi nhấn đăng nhập',
      'Thông báo "Tài khoản bị tạm khóa"',
      'Không nhận được email xác nhận'
    ],
    causes: [
      'Quên mật khẩu hoặc nhập sai thông tin',
      'Tài khoản bị khóa do đăng nhập sai nhiều lần',
      'Lỗi kết nối mạng hoặc server',
      'Chưa xác thực email đăng ký'
    ],
    solutions: [
      'Sử dụng chức năng "Quên mật khẩu" để đặt lại mật khẩu',
      'Kiểm tra lại email và mật khẩu đã nhập',
      'Xóa cache và cookie trình duyệt',
      'Chờ 30 phút nếu tài khoản bị tạm khóa',
      'Kiểm tra email xác nhận và xác thực tài khoản',
      'Thử đăng nhập bằng trình duyệt khác'
    ],
    prevention: [
      'Sử dụng mật khẩu mạnh và lưu ở nơi an toàn',
      'Bật xác thực hai yếu tố (2FA)',
      'Cập nhật thông tin liên lạc thường xuyên'
    ],
    severity: 'medium',
    category: 'authentication',
    estimatedTime: '5-15 phút',
    difficulty: 'easy',
    relatedLinks: [
      { title: 'Hướng dẫn đặt lại mật khẩu', href: '/help/account#password-reset' },
      { title: 'Bảo mật tài khoản', href: '/help/account#security' }
    ]
  },
  {
    id: 'payment-failures',
    title: 'Thanh toán không thành công',
    description: 'Lỗi thanh toán có thể xảy ra do nhiều nguyên nhân từ phía ngân hàng, cổng thanh toán hoặc thông tin thẻ không chính xác.',
    symptoms: [
      'Thông báo "Thanh toán thất bại"',
      'Trang chuyển hướng về lại trang thanh toán',
      'Thông báo lỗi từ ngân hàng',
      'Đơn hàng không được xác nhận sau thanh toán'
    ],
    causes: [
      'Thông tin thẻ không chính xác',
      'Thẻ hết hạn hoặc hết hạn mức',
      'Lỗi kết nối với cổng thanh toán',
      'Chính sách bảo mật của ngân hàng từ chối giao dịch'
    ],
    solutions: [
      'Kiểm tra lại thông tin thẻ (số, CVV, ngày hết hạn)',
      'Sử dụng phương thức thanh toán khác',
      'Liên hệ ngân hàng để xác nhận giao dịch',
      'Kiểm tra kết nối internet và thử lại',
      'Xóa cache và cookie trình duyệt',
      'Thử thanh toán bằng thiết bị khác'
    ],
    prevention: [
      'Luôn kiểm tra thông tin thẻ trước khi thanh toán',
      'Đảm bảo kết nối internet ổn định',
      'Sử dụng trình duyệt cập nhật và an toàn'
    ],
    severity: 'high',
    category: 'payment',
    estimatedTime: '10-20 phút',
    difficulty: 'medium',
    relatedLinks: [
      { title: 'Phương thức thanh toán', href: '/help/payment' },
      { title: 'Bảo mật thanh toán', href: '/help/payment#security' }
    ]
  },
  {
    id: 'performance-issues',
    title: 'Website tải chậm hoặc không phản hồi',
    description: 'Tốc độ tải trang chậm có thể ảnh hưởng đến trải nghiệm mua sắm và gây khó khăn khi thao tác.',
    symptoms: [
      'Trang tải quá chậm (>10 giây)',
      'Các nút và liên kết không phản hồi',
      'Hình ảnh không tải được',
      'Lỗi timeout khi thực hiện thao tác'
    ],
    causes: [
      'Kết nối internet không ổn định',
      'Trình duyệt quá nhiều tab đang mở',
      'Cache và cookie đầy',
      'Server đang bảo trì hoặc quá tải'
    ],
    solutions: [
      'Kiểm tra tốc độ kết nối internet',
      'Xóa cache và cookie trình duyệt',
      'Đóng các tab không cần thiết',
      'Cập nhật trình duyệt lên phiên bản mới nhất',
      'Thử sử dụng trình duyệt khác',
      'Kiểm tra trạng thái hệ thống AsiaShop'
    ],
    prevention: [
      'Duy trì kết nối internet ổn định',
      'Định kỳ xóa cache trình duyệt',
      'Sử dụng trình duyệt được cập nhật'
    ],
    severity: 'medium',
    category: 'performance',
    estimatedTime: '5-10 phút',
    difficulty: 'easy'
  },
  {
    id: 'mobile-app-issues',
    title: 'Lỗi ứng dụng di động',
    description: 'Các sự cố trên ứng dụng di động có thể bao gồm lỗi đăng nhập, crash hoặc không đồng bộ dữ liệu.',
    symptoms: [
      'Ứng dụng tự động đóng đột ngột',
      'Không thể đăng nhập trên ứng dụng',
      'Dữ liệu không đồng bộ với website',
      'Thông báo lỗi khi mở ứng dụng'
    ],
    causes: [
      'Phiên bản ứng dụng cũ',
      'Lỗi kết nối mạng',
      'Bộ nhớ thiết bị đầy',
      'Xung đột với ứng dụng khác'
    ],
    solutions: [
      'Cập nhật ứng dụng lên phiên bản mới nhất',
      'Xóa cache ứng dụng',
      'Khởi động lại thiết bị',
      'Gỡ và cài đặt lại ứng dụng',
      'Kiểm tra kết nối internet',
      'Giải phóng bộ nhớ thiết bị'
    ],
    prevention: [
      'Luôn cập nhật ứng dụng khi có phiên bản mới',
      'Định kỳ xóa cache ứng dụng',
      'Đảm bảo đủ bộ nhớ trống'
    ],
    severity: 'medium',
    category: 'mobile',
    estimatedTime: '10-15 phút',
    difficulty: 'medium'
  },
  {
    id: 'browser-compatibility',
    title: 'Lỗi tương thích trình duyệt',
    description: 'Một số tính năng có thể không hoạt động đúng trên các trình duyệt cũ hoặc không được hỗ trợ.',
    symptoms: [
      'Giao diện hiển thị bị lỗi',
      'Các nút không hoạt động',
      'Không thể tải trang',
      'Lỗi JavaScript trên console'
    ],
    causes: [
      'Sử dụng trình duyệt cũ',
      'JavaScript bị vô hiệu hóa',
      'Extensions gây xung đột',
      'Thiết lập bảo mật quá cao'
    ],
    solutions: [
      'Cập nhật trình duyệt lên phiên bản mới nhất',
      'Kích hoạt JavaScript trong trình duyệt',
      'Vô hiệu hóa các extensions tạm thời',
      'Sử dụng chế độ ẩn danh',
      'Thử với trình duyệt khác (Chrome, Firefox, Safari)'
    ],
    prevention: [
      'Sử dụng trình duyệt hiện đại và cập nhật',
      'Giữ các extensions ở mức tối thiểu',
      'Không vô hiệu hóa các tính năng bảo mật mặc định'
    ],
    severity: 'low',
    category: 'browser',
    estimatedTime: '5-10 phút',
    difficulty: 'easy'
  }
];

// Account Issues
const accountIssues: TroubleshootingIssue[] = [
  {
    id: 'password-reset-issues',
    title: 'Không đặt lại được mật khẩu',
    description: 'Vấn đề khi sử dụng chức năng quên mật khẩu hoặc không nhận được email đặt lại.',
    symptoms: [
      'Không nhận được email đặt lại mật khẩu',
      'Liên kết đặt lại hết hạn',
      'Thông báo "Email không tồn tại"',
      'Lỗi khi tạo mật khẩu mới'
    ],
    causes: [
      'Nhập sai email đăng ký',
      'Email bị rác hoặc vào thư spam',
      'Liên kết đặt lại đã được sử dụng',
      'Hệ thống email đang có vấn đề'
    ],
    solutions: [
      'Kiểm tra chính xác email đã đăng ký',
      'Kiểm tra thư spam/quảng cáo',
      'Yêu cầu gửi lại email đặt lại',
      'Thêm support@asiashop.vn vào danh sách an toàn',
      'Chờ 5-10 phút trước khi yêu cầu lại',
      'Liên hệ hỗ trợ nếu vẫn không nhận được'
    ],
    prevention: [
      'Lưu lại email đăng ký ở nơi an toàn',
      'Cập nhật email khi thay đổi',
      'Thường xuyên kiểm tra hộp thư'
    ],
    severity: 'medium',
    category: 'account',
    estimatedTime: '10-15 phút',
    difficulty: 'easy'
  },
  {
    id: 'account-locked',
    title: 'Tài khoản bị khóa',
    description: 'Tài khoản có thể bị khóa tạm thời do vi phạm chính sách hoặc hoạt động đáng ngờ.',
    symptoms: [
      'Thông báo "Tài khoản đã bị khóa"',
      'Không thể đăng nhập',
      'Không nhận được email xác nhận',
      'Biểu mẫu đăng nhập không hoạt động'
    ],
    causes: [
      'Đăng nhập sai nhiều lần',
      'Hoạt động đáng ngờ được phát hiện',
      'Vi phạm điều khoản sử dụng',
      'Yêu cầu từ người dùng hoặc cơ quan chức năng'
    ],
    solutions: [
      'Chờ 30 phút nếu khóa tự động',
      'Kiểm tra email thông báo khóa tài khoản',
      'Liên hệ hỗ trợ để xác minh danh tính',
      'Cung cấp giấy tờ tùy thân khi được yêu cầu',
      'Làm theo hướng dẫn trong email khóa tài khoản'
    ],
    prevention: [
      'Sử dụng mật khẩu mạnh và không chia sẻ',
      'Tránh đăng nhập sai nhiều lần',
      'Tuân thủ điều khoản sử dụng'
    ],
    severity: 'high',
    category: 'account',
    estimatedTime: '1-24 giờ',
    difficulty: 'hard'
  },
  {
    id: 'profile-update-failures',
    title: 'Không cập nhật được thông tin cá nhân',
    description: 'Lỗi khi cố gắng cập nhật hồ sơ, địa chỉ hoặc thông tin tài khoản.',
    symptoms: [
      'Nút "Lưu" không hoạt động',
      'Thông báo lỗi khi cập nhật',
      'Thông tin không được lưu sau khi cập nhật',
      'Trang tải lại mà không có thay đổi'
    ],
    causes: [
      'Thông tin không hợp lệ',
      'Lỗi kết nối mạng',
      'Lỗi kỹ thuật từ server',
      'Thiếu các trường bắt buộc'
    ],
    solutions: [
      'Kiểm tra lại thông tin đã nhập',
      'Đảm bảo điền đầy đủ các trường bắt buộc',
      'Làm mới trang và thử lại',
      'Kiểm tra kết nối internet',
      'Thử cập nhật từng thông tin riêng lẻ',
      'Sử dụng trình duyệt khác'
    ],
    prevention: [
      'Kiểm tra kỹ thông tin trước khi lưu',
      'Đảm bảo kết nối internet ổn định',
      'Làm theo hướng dẫn validation của form'
    ],
    severity: 'low',
    category: 'account',
    estimatedTime: '5-10 phút',
    difficulty: 'easy'
  },
  {
    id: 'email-verification',
    title: 'Không xác thực được email',
    description: 'Vấn đề với quá trình xác nhận email đăng ký hoặc thay đổi email.',
    symptoms: [
      'Không nhận được email xác thực',
      'Liên kết xác thực không hoạt động',
      'Thông báo "Email đã được xác thực" nhưng vẫn không thể sử dụng',
      'Email xác thực hết hạn'
    ],
    causes: [
      'Email bị rác hoặc vào thư spam',
      'Nhập sai email khi đăng ký',
      'Link xác thực đã hết hạn (24 giờ)',
      'Lỗi hệ thống gửi email'
    ],
    solutions: [
      'Kiểm tra thư spam/quảng cáo',
      'Yêu cầu gửi lại email xác thực',
      'Đảm bảo click vào link trong vòng 24 giờ',
      'Kiểm tra lại email đã đăng ký',
      'Thêm domain asiashop.vn vào danh sách an toàn'
    ],
    prevention: [
      'Sử dụng email chính và thường xuyên kiểm tra',
      'Đăng ký với thông tin chính xác',
      'Xác thực email ngay sau khi đăng ký'
    ],
    severity: 'medium',
    category: 'account',
    estimatedTime: '5-15 phút',
    difficulty: 'easy'
  }
];

// Shopping and Cart Issues
const shoppingIssues: TroubleshootingIssue[] = [
  {
    id: 'add-to-cart-failures',
    title: 'Không thêm được sản phẩm vào giỏ hàng',
    description: 'Lỗi khi cố gắng thêm sản phẩm vào giỏ hàng, nút thêm vào giỏ hàng không hoạt động.',
    symptoms: [
      'Nút "Thêm vào giỏ hàng" không phản hồi',
      'Thông báo lỗi khi thêm sản phẩm',
      'Sản phẩm không xuất hiện trong giỏ hàng',
      'Giỏ hàng hiển thị số lượng 0'
    ],
    causes: [
      'Sản phẩm hết hàng',
      'Lỗi kết nối mạng',
      'Chưa chọn đủ thuộc tính sản phẩm',
      'Lỗi JavaScript trên trang'
    ],
    solutions: [
      'Kiểm tra lại tình trạng sản phẩm',
      'Làm mới trang và thử lại',
      'Chọn đầy đủ thuộc tính (size, màu sắc)',
      'Đăng nhập vào tài khoản',
      'Xóa cache trình duyệt',
      'Thử bằng trình duyệt khác'
    ],
    prevention: [
      'Đăng nhập trước khi mua sắm',
      'Kiểm tra tình trạng sản phẩm',
      'Đảm bảo kết nối internet ổn định'
    ],
    severity: 'medium',
    category: 'shopping',
    estimatedTime: '5-10 phút',
    difficulty: 'easy'
  },
  {
    id: 'cart-update-issues',
    title: 'Giỏ hàng không cập nhật',
    description: 'Sản phẩm trong giỏ hàng không thay đổi khi cập nhật số lượng hoặc xóa.',
    symptoms: [
      'Thay đổi số lượng nhưng không cập nhật',
      'Không xóa được sản phẩm khỏi giỏ hàng',
      'Tổng tiền không thay đổi',
      'Lưu giỏ hàng không thành công'
    ],
    causes: [
      'Lỗi kết nối mạng',
      'Session hết hạn',
      'Lỗi kỹ thuật giỏ hàng',
      'Vượt quá số lượng cho phép'
    ],
    solutions: [
      'Làm mới trang giỏ hàng',
      'Đăng nhập lại vào tài khoản',
      'Xóa cache và cookie',
      'Thử xóa từng sản phẩm một cách riêng lẻ',
      'Làm mới giỏ hàng hoàn toàn'
    ],
    prevention: [
      'Đăng nhập khi mua sắm',
      'Không để giỏ hàng quá lâu',
      'Kiểm tra lại trước khi thanh toán'
    ],
    severity: 'medium',
    category: 'shopping',
    estimatedTime: '5-15 phút',
    difficulty: 'easy'
  },
  {
    id: 'coupon-issues',
    title: 'Mã giảm giá không hoạt động',
    description: 'Không áp dụng được mã khuyến mãi hoặc thông báo mã không hợp lệ.',
    symptoms: [
      'Thông báo "Mã không hợp lệ"',
      'Mã giảm giá không được áp dụng',
      'Giá không giảm sau khi nhập mã',
      'Mã hết hạn hoặc không áp dụng cho sản phẩm'
    ],
    causes: [
      'Mã đã hết hạn',
      'Không đủ điều kiện áp dụng',
      'Mã chỉ áp dụng cho sản phẩm cụ thể',
      'Nhập sai mã giảm giá'
    ],
    solutions: [
      'Kiểm tra lại điều kiện áp dụng mã',
      'Đảm bảo nhập đúng mã (không có khoảng trắng)',
      'Kiểm tra ngày hết hạn của mã',
      'Xem các sản phẩm được áp dụng mã',
      'Liên hệ hỗ trợ để kiểm tra mã'
    ],
    prevention: [
      'Đọc kỹ điều kiện áp dụng',
      'Sử dụng mã trước khi hết hạn',
      'Kiểm tra sản phẩm áp dụng mã'
    ],
    severity: 'low',
    category: 'shopping',
    estimatedTime: '5-10 phút',
    difficulty: 'easy'
  },
  {
    id: 'shipping-calculation-errors',
    title: 'Lỗi tính phí vận chuyển',
    description: 'Phí vận chuyển không được tính hoặc hiển thị sai giá.',
    symptoms: [
      'Phí vận chuyển hiển thị 0đ',
      'Không thể chọn phương thức vận chuyển',
      'Phí vận chuyển quá cao',
      'Lỗi khi tính phí vận chuyển'
    ],
    causes: [
      'Chưa nhập đủ địa chỉ',
      'Khu vực không hỗ trợ vận chuyển',
      'Lỗi hệ thống tính phí',
      'Sản phẩm quá khổ hoặc nặng'
    ],
    solutions: [
      'Nhập đầy đủ địa chỉ giao hàng',
      'Kiểm tra khu vực có hỗ trợ vận chuyển không',
      'Làm mới trang và tính lại phí',
      'Thử chọn phương thức vận chuyển khác',
      'Liên hệ hỗ trợ để kiểm tra'
    ],
    prevention: [
      'Nhập chính xác địa chỉ giao hàng',
      'Kiểm tra khu vực hỗ trợ trước khi đặt hàng',
      'Xem lại thông tin trước khi xác nhận'
    ],
    severity: 'medium',
    category: 'shopping',
    estimatedTime: '5-10 phút',
    difficulty: 'easy'
  }
];

// Order and Payment Issues
const orderIssues: TroubleshootingIssue[] = [
  {
    id: 'payment-processing-errors',
    title: 'Lỗi xử lý thanh toán',
    description: 'Thanh toán bị gián đoạn hoặc không hoàn tất được quá trình.',
    symptoms: [
      'Trang tải vô hạn khi thanh toán',
      'Thông báo lỗi từ cổng thanh toán',
      'Tiền đã trừ nhưng đơn hàng không xác nhận',
      'Quay lại trang thanh toán sau khi thanh toán'
    ],
    causes: [
      'Lỗi kết nối với cổng thanh toán',
      'Thời gian timeout quá ngắn',
      'Lỗi từ ngân hàng',
      'Sự cố hệ thống AsiaShop'
    ],
    solutions: [
      'Kiểm tra lại tài khoản ngân hàng',
      'Chờ 10-15 phút và kiểm tra lại đơn hàng',
      'Chụp màn hình xác nhận thanh toán',
      'Liên hệ hỗ trợ với mã giao dịch',
      'Tránh thao tác nhiều lần'
    ],
    prevention: [
      'Kiểm tra kết nối internet',
      'Không đóng trình duyệt khi đang thanh toán',
      'Sử dụng phương thức thanh toán đáng tin cậy'
    ],
    severity: 'high',
    category: 'order',
    estimatedTime: '15-30 phút',
    difficulty: 'hard'
  },
  {
    id: 'order-confirmation-failures',
    title: 'Đơn hàng không được xác nhận',
    description: 'Sau khi thanh toán nhưng không nhận được xác nhận đơn hàng.',
    symptoms: [
      'Không nhận được email xác nhận',
      'Đơn hàng không xuất hiện trong lịch sử',
      'Trạng thái đơn hàng không cập nhật',
      'Mã đơn hàng không được tạo'
    ],
    causes: [
      'Lỗi hệ thống tạo đơn hàng',
      'Email không chính xác',
      'Thanh toán chưa hoàn tất',
      'Lỗi xử lý đơn hàng tự động'
    ],
    solutions: [
      'Kiểm tra email đã đăng ký',
      'Kiểm tra lại phương thức thanh toán',
      'Tìm kiếm đơn hàng bằng email hoặc số điện thoại',
      'Liên hệ hỗ trợ với thông tin thanh toán',
      'Kiểm tra lại tài khoản ngân hàng'
    ],
    prevention: [
      'Đảm bảo email chính xác',
      'Chờ xác nhận trước khi đóng trang',
      'Lưu lại thông tin thanh toán'
    ],
    severity: 'high',
    category: 'order',
    estimatedTime: '10-20 phút',
    difficulty: 'medium'
  },
  {
    id: 'duplicate-orders',
    title: 'Đặt hàng trùng lặp',
    description: 'Tạo ra nhiều đơn hàng giống nhau do nhầm lẫn hoặc lỗi hệ thống.',
    symptoms: [
      'Nhiều đơn hàng giống nhau',
      'Bị trừ tiền nhiều lần',
      'Nhận nhiều email xác nhận',
      'Nhiều đơn hàng đang xử lý'
    ],
    causes: [
      'Nhấn nút "Đặt hàng" nhiều lần',
      'Lỗi tải trang khi đặt hàng',
      'Lỗi hệ thống tạo đơn hàng',
      'Vấn đề với cổng thanh toán'
    ],
    solutions: [
      'Liên hệ ngay lập tức để hủy đơn thừa',
      'Cung cấp mã đơn hàng cần giữ lại',
      'Yêu cầu hoàn tiền cho đơn trùng',
      'Kiểm tra lại đơn hàng đã xác nhận',
      'Không thao tác lại khi đang xử lý'
    ],
    prevention: [
      'Chờ xác nhận trước khi thao tác lại',
      'Kiểm tra lại đơn hàng trước khi đặt',
      'Không nhấn nút nhiều lần'
    ],
    severity: 'medium',
    category: 'order',
    estimatedTime: '10-30 phút',
    difficulty: 'medium'
  },
  {
    id: 'payment-method-not-working',
    title: 'Phương thức thanh toán không hoạt động',
    description: 'Không thể chọn hoặc sử dụng một phương thức thanh toán cụ thể.',
    symptoms: [
      'Phương thức thanh toán bị xám',
      'Không thể chọn phương thức mong muốn',
      'Thông báo lỗi khi chọn phương thức',
      'Chỉ có một vài phương thức khả dụng'
    ],
    causes: [
      'Phương thức đang bảo trì',
      'Giá trị đơn hàng không đủ điều kiện',
      'Lỗi kỹ thuật với phương thức cụ thể',
      'Không hỗ trợ cho khu vực của bạn'
    ],
    solutions: [
      'Chọn phương thức thanh toán khác',
      'Kiểm tra điều kiện áp dụng phương thức',
      'Liên hệ hỗ trợ để kiểm tra',
      'Thử lại sau vài phút',
      'Chia nhỏ đơn hàng nếu cần'
    ],
    prevention: [
      'Có sẵn nhiều phương thức thanh toán',
      'Kiểm tra điều kiện trước khi đặt hàng',
      'Cập nhật thông tin thanh toán'
    ],
    severity: 'medium',
    category: 'order',
    estimatedTime: '5-10 phút',
    difficulty: 'easy'
  }
];

// Self-Service Solutions
const selfServiceSolutions = [
  {
    category: 'Đăng nhập & Tài khoản',
    icon: User,
    solutions: [
      {
        title: 'Quên mật khẩu',
        steps: [
          'Vào trang đăng nhập',
          'Nhấn "Quên mật khẩu"',
          'Nhập email đăng ký',
          'Kiểm tra email và nhấp vào link',
          'Tạo mật khẩu mới'
        ],
        time: '5 phút',
        difficulty: 'Dễ'
      },
      {
        title: 'Tài khoản bị khóa',
        steps: [
          'Chờ 30 phút nếu khóa tự động',
          'Kiểm tra email thông báo',
          'Làm theo hướng dẫn trong email',
          'Liên hệ hỗ trợ nếu cần'
        ],
        time: '30 phút - 24 giờ',
        difficulty: 'Trung bình'
      }
    ]
  },
  {
    category: 'Thanh toán',
    icon: CreditCard,
    solutions: [
      {
        title: 'Thanh toán thất bại',
        steps: [
          'Kiểm tra lại thông tin thẻ',
          'Thử phương thức thanh toán khác',
          'Kiểm tra kết nối internet',
          'Liên hệ ngân hàng nếu cần'
        ],
        time: '10 phút',
        difficulty: 'Dễ'
      },
      {
        title: 'COD không khả dụng',
        steps: [
          'Kiểm tra giá trị đơn hàng (<20 triệu)',
          'Nhập chính xác địa chỉ',
          'Chọn phương thức thanh toán khác',
          'Liên hệ hỗ trợ để kiểm tra'
        ],
        time: '5 phút',
        difficulty: 'Dễ'
      }
    ]
  },
  {
    category: 'Giỏ hàng & Mua sắm',
    icon: ShoppingCart,
    solutions: [
      {
        title: 'Không thêm vào giỏ hàng',
        steps: [
          'Kiểm tra tình trạng sản phẩm',
          'Chọn đầy đủ thuộc tính',
          'Làm mới trang và thử lại',
          'Đăng nhập vào tài khoản'
        ],
        time: '5 phút',
        difficulty: 'Dễ'
      },
      {
        title: 'Mã giảm giá không hoạt động',
        steps: [
          'Kiểm tra điều kiện áp dụng',
          'Nhập đúng mã giảm giá',
          'Kiểm tra ngày hết hạn',
          'Liên hệ hỗ trợ để xác nhận'
        ],
        time: '5 phút',
        difficulty: 'Dễ'
      }
    ]
  }
];

// System Status Data
const systemServices = [
  { name: 'Website AsiaShop', status: 'operational', uptime: '99.9%', lastChecked: '2 phút trước' },
  { name: 'Cổng thanh toán', status: 'operational', uptime: '99.8%', lastChecked: '1 phút trước' },
  { name: 'Hệ thống đơn hàng', status: 'operational', uptime: '99.7%', lastChecked: '3 phút trước' },
  { name: 'Email notifications', status: 'degraded', uptime: '98.5%', lastChecked: '5 phút trước' },
  { name: 'API Services', status: 'operational', uptime: '99.9%', lastChecked: '1 phút trước' },
  { name: 'Mobile Apps', status: 'operational', uptime: '99.6%', lastChecked: '4 phút trước' }
];

// Diagnostic Tools
const diagnosticTools = [
  {
    name: 'Kiểm tra kết nối mạng',
    description: 'Kiểm tra tốc độ và chất lượng kết nối internet của bạn',
    icon: Wifi,
    action: 'Chạy kiểm tra',
    tool: 'network-check'
  },
  {
    name: 'Kiểm tra trình duyệt',
    description: 'Kiểm tra phiên bản và tính năng trình duyệt của bạn',
    icon: Monitor,
    action: 'Kiểm tra ngay',
    tool: 'browser-check'
  },
  {
    name: 'Xóa cache và cookie',
    description: 'Hướng dẫn xóa cache và cookie cho các trình duyệt phổ biến',
    icon: RefreshCw,
    action: 'Xem hướng dẫn',
    tool: 'cache-clear'
  },
  {
    name: 'Kiểm tra hệ thống',
    description: 'Kiểm tra trạng thái hệ thống AsiaShop hiện tại',
    icon: Activity,
    action: 'Kiểm tra trạng thái',
    tool: 'system-status'
  }
];

// When to Contact Support Guidelines
const supportGuidelines = [
  {
    situation: 'Khẩn cấp - Cần ngay lập tức',
    icon: AlertTriangle,
    scenarios: [
      'Bị trừ tiền nhưng không nhận được đơn hàng',
      'Tài khoản bị truy cập trái phép',
      'Lỗi bảo mật nghiêm trọng',
      'Không thể hủy đơn hàng khẩn cấp'
    ],
    contactMethod: 'Hotline 1900 1234',
    responseTime: 'Ngay lập tức'
  },
  {
    situation: 'Ưu tiên cao - Trong vòng 1 giờ',
    icon: Clock,
    scenarios: [
      'Đơn hàng quan trọng không xác nhận',
      'Tài khoản bị khóa không rõ lý do',
      'Lỗi thanh toán với số tiền lớn',
      'Sản phẩm quan trọng hết hàng sau khi đặt'
    ],
    contactMethod: 'Chat trực tiếp',
    responseTime: '15-30 phút'
  },
  {
    situation: 'Thông thường - Trong vòng 24 giờ',
    icon: MessageSquare,
    scenarios: [
      'Hỏi đáp về chính sách',
      'Yêu cầu đổi trả thông thường',
      'Cập nhật thông tin tài khoản',
      'Phản hồi về sản phẩm/dịch vụ'
    ],
    contactMethod: 'Email support@asiashop.vn',
    responseTime: '2-4 giờ'
  }
];

// Troubleshooting FAQs
const troubleshootingFAQs = [
  {
    question: 'Làm sao để biết lỗi do phía tôi hay do hệ thống AsiaShop?',
    answer: 'Bạn có thể kiểm tra bằng cách: 1) Thử thực hiện thao tác tương tự trên trình duyệt khác, 2) Kiểm tra kết nối internet, 3) Xem trạng thái hệ thống AsiaShop, 4) Thử với tài khoản khác. Nếu vấn đề chỉ xảy ra với bạn, có thể do phía bạn. Nếu nhiều người gặp vấn đề tương tự, đó là lỗi hệ thống.'
  },
  {
    question: 'Tôi nên làm gì khi gặp lỗi không tìm thấy trong hướng dẫn?',
    answer: 'Khi gặp lỗi mới: 1) Chụp màn hình thông báo lỗi, 2) Ghi lại các bước đã thực hiện, 3) Thu thập thông tin trình duyệt và thiết bị, 4) Liên hệ hỗ trợ với đầy đủ thông tin. Càng chi tiết, chúng tôi càng hỗ trợ nhanh hơn.'
  },
  {
    question: 'Làm thế nào để phòng ngừa các sự cố thường gặp?',
    answer: 'Để phòng ngừa sự cố: 1) Luôn cập nhật trình duyệt và ứng dụng, 2) Sử dụng mật khẩu mạnh và bật 2FA, 3) Kiểm tra kỹ thông tin trước khi xác nhận, 4) Lưu lại thông tin quan trọng, 5) Thường xuyên xóa cache và cookie, 6) Sử dụng kết nối internet ổn định.'
  }
];

// Helper function to get severity color
const getSeverityColor = (severity: Severity) => {
  switch (severity) {
    case 'low': return 'bg-green-100 text-green-600 border-green-200';
    case 'medium': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
    case 'high': return 'bg-orange-100 text-orange-600 border-orange-200';
    case 'critical': return 'bg-red-100 text-red-600 border-red-200';
    default: return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

// Helper function to get difficulty color
const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard') => {
  switch (difficulty) {
    case 'easy': return 'text-green-600';
    case 'medium': return 'text-yellow-600';
    case 'hard': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

// Helper function to get status icon
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'operational': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'degraded': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case 'down': return <XCircle className="h-4 w-4 text-red-500" />;
    default: return <HelpCircle className="h-4 w-4 text-gray-500" />;
  }
};

export default function TroubleshootingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
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
              <div className="mt-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Khắc phục sự cố
                </h1>
                <p className="text-lg text-gray-600 max-w-3xl">
                  Hướng dẫn chi tiết để chẩn đoán và giải quyết các vấn đề thường gặp khi sử dụng AsiaShop.
                  Tìm giải pháp nhanh chóng cho các sự cố kỹ thuật, tài khoản và thanh toán.
                </p>
              </div>
            </div>

            {/* Search Section */}
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Search className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-blue-900">
                  Tìm kiếm giải pháp
                </h2>
              </div>
              <HelpSearch
                className="max-w-2xl"
                placeholder="Tìm kiếm vấn đề bạn đang gặp phải..."
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-blue-700">Tìm kiếm phổ biến:</span>
                <Badge variant="secondary" className="cursor-pointer hover:bg-blue-100">
                  không đăng nhập được
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-blue-100">
                  thanh toán thất bại
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-blue-100">
                  không thêm vào giỏ hàng
                </Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-blue-100">
                  quên mật khẩu
                </Badge>
              </div>
            </div>

            {/* Quick Diagnostic Tools */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Công cụ chẩn đoán nhanh</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {diagnosticTools.map((tool, index) => {
                  const Icon = tool.icon;
                  return (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{tool.name}</h3>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{tool.description}</p>
                        <Button variant="outline" size="sm" className="w-full">
                          {tool.action}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* System Status */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Trạng thái hệ thống</h2>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-green-600" />
                        Tất cả hệ thống đang hoạt động
                      </CardTitle>
                      <CardDescription>
                        Cập nhật lần cuối: 2 phút trước
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      Hoạt động bình thường
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemServices.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(service.status)}
                          <div>
                            <div className="font-medium">{service.name}</div>
                            <div className="text-sm text-gray-500">
                              Uptime: {service.uptime} • Kiểm tra: {service.lastChecked}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={service.status === 'operational' ? 'default' : 'secondary'}
                          className={service.status === 'degraded' ? 'bg-yellow-100 text-yellow-600' : ''}
                        >
                          {service.status === 'operational' ? 'Hoạt động' :
                           service.status === 'degraded' ? 'Giảm hiệu suất' : 'Lỗi'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Xem trang trạng thái chi tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Issues Categories */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Các sự cố thường gặp</h2>
              <Tabs defaultValue="technical" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="technical">Kỹ thuật</TabsTrigger>
                  <TabsTrigger value="account">Tài khoản</TabsTrigger>
                  <TabsTrigger value="shopping">Mua sắm</TabsTrigger>
                  <TabsTrigger value="order">Đơn hàng</TabsTrigger>
                  <TabsTrigger value="solutions">Tự khắc phục</TabsTrigger>
                </TabsList>

                {/* Technical Issues */}
                <TabsContent value="technical" className="space-y-4">
                  {technicalIssues.map((issue, index) => (
                    <Card key={issue.id} className="overflow-hidden">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-lg">{issue.title}</CardTitle>
                              <Badge
                                variant="outline"
                                className={getSeverityColor(issue.severity)}
                              >
                                {issue.severity === 'low' ? 'Thấp' :
                                 issue.severity === 'medium' ? 'Trung bình' :
                                 issue.severity === 'high' ? 'Cao' : 'Khẩn cấp'}
                              </Badge>
                            </div>
                            <CardDescription>{issue.description}</CardDescription>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-sm text-gray-500">Thời gian:</div>
                            <div className="font-medium">{issue.estimatedTime}</div>
                            <div className={`text-sm ${getDifficultyColor(issue.difficulty)}`}>
                              {issue.difficulty === 'easy' ? 'Dễ' :
                               issue.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Symptoms */}
                        <div>
                          <h4 className="font-medium mb-2 text-red-600">Dấu hiệu nhận biết:</h4>
                          <ul className="space-y-1">
                            {issue.symptoms.map((symptom, symptomIndex) => (
                              <li key={symptomIndex} className="flex items-start gap-2 text-sm">
                                <AlertCircle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                                {symptom}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Solutions */}
                        <div>
                          <h4 className="font-medium mb-2 text-green-600">Giải pháp:</h4>
                          <ol className="space-y-2">
                            {issue.solutions.map((solution, solutionIndex) => (
                              <li key={solutionIndex} className="flex items-start gap-3">
                                <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                                  {solutionIndex + 1}
                                </span>
                                <span className="text-sm">{solution}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Prevention */}
                        {issue.prevention.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2 text-blue-600">Phòng ngừa:</h4>
                            <ul className="space-y-1">
                              {issue.prevention.map((prevention, preventionIndex) => (
                                <li key={preventionIndex} className="flex items-start gap-2 text-sm">
                                  <Shield className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                                  {prevention}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Related Links */}
                        {issue.relatedLinks && issue.relatedLinks.length > 0 && (
                          <div className="pt-3 border-t">
                            <div className="flex flex-wrap gap-2">
                              {issue.relatedLinks.map((link, linkIndex) => (
                                <Button key={linkIndex} variant="outline" size="sm" asChild>
                                  <a href={link.href} className="flex items-center gap-1">
                                    <ExternalLink className="h-3 w-3" />
                                    {link.title}
                                  </a>
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Account Issues */}
                <TabsContent value="account" className="space-y-4">
                  {accountIssues.map((issue, index) => (
                    <Card key={issue.id} className="overflow-hidden">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-lg">{issue.title}</CardTitle>
                              <Badge
                                variant="outline"
                                className={getSeverityColor(issue.severity)}
                              >
                                {issue.severity === 'low' ? 'Thấp' :
                                 issue.severity === 'medium' ? 'Trung bình' :
                                 issue.severity === 'high' ? 'Cao' : 'Khẩn cấp'}
                              </Badge>
                            </div>
                            <CardDescription>{issue.description}</CardDescription>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-sm text-gray-500">Thời gian:</div>
                            <div className="font-medium">{issue.estimatedTime}</div>
                            <div className={`text-sm ${getDifficultyColor(issue.difficulty)}`}>
                              {issue.difficulty === 'easy' ? 'Dễ' :
                               issue.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Symptoms */}
                        <div>
                          <h4 className="font-medium mb-2 text-red-600">Dấu hiệu nhận biết:</h4>
                          <ul className="space-y-1">
                            {issue.symptoms.map((symptom, symptomIndex) => (
                              <li key={symptomIndex} className="flex items-start gap-2 text-sm">
                                <AlertCircle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                                {symptom}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Solutions */}
                        <div>
                          <h4 className="font-medium mb-2 text-green-600">Giải pháp:</h4>
                          <ol className="space-y-2">
                            {issue.solutions.map((solution, solutionIndex) => (
                              <li key={solutionIndex} className="flex items-start gap-3">
                                <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                                  {solutionIndex + 1}
                                </span>
                                <span className="text-sm">{solution}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Prevention */}
                        {issue.prevention.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2 text-blue-600">Phòng ngừa:</h4>
                            <ul className="space-y-1">
                              {issue.prevention.map((prevention, preventionIndex) => (
                                <li key={preventionIndex} className="flex items-start gap-2 text-sm">
                                  <Shield className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                                  {prevention}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Shopping Issues */}
                <TabsContent value="shopping" className="space-y-4">
                  {shoppingIssues.map((issue, index) => (
                    <Card key={issue.id} className="overflow-hidden">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-lg">{issue.title}</CardTitle>
                              <Badge
                                variant="outline"
                                className={getSeverityColor(issue.severity)}
                              >
                                {issue.severity === 'low' ? 'Thấp' :
                                 issue.severity === 'medium' ? 'Trung bình' :
                                 issue.severity === 'high' ? 'Cao' : 'Khẩn cấp'}
                              </Badge>
                            </div>
                            <CardDescription>{issue.description}</CardDescription>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-sm text-gray-500">Thời gian:</div>
                            <div className="font-medium">{issue.estimatedTime}</div>
                            <div className={`text-sm ${getDifficultyColor(issue.difficulty)}`}>
                              {issue.difficulty === 'easy' ? 'Dễ' :
                               issue.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Symptoms */}
                        <div>
                          <h4 className="font-medium mb-2 text-red-600">Dấu hiệu nhận biết:</h4>
                          <ul className="space-y-1">
                            {issue.symptoms.map((symptom, symptomIndex) => (
                              <li key={symptomIndex} className="flex items-start gap-2 text-sm">
                                <AlertCircle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                                {symptom}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Solutions */}
                        <div>
                          <h4 className="font-medium mb-2 text-green-600">Giải pháp:</h4>
                          <ol className="space-y-2">
                            {issue.solutions.map((solution, solutionIndex) => (
                              <li key={solutionIndex} className="flex items-start gap-3">
                                <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                                  {solutionIndex + 1}
                                </span>
                                <span className="text-sm">{solution}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Prevention */}
                        {issue.prevention.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2 text-blue-600">Phòng ngừa:</h4>
                            <ul className="space-y-1">
                              {issue.prevention.map((prevention, preventionIndex) => (
                                <li key={preventionIndex} className="flex items-start gap-2 text-sm">
                                  <Shield className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                                  {prevention}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Order Issues */}
                <TabsContent value="order" className="space-y-4">
                  {orderIssues.map((issue, index) => (
                    <Card key={issue.id} className="overflow-hidden">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-lg">{issue.title}</CardTitle>
                              <Badge
                                variant="outline"
                                className={getSeverityColor(issue.severity)}
                              >
                                {issue.severity === 'low' ? 'Thấp' :
                                 issue.severity === 'medium' ? 'Trung bình' :
                                 issue.severity === 'high' ? 'Cao' : 'Khẩn cấp'}
                              </Badge>
                            </div>
                            <CardDescription>{issue.description}</CardDescription>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-sm text-gray-500">Thời gian:</div>
                            <div className="font-medium">{issue.estimatedTime}</div>
                            <div className={`text-sm ${getDifficultyColor(issue.difficulty)}`}>
                              {issue.difficulty === 'easy' ? 'Dễ' :
                               issue.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Symptoms */}
                        <div>
                          <h4 className="font-medium mb-2 text-red-600">Dấu hiệu nhận biết:</h4>
                          <ul className="space-y-1">
                            {issue.symptoms.map((symptom, symptomIndex) => (
                              <li key={symptomIndex} className="flex items-start gap-2 text-sm">
                                <AlertCircle className="h-3 w-3 text-red-500 mt-1 flex-shrink-0" />
                                {symptom}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Solutions */}
                        <div>
                          <h4 className="font-medium mb-2 text-green-600">Giải pháp:</h4>
                          <ol className="space-y-2">
                            {issue.solutions.map((solution, solutionIndex) => (
                              <li key={solutionIndex} className="flex items-start gap-3">
                                <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                                  {solutionIndex + 1}
                                </span>
                                <span className="text-sm">{solution}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Prevention */}
                        {issue.prevention.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2 text-blue-600">Phòng ngừa:</h4>
                            <ul className="space-y-1">
                              {issue.prevention.map((prevention, preventionIndex) => (
                                <li key={preventionIndex} className="flex items-start gap-2 text-sm">
                                  <Shield className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                                  {prevention}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Self-Service Solutions */}
                <TabsContent value="solutions" className="space-y-6">
                  {selfServiceSolutions.map((category, categoryIndex) => {
                    const Icon = category.icon;
                    return (
                      <Card key={categoryIndex}>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                              <Icon className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-xl">{category.category}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {category.solutions.map((solution, solutionIndex) => (
                              <div key={solutionIndex} className="space-y-4 p-4 border rounded-lg">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold">{solution.title}</h4>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-3 w-3" />
                                    <span>{solution.time}</span>
                                    <span className={getDifficultyColor(solution.difficulty as any)}>
                                      • {solution.difficulty}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <h5 className="font-medium mb-2 text-sm">Các bước thực hiện:</h5>
                                  <ol className="space-y-1">
                                    {solution.steps.map((step, stepIndex) => (
                                      <li key={stepIndex} className="flex items-start gap-2 text-sm">
                                        <span className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                                          {stepIndex + 1}
                                        </span>
                                        {step}
                                      </li>
                                    ))}
                                  </ol>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </TabsContent>
              </Tabs>
            </section>

            {/* When to Contact Support */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">Khi nào cần liên hệ hỗ trợ</h2>
              <div className="space-y-4">
                {supportGuidelines.map((guideline, index) => {
                  const Icon = guideline.icon;
                  return (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <Icon className="h-6 w-6 text-blue-600" />
                          <CardTitle className="text-lg">{guideline.situation}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <h4 className="font-medium mb-2">Các tình huống:</h4>
                            <ul className="space-y-1">
                              {guideline.scenarios.map((scenario, scenarioIndex) => (
                                <li key={scenarioIndex} className="flex items-start gap-2 text-sm">
                                  <ChevronRight className="h-3 w-3 text-blue-500 mt-1 flex-shrink-0" />
                                  {scenario}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Liên hệ qua:</h4>
                            <p className="text-sm font-medium text-blue-600">{guideline.contactMethod}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Thời gian phản hồi:</h4>
                            <p className="text-sm font-medium">{guideline.responseTime}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* FAQ Section */}
            <section>
              <FAQSection
                title="Câu hỏi thường gặp về khắc phục sự cố"
                items={troubleshootingFAQs}
              />
            </section>

            {/* Contact Support CTA */}
            <section>
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="p-8">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Vẫn cần hỗ trợ?</h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Nếu bạn đã thử các giải pháp trên mà vẫn không giải quyết được vấn đề,
                      đừng ngần ngại liên hệ với đội ngũ hỗ trợ của chúng tôi.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button asChild>
                        <a href="/help/contact">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat với hỗ trợ
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href="mailto:support@asiashop.vn">
                          <Mail className="h-4 w-4 mr-2" />
                          Gửi email
                        </a>
                      </Button>
                      <Button variant="outline" asChild>
                        <a href="tel:19001234">
                          <Phone className="h-4 w-4 mr-2" />
                          Gọi hotline
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}