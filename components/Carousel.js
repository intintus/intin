
import React from 'react';
import Image from 'next/image';
import can from '../public/images/can.png'
import card from '../public/images/card.png'
import colab from '../public/images/colab1.png'
import planner from '../public/images/planner.png'
import rea from '../public/images/rea.png'

export default function Carousel() {
  return (
    
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
          <Image src={can} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."/>
        </div>
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
          <Image src={card} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."/>
        </div>
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
          <Image src={colab} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."/>
        </div>
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
          <Image src={planner} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."/>
        </div>
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
          <Image src={rea} className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."/>
        </div>
     
  );
}


