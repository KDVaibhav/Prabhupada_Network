"use client";
import DataInsertModal from "@/components/ui/DataInsertModal";
import { Button } from "flowbite-react";
import Image from "next/image";
import { useState } from "react";
import { JoinUsFields } from "../data";

export default function AboutUs() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="bg-bgApp mt-4 text-gray-800">
      {/* Banner Section */}
      <div className="relative rounded-2xl isolate w-full h-60 md:h-72 flex items-center justify-center overflow-hidden">
        <img
          src="https://ik.imagekit.io/opiwak7mf/Prabhupada_Network/About-us(PN).webp?updatedAt=1754812796023"
          alt="AboutUs Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary2/85 to-orange-400/70 mix-blend-multiply" />
        <div className="absolute left-10 top-1/2 -translate-y-1/2 hidden md:block">
          <div className="h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-tight">
            Srila Prabhupada Connection Mayapur: Strengthening Our Spiritual
            Bonds
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <section className="bg-bgApp2 mt-2 rounded-2xl px-6 py-12 text-lg text-fontApp leading-relaxed">
        <p>
          Understanding the importance of profoundly connecting with Śrīla
          Prabhupāda, strengthening our relationships with our śikṣā and
          dīkṣā-gurus, and embracing Prabhupāda's desire that we cooperate in
          his physical absence, the Srila Prabhupāda Connection Team will
          facilitate:
        </p>

        <ul className="list-disc list-inside mt-6 space-y-4">
          <li>
            <strong>Enhanced care for devotees and community building</strong>:
            We will arrange in September and October, 2025 the Devotee Care
            Course offered by Radha Gopinath and Damodar Prabhus, as well as the
            Community Development Course offered by Sridham Prabhu and Kisori
            Mataji.
          </li>
          <li>
            <strong>Additional courses</strong>: Launched the Śrīla Prabhupāda Introductory Course in July, 2025.
          </li>
          <li>
            <strong>Śrīla Prabhupāda Connect Days</strong>: Events featuring
            senior devotees, cultural programs, and competitions, scheduled as
            follows:
            <ul className="list-disc list-inside ml-6">
              <li>February 20, 2025 – Gaura Purnima Festival (English)</li>
              <li>March 13, 2025 – Gaura Purnima Festival (Bengali)</li>
              <li>August 17, 2025 – Śrīla Prabhupāda’s Vyāsa-pūjā</li>
              <li>October 25, 2025 – Śrīla Prabhupāda’s Tirobhāva</li>
            </ul>
          </li>
          <li>
            <strong>
              Srila Prabhupada Connection - Mayapur website and social media
            </strong>
            : Promoting events and weekly podcasts featuring senior Vaiṣṇavas
            worldwide.
          </li>
          <li>
            <strong>Developing a replicable model</strong> for other communities
            to implement, assisting in strengthening Śrīla Prabhupāda’s
            teachings and mission.
          </li>
        </ul>
      </section>

      {/* Call to Action */}
      <section className="bg-bgApp2 mt-2 text-fontApp py-10 text-center rounded-2xl bg">
        <h2 className="text-3xl font-semibold">Join Us</h2>
        <p className="max-w-3xl mx-auto text-lg mt-4">
          Be part of the movement! Connect with us, attend courses, and help
          spread Śrīla Prabhupāda’s teachings.
        </p>
        <div className="flex justify-center">
          <Button
            onClick={() => setOpenModal(!openModal)}
            className="bg-primary2"
          >
            Get Involved
          </Button>
        </div>
        <DataInsertModal
          openModal={openModal}
          onCloseModal={() => setOpenModal(false)}
          title="Join-Us"
          fields={JoinUsFields}
        />
      </section>

      {/* Team */}
      <section className="bg-bgApp2 flex flex-col md:flex-row justify-center  mt-2 rounded-2xl text-fontApp">
        <div className="flex flex-col items-center p-2 md:w-1/4">
          <img
            src="https://ik.imagekit.io/opiwak7mf/Prabhupada_Network/AboutUs/HG_Ramanipati_Pr.webp?updatedAt=1743596499872"
            className="w-32 h-36 rounded-2xl"
          />
          <div className="flex flex-col items-center">
            <div className="font-extrabold text-center">Ramanipati Prabhu</div>
            <div className="font-extralight">COMPETITIONS</div>
            <div className="text-center">
              Competitions Cultural Events Facilitate Meetings Onsite Promotions
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center p-2 md:w-1/4">
          <img
            src="https://ik.imagekit.io/opiwak7mf/Prabhupada_Network/AboutUs/HG_Janmashtami_Pr.webp?updatedAt=1743596499774"
            className="w-32 h-36 rounded-2xl"
          />
          <div className="flex flex-col items-center">
            <div className="font-extrabold text-center">Janmastami Dasa</div>
            <div className="font-extralight">Team Servant</div>
            <div>Team Servant</div>
          </div>
        </div>
        <div className="flex flex-col items-center p-2 md:w-1/4">
          <img
            src="https://ik.imagekit.io/opiwak7mf/Prabhupada_Network/AboutUs/HG_Krishna_Vijay_Pr.webp?updatedAt=1743596500054"
            className="w-32 h-36 rounded-2xl"
          />
          <div className="flex flex-col items-center">
            <div className="font-extrabold text-center">
              Krishna Vijay Prabhu
            </div>
            <div className="font-extralight">Event Managment</div>
            <div>Event Managment</div>
          </div>
        </div>
      </section>
    </div>
  );
}
