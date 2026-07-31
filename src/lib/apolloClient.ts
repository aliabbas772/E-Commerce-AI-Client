import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  Observable,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { REFRESH_TOKEN } from "../features/auth/queries";
import { store } from "../store/store";
import { login, logout } from "../store/slices/authSlice";

const GRAPHQL_ENDPOINT = "http://localhost:4000/graphql";

const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: REFRESH_TOKEN.loc?.source.body,
        }),
      });

      const result = await response.json();

      if (result.errors || !result.data?.refreshToken) {
        throw new Error("Refresh failed");
      }

      const { accessToken, user } = result.data.refreshToken;
      localStorage.setItem("token", accessToken);
      store.dispatch(login({ user, token: accessToken }));

      return accessToken;
    } catch (err) {
      store.dispatch(logout());
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === "UNAUTHENTICATED") {
        return new Observable((observer) => {
          refreshAccessToken().then((newToken) => {
            if (!newToken) {
              observer.error(err);
              return;
            }

            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: `Bearer ${newToken}`,
              },
            });

            forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          });
        });
      }
    }
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});
