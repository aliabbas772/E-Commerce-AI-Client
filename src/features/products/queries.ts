import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts($filters: ProductFilters, $page: Int, $limit: Int) {
    getProducts(filters: $filters, page: $page, limit: $limit) {
      data {
        _id
        name
        price
        comparePrice
        images
        averageRating
        stock
      }
      totalCount
      totalPages
      currentPage
      hasNextPage
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    getProductById(id: $id) {
      _id
      name
      description
      price
      comparePrice
      images
      sizes
      stock
      averageRating
      totalReviews
      category {
        _id
        name
      }
    }
  }
`;
