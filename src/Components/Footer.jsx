import React from "react";
// import {
//   Flag,
//   Mail,
//   Phone,
//   MapPin,
//   Instagram,
//   Twitter,
//   Facebook,
//   Linkedin,
// } from "lucide-react";
import { Wrapper } from "../Styles/Footer";
import { FiFacebook, FiInstagram, FiLinkedin, FiTwitter } from "react-icons/fi";
import IMAGES from "../assets/images";
import { HiMapPin } from "react-icons/hi2";
import { HiMail, HiPhone } from "react-icons/hi";
import { getYear } from "date-fns";

const Footer = () => {
    const quickLinks = [
        { label: "About Us", id: "about" },
        { label: "Membership", id: "memberships" },
        // { label: "Testimonials", id: "testimonials" },
        // { label: "Ambassadors", id: "ambassadors" },
        // { label: "Pricing", id: "pricing" },
    ];

    return (
        <Wrapper>
            <footer className="bg-dark text-white py-5" style={{ backgroundColor: "var(--footer-bg)" }} >
                <div className="container">
                    <div className="row">
                        {/* Logo + Description */}
                        <div className="col-md-3 mb-4">
                            <div className="d-flex flex-column align-items-center mb-3">
                                <img src={IMAGES.logo} className="text-primary mb-3"  width={98} />
                                <span className="fw-bold fs-5">RockMade Golf</span>
                            </div>
                            <p className="text-white small text-center">
                                The premier golf membership for serious players.
                            </p>
                            <p className="text-center small mb-0">
                                © {getYear(new Date())} RockMade Golf. All rights reserved.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="col-md-3 mb-4">
                            <h5>Quick Links</h5>
                            <ul className="list-unstyled">
                                {quickLinks.map((l) => (
                                    <li key={l.id}>
                                        <a href={`${l.id}`} className="text-muted btn btn-link p-0 text-start footer-link" >
                                            {l.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="col-md-3 mb-4">
                            <h5>Contact</h5>
                            <ul className="list-unstyled text-white small">
                                <li className="d-flex align-items-center mb-2">
                                    <HiMail className="me-2" style={{ width: 16, height: 16 }} />
                                    membership@rockmadegolf.com
                                </li>
                                <li className="d-flex align-items-center mb-2">
                                    <HiPhone className="me-2" style={{ width: 16, height: 16 }} />
                                    1-800-ROCKMADE-GOLF
                                </li>
                                <li className="d-flex align-items-center">
                                    <HiMapPin className="me-2" style={{ width: 16, height: 16 }} />
                                    Augusta, GA 30901
                                </li>
                            </ul>
                        </div>

                        {/* Social Media */}
                        <div className="col-md-3">
                            <h5>Follow Us</h5>
                            <div className="d-flex gap-3">
                                <a href="#" className="text-light social-icon">
                                  <FiInstagram style={{ width: 24, height: 24 }} />
                                </a>
                                <a href="#" className="text-light social-icon">
                                    <FiTwitter style={{ width: 24, height: 24 }} />
                                </a>
                                <a href="#" className="text-light social-icon">
                                    <FiFacebook style={{ width: 24, height: 24 }} />
                                </a>
                                <a href="#" className="text-light social-icon">
                                    <FiLinkedin style={{ width: 24, height: 24 }} />
                                </a>
                            </div>
                        </div>
                    </div>

                    <hr className="my-4 border-secondary" />
                    <span className="d-flex gap-2 justify-content-center align-items-center">
                        <p className="text-center small mb-0 fw-bold">
                            Powered By 
                        </p>
                        <a href="https://www.gctechies.com" target={"_blank"}>
                            <img src={IMAGES.gct_logo} alt="" width={98}/>
                        </a>
                    </span>
                </div>
            </footer>
        </Wrapper>
    );
};

export default Footer;
