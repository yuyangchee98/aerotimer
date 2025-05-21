import Fuse from 'fuse.js';
import { Airport, AirportsData, AirportSearchResult } from '../types/airport';

let airportsCache: Airport[] | null = null;

// Load airports from public/airports.json
export const loadAirports = async (): Promise<Airport[]> => {
  if (airportsCache) {
    return airportsCache;
  }

  try {
    const response = await fetch('/airports.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch airports: ${response.statusText}`);
    }
    
    const airportsData: AirportsData = await response.json();
    
    // Convert object to array and filter for major airports
    const airportsArray = Object.entries(airportsData).map(([code, airport]) => ({
      ...airport,
      // Use the code as icao if it's missing
      icao: airport.icao || code,
    }));

    // Filter for major airports (have IATA codes or are large airports)
    const majorAirports = airportsArray.filter(airport => 
      airport.iata && airport.iata.length === 3 && // Valid IATA code
      airport.name && 
      airport.city &&
      airport.lat &&
      airport.lon
    );

    airportsCache = majorAirports;
    return majorAirports;
  } catch (error) {
    console.error('Error loading airports:', error);
    throw new Error('Failed to load airport data');
  }
};

// Create Fuse instance for fuzzy searching
const createFuseInstance = (airports: Airport[]) => {
  return new Fuse(airports, {
    keys: [
      { name: 'iata', weight: 0.4 },
      { name: 'icao', weight: 0.3 },
      { name: 'name', weight: 0.2 },
      { name: 'city', weight: 0.1 },
    ],
    threshold: 0.4, // More lenient search
    minMatchCharLength: 2,
    includeScore: true,
  });
};

// Search airports with fuzzy matching
export const searchAirports = async (query: string, limit: number = 10): Promise<AirportSearchResult[]> => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const airports = await loadAirports();
    const fuse = createFuseInstance(airports);
    const results = fuse.search(query, { limit });

    return results.map(result => ({
      code: result.item.icao,
      airport: result.item,
      score: result.score,
    }));
  } catch (error) {
    console.error('Error searching airports:', error);
    return [];
  }
};

// Get airport by IATA or ICAO code
export const getAirportByCode = async (code: string): Promise<Airport | null> => {
  try {
    const airports = await loadAirports();
    const upperCode = code.toUpperCase();
    
    return airports.find(airport => 
      airport.iata === upperCode || airport.icao === upperCode
    ) || null;
  } catch (error) {
    console.error('Error getting airport by code:', error);
    return null;
  }
};

// Validate airport pair
export const validateAirportPair = (origin: Airport | null, destination: Airport | null): boolean => {
  if (!origin || !destination) {
    return false;
  }
  
  // Same airport check
  if (origin.icao === destination.icao) {
    return false;
  }
  
  return true;
};

// Format airport for display
export const formatAirportDisplay = (airport: Airport): string => {
  const code = airport.iata || airport.icao;
  return `${code} - ${airport.name} (${airport.city})`;
};
