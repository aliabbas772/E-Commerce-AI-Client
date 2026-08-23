import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  Observable,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ErrorLink } from "@apollo/client/link/error";
import { CombinedGraphQLErrors } from "@apollo/client/errors";
import { REFRESH_TOKEN } from "../features/auth/queries";
import { store } from "../store/store";
import { login, logout } from "../store/slices/authSlice";

const GRAPHQL_ENDPOINT =
  import.meta.env.VITE_GRAPHQL_HTTP_URL || "http://localhost:4000/graphql";

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
      localStorage.setItem("user", JSON.stringify(user));
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

const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (CombinedGraphQLErrors.is(error)) {
    const isUnauthenticated = error.errors.some(
      (e) => e.extensions?.code === "UNAUTHENTICATED",
    );

    if (isUnauthenticated) {
      return new Observable((observer) => {
        refreshAccessToken().then((newToken) => {
          if (!newToken) {
            observer.error(error);
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
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Wishlist: {
        fields: {
          products: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});
