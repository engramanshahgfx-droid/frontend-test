import { Tajawal } from "next/font/google";
import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "font-awesome/css/font-awesome.css";
import { ToastContainer } from "react-toastify";
import ContextProvider from "@/providers/ContextProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import UIProvider from "@/providers/UIProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import AuthModal from "@/components/AuthModal";
import BookingModal from "@/components/BookingModal";
import ReservationModal from "@/components/ReservationModal";

const tajawal = Tajawal({
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
});

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ar" }];
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { lang } = resolvedParams;


  const metas = {
  ar: {
    title: "التلال والرمال - تنظيم الرحلات السياحية",
    description: "نقدم رحلات سياحية فريدة تجمع بين المتعة والمغامرة والقيمة المفيدة في ربوع المملكة العربية السعودية. رحلات العوائل، المدارس، الشركات والمجموعات الخاصة.",
  },
  en: {
    title: "Tilal Rimal - Tourism Trips Organization",
    description: "We offer unique tourism trips that combine fun, adventure, and meaningful value throughout Saudi Arabia. Family trips, school trips, corporate trips, and private groups.",
  }
};

  const baseUrl = "";
  const canonicalUrl = `${baseUrl}/${lang}`;

  const meta = metas[lang] || metas.en;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${baseUrl}/en`,
        ar: `${baseUrl}/ar`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      url: canonicalUrl,
      //  images: [
      //    {
      //      url: image,
      //      width: 1200,
      //      height: 630,
      //    },
      //  ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      //  images: [image],
    },
  };
}

export default async function RootLayout({ children, params }) {
  const resolvedParams = await params;
  const { lang } = resolvedParams;

  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      data-scroll-behavior="smooth"
      className={tajawal.className}
    >
      <head>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js"></script>
      </head>
      <body suppressHydrationWarning>
        <AuthProvider>
          <UIProvider>
            <ContextProvider>
              <Navbar lang={lang} />
              <ToastContainer position="top-center" autoClose={3000} />
              <main
                className="d-flex flex-column flex-grow-1 bg-white"
                style={{ minHeight: "100vh" }}
              >
                {children}
              </main>
              <BackToTopButton />
              <WhatsAppButton lang={lang} />
              <Footer lang={lang} />
            </ContextProvider>
            <AuthModal />
            <BookingModal />
            <ReservationModal />
          </UIProvider>
        </AuthProvider>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
