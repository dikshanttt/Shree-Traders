import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import StoreShell from "@/components/StoreShell";
import { getCurrentUser } from "@/actions/authActions";

export const metadata: Metadata = {
  title: "Shree Traders | Find Your perfect fit — Shop with Dipa | Damak, Jhapa",
  description:
    "Shree Traders at Thana Road, Lekhnath Chowk, Damak. Shop with Dipa — Find Your perfect fit in bridal Banarasi sarees, designer kurtas, men's fashion, and kids' wear with fast local delivery across Damak and Jhapa.",
  keywords: [
    "Shree Traders",
    "Shop with Dipa",
    "Damak Clothing Store",
    "Damak Saree Shop",
    "Sarees Damak",
    "Kurtas Damak",
    "Men's Fashion Damak",
    "Kids Wear Damak",
    "Thana Road Damak",
    "Lekhnath Chowk Damak",
    "Banarasi Saree Nepal",
    "Jhapa Clothing Store",
    "eSewa Fonepay Saree",
  ],
  openGraph: {
    title: "Shree Traders - Damak's Premier Saree & Kurta Store",
    description: "Browse designer sarees, trending kurtas & fashion accessories in Damak. Fast delivery and digital payment via eSewa & Fonepay.",
    url: "https://shreetradersdamak.com",
    siteName: "Shree Traders Damak",
    images: [
      {
        url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "Shree Traders Sarees & Kurtas Damak",
      },
    ],
    locale: "ne_NP",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <LanguageProvider>
          <AuthProvider initialUser={currentUser}>
            <CartProvider>
              <StoreShell>{children}</StoreShell>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
