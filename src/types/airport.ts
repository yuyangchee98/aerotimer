// Based on your airport data structure
export interface Airport {
  icao: string;
  iata: string;
  name: string;
  city: string;
  state?: string; // Optional for non-US airports
  country: string;
  elevation: number;
  lat: number;
  lon: number;
  tz: string;
}

// The main airports data structure (object with keys)
export interface AirportsData {
  [key: string]: Airport;
}

// For search results and selections
export interface AirportSearchResult {
  code: string; // icao code (the key)
  airport: Airport;
  score?: number; // For fuzzy search scoring
}

// For airport pair selection
export interface AirportPair {
  origin: Airport | null;
  destination: Airport | null;
}
