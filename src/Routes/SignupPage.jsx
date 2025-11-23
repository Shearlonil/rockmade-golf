import { useState } from "react";
import { motion } from "framer-motion";
import {
    RiUserLine,
    RiMailLine,
    RiLockLine,
    RiEyeLine,
    RiPhoneLine,
    RiEyeOffLine,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import IMAGES from "../assets/images";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }
    // Simulate sign-up (replace with API call)
    console.log("Signing up:", formData);
    setError("");
    navigate("/login");
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
                  <img
                    src={IMAGES.logo}
                    className="text-primary mb-3"
                    width={98}
                  />{" "}
                  <h2 className="fw-bold mb-1">Join the Club</h2>
                  <p className="text-muted">
                    Create your RockMade Golf account
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label fw-bold">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <RiUserLine size={18} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your full name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <RiMailLine size={18} />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <RiPhoneLine size={18} />
                      </span>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Enter your phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <RiLockLine size={18} />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Create a password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <RiEyeOffLine size={18} />
                        ) : (
                          <RiEyeLine size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold">
                      Confirm Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <RiLockLine size={18} />
                      </span>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control"
                        placeholder="Confirm your password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <RiEyeOffLine size={18} />
                        ) : (
                          <RiEyeLine size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn custom-btn w-100 mb-3">
                    Create Account
                  </button>

                  <div className="text-center">
                    <p className="mb-0 text-muted small">
                      Already have an account?{" "}
                      <a href="/login" className="text-primary fw-bold">
                        Sign In
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

export default SignUpPage;
