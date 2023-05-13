import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useRef } from "react";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";
import Product from "../../models/Product";
import db from "../../utils/db";
import { Store } from "../../utils/Store";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { faShoppingCart, faBox } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ProductScreen(props) {
  const { product } = props;
  const { state, dispatch } = useContext(Store);
  const router = useRouter();
  if (!product) {
    return <Layout title="Produt Not Found">Produt Not Found</Layout>;
  }
  const buttonRef = useRef(null);

  const handleClick = () => {
    const button = buttonRef.current;
    button.classList.add("clicked");
  };

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error("Sorry. Product is out of stock");
    }

    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
  };

  return (
    <Layout title={product.name}>
      <div className="py-2">
        <Link href="/">back to products</Link>
      </div>
      <div className="grid md:grid-cols-4 ">
        <div className="md:col-span-2">
          <Image
            className="rounded-md"
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            sizes="100vw"
            style={{
              width: "70%",
              height: "auto",
            }}
          ></Image>
        </div>
        <div>
          <ul>
            <li className="text-xs">Brand: {product.brand}</li>
            <li>
              <h1 className="text-xl font-bold mb-10">{product.name}</h1>
            </li>
            <li className="mb-5">Category: {product.category}</li>

            <li className="mb-5">
              {product.rating} of {product.numReviews} reviews
            </li>
            <li>{product.description}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Status</div>
              <div>{product.countInStock > 0 ? "In stock" : "Unavailable"}</div>
            </div>
            <button
              className="cart-button"
              onClick={function (event) {
                handleClick();
                addToCartHandler(product);
              }}
              ref={buttonRef}
            >
              <span className="add-to-cart">Add to cart</span>
              <span className="added">Added</span>
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="fa-shopping-cart"
              />
              <FontAwesomeIcon icon={faBox} className="fa-box" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}
