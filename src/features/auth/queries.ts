import { gql } from "@apollo/client";

export const LOGIN_WITH_PASSWORD = gql`
  mutation LoginWithPassword($email: String!, $password: String!) {
    loginWithPassword(email: $email, password: $password) {
      accessToken
      user {
        _id
        name
        email
        role
      }
    }
  }
`;
