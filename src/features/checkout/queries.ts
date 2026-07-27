import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
  mutation CreateOrder(
    $items: [OrderItemInput!]!
    $addressId: ID!
    $notes: String
  ) {
    createOrder(items: $items, addressId: $addressId, notes: $notes) {
      razorpayOrderId
      amount
      currency
    }
  }
`;

export const VERIFY_PAYMENT = gql`
  mutation VerifyPayment(
    $razorpayOrderId: String!
    $razorpayPaymentId: String!
    $razorpaySignature: String!
  ) {
    verifyPayment(
      razorpayOrderId: $razorpayOrderId
      razorpayPaymentId: $razorpayPaymentId
      razorpaySignature: $razorpaySignature
    ) {
      message
    }
  }
`;
