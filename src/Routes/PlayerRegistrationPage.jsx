import { useState } from "react";
import { motion } from "framer-motion";
import {
  RiUserLine,
  RiMailLine,
  RiCalendarLine,
  RiBuildingLine,
  RiGolfBallLine,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import IMAGES from "../assets/images";

const PlayerRegistrationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    dob: "",
    gender: "",
    handicapIndex: "",
    country: "",
    homeClub: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.username ||
      !formData.email ||
      !formData.dob ||
      !formData.gender ||
      !formData.handicapIndex ||
      !formData.country ||
      !formData.homeClub
    ) {
      setError("Please fill in all fields.");
      return;
    }
    // Basic DOB check (18+)
    const age = new Date().getFullYear() - new Date(formData.dob).getFullYear();
    if (age < 18) {
      setError("You must be at least 18 years old.");
      return;
    }
    // Email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email.");
      return;
    }
    // Simulate submit (replace with API)
    console.log("Registering player:", formData);
    setError("");
    navigate("/dashboard"); // Redirect to dashboard or success
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
          <div className="col-12 col-md-8 col-lg-6">
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
                  />
                  <h2 className="fw-bold mb-1">
                    Join the Fairway <span className="word-span">Family</span>
                  </h2>
                  <p className="text-muted">
                    Complete your player profile to start competing
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger mb-4" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">First Name</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <RiUserLine size={18} />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="John"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Last Name</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <RiUserLine size={18} />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Doe"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Username</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <RiUserLine size={18} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="@johndoe"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Email</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <RiMailLine size={18} />
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="john@example.com"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        Date of Birth
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <RiCalendarLine size={18} />
                        </span>
                        <input
                          type="date"
                          className="form-control"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Gender</label>
                      <select
                        className="form-select"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        Handicap Index
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <RiGolfBallLine size={18} />
                        </span>
                        <input
                          type="number"
                          className="form-control"
                          placeholder="e.g., 12.5"
                          name="handicapIndex"
                          value={formData.handicapIndex}
                          onChange={handleChange}
                          required
                          step="0.1"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Country</label>
                      <select
                        className="form-select"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold">Home Club</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <RiBuildingLine size={18} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Augusta National"
                        name="homeClub"
                        value={formData.homeClub}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn custom-btn w-100 mb-3">
                    Register Player
                  </button>

                  <div className="text-center">
                    <p className="mb-0 text-muted small">
                      Already registered?{" "}
                      <a href="/login" className="fw-bold text-primary">
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

export default PlayerRegistrationPage;
