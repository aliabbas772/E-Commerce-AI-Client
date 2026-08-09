import { useMutation } from "@apollo/client/react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { ADD_TO_CART, GET_MY_CART } from "./queries";
import { addGuestItem } from "../../store/slices/guestCartSlice";

interface AddToCartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
}

export function useAddToCart() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [addToCartMutation] = useMutation(ADD_TO_CART, {
    refetchQueries: [{ query: GET_MY_CART }],
    onError: (err) => {
      alert(err.message); // or wire to a toast system if you have one
    },
  });

  return (item: AddToCartItem) => {
    if (isAuthenticated) {
      addToCartMutation({
        variables: { productId: item.productId, quantity: 1, size: item.size },
      });
    } else {
      dispatch(addGuestItem(item));
    }
  };
}
