"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const FlipCalendar = () => {
  const [quotes, setQuotes] = useState<
    { _id: string; quote: string; date: string }[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/quotes`
        );
        setQuotes(response.data);
      } catch (error) {
        console.error(error);
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
    <div className="flex flex-col items-center mt-8">
      <div className="relative w-80 h-64 bg-white shadow-xl rounded-lg border-2 border-gray-300 p-4 flex flex-col items-center">
        {/* Spiral Binding Effect */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-4 h-2 bg-gray-700 rounded-full"></div>
          ))}
        </div>

        <h2 className="text-lg font-bold text-gray-700">
          Srila Prabhupada Quote
        </h2>

        <AnimatePresence mode="wait">
          {quotes.length > 0 && (
            <motion.div
              key={currentIndex}
              className="text-center text-gray-600 mt-4 text-sm italic px-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              "{quotes[currentIndex].quote}"
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-xs text-gray-500 mt-6">
          📅 {quotes[currentIndex]?.date}
        </p>

        {/* Navigation Buttons */}
        <div className="absolute bottom-2 w-full flex justify-between px-4">
          <button
            onClick={prevQuote}
            className="p-2 bg-gray-300 rounded-full shadow-md"
          >
            &#x2190;
          </button>
          <button
            onClick={nextQuote}
            className="p-2 bg-gray-300 rounded-full shadow-md"
          >
            &#x2192;
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlipCalendar;
