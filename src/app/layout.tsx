import './globals.css';
import type { Metadata, Viewport } from 'next';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'HORIZON — Home Tuition for Classes 5–12 | CBSE, ICSE, State Boards',
  description: 'Personalised home tuition for Classes 5–12 with academic assessment, verified tutor matching, progress monitoring, and parent support. Delhi NCR.',
  keywords: ['Home Tuition', 'Home Tutor', 'Classes 5-12', 'CBSE Home Tutor', 'ICSE Home Tutor', 'Horizon Tuitions'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
