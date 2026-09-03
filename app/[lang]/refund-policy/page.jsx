import RefundContent from '@/components/Policies/RefundContent';

export default async function RefundPage({ params }) {
  const { lang } = await params;
  return <RefundContent lang={lang} />;
}
