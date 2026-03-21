import './globals.css';
import { ConvexClientProvider } from './convex-provider';

export const metadata = {
  title: 'HurleyUS Mission Control',
  description: 'Real-time team communication',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
