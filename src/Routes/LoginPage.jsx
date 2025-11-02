"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, Flag, Mail, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import IMAGES from "../assets/images";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    // Simulate login (replace with API call)
    console.log("Logging in:", { email });
    setError("");
    navigate("/dashboard"); // Redirect after login
  };

  return (
    <section
      className="position-relative min-vh-100 d-flex align-items-center justify-content-center"
      style={{ paddingTop: "80px" }}
    >
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundImage: `url(${
            IMAGES.image1 ||
            "https://images.unsplash.com/photo-1587174484923-2d0ace49f1a9?q=80&w=2070"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.6)",
        }}
      ></div>
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>

      <div className="position-relative container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="row justify-content-center"
        >
          <div className="col-12 col-md-6 col-lg-5">
            <div
              className="card border-0 shadow-lg"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <Flag className="text-primary mb-3" size={48} />
                  <h2 className="fw-bold mb-1">Welcome Back</h2>
                  <p className="text-muted">
                    Sign in to your GolfMate Pro account
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="form-label fw-bold">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <Mail size={18} />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <Lock size={18} />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="remember"
                      />
                      <label
                        className="form-check-label small"
                        htmlFor="remember"
                      >
                        Remember me
                      </label>
                    </div>
                    <a
                      href="#forgot"
                      className="text-primary text-decoration-none small"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  <button type="submit" className="btn custom-btn w-100 mb-3">
                    Sign In
                  </button>

                  <div className="text-center">
                    <p className="mb-0 text-muted small">
                      Don't have an account?{" "}
                      <a href="/signup" className="text-primary fw-bold">
                        Sign Up
                      </a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LoginPage;
