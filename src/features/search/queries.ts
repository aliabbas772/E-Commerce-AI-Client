import { gql } from "@apollo/client";

export const SEARCH_PRODUCTS = gql`
  query SearchProducts(
    $query: String!
    $page: Int
    $limit: Int
    $filters: SearchFilters
  ) {
    searchProducts(
      query: $query
      page: $page
      limit: $limit
      filters: $filters
    ) {
      data {
        _id
        name
        price
        comparePrice
        images
        averageRating
        stock
        sizes
      }
      totalCount
      totalPages
      currentPage
      hasNextPage
    }
  }
`;

export const GET_SEARCH_SUGGESTIONS = gql`
  query GetSearchSuggestions($query: String!) {
    getSearchSuggestions(query: $query)
  }
`;
