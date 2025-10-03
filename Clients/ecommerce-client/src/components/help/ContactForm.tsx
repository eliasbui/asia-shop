'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

interface ContactFormProps {
  className?: string;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  orderNumber?: string;
}

export function ContactForm({ className }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    orderNumber: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Vui lòng nhập chủ đề';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Vui lòng nhập nội dung tin nhắn';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Tin nhắn phải có ít nhất 10 ký tự';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        orderNumber: '',
      });
      setErrors({});
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <CardTitle>Gửi yêu cầu hỗ trợ</CardTitle>
        <CardDescription>
          Điền vào biểu mẫu dưới đây và chúng tôi sẽ phản hồi trong vòng 24 giờ.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Họ tên *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange('name')}
                className={cn(errors.name && 'border-red-500')}
                placeholder="Nhập họ tên của bạn"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                className={cn(errors.email && 'border-red-500')}
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Chủ đề *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={handleInputChange('subject')}
              className={cn(errors.subject && 'border-red-500')}
              placeholder="Ví dụ: Vấn đề về đơn hàng #12345"
            />
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="orderNumber">Mã đơn hàng (nếu có)</Label>
            <Input
              id="orderNumber"
              value={formData.orderNumber}
              onChange={handleInputChange('orderNumber')}
              placeholder="Ví dụ: #12345"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Nội dung tin nhắn *</Label>
            <textarea
              id="message"
              value={formData.message}
              onChange={handleInputChange('message')}
              className={cn(
                'w-full min-h-[120px] px-3 py-2 text-sm ring-offset-background border border-input bg-background rounded-md',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                errors.message && 'border-red-500'
              )}
              placeholder="Mô tả chi tiết vấn đề của bạn..."
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message}</p>
            )}
          </div>

          {submitStatus === 'success' && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                Yêu cầu hỗ trợ của bạn đã được gửi thành công! Chúng tôi sẽ phản hồi trong vòng 24 giờ.
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === 'error' && (
            <Alert className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-800">
                Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau.
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Hotline:</strong> 1900 1234 (8:00 - 22:00, T2 - CN)
            </p>
            <p>
              <strong>Email:</strong> support@asiashop.vn
            </p>
            <p>
              <strong>Live Chat:</strong> Có sẵn trên website (8:00 - 22:00)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}