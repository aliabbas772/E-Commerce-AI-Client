import { gql } from "@apollo/client";

export const GET_ADMIN_PROFILE = gql`
  query GetAdminProfile {
    getAdminProfile {
      _id
      permissions
      isActive
      lastLoginAt
      createdAt
      user {
        _id
        name
        email
      }
    }
  }
`;

export const GET_ALL_ADMINS = gql`
  query GetAllAdmins {
    getAllAdmins {
      _id
      permissions
      isActive
      lastLoginAt
      createdAt
      user {
        _id
        name
        email
      }
    }
  }
`;

export const GET_AUDIT_LOGS = gql`
  query GetAuditLogs($adminId: ID!, $page: Int, $limit: Int) {
    getAuditLogs(adminId: $adminId, page: $page, limit: $limit) {
      action
      entity
      entityId
      ip
      timestamp
    }
  }
`;

export const CREATE_ADMIN = gql`
  mutation CreateAdmin($userId: ID!, $permissions: [String!]!) {
    createAdmin(userId: $userId, permissions: $permissions) {
      _id
      permissions
      isActive
      user {
        _id
        name
        email
      }
    }
  }
`;

export const UPDATE_ADMIN_PERMISSIONS = gql`
  mutation UpdateAdminPermissions($adminId: ID!, $permissions: [String!]!) {
    updateAdminPermissions(adminId: $adminId, permissions: $permissions) {
      _id
      permissions
    }
  }
`;

export const DEACTIVATE_ADMIN = gql`
  mutation DeactivateAdmin($adminId: ID!) {
    deactivateAdmin(adminId: $adminId) {
      message
    }
  }
`;
