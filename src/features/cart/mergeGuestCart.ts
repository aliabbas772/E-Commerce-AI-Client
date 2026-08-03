import { apolloClient } from "../../lib/apolloClient";
import { ADD_TO_CART, GET_MY_CART } from "./queries";
import { clearGuestCart } from "../../store/slices/guestCartSlice";

interface GuestItem {
  productId: string;
  quantity: number;
  size: string;
}

export async function mergeGuestCartOnLogin(
  guestItems: GuestItem[],
  dispatch: any,
) {
  if (guestItems.length === 0) return;

  for (const item of guestItems) {
    try {
      await apolloClient.mutate({
        mutation: ADD_TO_CART,
        variables: {
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
        },
      });
    } catch (err) {
      console.error("Failed to merge guest cart item:", item, err);
    }
  }

  dispatch(clearGuestCart());
  apolloClient.refetchQueries({ include: [GET_MY_CART] });
}
