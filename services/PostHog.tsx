import React, { useEffect } from 'react';
import PostHog from 'posthog-react-native';
import Constants from 'expo-constants';

// Initialize PostHog client
let posthogClient: PostHog | null = null;

const getPostHogClient = (): PostHog | null => {
  if (posthogClient) {
    return posthogClient;
  }

  const apiKey = Constants.expoConfig?.extra?.posthogApiKey;
  const host = Constants.expoConfig?.extra?.posthogHost;

  if (!apiKey || !host) {
    console.warn('PostHog: Missing API key or host in configuration');
    return null;
  }

  try {
    posthogClient = new PostHog(apiKey, {
      host,
      // Enable feature flags
      enableSessionReplay: false,
    });
    console.log('PostHog: Initialized successfully');
  } catch (error) {
    console.error('PostHog: Failed to initialize', error);
    return null;
  }

  return posthogClient;
};

interface PostHogProviderProps {
  children: React.ReactNode;
}

export const PostHogProvider: React.FC<PostHogProviderProps> = ({
  children,
}) => {
  useEffect(() => {
    // Initialize PostHog on mount
    getPostHogClient();
  }, []);

  return <>{children}</>;
};

/**
 * Hook to check if a feature flag is enabled
 * @param flagKey - The feature flag key to check
 * @param defaultValue - Default value if flag is not found (default: false)
 * @returns boolean indicating if the feature is enabled
 */
export const useFeatureFlag = (
  flagKey: string,
  defaultValue: boolean = false
): boolean => {
  const [isEnabled, setIsEnabled] = React.useState<boolean>(defaultValue);

  useEffect(() => {
    const client = getPostHogClient();
    if (!client) {
      setIsEnabled(defaultValue);
      return;
    }

    // Check feature flag value
    client.isFeatureEnabled(flagKey).then((enabled) => {
      setIsEnabled(enabled ?? defaultValue);
    });

    // Subscribe to feature flag changes
    const unsubscribe = client.onFeatureFlags(() => {
      client.isFeatureEnabled(flagKey).then((enabled) => {
        setIsEnabled(enabled ?? defaultValue);
      });
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [flagKey, defaultValue]);

  return isEnabled;
};

/**
 * Get the PostHog client instance
 * Use this for advanced PostHog operations
 */
export const getPostHog = (): PostHog | null => {
  return getPostHogClient();
};
