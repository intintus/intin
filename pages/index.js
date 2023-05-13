import axios from "axios";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import ProductItem from "../components/ProductItem";
import Product from "../models/Product";
import db from "../utils/db";
import Image from "next/image";
import { Store } from "../utils/Store";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import can from "../public/images/can.png";
import card from "../public/images/card.png";
import colab from "../public/images/colab1.png";
import planner from "../public/images/planner.png";
import rea from "../public/images/rea.png";
import canses from "../public/images/canses.png";
import show from "../public/images/show.png";
import rtw from "../public/images/rtw.png";
import AOS from "aos";
import "aos/dist/aos.css";

const PAGE_SIZE = 8;

export default function Home({ products, featuredProducts }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  useEffect(() => {
    AOS.init();
  }, []);

  const router = useRouter();

  const pageHandler = (page) => {
    router.push({
      query: { page },
    });
  };

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error("Sorry. Product is out of stock");
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });

    toast.success("Product added to the cart");
  };

  return (
    <Layout title="Home Page">
      <Carousel className="mb-24" showThumbs={false} autoPlay infiniteLoop>
        <div className=" duration-700 h-96 ease-in-out" data-carousel-item>
          <Image
            src={can}
            className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            alt="..."
          />
        </div>
        <div className=" duration-700 ease-in-out" data-carousel-item>
          <Image
            src={card}
            className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            alt="..."
          />
        </div>
        <div className=" duration-700 ease-in-out" data-carousel-item>
          <Image
            src={colab}
            className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            alt="..."
          />
        </div>
        <div className=" duration-700 ease-in-out" data-carousel-item>
          <Image
            src={planner}
            className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            alt="..."
          />
        </div>
        <div className=" duration-700 ease-in-out" data-carousel-item>
          <Image
            src={rea}
            className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
            alt="..."
          />
        </div>
      </Carousel>
      <h2 class="text_shadows ">Latest Products ⇩</h2>
      <div>
        <div className="grid grid-cols-1 gap-4 mt-5 md:grid-cols-3 lg:grid-cols-4">
          {products &&
            products.map((product) => (
              <ProductItem
                key={product._id}
                product={product}
                addToCartHandler={addToCartHandler}
              />
            ))}
        </div>
      </div>
      <h2 class="text_shadows ">Collections ⇩</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2 mb-10 mt-12">
        <div className="relative">
          <div data-aos="fade-right">
            <Image src={rtw} className="w-full justify-center h-96" alt="..." />
            <button className="absolute text-5xl text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              KindaCode.com
            </button>
          </div>
        </div>
        <div className="relative">
          <div data-aos="fade-left">
            <Image src={canses} className="w-full justify-center h-96" alt="..." />
            <button className="absolute text-5xl text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              KindaCode
            </button>
          </div>
        </div>
        <div className="relative">
          <div data-aos="fade-up-right">
            <Image src={rea} className="w-full justify-center h-96" alt="..." />
            <button className="absolute text-5xl text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              Ready To Wear
            </button>
          </div>
        </div>
        <div className="relative">
          <div data-aos="fade-down-left">
            <Image src={can} className="w-full justify-center h-96" alt="..." />
            <button className="absolute text-5xl text-white bg-gray-500 rounded-lg bg-opacity-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              Cans
            </button>
          </div>
        </div>
      </div>
      <h2 className="text_shadows ">ShowRoom ⇩</h2>
      <div className="relative">
          <div data-aos="fade-down-left">
            <Image src={show} className="w-full justify-center h-[32rem]" alt="..." />
            <div className="absolute text-5xl text-black bg-white w-1/2 h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <h1 className="text-center mt-6">SHOWROOM</h1>
              <h3 className="text-center text-sm mt-6">MON - FRI | 10:00 AM - 5:00 PM</h3>
              <h4 className="text-center text-2xl p-5 ml-24 mr-24 bg-black cursor-pointer text-white mt-6">SCHEDULE AN APPOINTMENT</h4>
            </div>
          </div>
        </div>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  const page = query.page || 1;
  const featuredProducts = await Product.find({ isFeatured: true }).lean();
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
      featuredProducts: featuredProducts.map(db.convertDocToObj),
      products: products.map(db.convertDocToObj),
      page,
      pages: Math.ceil(countProducts / PAGE_SIZE),
    },
  };
}
