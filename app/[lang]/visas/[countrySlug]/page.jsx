import EvisaCountryDetails from "@/components/visa/evisa/evisaCountryDetails";

function normalizeParam(param) {
  if (Array.isArray(param)) {
    param = param.join("-");
  }
  return param ? decodeURIComponent(String(param)).toLowerCase() : "";
}

async function getVisaCountryBySlug(slug) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  
  try {
    const response = await fetch(`${apiUrl}/visa-countries/${slug}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Failed to fetch visa country:', error);
    return null;
  }
}

export default async function CountryVisaPage({ params }) {
  const resolvedParams = await params;
  const lang = normalizeParam(resolvedParams?.lang) || "ar";
  const countrySlug = normalizeParam(resolvedParams?.countrySlug);
  
  const country = await getVisaCountryBySlug(countrySlug);
  
  return <EvisaCountryDetails 
    lang={lang} 
    countrySlug={countrySlug} 
    basePath="/visas"
    initialCountry={country}
  />;
}