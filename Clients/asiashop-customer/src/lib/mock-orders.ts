import { OrderWithDetails } from '@/types'
import { mockProducts } from './mock-data'

// Mock orders for testing
export const mockOrders: OrderWithDetails[] = [
  {
    id: 'order-1',
    orderNumber: 'ORD-2024-001234',
    userId: 'user-1',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    status: 'DELIVERED',
    paymentStatus: 'CAPTURED',
    fulfillmentStatus: 'DELIVERED',
    currency: 'USD',
    subtotal: 329.97,
    taxAmount: 26.40,
    shippingAmount: 0,
    discountAmount: 0,
    totalAmount: 356.37,
    notes: null,
    billingAddressId: 'addr-1',
    shippingAddressId: 'addr-1',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-18T14:20:00'),
    billingAddress: {
      id: 'addr-1',
      userId: 'user-1',
      type: 'SHIPPING',
      firstName: 'John',
      lastName: 'Doe',
      company: null,
      address1: '123 Main Street',
      address2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
      phone: '+1 (555) 123-4567',
      isDefault: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    shippingAddress: {
      id: 'addr-1',
      userId: 'user-1',
      type: 'SHIPPING',
      firstName: 'John',
      lastName: 'Doe',
      company: null,
      address1: '123 Main Street',
      address2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
      phone: '+1 (555) 123-4567',
      isDefault: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    items: [
      {
        id: 'item-1',
        orderId: 'order-1',
        productId: '1',
        variantId: 'v1',
        quantity: 1,
        price: 299.99,
        totalAmount: 299.99,
        product: mockProducts[0],
        variant: mockProducts[0].variants[0]
      },
      {
        id: 'item-2',
        orderId: 'order-1',
        productId: '4',
        variantId: 'v7',
        quantity: 1,
        price: 29.99,
        totalAmount: 29.99,
        product: mockProducts[3],
        variant: mockProducts[3].variants[0]
      }
    ],
    payments: [
      {
        id: 'pay-1',
        orderId: 'order-1',
        amount: 356.37,
        currency: 'USD',
        method: 'CREDIT_CARD',
        status: 'CAPTURED',
        transactionId: 'txn_1234567890',
        createdAt: new Date('2024-01-15T10:30:00')
      }
    ],
    shipments: [
      {
        id: 'ship-1',
        orderId: 'order-1',
        trackingNumber: '1Z999AA10123456784',
        carrier: 'UPS',
        status: 'DELIVERED',
        shippedAt: new Date('2024-01-16T08:00:00'),
        deliveredAt: new Date('2024-01-18T14:20:00')
      }
    ]
  },
  {
    id: 'order-2',
    orderNumber: 'ORD-2024-001235',
    userId: 'user-1',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    status: 'SHIPPED',
    paymentStatus: 'CAPTURED',
    fulfillmentStatus: 'SHIPPED',
    currency: 'USD',
    subtotal: 549.98,
    taxAmount: 43.99,
    shippingAmount: 0,
    discountAmount: 50,
    totalAmount: 543.97,
    notes: null,
    billingAddressId: 'addr-1',
    shippingAddressId: 'addr-1',
    createdAt: new Date('2024-01-20T15:45:00'),
    updatedAt: new Date('2024-01-21T09:00:00'),
    billingAddress: {
      id: 'addr-1',
      userId: 'user-1',
      type: 'BILLING',
      firstName: 'John',
      lastName: 'Doe',
      company: null,
      address1: '123 Main Street',
      address2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
      phone: '+1 (555) 123-4567',
      isDefault: true,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    items: [
      {
        id: 'item-3',
        orderId: 'order-2',
        productId: '2',
        variantId: 'v4',
        quantity: 1,
        price: 449.99,
        totalAmount: 449.99,
        product: mockProducts[1],
        variant: mockProducts[1].variants[0]
      },
      {
        id: 'item-4',
        orderId: 'order-2',
        productId: '10',
        variantId: 'v25',
        quantity: 1,
        price: 79.99,
        totalAmount: 79.99,
        product: mockProducts[9],
        variant: mockProducts[9].variants[0]
      }
    ],
    payments: [
      {
        id: 'pay-2',
        orderId: 'order-2',
        amount: 543.97,
        currency: 'USD',
        method: 'PAYPAL',
        status: 'CAPTURED',
        transactionId: 'PP-1234567890',
        createdAt: new Date('2024-01-20T15:45:00')
      }
    ],
    shipments: [
      {
        id: 'ship-2',
        orderId: 'order-2',
        trackingNumber: 'FEDEX123456789',
        carrier: 'FedEx',
        status: 'IN_TRANSIT',
        shippedAt: new Date('2024-01-21T09:00:00'),
        deliveredAt: null
      }
    ]
  },
  {
    id: 'order-3',
    orderNumber: 'ORD-2024-001236',
    userId: 'user-1',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    status: 'PROCESSING',
    paymentStatus: 'AUTHORIZED',
    fulfillmentStatus: 'PROCESSING',
    currency: 'USD',
    subtotal: 129.99,
    taxAmount: 10.40,
    shippingAmount: 10,
    discountAmount: 0,
    totalAmount: 150.39,
    notes: 'Please gift wrap this order',
    billingAddressId: 'addr-2',
    shippingAddressId: 'addr-2',
    createdAt: new Date('2024-01-25T12:00:00'),
    updatedAt: new Date('2024-01-25T12:00:00'),
    billingAddress: {
      id: 'addr-2',
      userId: 'user-1',
      type: 'BILLING',
      firstName: 'Jane',
      lastName: 'Smith',
      company: 'Tech Corp',
      address1: '456 Corporate Blvd',
      address2: null,
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'US',
      phone: '+1 (555) 987-6543',
      isDefault: false,
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25')
    },
    shippingAddress: {
      id: 'addr-2',
      userId: 'user-1',
      type: 'SHIPPING',
      firstName: 'Jane',
      lastName: 'Smith',
      company: 'Tech Corp',
      address1: '456 Corporate Blvd',
      address2: null,
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'US',
      phone: '+1 (555) 987-6543',
      isDefault: false,
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25')
    },
    items: [
      {
        id: 'item-5',
        orderId: 'order-3',
        productId: '3',
        variantId: null,
        quantity: 1,
        price: 129.99,
        totalAmount: 129.99,
        product: mockProducts[2],
        variant: undefined
      }
    ],
    payments: [
      {
        id: 'pay-3',
        orderId: 'order-3',
        amount: 150.39,
        currency: 'USD',
        method: 'CREDIT_CARD',
        status: 'AUTHORIZED',
        transactionId: 'txn_9876543210',
        createdAt: new Date('2024-01-25T12:00:00')
      }
    ],
    shipments: []
  },
  {
    id: 'order-4',
    orderNumber: 'ORD-2024-001233',
    userId: 'user-1',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    status: 'CANCELLED',
    paymentStatus: 'REFUNDED',
    fulfillmentStatus: 'CANCELLED',
    currency: 'USD',
    subtotal: 79.99,
    taxAmount: 6.40,
    shippingAmount: 10,
    discountAmount: 0,
    totalAmount: 96.39,
    notes: null,
    billingAddressId: 'addr-1',
    shippingAddressId: 'addr-1',
    createdAt: new Date('2024-01-10T08:00:00'),
    updatedAt: new Date('2024-01-11T10:00:00'),
    billingAddress: {
      id: 'addr-1',
      userId: 'user-1',
      type: 'BILLING',
      firstName: 'John',
      lastName: 'Doe',
      company: null,
      address1: '123 Main Street',
      address2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
      phone: '+1 (555) 123-4567',
      isDefault: true,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10')
    },
    items: [
      {
        id: 'item-6',
        orderId: 'order-4',
        productId: '5',
        variantId: 'v12',
        quantity: 1,
        price: 79.99,
        totalAmount: 79.99,
        product: mockProducts[4],
        variant: mockProducts[4].variants[0]
      }
    ],
    payments: [
      {
        id: 'pay-4',
        orderId: 'order-4',
        amount: 96.39,
        currency: 'USD',
        method: 'CREDIT_CARD',
        status: 'REFUNDED',
        transactionId: 'txn_1111111111',
        createdAt: new Date('2024-01-10T08:00:00')
      }
    ],
    shipments: []
  }
]

// Helper functions for mock orders
export function getUserOrders(userId: string): OrderWithDetails[] {
  return mockOrders.filter(order => order.userId === userId)
}

export function getOrderById(orderId: string): OrderWithDetails | undefined {
  return mockOrders.find(order => order.id === orderId)
}

export function getOrderByNumber(orderNumber: string): OrderWithDetails | undefined {
  return mockOrders.find(order => order.orderNumber === orderNumber)
}

export function getOrderStatusColor(status: string): string {
  switch (status) {
    case 'DELIVERED':
      return 'text-green-600 bg-green-100'
    case 'SHIPPED':
      return 'text-blue-600 bg-blue-100'
    case 'PROCESSING':
      return 'text-yellow-600 bg-yellow-100'
    case 'CONFIRMED':
      return 'text-indigo-600 bg-indigo-100'
    case 'CANCELLED':
      return 'text-red-600 bg-red-100'
    case 'RETURNED':
      return 'text-gray-600 bg-gray-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

export function getPaymentMethodIcon(method: string): string {
  switch (method) {
    case 'CREDIT_CARD':
    case 'DEBIT_CARD':
      return '💳'
    case 'PAYPAL':
      return '🅿️'
    case 'APPLE_PAY':
      return '🍎'
    case 'GOOGLE_PAY':
      return '🇬'
    case 'BANK_TRANSFER':
      return '🏦'
    default:
      return '💰'
  }
}