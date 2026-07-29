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

export const SEND_REGISTER_OTP = gql`
  mutation SendRegisterOTP(
    $name: String!
    $email: String!
    $password: String!
    $phone: String
    $captchaToken: String!
  ) {
    sendRegisterOTP(
      name: $name
      email: $email
      password: $password
      phone: $phone
      captchaToken: $captchaToken
    ) {
      message
    }
  }
`;

export const VERIFY_REGISTER_OTP = gql`
  mutation VerifyRegisterOTP($email: String!, $otp: String!) {
    verifyRegisterOTP(email: $email, otp: $otp) {
      accessToken
      user {
        _id
        name
        email
        phone
        role
        isVerified
      }
    }
  }
`;

export const LOGIN_WITH_OTP = gql`
  mutation LoginWithOTP($email: String!, $captchaToken: String!) {
    loginWithOTP(email: $email, captchaToken: $captchaToken) {
      message
    }
  }
`;

export const VERIFY_LOGIN_OTP = gql`
  mutation VerifyLoginOTP($email: String!, $otp: String!) {
    verifyLoginOTP(email: $email, otp: $otp) {
      accessToken
      user {
        _id
        name
        email
        phone
        role
        isVerified
      }
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout {
      message
    }
  }
`;
