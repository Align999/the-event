import { FEATURES } from '@/config/features';

export const withFeatureFlag = (flagName: string, Component: React.FC) => {
  return (props: any) => {
    if (!FEATURES[flagName]) {
      return null;
    }
    return <Component {...props} />;
  };
};

export const createTestDatabase = async () => {
  // Setup test database schema
};

export const cleanupTestDatabase = async () => {
  // Cleanup test data
};