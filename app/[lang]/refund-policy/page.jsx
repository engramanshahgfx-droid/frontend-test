import Refuakbarontent from '@/components/Policies/Refuakbarontent';

export default async function RefundPage({ params }) {
  const { lang } = await params;
  return <Refuakbarontent lang={lang} />;
}
