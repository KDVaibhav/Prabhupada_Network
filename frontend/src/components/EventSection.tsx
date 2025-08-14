"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import axios from "axios";
import { useSelector } from "react-redux";
import DataInsertModal from "./ui/DataInsertModal";
import { EventFields } from "@/app/data";

const EventSection = () => {
  const [events, setEvents] = useState<
    {
      title: string;
      date: string;
      imageUrl: string;
      location: string;
      description: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const cards = events.map((event, index) => (
    <Card key={event.title} card={event} index={index} />
  ));

  const { isAuthenticated } = useSelector(
    (state: { auth: { isAuthenticated: boolean } }) => state.auth
  );
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/event`
        );
        const childEvents = response.data.filter(
          (e: any) => e.parentEventId !== ""
        );
        setEvents(childEvents);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="w-full h-full py-2 bg-bgApp2 rounded-2xl">
      <h2 className="max-w-7xl pl-4 py-2 mx-auto text-2xl font-bold text-fontApp font-sans">
        Events
      </h2>
      <div className="flex flex-col items-center">
        {loading ? (
          <div className="p-4 text-fontApp">Loading...</div>
        ) : (
          <Carousel items={cards} />
        )}

        {isAuthenticated && (
          <button
            onClick={() => setOpenModal(true)}
            className="mt-4 bg-primary2 text-white p-2 rounded-2xl shadow-md font-bold hover:text-fontApp2"
          >
            Upload Events
          </button>
        )}
      </div>

      {/* Modal */}
      {isAuthenticated && (
        <DataInsertModal
          openModal={openModal}
          onCloseModal={() => setOpenModal(false)}
          title="Event"
          fields={EventFields}
        />
      )}
    </div>
  );
};

export default EventSection;
