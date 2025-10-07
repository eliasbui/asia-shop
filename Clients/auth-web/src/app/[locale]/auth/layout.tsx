'use client';

import { ReactNode } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { Package, ShieldCheck, Truck, Star } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const t = useTranslations('auth');
  const locale = useLocale();

  const features = [
    {
      icon: Package,
      titleKey: "features.products.title",
      descriptionKey: "features.products.description"
    },
    {
      icon: ShieldCheck,
      titleKey: "features.payment.title",
      descriptionKey: "features.payment.description"
    },
    {
      icon: Truck,
      titleKey: "features.delivery.title",
      descriptionKey: "features.delivery.description"
    },
    {
      icon: Star,
      titleKey: "features.rating.title",
      descriptionKey: "features.rating.description"
    }
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Slogan & Background */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 dark:from-purple-900 dark:via-purple-800 dark:to-indigo-900 p-12 flex-col justify-between relative overflow-hidden"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Floating Asian Products Background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-[10%] left-[15%] text-6xl animate-float" style={{ animationDelay: '0s' }}>
            🍜
          </div>
          <div className="absolute top-[25%] right-[20%] text-5xl animate-float-slow" style={{ animationDelay: '2s' }}>
            🥟
          </div>
          <div className="absolute bottom-[30%] left-[10%] text-7xl animate-float" style={{ animationDelay: '1s' }}>
            🍱
          </div>
          <div className="absolute top-[60%] right-[15%] text-6xl animate-float-slow" style={{ animationDelay: '3s' }}>
            🍵
          </div>
          <div className="absolute bottom-[15%] right-[25%] text-5xl animate-float" style={{ animationDelay: '1.5s' }}>
            🥢
          </div>
          <div className="absolute top-[40%] left-[25%] text-6xl animate-float-slow" style={{ animationDelay: '2.5s' }}>
            🍙
          </div>
          <div className="absolute top-[75%] left-[35%] text-5xl animate-float" style={{ animationDelay: '0.5s' }}>
            🥠
          </div>
          <div className="absolute bottom-[45%] right-[30%] text-7xl animate-float-slow" style={{ animationDelay: '1.8s' }}>
            🍲
          </div>
          <div className="absolute top-[15%] left-[45%] text-5xl animate-float" style={{ animationDelay: '2.2s' }}>
            🍡
          </div>
          <div className="absolute bottom-[20%] left-[20%] text-6xl animate-float-slow" style={{ animationDelay: '3.5s' }}>
            🍢
          </div>
        </div>

        <div className="relative z-10">
          <Link href={`/${locale}`} className="flex items-center space-x-2 mb-16">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="w-10 h-10 bg-white rounded-lg flex items-center justify-center"
            >
              <Package className="w-6 h-6 text-purple-600" />
            </motion.div>
            <span className="text-2xl font-bold text-white">Asia Shop</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              {t('slogan')}
            </h1>
            <p className="text-xl text-purple-100 mb-12 leading-relaxed">
              {t('sloganDescription')}
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                className="flex items-start space-x-3"
              >
                <div className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{t(feature.titleKey)}</h3>
                  <p className="text-purple-200 text-xs mt-1">{t(feature.descriptionKey)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="relative z-10 text-purple-100 italic"
        >
          <p className="text-lg">&ldquo;{t('testimonial.quote')}&rdquo;</p>
          <p className="text-sm mt-2">- {t('testimonial.author')}</p>
        </motion.div>
      </motion.div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative bg-background overflow-hidden">
        {/* Asian Map Background - Hidden behind form */}
        <div className="absolute inset-0 opacity-20 dark:opacity-15">
          {/* Asia Map SVG Outline */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.1 }} />
                <stop offset="100%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.3 }} />
              </linearGradient>
            </defs>
            
            {/* Simplified Asia Continent Outline */}
            <path 
              d="M 200,80 L 250,60 L 320,70 L 380,50 L 450,60 L 520,80 L 580,100 L 620,140 L 650,180 L 670,240 L 680,300 L 670,360 L 640,410 L 600,440 L 550,460 L 500,470 L 450,480 L 420,490 L 380,485 L 350,475 L 320,460 L 280,450 L 250,430 L 220,400 L 190,360 L 170,320 L 160,280 L 150,240 L 160,200 L 180,150 L 200,110 Z"
              fill="url(#mapGradient)"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary/40"
              opacity="0.5"
            />
            
            {/* Country Borders - Simplified */}
            <path d="M 320,70 L 350,90 L 380,85 L 380,50" stroke="currentColor" strokeWidth="1" className="text-primary/30" fill="none" strokeDasharray="3,3" />
            <path d="M 450,60 L 470,80 L 490,95 L 520,80" stroke="currentColor" strokeWidth="1" className="text-primary/30" fill="none" strokeDasharray="3,3" />
            <path d="M 280,200 L 320,220 L 350,240 L 380,250" stroke="currentColor" strokeWidth="1" className="text-primary/30" fill="none" strokeDasharray="3,3" />
            
            {/* Cities/Capitals - Dots */}
            <circle cx="320" cy="180" r="4" fill="currentColor" className="text-primary animate-pulse" opacity="0.8" />
            <circle cx="480" cy="220" r="4" fill="currentColor" className="text-primary animate-pulse" opacity="0.8" style={{ animationDelay: '0.5s' }} />
            <circle cx="380" cy="320" r="4" fill="currentColor" className="text-primary animate-pulse" opacity="0.8" style={{ animationDelay: '1s' }} />
            <circle cx="550" cy="280" r="4" fill="currentColor" className="text-primary animate-pulse" opacity="0.8" style={{ animationDelay: '1.5s' }} />
            <circle cx="420" cy="380" r="4" fill="currentColor" className="text-primary animate-pulse" opacity="0.8" style={{ animationDelay: '2s' }} />
            
            {/* Grid Lines */}
            <line x1="0" y1="200" x2="800" y2="200" stroke="currentColor" strokeWidth="0.5" className="text-primary/20" strokeDasharray="5,10" />
            <line x1="0" y1="300" x2="800" y2="300" stroke="currentColor" strokeWidth="0.5" className="text-primary/20" strokeDasharray="5,10" />
            <line x1="0" y1="400" x2="800" y2="400" stroke="currentColor" strokeWidth="0.5" className="text-primary/20" strokeDasharray="5,10" />
            <line x1="300" y1="0" x2="300" y2="600" stroke="currentColor" strokeWidth="0.5" className="text-primary/20" strokeDasharray="5,10" />
            <line x1="500" y1="0" x2="500" y2="600" stroke="currentColor" strokeWidth="0.5" className="text-primary/20" strokeDasharray="5,10" />
          </svg>
          
          {/* Map contour pattern overlay */}
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, hsl(var(--primary) / 0.1) 1px, transparent 1px),
                             radial-gradient(circle at 70% 60%, hsl(var(--primary) / 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}></div>
          
          {/* Asian Landmarks scattered across the map */}
          <div className="absolute top-[15%] left-[20%] text-6xl animate-pulse" style={{ animationDelay: '0s', animationDuration: '4s' }}>
            🏯
          </div>
          <div className="absolute top-[35%] right-[25%] text-7xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '5s' }}>
            🗼
          </div>
          <div className="absolute bottom-[40%] left-[15%] text-6xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '4.5s' }}>
            🛕
          </div>
          <div className="absolute top-[60%] right-[20%] text-7xl animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '5.5s' }}>
            ⛩️
          </div>
          <div className="absolute bottom-[20%] left-[30%] text-6xl animate-pulse" style={{ animationDelay: '2.5s', animationDuration: '4s' }}>
            🕌
          </div>
          <div className="absolute top-[25%] left-[60%] text-5xl animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '6s' }}>
            🏛️
          </div>
          <div className="absolute bottom-[35%] right-[35%] text-6xl animate-pulse" style={{ animationDelay: '3s', animationDuration: '5s' }}>
            🏰
          </div>
          <div className="absolute top-[70%] left-[50%] text-5xl animate-pulse" style={{ animationDelay: '1.8s', animationDuration: '4.8s' }}>
            🗿
          </div>
          
          {/* Geographic markers */}
          <div className="absolute top-[20%] right-[15%] text-3xl opacity-60">📍</div>
          <div className="absolute top-[50%] left-[25%] text-3xl opacity-60">📍</div>
          <div className="absolute bottom-[25%] right-[30%] text-3xl opacity-60">📍</div>
          <div className="absolute top-[45%] right-[50%] text-3xl opacity-60">📍</div>
          
          {/* Subtle connecting lines */}
          <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <line x1="20%" y1="15%" x2="70%" y2="35%" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" className="text-primary/50" />
            <line x1="15%" y1="60%" x2="80%" y2="60%" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" className="text-primary/50" />
            <line x1="30%" y1="80%" x2="60%" y2="25%" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" className="text-primary/50" />
          </svg>
        </div>

        {/* Header with controls */}
        <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        {/* Mobile Logo */}
        <div className="lg:hidden pt-6 px-6 text-center">
          <Link href={`/${locale}`} className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">Asia Shop</span>
          </Link>
        </div>

        {/* Form Container with Card */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 bg-secondary/30 dark:bg-secondary/10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="bg-card text-card-foreground rounded-2xl shadow-2xl border border-border p-8 dark:shadow-purple-500/10">
              {children}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="pb-6 text-center text-sm text-muted-foreground"
        >
          <p>© 2024 Asia Shop. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
}