import Link from "next/link";
import React from "react";

const DonationForm = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center bg-bgApp2 rounded-2xl mt-2">
      <div className="w-full md:w-1/3 flex items-center justify-center order-1 md:order-2">
        <img
          src="https://ik.imagekit.io/opiwak7mf/Prabhupada_Network/donation.png?updatedAt=1751788582838"
          className="rounded-2xl m-2 object-fill w-1/3 md:w-2/3 h-[100px]"
        />
      </div>
      <div className="flex flex-col items-center bg-bgApp2 rounded-2xl mb-2 order-2 md:order-1">
        <div className="p-2 text-center text-fontApp">
          Please Donate And Help Us Organize Srila Prabhupada Connect Days
        </div>
        <Link
          href={"/donation"}
          className="p-2 bg-primary2 rounded-2xl font-bold text-white hover:text-fontApp2"
        >
          Donate Now
        </Link>
      </div>
    </div>
  )
};

export default DonationForm;
