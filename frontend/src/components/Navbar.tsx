"use client";

import { navOptions } from "@/app/data";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setAuth, setWindowSize } from "@/features/authSlice";
import { AppDispatch } from "@/lib/store";
import LoginModal from "./LoginModal";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, windowSize } = useSelector(
    (state: {
      auth: { isAuthenticated: boolean; user: any; windowSize: number };
    }) => state.auth
  );
  const [openModal, setOpenModal] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const onCloseModal = () => {
    setOpenModal(false);
  };

  let pathname = usePathname() || "/";
  if (pathname.includes("/blogs/")) pathname = "/blogs";
  if (pathname.includes("/courses/")) pathname = "/courses";
  if (pathname.includes("/events/")) pathname = "/events";
  const [hoveredPath, setHoveredPath] = useState(pathname);

  useEffect(() => {
    const handleResize = () => dispatch(setWindowSize(window.innerWidth));
    dispatch(setAuth({isAuthenticated: localStorage.getItem("token") !== null}));
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  const toggleNavBar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="w-full flex gap-4 top-5 z-[100]">
      {/* Main Nav */}
      <div className="relative flex flex-col bg-white backdrop-blur-md w-full shadow-md rounded-2xl">
        <div className="flex justify-between pr-2 items-center">
          <Logo />
          {windowSize < 1000 ? (
            <MobileMenuToggle isOpen={isOpen} toggleNavBar={toggleNavBar} />
          ) : (
            <NavOptions
              hoveredPath={hoveredPath}
              setHoveredPath={setHoveredPath}
              pathname={pathname}
            />
          )}
        </div>
        {windowSize < 1000 && (
          <MobileMenuDropdown
            isOpen={isOpen}
            hoveredPath={hoveredPath}
            setHoveredPath={setHoveredPath}
            pathname={pathname}
          />
        )}
      </div>
      {isAuthenticated ? (
        <button
          onClick={() => dispatch(logoutUser())}
          className="bg-primary2 w-24 h-14 flex items-center justify-center rounded-2xl shadow-md font-bold font-Roboto text-white mt-2 hover:text-fontApp2"
        >
          Logout
        </button>
      ) : (
        <LoginButton
          openModal={openModal}
          onCloseModal={onCloseModal}
          setOpenModal={setOpenModal}
        />
      )}
    </nav>
  );
};

export default Navbar;

const Logo = () => {
  const { windowSize } = useSelector(
    (state: {
      auth: { isAuthenticated: boolean; user: any; windowSize: number };
    }) => state.auth
  );
  return (
    <div className="flex gap-2 items-center">
      <Image
        src="/PN_Logo.jpg"
        alt="Prabhupada Network Logo"
        width={70}
        height={70}
        className="rounded-full"
      />
      {windowSize >= 1000 && (
        <div className="flex flex-col font-bold font-Roboto">
          <span>Prabhupada</span>
          <span>Network</span>
        </div>
      )}
    </div>
  );
};

const MobileMenuDropdown = ({
  isOpen,
  hoveredPath,
  setHoveredPath,
  pathname,
}: {
  isOpen: boolean;
  hoveredPath: string;
  setHoveredPath: React.Dispatch<React.SetStateAction<string>>;
  pathname: string;
}) => (
  <div
    className={`transition-all duration-500 overflow-hidden ${
      isOpen ? "max-h-[300px] mt-2 opacity-100" : "max-h-0 opacity-0"
    }`}
  >
    <NavOptions
      hoveredPath={hoveredPath}
      setHoveredPath={setHoveredPath}
      pathname={pathname}
    />
  </div>
);

const NavOptions = ({
  hoveredPath,
  setHoveredPath,
  pathname,
}: {
  hoveredPath: string;
  setHoveredPath: React.Dispatch<React.SetStateAction<string>>;
  pathname: string;
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-center text-lg">
      {navOptions.map((option, index) => {
        const isActive = option.path === pathname;
        return (
          <Link
            key={option.path}
            href={option.path}
            className={`flex justify-center p-2 rounded-md font-semibold text-sm lg:text-base relative no-underline duration-300 ease-in hover:text-white`}
            data-active={isActive}
            onMouseOver={() => setHoveredPath(option.path)}
            onMouseLeave={() => setHoveredPath(pathname)}
          >
            <span>{option.name}</span>
            {option.path === hoveredPath && (
              <motion.div
                className="absolute top-0 left-0 h-full bg-primary2 rounded-md -z-10"
                layoutId="navbar"
                aria-hidden="true"
                style={{
                  width: "100%",
                }}
                transition={{
                  type: "spring",
                  bounce: 0.25,
                  stiffness: 130,
                  damping: 20,
                  duration: 0.3,
                }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
};

const LoginButton = ({
  openModal,
  setOpenModal,
  onCloseModal,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  onCloseModal: () => void;
}) => {
  return (
    <>
      <button
        onClick={() => setOpenModal(true)}
        className="bg-primary2 w-24 h-14 flex items-center justify-center rounded-2xl shadow-md font-bold font-Roboto text-white mt-2 hover:text-fontApp2"
      >
        Login
      </button>
      <LoginModal openModal={openModal} onCloseModal={onCloseModal} />
    </>
  );
};
const MobileMenuToggle = ({
  isOpen,
  toggleNavBar,
}: {
  isOpen: boolean;
  toggleNavBar: () => void;
}) => (
  <div className="cursor-pointer" onClick={toggleNavBar}>
    <Image
      src={isOpen ? "/close.png" : "/Hamburger_Menu.png"}
      alt="Menu Icon"
      width={30}
      height={30}
    />
  </div>
);
