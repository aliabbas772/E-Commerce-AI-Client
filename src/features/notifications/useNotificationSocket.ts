import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { notificationSocket } from "../../lib/socket";
import { apolloClient } from "../../lib/apolloClient";
import { GET_UNREAD_COUNT, GET_MY_NOTIFICATIONS } from "./queries";

export function useNotificationSocket() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      notificationSocket.disconnect();
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    notificationSocket.connect(token);

    const unsubscribe = notificationSocket.subscribe((event, data) => {
      if (event !== "new_notification") return;

      apolloClient.cache.updateQuery(
        { query: GET_UNREAD_COUNT },
        (existing) => {
          if (!existing) return existing;
          return {
            getUnreadCount: {
              ...existing.getUnreadCount,
              count: existing.getUnreadCount.count + 1,
            },
          };
        },
      );

      apolloClient.cache.updateQuery(
        { query: GET_MY_NOTIFICATIONS, variables: { page: 1, limit: 15 } },
        (existing) => {
          if (!existing) return existing;
          return {
            getMyNotifications: [
              { ...data, __typename: "Notification" },
              ...existing.getMyNotifications,
            ],
          };
        },
      );
    });

    return () => {
      unsubscribe();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    return () => {
      notificationSocket.disconnect();
    };
  }, []);
}
