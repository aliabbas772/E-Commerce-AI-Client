import { gql } from "@apollo/client";

export const GET_MY_WISHLIST = gql`
  query GetMyWishlist {
    getMyWishlist {
      _id
      products {
        _id
        name
        price
        images
        sizes
        stock
      }
    }
  }
`;

export const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist($productId: ID!) {
    addToWishlist(productId: $productId) {
      _id
      products {
        _id
      }
    }
  }
`;

export const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist($productId: ID!) {
    removeFromWishlist(productId: $productId) {
      _id
      products {
        _id
      }
    }
  }
`;
