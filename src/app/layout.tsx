import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactButtons from "@/components/ContactButtons";
import { getCurrentUser } from "@/actions/authActions";

export const metadata: Metadata = {
  title: "Shree Traders | Sarees, Kurtas & Fashion in Damak, Jhapa",
  description:
    "Shree Traders at Thana Road, Lekhnath Chowk, Damak. Discover premium bridal Banarasi sarees, party wear chiffons, and trending kurta sets with fast local delivery across Damak and Jhapa.",
  keywords: [
    "Shree Traders",
    "Damak Saree Shop",
    "Sarees Damak",
    "Kurtas Damak",
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
              <Navbar />
              <main className="flex-1">{children}</main>
              <ContactButtons variant="floating" />
              <Footer />
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
