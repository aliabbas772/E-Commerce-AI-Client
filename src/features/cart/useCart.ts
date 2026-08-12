import { useQuery, useMutation } from "@apollo/client/react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { GET_MY_CART, UPDATE_CART_ITEM, REMOVE_FROM_CART } from "./queries";
import {
  removeGuestItem,
  increaseGuestQuantity,
  decreaseGuestQuantity,
} from "../../store/slices/guestCartSlice";

export interface UnifiedCartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  stock?: number;
}

export function useCart() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const guestItems = useSelector((state: RootState) => state.guestCart.items);
  const dispatch = useDispatch();

  const { data, loading, refetch } = useQuery<any>(GET_MY_CART, {
    skip: !isAuthenticated,
  });

  const [updateCartItem] = useMutation(UPDATE_CART_ITEM, {
    refetchQueries: [{ query: GET_MY_CART }],
  });
  const [removeFromCartMutation] = useMutation(REMOVE_FROM_CART, {
    refetchQueries: [{ query: GET_MY_CART }],
  });

  let items: UnifiedCartItem[];

  if (isAuthenticated) {
    const cartItems = data?.getMyCart?.items ?? [];
    items = cartItems.map((item: any) => ({
      productId: item.product._id,
      name: item.product.name,
      price: item.price,
      image: item.product.images?.[0] ?? "",
      size: item.size,
      quantity: item.quantity,
      stock: item.product.stock,
    }));
  } else {
    items = guestItems;
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const increaseQuantity = (productId: string, size: string) => {
    if (isAuthenticated) {
      const current = items.find(
        (i) => i.productId === productId && i.size === size,
      );
      if (current) {
        updateCartItem({
          variables: { productId, size, quantity: current.quantity + 1 },
        });
      }
    } else {
      dispatch(increaseGuestQuantity({ productId, size }));
    }
  };

  const decreaseQuantity = (productId: string, size: string) => {
    if (isAuthenticated) {
      const current = items.find(
        (i) => i.productId === productId && i.size === size,
      );
      if (current && current.quantity > 1) {
        updateCartItem({
          variables: { productId, size, quantity: current.quantity - 1 },
        });
      }
    } else {
      dispatch(decreaseGuestQuantity({ productId, size }));
    }
  };

  const removeItem = (productId: string, size: string) => {
    if (isAuthenticated) {
      removeFromCartMutation({ variables: { productId, size } });
    } else {
      dispatch(removeGuestItem({ productId, size }));
    }
  };

  return {
    items,
    subtotal,
    itemCount,
    loading: isAuthenticated && loading,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    refetch,
  };
}
