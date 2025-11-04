"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { HiArrowRight, HiBolt } from "react-icons/hi2";
import CountUp from "react-countup";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import IMAGES from "../assets/images";
import { BiBullseye } from "react-icons/bi";
import { HiShieldCheck, HiUsers } from "react-icons/hi";

const Carousel = ({ children }) => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000 }),
  ]);
  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="d-flex">{children}</div>
    </div>
  );
};

const CarouselItem = ({ children }) => (
  <div className="flex-shrink-0" style={{ width: "100%", padding: "0 0.5rem" }}>
    {children}
  </div>
);

export default function MembershipPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [countersVisible, setCountersVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setCountersVisible(true),
      { threshold: 0.5 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      Icon: Trophy,
      title: "Exclusive Tournaments",
      desc: "Compete in members-only events with prestigious prizes.",
    },
    {
      Icon: Clock,
      title: "Priority Tee Times",
      desc: "Book up to 14 days in advance at premium courses.",
    },
    {
      Icon: BiBullseye,
      title: "Pro Coaching",
      desc: "Personalized training with PGA-certified instructors.",
    },
    {
      Icon: HiUsers,
      title: "Elite Network",
      desc: "Connect with influential golfers and business leaders.",
    },
    {
      Icon: HiShieldCheck,
      title: "Premium Insurance",
      desc: "Full coverage for equipment, travel, and tournaments.",
    },
    {
      Icon: HiBolt,
      title: "VIP Experiences",
      desc: "Pro-am events, player meet-ups, behind-the-scenes tours.",
    },
  ];

  const testimonials = [
    {
      name: "Michael Chen",
      tier: "Gold",
      avatar: "MC",
      content: "RockMade Golf transformed my game and my network.",
    },
    {
      name: "Sarah Williams",
      tier: "Silver",
      avatar: "SW",
      content: "The exclusive tournaments are incredible.",
    },
    {
      name: "David Rodriguez",
      tier: "Gold",
      avatar: "DR",
      content: "Best investment in my golf journey.",
    },
    {
      name: "Emma Thompson",
      tier: "Bronze",
      avatar: "ET",
      content: "Even as a Bronze member I get amazing courses.",
    },
    {
      name: "James Patterson",
      tier: "Gold",
      avatar: "JP",
      content: "Improved my handicap by 4 strokes.",
    },
  ];

  const ambassadors = [
    {
      name: "Alex Morgan",
      role: "PGA Tour Professional",
      achievement: "2023 Masters Top 10",
      handicap: "+4.2",
    },
    {
      name: "Jessica Lee",
      role: "LPGA Rising Star",
      achievement: "2024 Rookie of the Year",
      handicap: "+3.8",
    },
    {
      name: "Robert Hayes",
      role: "Club Champion",
      achievement: "15x Regional Winner",
      handicap: "0.2",
    },
  ];

  const pricing = {
    bronze: {
      monthly: 79,
      yearly: 79 * 12 * 0.85,
      features: [
        "50+ premium courses",
        "7-day advance tee times",
        "Monthly group coaching",
        "Member events",
        "Basic insurance",
      ],
    },
    silver: {
      monthly: 149,
      yearly: 149 * 12 * 0.83,
      popular: true,
      features: [
        "150+ premium courses",
        "14-day advance tee times",
        "Weekly pro coaching",
        "Priority tournament entry",
        "Premium insurance",
        "VIP event access",
      ],
    },
    gold: {
      monthly: 299,
      yearly: 299 * 12 * 0.8,
      features: [
        "Unlimited worldwide access",
        "30-day advance tee times",
        "Unlimited 1-on-1 coaching",
        "Guaranteed tournament spots",
        "Complete insurance",
        "All VIP experiences",
        "Concierge",
        "Pro shop discounts",
      ],
    },
  };

  const galleryItems = [
    {
      id: 1,
      src: IMAGES.image1,
      title: "Championship Tournament",
      caption: "Annual Masters Qualifier",
    },
    {
      id: 2,
      src: IMAGES.image2,
      title: "Pro-Am Event",
      caption: "Playing with PGA Pros",
    },
    {
      id: 3,
      src: IMAGES.image3,
      title: "Sunrise Session",
      caption: "Early Morning at Pebble Beach",
    },
    {
      id: 4,
      src: IMAGES.image4,
      title: "Member Networking",
      caption: "Business on the Fairway",
    },
    {
      id: 5,
      src: IMAGES.image5,
      title: "Coaching Clinic",
      caption: "Swing Analysis Session",
    },
    {
      id: 6,
      src: IMAGES.image6,
      title: "Victory Celebration",
      caption: "Gold Member Awards",
    },
  ];

  const stats = [
    { num: 1200, label: "Active Members", suffix: "+" },
    { num: 45, label: "Annual Tournaments", suffix: "" },
    { num: 150, label: "Partner Courses", suffix: "+" },
    { num: 98, label: "Member Satisfaction", suffix: "%" },
  ];

  return (
    <>
      <section
        className="position-relative text-center text-white d-flex align-items-center justify-content-center min-vh-100"
        style={{ paddingTop: "80px" }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-75"></div>
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: `url(${
              IMAGES.image1 ||
              "https://images.unsplash.com/photo-1587174484923-2d0ace49f1a9?q=80&w=2070"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.5)",
          }}
        ></div>
        <div className="position-relative container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="display-3 fw-bold mb-4">
              Elevate Your <span className="word-span">Golf Game</span>
            </h1>
            <p className="lead mb-5 col-lg-8 mx-auto">
              Join an exclusive community of passionate golfers and unlock
              premium courses, pro coaching, and unforgettable experiences.
            </p>
            <div>
              <a
                href="#pricing"
                className="btn donate-btn btn-lg me-3 text-white"
              >
                Join Now{" "}
                <HiArrowRight
                  className="ms-1"
                  style={{ width: 20, height: 20 }}
                />
              </a>
              <a href="#features" className="btn custom-btn btn-lg">
                View Plans
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Premium Membership Benefits</h2>
            <p className="lead text-muted">
              Everything you need to take your golf game to the next level
            </p>
          </div>
          <div className="row g-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="col-md-6 col-lg-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="bg-primary bg-opacity-10 rounded p-3 d-inline-flex mb-3">
                      <f.Icon
                        style={{
                          width: 24,
                          height: 24,
                          color: "var(--primary-color)",
                        }}
                      />
                    </div>
                    <h5 className="card-title">{f.title}</h5>
                    <p className="card-text text-muted">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Member Lifestyle</h2>
            <p className="lead text-muted">
              Experience the RockMade Golf difference through our members' eyes
            </p>
          </div>
          <div className="row g-4">
            {galleryItems.map((item) => (
              <motion.div
                key={item.id}
                className="col-md-6 col-lg-4"
                whileHover={{ scale: 1.05 }}
              >
                <div className="gallery-item position-relative overflow-hidden rounded shadow-sm h-100">
                  <img
                    src={item.src}
                    className="img-fluid w-100 h-100"
                    alt={item.title}
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                    }}
                  />
                  <div
                    className="caption position-absolute bottom-0 start-0 end-0 text-white p-4"
                    style={{
                      background:
                        "linear-gradient(transparent, rgba(0,0,0,0.8))",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    <h5 className="mb-1">{item.title}</h5>
                    <p className="mb-0 small">{item.caption}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">What Our Members Say</h2>
            <p className="lead text-muted">
              Join thousands of satisfied golfers
            </p>
          </div>
          <Carousel>
            {testimonials.map((t, i) => (
              <CarouselItem key={i}>
                <motion.div whileHover={{ y: -5 }}>
                  <div className="card mx-2 h-100 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-3">
                        <div className="d-flex align-items-center">
                          <div
                            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{ width: 40, height: 40 }}
                          >
                            {t.avatar}
                          </div>
                          <div>
                            <h6 className="mb-0">{t.name}</h6>
                            <span className="badge bg-secondary">
                              {t.tier} Member
                            </span>
                          </div>
                        </div>
                        <div>
                          {[...Array(5)].map((_, s) => (
                            <Star
                              key={s}
                              className="text-warning"
                              style={{ width: 16, height: 16 }}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted fst-italic">"{t.content}"</p>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </Carousel>
        </div>
      </section>

      {/* AMBASSADORS */}
      <section id="ambassadors" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Meet Our Ambassadors</h2>
            <p className="lead text-muted">Learn from the best in the game</p>
          </div>
          <div className="row g-4">
            {ambassadors.map((a, i) => (
              <motion.div
                key={i}
                className="col-md-4"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="card text-center h-100 shadow-sm">
                  <div className="bg-primary bg-gradient text-white p-5">
                    <Trophy style={{ width: 64, height: 64 }} />
                  </div>
                  <div
                    className="card-body pt-0"
                    style={{ marginTop: "-40px" }}
                  >
                    <h5 className="card-title">{a.name}</h5>
                    <p className="text-muted">{a.role}</p>
                    <p className="small text-muted mb-1">{a.achievement}</p>
                    <p
                      className="fw-bold"
                      style={{ color: "var(--primary-color)" }}
                    >
                      Handicap: {a.handicap}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section
        ref={statsRef}
        className="py-5 text-white"
        style={{ background: "var(--primary-color)" }}
      >
        <div className="container">
          <div className="row text-center">
            {stats.map((s, i) => (
              <div key={i} className="col-6 col-md-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={countersVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1 }}
                >
                  <h2 className="display-4 fw-bold">
                    {countersVisible && (
                      <CountUp end={s.num} duration={2.5} suffix={s.suffix} />
                    )}
                  </h2>
                  <p className="lead">{s.label}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">Choose Your Membership</h2>
            <p className="lead text-muted mb-4">
              Select the perfect plan for your golf journey
            </p>
            <div className="d-flex justify-content-center align-items-center gap-3">
              <span
                className={!isYearly ? "text-primary fw-bold" : "text-muted"}
              >
                Monthly
              </span>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={isYearly}
                  onChange={(e) => setIsYearly(e.target.checked)}
                  style={{ width: "3rem", height: "1.5rem" }}
                />
                <label className="form-check-label">
                  <span className="badge bg-secondary">Save up to 20%</span>
                </label>
              </div>
              <span
                className={isYearly ? "text-primary fw-bold" : "text-muted"}
              >
                Yearly
              </span>
            </div>
          </div>
          <div className="row g-4">
            {Object.entries(pricing).map(([tier, p], i) => {
              const monthlyPrice = isYearly
                ? Math.round(p.yearly / 12)
                : p.monthly;
              return (
                <motion.div
                  key={tier}
                  className="col-md-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div
                    className={`card h-100 shadow-sm ${
                      p.popular ? "border-primary border-3" : ""
                    }`}
                  >
                    {p.popular && (
                      <div className="position-absolute top-0 start-50 translate-middle-x">
                        <span className="badge bg-primary">MOST POPULAR</span>
                      </div>
                    )}
                    <div
                      className="card-body d-flex flex-column"
                      style={{ paddingTop: p.popular ? "2.5rem" : "1.5rem" }}
                    >
                      <h4 className="card-title text-capitalize text-center">
                        {tier}
                      </h4>
                      <div className="text-center mb-4">
                        <span className="display-5 fw-bold">
                          ${monthlyPrice}
                        </span>
                        <span className="text-muted"> /month</span>
                        {isYearly && (
                          <p className="small text-muted mb-0">
                            billed annually (${Math.round(p.yearly)})
                          </p>
                        )}
                      </div>
                      <ul className="list-unstyled flex-grow-1 mb-4">
                        {p.features.map((f, idx) => (
                          <li
                            key={idx}
                            className="d-flex align-items-start mb-2"
                          >
                            <Check
                              className="text-success me-2 mt-1"
                              style={{ width: 18, height: 18 }}
                            />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <a
                        href="#contact"
                        className={`btn w-100 ${
                          p.popular ? "donate-btn text-white" : "custom-btn"
                        }`}
                      >
                        Get Started{" "}
                        <ArrowRight
                          className="ms-1"
                          style={{ width: 16, height: 16 }}
                        />
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="py-5 text-white text-center"
        style={{ background: "var(--bg-gradient)" }}
      >
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="display-4 fw-bold mb-4">
              Ready to Elevate Your Game?
            </h2>
            <p className="lead mb-5">
              Join RockMade Golf today and start playing like a champion
              tomorrow.
            </p>
            <div>
              <a
                href="#pricing"
                className="btn donate-btn btn-lg me-3 text-white"
              >
                Start Your Journey <ArrowRight className="ms-1" />
              </a>
              <a href="#contact" className="btn custom-btn btn-lg">
                Schedule a Call
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
