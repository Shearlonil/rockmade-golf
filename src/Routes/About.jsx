import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import HeroComp from "../Components/HeroComp";
import IMAGES from "../assets/images";
import { BiCheckCircle } from "react-icons/bi";
import { GiCheckMark } from "react-icons/gi";
import { IoGolf } from "react-icons/io5";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div>
      <HeroComp $heroImage={IMAGES.image1} height={"30vh"}>
        <div>
          <h3 className="display-5 fw-bold">
            About <span className="word-span">Us</span>
          </h3>
        </div>
      </HeroComp>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="my-5"
      >
        <Container>
          <h2 className="text-center mb-4 display-5 fw-bold">
            <span className="word-span">RockMade</span> Golf
          </h2>
          <p className="text-center mx-auto w-75 fs-5">
            RockMadeGolf was created out of a passion for the game and a desire
            to make it more engaging. Traditional scorekeeping and golf
            communities are often fragmented. Our platform brings golfers
            together, offering fun modes of play, social connections, and
            competitive tournaments.
          </p>
          <div className="d-flex flex-column align-items-center justify-content-center mt-5">
            <h3 className="fw-bold display-5 mb-4">Why Join Us</h3>
            <div className="fs-5 col-lg-8">
              <p>
                <GiCheckMark color="var(--secondary-color)" /> Lorem ipsum dolor
                sit amet consectetur adipisicing elit.
              </p>
              <p>
                <GiCheckMark color="var(--secondary-color)" /> Error aliquam
                delectus pariatur quam deserunt facere sed.
              </p>
              <p>
                <GiCheckMark color="var(--secondary-color)" /> Lorem ipsum dolor
                sit amet consectetur adipisicing elit.
              </p>
              <p>
                <GiCheckMark color="var(--secondary-color)" /> Lorem ipsum dolor
                sit amet consectetur adipisicing elit.
              </p>
              <p>
                <GiCheckMark color="var(--secondary-color)" /> Error aliquam
                delectus pariatur quam deserunt facere sed.
              </p>
              <p>
                <GiCheckMark color="var(--secondary-color)" /> Error aliquam
                delectus pariatur quam deserunt facere sed.
              </p>
              <p>
                <GiCheckMark color="var(--secondary-color)" /> Lorem ipsum dolor
                sit amet consectetur adipisicing elit.
              </p>
              <p>
                <GiCheckMark color="var(--secondary-color)" /> Error aliquam
                delectus pariatur quam deserunt facere sed.
              </p>
              <p>
                <GiCheckMark color="var(--secondary-color)" /> Lorem ipsum dolor
                sit amet consectetur adipisicing elit.
              </p>
            </div>
          </div>
        </Container>
      </motion.section>

      {/* Features Highlight */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="my-5"
      >
        <Container>
          <h2 className="text-center mb-4 display-5 fw-bold">
            Our Match Modes
          </h2>
          <Row className="mt-4">
            <Col md={4} className="mb-4">
              <div className="p-4 card shadow border-0 rounded-3 h-100">
                <h3 className="fw-bold mb-3">
                  <IoGolf
                    className="me-2"
                    color="var(--primary-color)"
                    size={32}
                  />{" "}
                  Member Games
                </h3>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius
                  vero expedita?
                </p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="p-4 card shadow border-0 rounded-3 h-100">
                <h3 className="fw-bold mb-3">
                  <GiCheckMark
                    className="me-2"
                    color="var(--secondary-color)"
                    size={32}
                  />{" "}
                  Tournament Games
                </h3>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius
                  vero expedita?
                </p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="p-4 card shadow border-0 rounded-3 h-100">
                <h3 className="fw-bold mb-3">
                  <img
                    src={IMAGES.versus_icon}
                    className="me-2"
                    style={{ width: "32px", height: "32px" }}
                    alt="Versus Icon"
                  />{" "}
                  Versus Games
                </h3>
                <p>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius
                  vero expedita?
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </motion.section>

      {/* Mission & Vision */}
      <motion.section
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="my-3"
      >
        <Container className="fs-5">
          <Row>
            <Col md={6} className="text-center">
              <div className="h-100 d-flex flex-column justify-content-center align-items-center p-4">
                <h3
                  className="display-6 fw-bold"
                  style={{ color: "var(--primary-color)" }}
                >
                  Our Mission
                </h3>
                <p>
                  To make golf accessible, engaging, and competitive for every
                  player, from casual beginners to seasoned professionals.
                </p>
              </div>
            </Col>
            <Col className="px-0" md={"6"}>
              <img src={IMAGES.image1} className="img-fluid" alt="" />
            </Col>
          </Row>
        </Container>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="my-3 mb-5"
      >
        <Container className="px-0">
          <Row>
            <Col md={6}>
              <img
                src={IMAGES.image3}
                className="img-fluid"
                alt="Vision"
                style={{ objectFit: "cover" }}
              />
            </Col>
            <Col md={6} className="text-center">
              <div className="h-100 d-flex flex-column justify-content-center align-items-center p-4 rounded-3">
                <h3 className="display-6 fw-bold mb-3">Our Vision</h3>
                <p>
                  We envision a global golfing community where every game,
                  tournament, and rivalry is connected through RockMadeGolf.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="about-section section-padding"
        id="section_2"
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-12 mb-4 mb-lg-0 d-flex align-items-center">
              <div className="services-info">
                <h2 className="fw-bold mb-4 text-white">About RockMade Golf</h2>
                <p className="text-white">
                  RockMade Golf is a modern golf community platform that
                  connects players of all levels to enjoy, compete, and track
                  their progress.
                </p>
                <h6 className="fw-bold mt-4 text-white">Golf for Everyone</h6>
                <p className="text-white">
                  Whether you're a beginner learning your first swing or a pro
                  chasing tournaments, RockMade Golf creates the perfect
                  experience for you.
                </p>
              </div>
            </div>

            <div className="col-lg-6 col-12">
              <div className="about-text-wrap">
                <img
                  src={IMAGES.image1}
                  alt="golf course"
                  className="about-image img-fluid"
                />
                <div className="about-text-info d-flex">
                  <div className="d-flex">
                    <i className="about-text-icon bi-person"></i>
                  </div>
                  <div className="ms-4">
                    <h5 className="fw-bold">Play Together</h5>
                    <p className="mb-0">
                      Join games, challenge friends, and enjoy golf like never
                      before.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Core Values */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="my-5"
      >
        <Container>
          <div className="text-center mb-4">
            <h2 className="display-5 fw-bold">Our Core Values</h2>
          </div>
          <Row className="mt-4 d-flex justify-content-center">
            {[
              { name: "Sportsmanship", icon: IMAGES.svg_playing_golf },
              { name: "Innovation", icon: IMAGES.svg_idea },
              {
                name: "Community",
                icon: IMAGES.svg_online_community_SECONDARY,
              },
              { name: "Fair Play", icon: IMAGES.svg_golf },
              { name: "Passion", icon: IMAGES.svg_team_SECONDARY },
            ].map(({ name, icon }, idx) => (
              <Col key={idx} md={2} sm={6} className="mb-3">
                <Card className="p-3 shadow-sm rounded-3 d-flex flex-column align-items-center h-100">
                  <img
                    src={icon}
                    width="55px"
                    height="55px"
                    alt={name}
                    className="mb-3"
                  />
                  <h5 className="fw-bold">{name}</h5>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </motion.section>

      {/* Team Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="my-5"
      >
        <Container>
          <div className="text-center mb-4">
            <h2 className="display-5 fw-bold">Meet the Team</h2>
            <p className="lead">
              RockMadeGolf is built with passion by golf enthusiasts and
              developers who believe in making the game more exciting.
            </p>
          </div>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="p-3 shadow border-0 rounded-3 text-center">
                <img
                  src={IMAGES.player4}
                  alt="Team Member"
                  className="rounded-circle mx-auto mb-3"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <h5 className="fw-bold">Joshua Odunbaku</h5>
                <p className="text-muted">Founder & Developer</p>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="p-3 shadow border-0 rounded-3 text-center">
                <img
                  src={IMAGES.player4}
                  alt="Team Member"
                  className="rounded-circle mx-auto mb-3"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <h5 className="fw-bold">Joshua Odunbaku</h5>
                <p className="text-muted">Founder & Developer</p>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="p-3 shadow border-0 rounded-3 text-center">
                <img
                  src={IMAGES.player4}
                  alt="Team Member"
                  className="rounded-circle mx-auto mb-3"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <h5 className="fw-bold">Joshua Odunbaku</h5>
                <p className="text-muted">Founder & Developer</p>
              </Card>
            </Col>
          </Row>
        </Container>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-5 text-center"
        style={{ background: "var(--bg-gradient)" }}
      >
        <Container>
          <h2 className="display-4 fw-bold mb-4 text-white">
            Ready to Elevate Your Golf Experience?
          </h2>
          <p className="lead mb-5 text-white">
            Join RockMadeGolf today and become part of the future of golf.
          </p>
          <Button variant="light" className="custom-btn px-5 py-3">
            Get Started
          </Button>
        </Container>
      </motion.section>
    </div>
  );
};

export default About;
