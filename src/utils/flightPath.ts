import { Airport } from '../types/airport';
import { FlightPosition } from '../types/flight';
import { calculateDistance, interpolatePoint } from './haversine';

// Flight constants
const AVERAGE_SPEED_KMH = 850; // Commercial aircraft average speed
const BUFFER_TIME_MINUTES = 45; // Takeoff, landing, taxi time
const MIN_FLIGHT_TIME_MINUTES = 15; // Minimum for very short flights
const MAX_FLIGHT_TIME_MINUTES = 120; // Maximum for productivity session

/**
 * Calculate flight duration between two airports
 * @param origin Origin airport
 * @param destination Destination airport
 * @returns Flight duration in seconds
 */
export const calculateFlightDuration = (
  origin: Airport,
  destination: Airport
): { distance: number; duration: number } => {
  const distance = calculateDistance(
    origin.lat,
    origin.lon,
    destination.lat,
    destination.lon
  );

  // Calculate flight time based on distance
  const flightTimeHours = distance / AVERAGE_SPEED_KMH;
  const flightTimeMinutes = flightTimeHours * 60;
  
  // Add buffer time for takeoff/landing
  const totalMinutes = Math.max(
    MIN_FLIGHT_TIME_MINUTES,
    Math.min(
      MAX_FLIGHT_TIME_MINUTES,
      flightTimeMinutes + BUFFER_TIME_MINUTES
    )
  );

  return {
    distance: Math.round(distance),
    duration: Math.round(totalMinutes * 60), // Convert to seconds
  };
};

/**
 * Generate points along the flight path for animation
 * @param origin Origin airport
 * @param destination Destination airport
 * @param numPoints Number of points to generate
 * @returns Array of lat/lon points along the flight path
 */
export const generateFlightPath = (
  origin: Airport,
  destination: Airport,
  numPoints: number = 100
): FlightPosition[] => {
  const points: FlightPosition[] = [];
  
  for (let i = 0; i <= numPoints; i++) {
    const progress = i / numPoints;
    const position = interpolatePoint(
      origin.lat,
      origin.lon,
      destination.lat,
      destination.lon,
      progress
    );
    
    points.push({
      lat: position.lat,
      lon: position.lon,
      progress,
    });
  }
  
  return points;
};

/**
 * Get current airplane position based on flight progress
 * @param origin Origin airport
 * @param destination Destination airport
 * @param progress Flight progress (0-1)
 * @returns Current airplane position
 */
export const getAirplanePosition = (
  origin: Airport,
  destination: Airport,
  progress: number
): FlightPosition => {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const position = interpolatePoint(
    origin.lat,
    origin.lon,
    destination.lat,
    destination.lon,
    clampedProgress
  );
  
  return {
    lat: position.lat,
    lon: position.lon,
    progress: clampedProgress,
  };
};

/**
 * Format flight duration for display
 * @param seconds Duration in seconds
 * @returns Formatted string like "2h 35m"
 */
export const formatFlightDuration = (seconds: number): string => {
  const totalMinutes = Math.round(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Format distance for display
 * @param kilometers Distance in kilometers
 * @returns Formatted string with appropriate units
 */
export const formatDistance = (kilometers: number): string => {
  if (kilometers >= 1000) {
    return `${(kilometers / 1000).toFixed(1)}k km`;
  }
  return `${Math.round(kilometers)} km`;
};
