import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { registerSchema } from '@/lib/validations/auth'
import { sendVerificationEmail } from '@/lib/utils/email'
import { generateVerificationToken } from '@/lib/utils/tokens'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedFields = registerSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input data', details: validatedFields.error.format() },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, phone, password } = validatedFields.data

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(phone ? [{ phone }] : [])
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User already exists with this email or phone number' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        phone,
        firstName,
        lastName,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        createdAt: true,
      }
    })

    // Generate email verification token
    const verificationToken = generateVerificationToken()
    await prisma.verificationToken.create({
      data: {
        token: verificationToken,
        email,
        type: 'EMAIL_VERIFICATION',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        userId: user.id,
      }
    })

    // Send verification email
    await sendVerificationEmail(email, verificationToken, `${firstName} ${lastName}`)

    // Create default user preferences
    await prisma.userPreference.create({
      data: {
        userId: user.id,
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please check your email for verification.',
      data: user
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}