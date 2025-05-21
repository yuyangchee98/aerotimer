import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { TimerState, TimerActions } from '../types/timer';
import { FlightData } from '../types/flight';
import { Airport } from '../types/airport';

// Combined app state
interface AppState {
  timer: TimerState;
  flight: FlightData;
}

// All possible actions
type AppAction =
  | { type: 'START_TIMER' }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'TICK'; payload: number }
  | { type: 'COMPLETE_TIMER' }
  | { type: 'SET_FLIGHT_ROUTE'; payload: { origin: Airport; destination: Airport; distance: number; duration: number } }
  | { type: 'CLEAR_FLIGHT_ROUTE' }
  | { type: 'UPDATE_FLIGHT_PROGRESS'; payload: number };

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Derived actions for easier use
  actions: TimerActions & {
    setFlightRoute: (origin: Airport, destination: Airport, distance: number, duration: number) => void;
    clearFlightRoute: () => void;
  };
}

// Initial state
const initialState: AppState = {
  timer: {
    duration: 25 * 60, // 25 minutes in seconds
    remainingTime: 25 * 60,
    isRunning: false,
    isPaused: false,
    isComplete: false,
  },
  flight: {
    route: null,
    isActive: false,
  },
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'START_TIMER':
      return {
        ...state,
        timer: {
          ...state.timer,
          isRunning: true,
          isPaused: false,
          isComplete: false,
        },
        flight: {
          ...state.flight,
          isActive: true,
        },
      };

    case 'PAUSE_TIMER':
      return {
        ...state,
        timer: {
          ...state.timer,
          isRunning: false,
          isPaused: true,
        },
      };

    case 'RESET_TIMER':
      return {
        ...state,
        timer: {
          ...state.timer,
          remainingTime: state.timer.duration,
          isRunning: false,
          isPaused: false,
          isComplete: false,
        },
        flight: {
          ...state.flight,
          isActive: false,
          route: state.flight.route ? { ...state.flight.route, progress: 0 } : null,
        },
      };

    case 'SET_DURATION':
      return {
        ...state,
        timer: {
          ...state.timer,
          duration: action.payload,
          remainingTime: action.payload,
          isComplete: false,
        },
      };

    case 'TICK':
      const newRemainingTime = Math.max(0, state.timer.remainingTime - 1);
      const progress = state.timer.duration > 0 ? 1 - (newRemainingTime / state.timer.duration) : 0;
      
      return {
        ...state,
        timer: {
          ...state.timer,
          remainingTime: newRemainingTime,
          isComplete: newRemainingTime === 0,
          isRunning: newRemainingTime > 0 ? state.timer.isRunning : false,
        },
        flight: {
          ...state.flight,
          route: state.flight.route ? { ...state.flight.route, progress } : null,
        },
      };

    case 'COMPLETE_TIMER':
      return {
        ...state,
        timer: {
          ...state.timer,
          isRunning: false,
          isPaused: false,
          isComplete: true,
        },
        flight: {
          ...state.flight,
          isActive: false,
        },
      };

    case 'SET_FLIGHT_ROUTE':
      return {
        ...state,
        timer: {
          ...state.timer,
          duration: action.payload.duration,
          remainingTime: action.payload.duration,
          isComplete: false,
        },
        flight: {
          ...state.flight,
          route: {
            origin: action.payload.origin,
            destination: action.payload.destination,
            distance: action.payload.distance,
            duration: action.payload.duration,
            progress: 0,
          },
        },
      };

    case 'CLEAR_FLIGHT_ROUTE':
      return {
        ...state,
        timer: {
          ...state.timer,
          duration: 25 * 60, // Reset to default 25 minutes
          remainingTime: 25 * 60,
          isComplete: false,
        },
        flight: {
          route: null,
          isActive: false,
        },
      };

    case 'UPDATE_FLIGHT_PROGRESS':
      return {
        ...state,
        flight: {
          ...state.flight,
          route: state.flight.route ? { ...state.flight.route, progress: action.payload } : null,
        },
      };

    default:
      return state;
  }
};

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Create action helpers
  const actions: AppContextType['actions'] = {
    startTimer: () => dispatch({ type: 'START_TIMER' }),
    pauseTimer: () => dispatch({ type: 'PAUSE_TIMER' }),
    resetTimer: () => dispatch({ type: 'RESET_TIMER' }),
    setDuration: (duration: number) => dispatch({ type: 'SET_DURATION', payload: duration }),
    setFlightRoute: (origin: Airport, destination: Airport, distance: number, duration: number) =>
      dispatch({ type: 'SET_FLIGHT_ROUTE', payload: { origin, destination, distance, duration } }),
    clearFlightRoute: () => dispatch({ type: 'CLEAR_FLIGHT_ROUTE' }),
  };

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
