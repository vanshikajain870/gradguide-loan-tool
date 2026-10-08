import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GradGuide Education Loan Assessment Tool',
  description: 'Source-grounded decision support tool for education loan assessment, funding gap analysis, lender evaluation, and document readiness.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
