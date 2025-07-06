"use client";

import { Carousel } from "flowbite-react";

export default function PromotionSection() {
  return (
    <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
      <Carousel slideInterval={5000}>
        <img
          src="https://ik.imagekit.io/opiwak7mf/Prabhupada_Network/Website%20Home%20Banner.png?updatedAt=1739163337702"
          alt="..."
        />
       
        <img
          src="https://flowbite.com/docs/images/carousel/carousel-5.svg"
          alt="..."
        />
      </Carousel>
    </div>
  );
}
