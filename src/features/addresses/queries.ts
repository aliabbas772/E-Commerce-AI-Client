import { gql } from "@apollo/client";

export const GET_MY_ADDRESSES = gql`
  query GetMyAddresses {
    getMyAddresses {
      _id
      fullName
      phone
      street
      city
      state
      pincode
      country
      isDefault
      label
    }
  }
`;

export const CREATE_ADDRESS = gql`
  mutation CreateAddress($input: CreateAddressInput!) {
    createAddress(input: $input) {
      _id
      fullName
      phone
      street
      city
      state
      pincode
      country
      isDefault
      label
    }
  }
`;

export const UPDATE_ADDRESS = gql`
  mutation UpdateAddress($id: ID!, $input: UpdateAddressInput!) {
    updateAddress(id: $id, input: $input) {
      _id
      fullName
      phone
      street
      city
      state
      pincode
      country
      isDefault
      label
    }
  }
`;

export const DELETE_ADDRESS = gql`
  mutation DeleteAddress($id: ID!) {
    deleteAddress(id: $id) {
      message
    }
  }
`;

export const SET_DEFAULT_ADDRESS = gql`
  mutation SetDefaultAddress($id: ID!) {
    setDefaultAddress(id: $id) {
      _id
      isDefault
    }
  }
`;