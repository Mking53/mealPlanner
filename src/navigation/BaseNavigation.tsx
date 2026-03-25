import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import type { ReactNode } from 'react';

type BaseNavigationProps = {
  children?: ReactNode;
};

export function BaseNavigation({ children }: BaseNavigationProps) {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>{children}</NavigationContainer>
    </NavigationIndependentTree>
  );
}
