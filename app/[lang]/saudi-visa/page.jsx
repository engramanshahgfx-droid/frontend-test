import Evisa from "@/components/visa/visa";

export const dynamic = 'force-dynamic';

async function getVisaCountries() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  
  try {
    const response = await fetch(`${apiUrl}/visa-countries`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Failed to fetch visa countries:', error);
    return [];
  }
}

export default async function VisaPage({ params }) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "ar";
  
  const countries = await getVisaCountries();
  
  return <Evisa lang={lang} basePath="/visas" countries={countries} />;
}