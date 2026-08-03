import { gql } from "@apollo/client";

const CART_FIELDS = `
  _id
  totalAmount
  items {
    product {
      _id
      name
      images
      stock
    }
    quantity
    size
    price
  }
`;

export const GET_MY_CART = gql`
  query GetMyCart {
    getMyCart {
      ${CART_FIELDS}
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!, $size: String!) {
    addToCart(productId: $productId, quantity: $quantity, size: $size) {
      ${CART_FIELDS}
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($productId: ID!, $quantity: Int!, $size: String!) {
    updateCartItem(productId: $productId, quantity: $quantity, size: $size) {
      ${CART_FIELDS}
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($productId: ID!, $size: String!) {
    removeFromCart(productId: $productId, size: $size) {
      ${CART_FIELDS}
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart {
      message
    }
  }
`;
