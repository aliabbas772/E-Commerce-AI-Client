import { gql } from "@apollo/client";

export const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews($productId: ID!, $page: Int, $limit: Int) {
    getProductReviews(productId: $productId, page: $page, limit: $limit) {
      data {
        _id
        rating
        title
        body
        isVerifiedPurchase
        createdAt
        user {
          _id
          name
        }
      }
      totalCount
      totalPages
      currentPage
      hasNextPage
    }
  }
`;

export const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      _id
      rating
      title
      body
      isVerifiedPurchase
      createdAt
      user {
        _id
        name
      }
    }
  }
`;

export const UPDATE_REVIEW = gql`
  mutation UpdateReview($id: ID!, $input: UpdateReviewInput!) {
    updateReview(id: $id, input: $input) {
      _id
      rating
      title
      body
      isVerifiedPurchase
      createdAt
      user {
        _id
        name
      }
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id) {
      message
    }
  }
`;
