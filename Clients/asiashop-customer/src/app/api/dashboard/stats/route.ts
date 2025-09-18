import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth/config'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Get user stats
    const [
      orderCount,
      totalSpent,
      wishlistCount,
      pendingReviews,
      unreadNotifications,
      recentOrders,
      userProfile
    ] = await Promise.all([
      // Total orders count
      prisma.order.count({
        where: { userId }
      }),
      
      // Total amount spent
      prisma.order.aggregate({
        where: {
          userId,
          status: {
            in: ['DELIVERED', 'SHIPPED', 'PROCESSING', 'CONFIRMED']
          }
        },
        _sum: {
          totalAmount: true
        }
      }),
      
      // Wishlist items count
      prisma.wishlistItem.count({
        where: { userId }
      }),
      
      // Pending reviews count (orders delivered but not reviewed)
      prisma.order.count({
        where: {
          userId,
          status: 'DELIVERED',
          items: {
            some: {
              product: {
                reviews: {
                  none: {
                    userId
                  }
                }
              }
            }
          }
        }
      }),
      
      // Unread notifications count
      prisma.notification.count({
        where: {
          userId,
          read: false
        }
      }),
      
      // Recent orders (last 5)
      prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                  price: true
                }
              }
            }
          }
        }
      }),
      
      // User profile
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          firstName: true,
          lastName: true,
          email: true,
          createdAt: true,
          preferences: true
        }
      })
    ])

    // Get personalized recommendations (simplified version)
    const recommendedProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true
      },
      take: 8,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    const stats = {
      totalOrders: orderCount,
      totalSpent: totalSpent._sum.totalAmount || 0,
      activeWishlistItems: wishlistCount,
      pendingReviews,
      unreadNotifications,
      recentOrders,
      recommendedProducts,
      userProfile
    }

    return NextResponse.json({
      success: true,
      data: stats
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}