import { useState, useEffect, useCallback } from 'react';
import { Airport, AirportSearchResult } from '../types/airport';
import { searchAirports, loadAirports } from '../utils/airportUtils';

interface UseAirportsReturn {
  searchResults: AirportSearchResult[];
  isLoading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
  clearResults: () => void;
  popularAirports: Airport[];
}

export const useAirports = (): UseAirportsReturn => {
  const [searchResults, setSearchResults] = useState<AirportSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [popularAirports, setPopularAirports] = useState<Airport[]>([]);

  // Load popular airports on mount
  useEffect(() => {
    const loadPopularAirports = async () => {
      try {
        const airports = await loadAirports();
        
        // Some popular airport codes to show as suggestions
        const popularCodes = ['LAX', 'JFK', 'LHR', 'NRT', 'DXB', 'CDG', 'FRA', 'SIN', 'HKG', 'ICN'];
        const popular = airports.filter(airport => 
          popularCodes.includes(airport.iata)
        ).slice(0, 6);
        
        setPopularAirports(popular);
      } catch (err) {
        console.error('Error loading popular airports:', err);
      }
    };

    loadPopularAirports();
  }, []);

  // Debounced search function
  const search = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await searchAirports(query);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search airports');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchResults,
    isLoading,
    error,
    search,
    clearResults,
    popularAirports,
  };
};
