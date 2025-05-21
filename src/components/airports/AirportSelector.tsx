import React, { useState, useRef, useEffect } from 'react';
import { Search, ArrowRightLeft, MapPin } from 'lucide-react';
import { Airport } from '../../types/airport';
import { useAirports } from '../../hooks/useAirports';
import { formatAirportDisplay } from '../../utils/airportUtils';

interface AirportSelectorProps {
  origin: Airport | null;
  destination: Airport | null;
  onOriginChange: (airport: Airport | null) => void;
  onDestinationChange: (airport: Airport | null) => void;
}

interface AirportInputProps {
  label: string;
  placeholder: string;
  selectedAirport: Airport | null;
  onAirportSelect: (airport: Airport | null) => void;
  popularAirports: Airport[];
}

const AirportInput: React.FC<AirportInputProps> = ({
  label,
  placeholder,
  selectedAirport,
  onAirportSelect,
  popularAirports,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { searchResults, isLoading, search } = useAirports();
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        search(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, search]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    
    if (!value) {
      onAirportSelect(null);
    }
  };

  const handleAirportSelect = (airport: Airport) => {
    onAirportSelect(airport);
    setQuery(formatAirportDisplay(airport));
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    // Delay closing to allow clicks on dropdown items
    setTimeout(() => setIsOpen(false), 200);
  };

  // Update query when selectedAirport changes from parent
  useEffect(() => {
    if (selectedAirport) {
      setQuery(formatAirportDisplay(selectedAirport));
    } else {
      setQuery('');
    }
  }, [selectedAirport]);

  const displayResults = query ? searchResults : popularAirports.map(airport => ({
    code: airport.icao,
    airport,
  }));

  return (
    <div className="relative">
      <label className="block text-xs font-medium text-white/80 mb-1">
        {label}
      </label>
      
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="
            w-full pl-7 pr-3 py-2 rounded-md text-sm
            bg-white/10 backdrop-blur-sm
            border border-white/20 text-white placeholder-gray-400
            focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-transparent
            transition-all
          "
        />
        
        {selectedAirport && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <MapPin className="h-3 w-3 text-green-400" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg max-h-48 overflow-auto">
          {isLoading && (
            <div className="p-2 text-center text-gray-500 text-sm">
              Searching...
            </div>
          )}
          
          {!isLoading && displayResults.length === 0 && query && (
            <div className="p-2 text-center text-gray-500 text-sm">
              No airports found
            </div>
          )}
          
          {!query && popularAirports.length > 0 && (
            <div className="p-2 text-xs text-gray-500 border-b">
              Popular airports
            </div>
          )}
          
          {displayResults.map((result, index) => (
            <button
              key={`${result.airport.icao}-${index}`}
              onClick={() => handleAirportSelect(result.airport)}
              className="
                w-full p-2 text-left hover:bg-blue-50 
                border-b border-gray-100 last:border-b-0
                focus:outline-none focus:bg-blue-50
                transition-colors
              "
            >
              <div className="font-medium text-gray-900 text-sm">
                {result.airport.iata || result.airport.icao} - {result.airport.name}
              </div>
              <div className="text-xs text-gray-600">
                {result.airport.city}, {result.airport.country}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const AirportSelector: React.FC<AirportSelectorProps> = ({
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
}) => {
  const { popularAirports } = useAirports();

  const handleSwapAirports = () => {
    const tempOrigin = origin;
    onOriginChange(destination);
    onDestinationChange(tempOrigin);
  };

  return (
    <div className="w-full max-w-80">
      <h2 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4 text-center">
        Flight Route
      </h2>
      
      <div className="space-y-4">
        {/* Origin */}
        <AirportInput
          label="From"
          placeholder="Departure airport..."
          selectedAirport={origin}
          onAirportSelect={onOriginChange}
          popularAirports={popularAirports}
        />
        
        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwapAirports}
            disabled={!origin && !destination}
            className="
              flex items-center justify-center w-8 h-8 rounded-full
              bg-white/10 hover:bg-white/20 transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:scale-105 active:scale-95 border border-white/20
            "
            title="Swap airports"
          >
            <ArrowRightLeft className="h-4 w-4 text-white" />
          </button>
        </div>
        
        {/* Destination */}
        <AirportInput
          label="To"
          placeholder="Destination airport..."
          selectedAirport={destination}
          onAirportSelect={onDestinationChange}
          popularAirports={popularAirports}
        />
        
        {/* Route Display */}
        {origin && destination && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-md p-3 mt-3">
            <div className="flex items-center justify-center text-green-200 text-sm">
              <span className="font-medium">{origin.iata || origin.icao}</span>
              <span className="mx-2">✈</span>
              <span className="font-medium">{destination.iata || destination.icao}</span>
            </div>
            <div className="text-center text-xs text-green-300 mt-1">
              {origin.city} → {destination.city}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AirportSelector;