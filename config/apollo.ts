import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import * as SecureStore from 'expo-secure-store';

const GRAPHQL_ENDPOINT =
  'https://3ucrjwsx3vb6llvsbhg2cud53q.appsync-api.eu-central-1.amazonaws.com/graphql';

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
});

// Auth link to add Bearer token to headers
const authLink = setContext(async (_, { headers }) => {
  try {
    const accessToken = await SecureStore.getItemAsync('soul-bible-access-token');

    return {
      headers: {
        ...headers,
        authorization: accessToken ? `Bearer ${accessToken}` : '',
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Error getting access token:', error);
    return { headers };
  }
});

// Error link to handle authentication errors
const errorLink = onError((errorContext: any) => {
  const { graphQLErrors, networkError } = errorContext;

  if (graphQLErrors) {
    graphQLErrors.forEach((error: any) => {
      console.error(`[GraphQL error]: ${error.message}`, error.extensions);

      // Handle unauthorized errors (token expired, invalid, etc.)
      if (
        error.extensions?.code === 'UNAUTHORIZED' ||
        error.message.includes('Unauthorized') ||
        error.message.includes('expired')
      ) {
        // Token refresh will be handled by the auth service
        console.log('Token expired or invalid - auth refresh needed');
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Create Apollo Client instance
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});
