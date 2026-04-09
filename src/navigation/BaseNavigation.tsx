import {
  NavigationContainer,
  NavigationIndependentTree,
  type InitialState,
} from '@react-navigation/native';
import { useCallback, useState, type ReactNode } from 'react';

type BaseNavigationProps = {
  children?: ReactNode;
};

const NAVIGATION_STATE_STORAGE_KEY = 'meal_planner_navigation_state';

export function BaseNavigation({ children }: BaseNavigationProps) {
  const [initialState] = useState<InitialState | undefined>(() => {
    if (typeof localStorage === 'undefined') {
      return undefined;
    }

    try {
      const savedState = localStorage.getItem(NAVIGATION_STATE_STORAGE_KEY);
      return savedState ? (JSON.parse(savedState) as InitialState) : undefined;
    } catch {
      localStorage.removeItem(NAVIGATION_STATE_STORAGE_KEY);
      return undefined;
    }
  });

  const handleStateChange = useCallback((state: InitialState | undefined) => {
    if (typeof localStorage === 'undefined' || !state) {
      return;
    }

    localStorage.setItem(NAVIGATION_STATE_STORAGE_KEY, JSON.stringify(state));
  }, []);

  return (
    <NavigationIndependentTree>
      <NavigationContainer initialState={initialState} onStateChange={handleStateChange}>
        {children}
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
