import { gql } from "@apollo/client";

export const GET_MY_ORDERS = gql`
  query GetMyOrders($page: Int, $limit: Int) {
    getMyOrders(page: $page, limit: $limit) {
      data {
        _id
        totalAmount
        paymentStatus
        deliveryStatus
        createdAt
        items {
          quantity
          size
          product {
            _id
            name
            images
          }
        }
      }
      totalCount
      totalPages
      currentPage
      hasNextPage
    }
  }
`;

export const GET_ORDER_BY_ID = gql`
  query GetOrderById($id: ID!) {
    getOrderById(id: $id) {
      _id
      totalAmount
      discount
      couponCode
      paymentStatus
      deliveryStatus
      invoiceUrl
      notes
      createdAt
      address {
        _id
      }
      items {
        quantity
        size
        price
        product {
          _id
          name
          images
        }
      }
    }
  }
`;
