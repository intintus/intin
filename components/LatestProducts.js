
import axios from "axios";
import { useRouter } from "next/router";
import { useContext } from "react";
import { toast } from "react-toastify";
import { Store } from "../utils/Store";
import ProductItem from "./ProductItem";
import Product from "../models/Product";
import db from "../utils/db";

const PAGE_SIZE = 9;

export default function Latest(props) {
  const { products } = props;

  const { state, dispatch } = useContext(Store);
  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      toast.error("Sorry. Product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
  };

  const router = useRouter();

  const pageHandler = (page) => {
    router.push({
      query: { page },
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products &&
          products.map((product) => (
            <ProductItem
              key={product._id}
              product={product}
              addToCartHandler={addToCartHandler}
            />
          ))}
      </div>
      {products && products.length > 0 && (
        <ul className="flex justify-center mt-5">
          {[...Array(Math.ceil(products.length / PAGE_SIZE)).keys()].map(
            (pageNumber) => (
              <li key={pageNumber}>
                <button
                  className={`default-button m-2`}
                  onClick={() => pageHandler(pageNumber + 1)}
                >
                  {pageNumber + 1}
                </button>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}

export async function getServerSideProps({ query }) {
  const page = query.page || 1;

  await db.connect();
  const products = await Product.find({})
    .sort({ createdAt: -1 })
    .skip(PAGE_SIZE * (page - 1))
    .limit(PAGE_SIZE)
    .lean();
  const countProducts = await Product.countDocuments();
  await db.disconnect();

  return {
    props: {
      products: products.map(db.convertDocToObj),
      page,
      pages: Math.ceil(countProducts / PAGE_SIZE),
    },
  };
}
