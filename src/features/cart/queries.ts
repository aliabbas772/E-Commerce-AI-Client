import { gql } from "@apollo/client";

export const GET_MY_CART = gql`
  query GetMyCart {
    getMyCart {
      _id
      totalAmount
      items {
        product {
          id
          name
          imageUrl
        }
        quantity
        size
        price
      }
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!, $size: String!) {
    addToCart(productId: $productId, quantity: $quantity, size: $size) {
      _id
      totalAmount
      items {
        product {
          id
          name
          imageUrl
        }
        quantity
        size
        price
      }
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($productId: ID!, $size: String!) {
    removeFromCart(productId: $productId, size: $size) {
      _id
      totalAmount
      items {
        product {
          id
          name
          imageUrl
        }
        quantity
        size
        price
      }
    }
  }
`;
