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

// Auth link to add authentication headers
const authLink = setContext(async (operation, { headers }) => {
  try {
    // Public mutations that use API key authentication
    const publicOperations = ['SignIn', 'SignUp', 'ForgotPassword', 'ResetPassword'];

    // Check if this is a public operation (use API key)
    if (publicOperations.includes(operation.operationName || '')) {
      return {
        headers: {
          ...headers,
          'x-api-key': 'da2-ykymx245tbd7lcj6ucmvrj7lim',
          'Content-Type': 'application/json',
        },
      };
    }

    // For authenticated requests, add Bearer token
    const accessToken = await SecureStore.getItemAsync('soul-bible-access-token');

    return {
      headers: {
        ...headers,
        authorization: accessToken ? `Bearer ${accessToken}` : '',
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Error configuring auth:', error);
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
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        keyFields: ['id'],
      },
      AuthResponse: {
        keyFields: false, // Don't normalize this type
      },
      SignInResponse: {
        keyFields: false, // Don't normalize this type
      },
    },
  }),
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
