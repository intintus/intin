/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState, Fragment } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Store } from "../utils/Store";
import DropdownLink from "./DropdownLink";
import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import "@fortawesome/fontawesome-svg-core/styles.css";
import {
  faShoppingCart,
  faUser,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Layout({ title, children }) {
  const { status, data: session } = useSession();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove("cart");
    dispatch({ type: "CART_RESET" });
    signOut({ callbackUrl: "/login" });
  };

  const [query, setQuery] = useState("");

  const router = useRouter();
  const submitHandler = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };
  const [isActive, setIsActive] = useState(false);

  const handleSearchToggle = (event) => {
    const container = event.currentTarget.closest(".search-wrapper");
    setIsActive(!isActive);
  };
  return (
    <>
      <Head>
        <title>{title ? title + " - Intintus" : "Intintus"}</title>
        <meta name='description' content='Ecommerce Website' />
        <link text-black rel='icon' href='/favicon.ico' />
      </Head>

      <ToastContainer position='bottom-center' limit={1} />

      <div className='flex min-h-screen flex-col justify-between '>
        <header>
          <nav className='flex h-24 items-center px-4 justify-between shadow-md'>
            <Link href='/' className='text-lg font-bold'>
              <img className='lg:ml-10' src='/images/intintus.jpg' />
            </Link>
            <Link
              href='/search?category=ReadyToWear'
              className='hidden lg:flex ml-5 text-sm text-black font-sans '
            >
              Ready To Wear
            </Link>
            <Link
              href='/search?category=Colaboration'
              className='hidden lg:flex ml-5 text-sm text-black font-sans '
            >
              Colaborations{" "}
            </Link>
            <Link
              href='/search?category=Planner'
              className='hidden lg:flex ml-5 text-sm text-black font-sans '
            >
              Planners{" "}
            </Link>
            <Link
              href='/search?category=NoteCard'
              className='hidden lg:flex ml-5 text-sm text-black font-sans '
            >
              Initial Note Card
            </Link>
            <Link
              href='/search?category=Can'
              className='hidden lg:flex ml-5 text-sm text-black font-sans '
            >
              Cans{" "}
            </Link>
            <div>
              <button
                className=' cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none'
                type='button'
                onClick={() => setNavbarOpen(!navbarOpen)}
              ></button>
            </div>

            <div
              className={
                "lg:flex flex-grow items-center" +
                (navbarOpen ? " flex" : " hidden")
              }
              id='example-navbar-danger'
            ></div>

            <form
              onSubmit={submitHandler}
              className='mx-auto  hidden mr-24  justify-center md:flex'
            >
              <div className={`search-wrapper ${isActive ? "" : "active"}`}>
                <div onSubmit={submitHandler} className='input-holder'>
                  <input
                    type='text'
                    className='search-input border-black'
                    placeholder='Type to search'
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <button className='search-icon' onClick={handleSearchToggle}>
                    <span></span>
                  </button>
                  <div className='close' onClick={handleSearchToggle}>
                    <div className='close-icon'></div>
                  </div>
                </div>
              </div>
            </form>
            <div className='flex items-center z-10'>
              <Link href='/cart' className='p-2'>
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  className='fa-shopping-cart text-black'
                />

                {cartItemsCount > 0 && (
                  <span className='ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white'>
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {status === "loading" ? (
                "Loading"
              ) : session?.user ? (
                <Menu as='div' className='relative inline-block'>
                  <Menu.Button className='text-black'>
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className='absolute right-2 mt-3 w-56 origin-top-right bg-white  shadow-lg '>
                    <Menu.Item>
                      <DropdownLink className='dropdown-link text-black' href='/profile'>
                        Profile
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink
                        className='dropdown-link text-black'
                        href='/order-history'
                      >
                        Order History
                      </DropdownLink>
                    </Menu.Item>
                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink
                          className='dropdown-link text-black'
                          href='/admin/dashboard'
                        >
                          Admin Dashboard
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <a
                        className='dropdown-link text-black'
                        href='#'
                        onClick={logoutClickHandler}
                      >
                        Logout
                      </a>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href='/login' className='p-2'>
                  <FontAwesomeIcon icon={faUser} className='fa-shopping-cart text-black' />
                </Link>
              )}
              <Menu as='div' className='relative inline-block'>
                <Menu.Button className='text-blue-600 lg:invisible  ml-1'>
                  <FontAwesomeIcon icon={faBars} className='fa-bars text-black' />
                </Menu.Button>
                <Menu.Items className='absolute right-0 w-56 origin-top-right bg-white  shadow-lg '>
                  <Menu.Item>
                    <DropdownLink
                      className='dropdown-link text-black'
                      href='/search?category=ReadyToWear'
                    >
                      Ready to Wear
                    </DropdownLink>
                  </Menu.Item>
                  <Menu.Item>
                    <DropdownLink
                      className='dropdown-link text-black'
                      href='/search?category=Colaborations'
                    >
                      Colaborations
                    </DropdownLink>
                  </Menu.Item>
                  <Menu.Item>
                    <DropdownLink
                      className='dropdown-link text-black'
                      href='/search?category=Planners'
                    >
                      Planners
                    </DropdownLink>
                  </Menu.Item>
                  <Menu.Item>
                    <DropdownLink
                      className='dropdown-link text-black'
                      href='/search?category=NoteCard'
                    >
                      Initial Note Card
                    </DropdownLink>
                  </Menu.Item>
                  <Menu.Item>
                    <a className='dropdown-link text-black' href='/search?category=Cans'>
                      Cans
                    </a>
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
          </nav>
        </header>
        <main className='container m-auto mt-4 px-4'>{children}</main>
        <footer className='flex h-10 justify-center items-center shadow-inner'>
          <p>Copyright © 2023 intintus</p>
        </footer>
      </div>
    </>
  );
}
