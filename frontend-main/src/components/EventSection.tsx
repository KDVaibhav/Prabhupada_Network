"use client";
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import axios from 'axios';


const EventSection = () => {
  const [events, setEvents] = useState<{title:string, date:string, imageUrl: string, location: string, description: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const cards = events.map((event, index) => (
    <Card key={event.title} card={event} index={index} />
  ));
  useEffect(()=>{
    const fetchEvents =async()=>{
      try{
        const eventsData = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/event`)
        console.log(eventsData.data);
        setEvents(eventsData.data);
        setLoading(false);
      }catch(error){
        console.log(error);
      }
    }
    fetchEvents();
},[])

  return (
    <div className="w-full h-full py-2 bg-bgApp2 rounded-2xl">
      <h2 className="max-w-7xl pl-4 mx-auto text-2xl font-bold text-fontApp font-sans">
        Events
      </h2>
      {loading?<div className='p-4 text-fontApp'>Loading...</div>:
      <Carousel items={cards} />}
    </div>
  );
}


export default EventSection