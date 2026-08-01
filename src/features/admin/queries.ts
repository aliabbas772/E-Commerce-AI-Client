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
