"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useSelector } from "react-redux";
import DataInsertModal from "./ui/DataInsertModal";
import { QuoteFields } from "@/app/data";
import { motion, AnimatePresence } from "framer-motion";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";

const QuotesSection = () => {
  const [quotes, setQuotes] = useState<
    { _id: string; quote: string; date: string; location: string }[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const { isAuthenticated } = useSelector(
    (state: { auth: { isAuthenticated: boolean } }) => state.auth
  );

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/quote`);
        setQuotes(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  const nextQuote = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  const prevQuote = () => {
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-bgApp2 rounded-2xl">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 w-full max-w-4xl">
        <div className="flex justify-center w-full md:w-auto">
          <Image
            src="https://ik.imagekit.io/opiwak7mf/Prabhupada_Network/SP%20Quotes%20Image.png?updatedAt=1739163938843"
            height={400}
            width={400}
            alt="SP_Quotes.png"
            className="w-32 h-32 md:w-52 md:h-52"
          />
        </div>

        {/* Quote Card */}
        <div className="flex flex-col items-center w-full">
          <div className="relative w-full max-w-xs sm:max-w-md bg-white shadow-xl rounded-b-3xl rounded-t-lg border-2 border-gray-300 p-4 flex flex-col items-center">
            {/* Spiral Binding Effect */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-3 h-2 bg-gray-700 rounded-full"></div>
              ))}
            </div>

            <h2 className="text-lg md:text-xl font-bold text-fontApp text-center">
              Srila Prabhupada Quote
            </h2>

            <AnimatePresence mode="wait">
              {loading ? (
                <div>Loading...</div>
              ) : (
                quotes.length > 0 && (
                  <motion.div
                    key={currentIndex}
                    className="text-center text-fontApp mt-4 text-base md:text-lg italic px-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                    "{quotes[currentIndex].quote}"
                  </motion.div>
                )
              )}
            </AnimatePresence>

            {/* Date & Location */}
            <div className="flex gap-1 text-sm text-gray-500 mt-4">
              <span>{quotes[currentIndex]?.date.split("T")[0]},</span>
              <span>{quotes[currentIndex]?.location}</span>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute bottom-2 w-full flex justify-between px-4">
              <button
                onClick={prevQuote}
                className="p-2 bg-gray-300 rounded-full shadow-md hover:bg-gray-400 transition"
              >
                <IconArrowNarrowLeft className="h-6 w-6 text-gray-500" />
              </button>
              <button
                onClick={nextQuote}
                className="p-2 bg-gray-300 rounded-full shadow-md hover:bg-gray-400 transition"
              >
                <IconArrowNarrowRight className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Quotes Button */}
      {isAuthenticated && (
        <button
          onClick={() => setOpenModal(true)}
          className="mt-4 bg-primary2 text-white p-2 rounded-2xl shadow-md font-bold hover:text-fontApp2"
        >
          Upload Quotes
        </button>
      )}

      {/* Modal */}
      <DataInsertModal
        openModal={openModal}
        onCloseModal={() => setOpenModal(false)}
        title="Quote"
        fields={QuoteFields}
      />
    </div>
  );
};

export default QuotesSection;
