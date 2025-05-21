/**
 * Calculate the great circle distance between two points on Earth
 * using the Haversine formula
 * 
 * @param lat1 Latitude of first point in degrees
 * @param lon1 Longitude of first point in degrees
 * @param lat2 Latitude of second point in degrees
 * @param lon2 Longitude of second point in degrees
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  
  // Convert degrees to radians
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const rLat1 = toRadians(lat1);
  const rLat2 = toRadians(lat2);

  // Haversine formula
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rLat1) * Math.cos(rLat2) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Convert radians to degrees
 */
export const toDegrees = (radians: number): number => {
  return radians * (180 / Math.PI);
};

/**
 * Calculate intermediate point along great circle path
 * @param lat1 Start latitude in degrees
 * @param lon1 Start longitude in degrees
 * @param lat2 End latitude in degrees
 * @param lon2 End longitude in degrees
 * @param fraction Progress along path (0-1)
 * @returns {lat, lon} coordinates of intermediate point
 */
export const interpolatePoint = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  fraction: number
): { lat: number; lon: number } => {
  const rlat1 = toRadians(lat1);
  const rlon1 = toRadians(lon1);
  const rlat2 = toRadians(lat2);
  const rlon2 = toRadians(lon2);

  const d = calculateDistance(lat1, lon1, lat2, lon2) / 6371; // Angular distance in radians
  
  const a = Math.sin((1 - fraction) * d) / Math.sin(d);
  const b = Math.sin(fraction * d) / Math.sin(d);

  const x = a * Math.cos(rlat1) * Math.cos(rlon1) + b * Math.cos(rlat2) * Math.cos(rlon2);
  const y = a * Math.cos(rlat1) * Math.sin(rlon1) + b * Math.cos(rlat2) * Math.sin(rlon2);
  const z = a * Math.sin(rlat1) + b * Math.sin(rlat2);

  const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
  const lon = Math.atan2(y, x);

  return {
    lat: toDegrees(lat),
    lon: toDegrees(lon),
  };
};
