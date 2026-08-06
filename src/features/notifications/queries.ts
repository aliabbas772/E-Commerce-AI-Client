import { gql } from "@apollo/client";

export const GET_MY_NOTIFICATIONS = gql`
  query GetMyNotifications($page: Int, $limit: Int) {
    getMyNotifications(page: $page, limit: $limit) {
      _id
      type
      title
      message
      isRead
      link
      createdAt
    }
  }
`;

export const GET_UNREAD_COUNT = gql`
  query GetUnreadCount {
    getUnreadCount {
      count
    }
  }
`;

export const MARK_AS_READ = gql`
  mutation MarkAsRead($id: ID!) {
    markAsRead(id: $id) {
      _id
      isRead
    }
  }
`;

export const MARK_ALL_AS_READ = gql`
  mutation MarkAllAsRead {
    markAllAsRead {
      message
    }
  }
`;

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($id: ID!) {
    deleteNotification(id: $id) {
      message
    }
  }
`;
