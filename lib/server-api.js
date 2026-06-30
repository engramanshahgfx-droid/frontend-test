/**
 * Server-side API utility for data fetching during build time (getStaticProps)
 * This ensures data is available in static HTML for SEO
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Server-side API call function
 * Safe for use in getStaticProps/getServerSideProps
 */
export async function serverApiCall(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  };

  try {
    console.log('[serverApiCall] Fetching:', url);
    const response = await fetch(url, config);
    const status = response.status;
    let data;

    try {
      data = await response.json();
    } catch (parseError) {
      const text = await response.text();
      data = text ? { message: text } : {};
    }

    console.log('[serverApiCall] Response status:', status, 'URL:', url);

    if (!response.ok) {
      console.error('[serverApiCall] Error response:', { url, status, data });
      throw new Error(data?.message || `API error: ${status}`);
    }

    return data;
  } catch (error) {
    console.error('[serverApiCall] Fetch error:', error.message, 'URL:', url);
    throw error;
  }
}

/**
 * Fetch all offers for static generation
 */
export async function getOffersStatic() {
  try {
    const data = await serverApiCall('/offers');
    let items = [];
    if (Array.isArray(data)) items = data;
    else if (data && Array.isArray(data.data)) items = data.data;
    else if (data && Array.isArray(data.offers)) items = data.offers;
    
    return items || [];
  } catch (error) {
    console.error('[getOffersStatic] Error:', error.message);
    return [];
  }
}

/**
 * Fetch active offers for homepage special offers slider
 */
export async function getSpecialOffersStatic(limit = 10) {
  const offers = await getOffersStatic();
  return (offers || [])
    .filter((o) => o && o.is_active !== false)
    .slice(0, Math.max(1, limit));
}

/**
 * Fetch all local island destinations for static generation
 */
export async function getLocalIslandsStatic() {
  try {
    const data = await serverApiCall('/island-destinations/local');
    if (data && Array.isArray(data.data)) return data.data;
    if (data && Array.isArray(data)) return data;
    return [];
  } catch (error) {
    console.error('[getLocalIslandsStatic] Error:', error.message);
    return [];
  }
}

/**
 * Fetch all international island destinations for static generation
 */
export async function getInternationalIslandsStatic() {
  try {
    const data = await serverApiCall('/island-destinations');
    if (data && Array.isArray(data.data)) return data.data;
    if (data && Array.isArray(data)) return data;
    return [];
  } catch (error) {
    console.error('[getInternationalIslandsStatic] Error:', error.message);
    return [];
  }
}

/**
 * Fetch international trips/packages for static generation
 */
export async function getInternationalTripsStatic() {
  try {
    const data = await serverApiCall('/trips');
    if (data && Array.isArray(data.data)) return data.data;
    if (data && Array.isArray(data)) return data;
    return [];
  } catch (error) {
    console.error('[getInternationalTripsStatic] Error:', error.message);
    return [];
  }
}

/**
 * Fetch international flights data (if available)
 */
export async function getInternationalFlightsStatic() {
  try {
    const data = await serverApiCall('/international/flights');
    if (data && Array.isArray(data.data)) return data.data;
    if (data && Array.isArray(data)) return data;
    return [];
  } catch (error) {
    console.error('[getInternationalFlightsStatic] Error - using empty fallback:', error.message);
    return [];
  }
}

/**
 * Fetch international hotels data (if available)
 */
export async function getInternationalHotelsStatic() {
  try {
    const data = await serverApiCall('/international/hotels');
    if (data && Array.isArray(data.data)) return data.data;
    if (data && Array.isArray(data)) return data;
    return [];
  } catch (error) {
    console.error('[getInternationalHotelsStatic] Error - using empty fallback:', error.message);
    return [];
  }
}

/**
 * Fetch international packages data (if available)
 */
export async function getInternationalPackagesStatic() {
  try {
    const data = await serverApiCall('/international/packages');
    if (data && Array.isArray(data.data)) return data.data;
    if (data && Array.isArray(data)) return data;
    return [];
  } catch (error) {
    console.error('[getInternationalPackagesStatic] Error - using empty fallback:', error.message);
    return [];
  }
}

/**
 * Fetch international destinations data (if available)
 */
export async function getInternationalDestinationsStatic() {
  try {
    const data = await serverApiCall('/international/destinations');
    if (data && Array.isArray(data.data)) return data.data;
    if (data && Array.isArray(data)) return data;
    return [];
  } catch (error) {
    console.error('[getInternationalDestinationsStatic] Error - using empty fallback:', error.message);
    return [];
  }
}

/**
 * Helper to get localized field from object
 */
export function getLocalizedField(obj, field, lang = 'en') {
  if (!obj) return '';
  
  // Map field names for special cases
  if (field === 'groupSize' || field === 'group_size') {
    return obj.group_size || obj.groupSize || '';
  }

  const fieldKey = `${field}_${lang}`;
  return obj[fieldKey] || obj[field] || '';
}

/**
 * Helper to parse array from various formats
 */
export function parseArrayField(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      return value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
}

/**
 * Helper to build image URL
 */
export function buildImageUrl(img, apiUrl = API_URL) {
  const placeholder = '/placeholder.png';
  if (!img) return placeholder;
  if (/^https?:\/\//i.test(img)) return img;
  
  const backendBase = apiUrl.replace(/\/api\/?$/, '');
  
  if (img.startsWith('/')) return `${backendBase}${img}`;
  if (img.startsWith('storage/') || img.startsWith('islands/')) return `${backendBase}/${img}`;
  
  return `${backendBase}/storage/islands/${img}`;
}

/**
 * Format offers data for display
 */
export function formatOffersData(items, lang = 'en') {
  return items.map((o) => ({
    id: o.id,
    title: getLocalizedField(o, 'title', lang),
    description: getLocalizedField(o, 'description', lang),
    image: buildImageUrl(o.image),
    duration: getLocalizedField(o, 'duration', lang),
    location: getLocalizedField(o, 'location', lang),
    groupSize: getLocalizedField(o, 'group_size', lang),
    badge: getLocalizedField(o, 'badge', lang),
    features: parseArrayField(getLocalizedField(o, 'features', lang)),
    highlights: parseArrayField(getLocalizedField(o, 'highlights', lang)),
  }));
}

/**
 * Format destination data for display
 */
export function formatDestinationData(item, lang = 'en') {
  return {
    id: item.id,
    slug: item.slug,
    title: getLocalizedField(item, 'title', lang),
    description: getLocalizedField(item, 'description', lang),
    shortDescription: getLocalizedField(item, 'short_description', lang),
    image: buildImageUrl(item.image),
    duration: getLocalizedField(item, 'duration', lang),
    groupSize: getLocalizedField(item, 'group_size', lang),
    location: getLocalizedField(item, 'location', lang),
    price: item.price,
    features: parseArrayField(getLocalizedField(item, 'features', lang)),
    itinerary: parseArrayField(getLocalizedField(item, 'itinerary', lang)),
    whatsIncluded: parseArrayField(getLocalizedField(item, 'whats_included', lang)),
  };
}
