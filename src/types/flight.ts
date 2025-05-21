import { Airport } from './airport';

export interface FlightRoute {
  origin: Airport | null;
  destination: Airport | null;
  distance: number; // in kilometers
  duration: number; // in seconds
  progress: number; // 0-1, current progress along route
}

export interface FlightPosition {
  lat: number;
  lon: number;
  progress: number; // 0-1
}

export interface FlightData {
  route: FlightRoute | null;
  isActive: boolean;
}
