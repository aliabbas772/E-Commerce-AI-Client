import { useQuery, useMutation } from "@apollo/client/react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import {
  GET_MY_WISHLIST,
  ADD_TO_WISHLIST,
  REMOVE_FROM_WISHLIST,
} from "./queries";

export function useWishlist() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const { data, loading } = useQuery(GET_MY_WISHLIST, {
    skip: !isAuthenticated,
  });

  const [addToWishlist] = useMutation(ADD_TO_WISHLIST, {
    refetchQueries: [{ query: GET_MY_WISHLIST }],
  });
  const [removeFromWishlist] = useMutation(REMOVE_FROM_WISHLIST, {
    refetchQueries: [{ query: GET_MY_WISHLIST }],
  });

  const products = data?.getMyWishlist?.products ?? [];
  const productIds = new Set(products.map((p: any) => p._id));

  const isWishlisted = (productId: string) => productIds.has(productId);

  const toggle = (productId: string) => {
    if (isWishlisted(productId)) {
      removeFromWishlist({ variables: { productId } });
    } else {
      addToWishlist({ variables: { productId } });
    }
  };

  return {
    products,
    loading: isAuthenticated && loading,
    isWishlisted,
    toggle,
    isAuthenticated,
  };
}
