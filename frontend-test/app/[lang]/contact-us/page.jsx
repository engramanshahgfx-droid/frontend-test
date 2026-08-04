import Contact from "@/components/contact-us";

export default async function ContactUsPage({ params }) {
  const resolvedParams = await params;
  const { lang } = resolvedParams;
  return <Contact lang={lang} />;
}