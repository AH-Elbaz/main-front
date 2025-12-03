import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google"; // تأكد من وجود Inter هنا
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// **الخط الجديد: Inter (للعناوين)**
const interHeading = Inter({
  subsets: ["latin"],
  // حمل أوزان Inter المستخدمة في المشروع بما فيها 500 و 800
  weight: ['100','200','300','400','500','600','700','800'],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vitalink.com'),
  title: {
    default: 'VitaLink - Elite Biometric Monitoring & Performance Optimization',
    template: '%s | VitaLink'
  },
  description: 'Transform continuous biometric streams into actionable readiness intelligence for coaches and elite athletes. Master your physiology with AI-powered health monitoring.',
  keywords: ['biometric monitoring', 'performance optimization', 'health tracking', 'athlete monitoring', 'AI health', 'recovery tracking', 'sports performance'],
  authors: [{ name: 'VitaLink' }],
  creator: 'VitaLink',
  publisher: 'VitaLink',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vitalink.com',
    siteName: 'VitaLink',
    title: 'VitaLink - Elite Biometric Monitoring & Performance Optimization',
    description: 'Transform continuous biometric streams into actionable readiness intelligence for coaches and elite athletes.',
    images: [{
      url: '/home_ass/hero.png',
      width: 1200,
      height: 630,
      alt: 'VitaLink - Performance Optimization',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VitaLink - Elite Biometric Monitoring',
    description: 'Master your physiology with AI-powered health monitoring.',
    images: ['/home_ass/hero.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification tokens here when ready
    // google: 'your-google-verification-token',
    // yandex: 'your-yandex-verification-token',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        // إضافة متغير خط Inter إلى الكلاسات المتاحة
        className={`${geistSans.variable} ${geistMono.variable} ${interHeading.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}