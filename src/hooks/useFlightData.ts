import { useCallback, useEffect } from 'react';
import { Airport } from '../types/airport';
import { useAppContext } from '../context/AppContext';
import { calculateFlightDuration } from '../utils/flightPath';
import { validateAirportPair } from '../utils/airportUtils';

interface UseFlightDataReturn {
  setFlightRoute: (origin: Airport | null, destination: Airport | null) => void;
  clearFlightRoute: () => void;
  flightRoute: {
    origin: Airport | null;
    destination: Airport | null;
    distance: number;
    duration: number;
    progress: number;
  } | null;
  isFlightActive: boolean;
}

export const useFlightData = (): UseFlightDataReturn => {
  const { state, actions } = useAppContext();

  const setFlightRoute = useCallback((origin: Airport | null, destination: Airport | null) => {
    // Clear route if either airport is null
    if (!origin || !destination) {
      actions.clearFlightRoute();
      return;
    }

    // Validate airport pair
    if (!validateAirportPair(origin, destination)) {
      console.warn('Invalid airport pair:', origin.icao, destination.icao);
      actions.clearFlightRoute();
      return;
    }

    // Calculate flight data
    try {
      const flightData = calculateFlightDuration(origin, destination);
      
      // Update context with new flight route
      actions.setFlightRoute(
        origin,
        destination,
        flightData.distance,
        flightData.duration
      );
      
      console.log(`Flight route set: ${origin.iata || origin.icao} → ${destination.iata || destination.icao}`);
      console.log(`Distance: ${flightData.distance} km, Duration: ${Math.round(flightData.duration / 60)} minutes`);
    } catch (error) {
      console.error('Error calculating flight duration:', error);
      actions.clearFlightRoute();
    }
  }, []); // Empty dependency array since actions are stable

  const clearFlightRoute = useCallback(() => {
    actions.clearFlightRoute();
  }, [actions]);

  // Auto-calculate when both airports are available (if called externally)
  useEffect(() => {
    // This effect is mainly for any external updates to the context
    // The main calculation happens in setFlightRoute above
  }, [state.flight.route]);

  return {
    setFlightRoute,
    clearFlightRoute,
    flightRoute: state.flight.route,
    isFlightActive: state.flight.isActive,
  };
};
