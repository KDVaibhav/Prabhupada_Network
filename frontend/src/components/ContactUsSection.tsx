"use client";

import { DIcons } from "dicons";
import Link from "next/link";
import Image from "next/image";
import { Button, TextInput, useThemeMode } from "flowbite-react";
import { useState } from "react";
import DataInsertModal from "./ui/DataInsertModal";
import { QueryFields } from "@/app/data";
import axios from "axios";
import { subscribe } from "diagnostics_channel";

const Underline = `hover:-translate-y-1 border rounded-xl p-2.5 transition-transform`;

function handleScrollTop() {
  window.scroll({
    top: 0,
    behavior: "smooth",
  });
}

const ContactUsSection = () => {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState("");
  const handleSubscribe = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriber`, {
        email: email,
      });
      alert("Subscribed Successfully");
    } catch (err) {
      console.error("Error in Subscribing:", err);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center w-full bg-bgApp2 rounded-2xl overflow-hidden mt-2">
      <div className="flex flex-col justify-center items-center md:flex-row w-full">
        {/* Srila Prabhupada Image and Text */}
        <div className="p-2 flex flex-col items-center justify-center w-full md:w-1/2">
          <Image
            src={"/SP_Footer.webp"}
            height={100}
            width={200}
            alt="Srila Prabhupada"
            className="rounded-2xl"
          />
          <span className="text-center text-fontApp max-w-72 md:max-w-96">
            His Divine Grace A.C. Bhaktivedanta Swami Prabhupada
          </span>
        </div>
        {/* Contact Us */}
        <div className="text-fontApp flex flex-col items-center justify-center max-w-72 md:max-w-96">
          <h1 className="font-bold">Contact Us</h1>
          <div className="text-center">
            Srila Prabhupada Connection - Mayapur, Room 102, 1st floor, lotus
            building, Iskcon Temple Mayapur, Nadia 741313, West Bengal, India.
          </div>
          <div className="flex flex-col gap-2 p-2">
            <div className="flex items-center gap-2">
              <DIcons.Phone className="text-white bg-primary2 rounded-full w-10 h-10 p-2" />
              +91 9679331108
            </div>
            <div className="flex items-center gap-2">
              <DIcons.Mail className="text-white bg-primary2 rounded-full w-10 h-10 p-2" />
              srilaprabhupadaconnectionm@gmail.com
            </div>
          </div>
        </div>
      </div>
      <h1 className="font-bold text-center text-fontApp mb-5">
        Follow Us for more updates
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-between gap-y-6 md:gap-5 text-black">
        <div className="flex md:flex-col justify-center w-full md:w-1/2">
          <TextInput
            id={email}
            aria-label={`Enter email`}
            placeholder={`Enter email`}
            value={email || ""}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button onClick={handleSubscribe} className="bg-primary2">
            Subscribe
          </Button>
        </div>
        <div className="flex flex-col w-full items-center justify-center md:ml-12">
          <div className="flex flex-wrap items-center justify-center gap-5 ">
            <Link
              aria-label="Logo"
              href="https://www.instagram.com/prabhupadanetwork/#"
              rel="noreferrer"
              target="_blank"
              className={Underline}
            >
              <DIcons.Instagram strokeWidth={1.5} className="h-5 w-5" />
            </Link>
            <Link
              aria-label="Logo"
              href="https://x.com/prabhupadateam"
              rel="noreferrer"
              target="_blank"
              className={Underline}
            >
              <DIcons.X className="h-5 w-5" />
            </Link>
            <Link
              aria-label="Logo"
              href="https://api.whatsapp.com/send?phone=919679331108"
              rel="noreferrer"
              target="_blank"
              className={Underline}
            >
              <DIcons.WhatsApp className="h-5 w-5" />
            </Link>
            <Link
              aria-label="Logo"
              href="https://www.facebook.com/people/Prabhupada-Network/61562961872679/"
              rel="noreferrer"
              target="_blank"
              className={Underline}
            >
              <DIcons.Facebook className="h-5 w-5" />
            </Link>
            <Link
              aria-label="Logo"
              href="https://www.youtube.com/@prabhupadanetwork"
              rel="noreferrer"
              target="_blank"
              className={Underline}
            >
              <DIcons.YouTube className="h-5 w-5" />
            </Link>
          </div>
          <Button
            onClick={() => {
              setOpenModal(!openModal);
            }}
            className="bg-primary2"
          >
            Anything you want to ask
          </Button>
          <DataInsertModal
            openModal={openModal}
            onCloseModal={() => setOpenModal(false)}
            title="Query"
            fields={QueryFields}
          />
        </div>
      </div>
      <div className="flex items-center rounded-full p-2 border mt-5">
        <button type="button" onClick={handleScrollTop}>
          <DIcons.ArrowUp className="h-5 w-5" />
          <span className="sr-only">Top</span>
        </button>
      </div>
    </div>
  );
};

export default ContactUsSection;
