"use client";

import axios from "axios";
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { setAuth } from "@/features/authSlice";
import { useDispatch } from "react-redux";

const LoginModal = ({
  openModal,
  onCloseModal,
}: {
  openModal: boolean;
  onCloseModal: () => void;
}) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/login`,

        {
          name: name,
          password: password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("token", response.data.accessToken);
      onCloseModal();
      dispatch(setAuth({ isAuthenticated: true }));
    } catch (err: any) {
      console.error(
        "Login failed:",
        err.response?.data?.message || err.message
      );
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal show={openModal} size="md" onClose={onCloseModal} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-4">
          <h3 className="text-xl font-medium text-fontApp dark:text-white">
            Sign in to our platform
          </h3>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="text-fontApp">
            <div className="mb-2 block">
              <Label
                htmlFor="name"
                value="Your name"
                className="text-fontApp"
              />
            </div>
            <TextInput
              id="name"
              aria-label="Enter your name"
              placeholder="name@company.com"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                htmlFor="password"
                value="Your password"
                className="text-fontApp"
              />
            </div>
            <TextInput
              id="password"
              aria-label="Enter your password"
              type="password"
              placeholder="password123"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {/* <div className="flex justify-between">
            <a
              href="#"
              className="text-sm text-cyan-700 hover:underline dark:text-cyan-500"
            >
              Lost Password?
            </a>
          </div> */}
          <div className="flex justify-end w-full">
            <Button
              onClick={handleLogin}
              className="bg-primary2 hover:text-fontApp"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in to your account"}
            </Button>
          </div>
          {/* <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
            Not registered?&nbsp;
            <a
              href="#"
              className="text-cyan-700 hover:underline dark:text-cyan-500"
            >
              Create account
            </a>
          </div> */}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
