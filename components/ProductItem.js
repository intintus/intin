/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React from 'react';
import { useRef } from 'react';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { faShoppingCart, faBox } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


export default function ProductItem({ product, addToCartHandler }) {
  const buttonRef = useRef(null);

  const handleClick = () => {
    const button = buttonRef.current;
    button.classList.add('clicked');
  };
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <img
          src={product.image}
          alt={product.name}
          className="rounded shadow object-cover h-64 w-full"
        />
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-lg">{product.name}</h2>
        </Link>
        <p className="mb-2">{product.brand}</p>
        <p>${product.price}</p>
        <button className="cart-button" onClick={function(event){ handleClick(); addToCartHandler(product)}} ref={buttonRef}>
    <span className="add-to-cart">Add to cart</span>
    <span className="added">Added</span>
    <FontAwesomeIcon icon={faShoppingCart} className="fa-shopping-cart" />
    <FontAwesomeIcon icon={faBox} className="fa-box" />
  </button>
      </div>
    </div>
  );
}



