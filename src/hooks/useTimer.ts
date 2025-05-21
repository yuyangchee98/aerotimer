import { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';

export const useTimer = () => {
  const { state, dispatch, actions } = useAppContext();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (state.timer.isRunning && state.timer.remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK', payload: 1 });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.timer.isRunning, state.timer.remainingTime, dispatch]);

  // Handle completion
  useEffect(() => {
    if (state.timer.remainingTime === 0 && state.timer.isRunning) {
      dispatch({ type: 'COMPLETE_TIMER' });
    }
  }, [state.timer.remainingTime, state.timer.isRunning, dispatch]);

  return {
    timer: state.timer,
    actions,
  };
};
