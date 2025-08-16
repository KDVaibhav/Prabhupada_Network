import React from "react";

const Footer = () => {
  return (
    <div className="flex justify-center bg-bgApp mt-2 rounded-2xl">
      Copyright 2025 © All rights Reserved.{' '}
      <p>
        {' '} Made by{' '}
        <a
          href="https://www.linkedin.com/in/vaibhav-agrawal-9a77681b8/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-slate-500 underline"
        >
          Vaibhav Agrawal
        </a>
      </p>
    </div>
  );
};

export default Footer;
