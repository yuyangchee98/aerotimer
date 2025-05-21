import React, { useRef, useEffect, useState, useCallback } from 'react';
import Globe from 'react-globe.gl';
import { useAppContext } from '../../context/AppContext';
import { getAirplanePosition } from '../../utils/flightPath';

const FlightMap: React.FC = () => {
  const { state } = useAppContext();
  const globeRef = useRef<any>(null);
  const globeContainerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  // User interaction state
  const [userIsInteracting, setUserIsInteracting] = useState(false);
  const [autoFollowEnabled, setAutoFollowEnabled] = useState(true);
  const interactionTimeoutRef = useRef<number | null>(null);

  // Constants
  const INTERACTION_RESET_DELAY = 4000; // 4 seconds
  const MIN_MOVEMENT_THRESHOLD = 0.01; // Minimum airplane movement to warrant camera update

  // Handle responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Set initial camera position
  useEffect(() => {
    if (globeRef.current) {
      // Set initial view to show the globe nicely
      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 0);
    }
  }, []);

  // Handle user interaction detection
  const handleUserInteraction = useCallback(() => {
    setUserIsInteracting(true);
    
    // Clear existing timeout
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    
    // Set new timeout to reset interaction state
    interactionTimeoutRef.current = window.setTimeout(() => {
      setUserIsInteracting(false);
    }, INTERACTION_RESET_DELAY);
  }, []);

  // Add interaction event listeners to the globe container
  useEffect(() => {
    const container = globeContainerRef.current;
    if (!container) return;

    const handleMouseDown = () => handleUserInteraction();
    const handleWheel = () => handleUserInteraction();
    const handleTouchStart = () => handleUserInteraction();

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('wheel', handleWheel);
    container.addEventListener('touchstart', handleTouchStart);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
    };
  }, [handleUserInteraction]);

  // Keyboard shortcut for auto-follow toggle
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target && (event.target as HTMLElement).tagName === 'INPUT') {
        return;
      }
      
      if (event.key === 'f' || event.key === 'F') {
        event.preventDefault();
        setAutoFollowEnabled(prev => !prev);
        // If re-enabling auto-follow, reset interaction state
        if (!autoFollowEnabled) {
          setUserIsInteracting(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [autoFollowEnabled]);

  // Prepare airport data for globe points
  const airportPoints = React.useMemo(() => {
    if (!state.flight.route) return [];
    
    const points = [];
    
    if (state.flight.route.origin) {
      points.push({
        id: 'origin',
        lat: state.flight.route.origin.lat,
        lng: state.flight.route.origin.lon,
        name: state.flight.route.origin.name,
        code: state.flight.route.origin.iata || state.flight.route.origin.icao,
        type: 'origin',
        color: '#22c55e', // Green for origin
      });
    }
    
    if (state.flight.route.destination) {
      points.push({
        id: 'destination',
        lat: state.flight.route.destination.lat,
        lng: state.flight.route.destination.lon,
        name: state.flight.route.destination.name,
        code: state.flight.route.destination.iata || state.flight.route.destination.icao,
        type: 'destination',
        color: '#ef4444', // Red for destination
      });
    }
    
    return points;
  }, [state.flight.route]);

  // Prepare flight path arc
  const flightArcs = React.useMemo(() => {
    if (!state.flight.route || !state.flight.route.origin || !state.flight.route.destination) {
      return [];
    }

    return [{
      startLat: state.flight.route.origin.lat,
      startLng: state.flight.route.origin.lon,
      endLat: state.flight.route.destination.lat,
      endLng: state.flight.route.destination.lon,
      color: state.flight.isActive ? '#3b82f6' : '#64748b', // Blue when active, gray when inactive
    }];
  }, [state.flight.route, state.flight.isActive]);

  // Calculate airplane position based on flight progress
  const airplanePosition = React.useMemo(() => {
    if (!state.flight.route || !state.flight.route.origin || !state.flight.route.destination || !state.flight.isActive) {
      return [];
    }

    const position = getAirplanePosition(
      state.flight.route.origin,
      state.flight.route.destination,
      state.flight.route.progress
    );

    return [{
      id: 'airplane',
      lat: position.lat,
      lng: position.lon,
      name: 'In Flight',
      color: '#fbbf24', // Yellow for airplane
      size: 1.5,
    }];
  }, [state.flight.route, state.flight.isActive]);

  // Store previous airplane position to detect significant movement
  const prevAirplanePos = useRef<{ lat: number; lon: number } | null>(null);

  // Smart auto-follow logic - only when user isn't interacting
  useEffect(() => {
    if (!globeRef.current || !state.flight.route || !state.flight.isActive || !autoFollowEnabled) {
      return;
    }

    // Don't auto-follow if user is currently interacting
    if (userIsInteracting) {
      return;
    }

    const currentPosition = getAirplanePosition(
      state.flight.route.origin!,
      state.flight.route.destination!,
      state.flight.route.progress
    );

    // Only update if airplane has moved significantly
    if (prevAirplanePos.current) {
      const latDiff = Math.abs(currentPosition.lat - prevAirplanePos.current.lat);
      const lonDiff = Math.abs(currentPosition.lon - prevAirplanePos.current.lon);
      
      if (latDiff < MIN_MOVEMENT_THRESHOLD && lonDiff < MIN_MOVEMENT_THRESHOLD) {
        return;
      }
    }

    // Get current camera position to preserve altitude/zoom
    const currentPOV = globeRef.current.pointOfView();
    const preserveAltitude = currentPOV ? currentPOV.altitude : 2;

    // Smoothly pan to airplane position while preserving zoom
    globeRef.current.pointOfView({ 
      lat: currentPosition.lat, 
      lng: currentPosition.lon, 
      altitude: preserveAltitude 
    }, 1500);

    // Update previous position
    prevAirplanePos.current = { lat: currentPosition.lat, lon: currentPosition.lon };
    
  }, [state.flight.route?.progress, state.flight.isActive, userIsInteracting, autoFollowEnabled]);

  return (
    <div ref={globeContainerRef} className="absolute inset-0 w-full h-full">
      <Globe
        ref={globeRef}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,1)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        
        // Airport points
        pointsData={[...airportPoints, ...airplanePosition]}
        pointAltitude={0.01}
        pointRadius={0.6}
        pointColor="color"
        pointLabel={(point: any) => `
          <div style="
            background: rgba(0,0,0,0.8); 
            color: white; 
            padding: 8px 12px; 
            border-radius: 8px; 
            font-size: 14px;
          ">
            <strong>${point.code || point.name}</strong>
            ${point.name && point.code ? `<br/>${point.name}` : ''}
          </div>
        `}
        
        // Flight arcs
        arcsData={flightArcs}
        arcColor="color"
        arcDashLength={0.6}
        arcDashGap={0.2}
        arcDashAnimateTime={2000}
        arcStroke={2}
        
        // Globe settings
        showAtmosphere={true}
        atmosphereColor="#1e40af"
        atmosphereAltitude={0.2}
        
        // Controls (built-in)
        enablePointerInteraction={true}
      />
    </div>
  );
};

export default FlightMap;