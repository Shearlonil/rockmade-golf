import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
    HiArrowRight,
    HiOutlineTrophy,
} from "react-icons/hi2";
import { RiDiscountPercentFill } from "react-icons/ri";
import CountUp from "react-countup";
import useEmblaCarousel from "embla-carousel-react";
import { useLocation, useNavigate } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import { toast } from "react-toastify";
import numeral from "numeral";
import {
    HiCheck,
    HiStar,
} from "react-icons/hi";

import useSubPlansController from "../api-controllers/sub-plans-controller";
import IMAGES from "../assets/images";
import handleErrMsg from "../Utils/error-handler";
import Skeleton from "react-loading-skeleton";
import { testimonials , features, ambassadors, galleryItems, stats} from "../Utils/data";

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
    const controllerRef = useRef(new AbortController());
    
    const navigate = useNavigate();
    const location = useLocation();

    const { membershipPlans } = useSubPlansController();

    const [countersVisible, setCountersVisible] = useState(false);
    const statsRef = useRef(null);

    const [subscriptionPlans, setSubscriptionPlans] = useState([]);
    const [networkRequest, setNetworkRequest] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && setCountersVisible(true),
            { threshold: 0.5 }
        );
        if (statsRef.current) observer.observe(statsRef.current);

        initialize();

        return () => {
            observer.disconnect();
            // This cleanup function runs when the component unmounts or when the dependencies of useEffect change (e.g., route change)
            controllerRef.current.abort();
        };
    }, [location.pathname]);

    const initialize = async () => {
        try {
            controllerRef.current = new AbortController();
            setNetworkRequest(true);
            const response = await membershipPlans(controllerRef.current.signal);

            //	check if the request to fetch pkg doesn't fail before setting values to display
            if(response && response.data){
                setSubscriptionPlans(response.data)
            }

            setNetworkRequest(false);
        } catch (error) {
            if (error.name === 'AbortError' || error.name === 'CanceledError') {
                // Request was intentionally aborted, handle silently
                return;
            }
            setNetworkRequest(false);
            toast.error(handleErrMsg(error).msg);
        }
    };

    const buildMembershipPlans = () => {
        return subscriptionPlans.map((p, i) => {
            let discount = numeral(p.discount).value();
            let amount = 0;
            if(discount > 0){
                const discVal = numeral(p.discount).divide(100).multiply(p.amount).value();
                amount = numeral(p.amount).subtract(discVal).value();
            }else {
                amount = p.amount
            }
            return <motion.div
                key={p.name}
                className="col-md-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
            >
                <div  className={`card h-100 shadow-sm p-2 ${ p.popular ? "border-primary border-3" : ""  }`} >
                    {p.popular && (
                        <div className="position-absolute top-0 start-50 translate-middle-x">
                            <span className="badge bg-primary">MOST POPULAR</span>
                        </div>
                    )}
                    <div className="card-body d-flex flex-column" style={{ paddingTop: p.popular ? "2.5rem" : "1.5rem" }} >
                        <h4 className="card-title text-capitalize text-center">
                            {p.name}
                        </h4>
                        <div className="text-center mb-4">
                            <span className="display-5 fw-bold">
                                ₦{amount}
                            </span>
                          <span className="text-success fw-bold"> /{p.duration_months} month{p.duration_months > 1 ? 's' : ''}</span>
                        </div>
                        <ul className="list-unstyled flex-grow-1 mb-2">
                            {p.SubPlanBenefits.map((f, idx) => (
                                <li key={idx}  className="d-flex align-items-start mb-2" >
                                    <HiCheck className="text-success me-2 mt-1" style={{ width: 18, height: 18 }} />
                                    <span>{f.desc}</span>
                                </li>
                            ))}
                        </ul>
                        { p.discount > 0 &&  <div className="mb-3 d-flex align-items-center">
                            <RiDiscountPercentFill color="red" size={40}/>
                            <span className="text-danger fw-bold fs-5"> {p.discount}% off </span>
                        </div> }
                        <a href="#contact" className={`btn w-100 ${p.popular ? "donate-btn text-white" : "custom-btn" }`} >
                            Get Started{" "}
                            <HiArrowRight className="ms-1" style={{ width: 16, height: 16 }} />
                        </a>
                    </div>
                </div>
            </motion.div>
        });
    };

    const buildMembershipSkeletons = () => {
        return new Array(3).fill(1).map((val, idx) => (
            <div className="col-md-4" key={idx}>
                <div  className={`card h-100 shadow-sm p-2`} >
                    <Skeleton />
                    <div className="card-body d-flex flex-column" >
                        <h4 className="card-title text-capitalize text-center">
                            <Skeleton />
                        </h4>
                        <div className="text-center mb-4">
                            <span className="display-5 fw-bold">
                                <Skeleton />
                            </span>
                        </div>
                        <ul className="list-unstyled flex-grow-1 mb-4">
                            <Skeleton count={10} key={Math.random()} />
                        </ul>
                        <a href="#contact" className={`btn w-100`} >
                            <Skeleton />
                        </a>
                    </div>
                </div>
            </div>
        ));
    };

    const resetAbortController = () => {
        // Cancel previous request if it exists
        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();
    };

    return (
        <>
            <section className="position-relative text-center text-white d-flex align-items-center justify-content-center min-vh-100" style={{ paddingTop: "80px" }} >
                <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-75"></div>
                <div className="position-absolute top-0 start-0 w-100 h-100"
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
                          <a href="#pricing" className="btn donate-btn btn-lg me-3 text-white"  >
                              Join Now{" "}
                              <HiArrowRight className="ms-1" style={{ width: 20, height: 20 }} />
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
                          <motion.div key={item.id} className="col-md-6 col-lg-4" whileHover={{ scale: 1.05 }} >
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
                                  <div className="caption position-absolute bottom-0 start-0 end-0 text-white p-4"
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
                                                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: 40, height: 40 }} >
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
                                                    <HiStar key={s} className="text-warning" style={{ width: 16, height: 16 }} fill="currentColor" />
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
                                      <HiOutlineTrophy style={{ width: 64, height: 64 }} />
                                  </div>
                                  <div className="card-body pt-0" style={{ marginTop: "-30px" }} >
                                      <h5 className="card-title">{a.name}</h5>
                                      <p className="text-muted">{a.role}</p>
                                      <p className="small text-muted mb-1">{a.achievement}</p>
                                      <p className="fw-bold" style={{ color: "var(--primary-color)" }} >
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
          <section ref={statsRef} className="py-5 text-white" style={{ background: "var(--primary-color)" }}  >
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
                  </div>
                  <div className="row g-4">
                      {!networkRequest && buildMembershipPlans()}
                      {networkRequest && buildMembershipSkeletons()}
                  </div>
              </div>
          </section>

          {/* FINAL CTA */}
          <section className="py-5 text-white text-center" style={{ background: "var(--bg-gradient)" }} >
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
                          <a href="#pricing" className="btn donate-btn btn-lg my-1 me-3 text-white" >
                              Start Your Journey <HiArrowRight className="ms-1" />
                          </a>
                          <a href="#contact" className="btn custom-btn btn-lg my-1">
                              Schedule a Call
                          </a>
                      </div>
                  </motion.div>
            </div>
          </section>
        </>
    );
}
