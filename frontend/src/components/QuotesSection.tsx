import React from "react";
import Image from "next/image";
import { quotes } from "@/app/data";

const QuotesSection = () => {
  return (
    <div className="flex gap-4 h-full items-center">
      {/* Left Section - Srila Prabhupada Image & Title */}
      <div className="flex flex-col items-center gap-4">
        <Image
          src="https://ik.imagekit.io/opiwak7mf/Prabhupada_Network/SP%20Quotes%20Image.png?updatedAt=1739163938843"
          height={200}
          width={200}
          alt="SP_Quotes.png"
          className="min-w-40 min-h-40"
        />
        <div className="text-fontApp font-bold text-lg text-center">
          Srila Prabhupada Quotes
        </div>
      </div>
      <div className="flex flex-col w-full h-full justify-between bg-white p-2 rounded-2xl">
        <div className="">
          Begin this year with full determination to serve Krishna and spread His
          message.
        </div>
        <div className="font-bold text-right">New York, 1966</div>
      </div>
    </div>
  );
};

export default QuotesSection;
