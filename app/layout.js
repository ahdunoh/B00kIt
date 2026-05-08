import { Inter } from "next/font/google";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./globals.css";

const inter = Inter({subsets : ["latin"]});

export const metadata = {
  title: "B00kIt App | Book a meeting room with ease",
  description: "Book a meeting or conference room for your next event or gathering with our easy-to-use booking system. Our platform allows you to quickly find and reserve the perfect space for your needsz. With our user-friendly interface and real-time availability updates, you can easily book your desired room and ensure a seamless experience for your next event.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={ inter.className }>
        <Header />
        <main className = "mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
