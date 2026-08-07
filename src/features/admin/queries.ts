import { gql } from "@apollo/client";

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      _id
      name
      slug
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      message
    }
  }
`;
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      _id
      name
      price
      images
      category {
        _id
        name
      }
      stock
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      _id
      name
      price
      images
      stock
      isActive
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      message
    }
  }
`;

export const UPLOAD_PRODUCT_IMAGE = gql`
  mutation UploadProductImage($productId: ID!, $base64Image: String!) {
    uploadProductImage(productId: $productId, base64Image: $base64Image) {
      _id
      images
    }
  }
`;

export const GET_ADMIN_PRODUCTS = gql`
  query GetAdminProducts($page: Int, $limit: Int) {
    getProducts(page: $page, limit: $limit) {
      data {
        _id
        name
        price
        stock
        isActive
        images
        category {
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
export const GET_ALL_ORDERS = gql`
  query GetAllOrders($page: Int, $limit: Int) {
    getAllOrders(page: $page, limit: $limit) {
      data {
        _id
        totalAmount
        paymentStatus
        deliveryStatus
        createdAt
        notes
        user {
          _id
          name
          email
        }
        items {
          quantity
          size
          product {
            _id
            name
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

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($id: ID!, $deliveryStatus: String!) {
    updateOrderStatus(id: $id, deliveryStatus: $deliveryStatus) {
      _id
      deliveryStatus
    }
  }
`;

export const CANCEL_ORDER = gql`
  mutation CancelOrder($id: ID!, $reason: String) {
    cancelOrder(id: $id, reason: $reason) {
      message
    }
  }
`;

export const GET_SALES_ANALYTICS = gql`
  query GetSalesAnalytics {
    getSalesAnalytics {
      totalRevenue
      totalOrders
      averageOrderValue
    }
  }
`;

export const GET_TOP_PRODUCTS = gql`
  query GetTopProducts {
    getTopProducts {
      productId
      name
      totalSold
      revenue
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers($search: String, $page: Int, $limit: Int) {
    getAllUsers(search: $search, page: $page, limit: $limit) {
      data {
        _id
        name
        email
        phone
        role
        isVerified
        createdAt
      }
      totalCount
      totalPages
      currentPage
      hasNextPage
    }
  }
`;
