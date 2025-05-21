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
      <label className="block text-sm font-medium text-white mb-2">
        {label}
      </label>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="
            w-full pl-10 pr-4 py-3 rounded-lg
            bg-white/10 backdrop-blur-sm
            border border-white/20 text-white placeholder-gray-300
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
            transition-all
          "
        />
        
        {selectedAirport && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <MapPin className="h-4 w-4 text-green-400" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
          {isLoading && (
            <div className="p-3 text-center text-gray-500">
              Searching...
            </div>
          )}
          
          {!isLoading && displayResults.length === 0 && query && (
            <div className="p-3 text-center text-gray-500">
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
                w-full p-3 text-left hover:bg-blue-50 
                border-b border-gray-100 last:border-b-0
                focus:outline-none focus:bg-blue-50
                transition-colors
              "
            >
              <div className="font-medium text-gray-900">
                {result.airport.iata || result.airport.icao} - {result.airport.name}
              </div>
              <div className="text-sm text-gray-600">
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
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h2 className="text-xl font-semibold text-white mb-6 text-center">
        Choose Your Flight Route
      </h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Origin */}
          <AirportInput
            label="From"
            placeholder="Search departure airport..."
            selectedAirport={origin}
            onAirportSelect={onOriginChange}
            popularAirports={popularAirports}
          />
          
          {/* Destination */}
          <AirportInput
            label="To"
            placeholder="Search destination airport..."
            selectedAirport={destination}
            onAirportSelect={onDestinationChange}
            popularAirports={popularAirports}
          />
        </div>
        
        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwapAirports}
            disabled={!origin && !destination}
            className="
              flex items-center justify-center w-10 h-10 rounded-full
              bg-white/10 hover:bg-white/20 transition-all
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:scale-105 active:scale-95
            "
          >
            <ArrowRightLeft className="h-4 w-4 text-white" />
          </button>
        </div>
        
        {/* Route Display */}
        {origin && destination && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-center text-green-200 text-sm">
              <span className="font-medium">{origin.iata || origin.icao}</span>
              <span className="mx-3">✈</span>
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
