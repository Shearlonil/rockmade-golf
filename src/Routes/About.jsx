import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import HeroComp from "../Components/HeroComp";
import IMAGES from "../assets/images";
import { BiCheckCircle } from "react-icons/bi";
import { BsCheckCircleFill } from "react-icons/bs";
import { GiCheckMark, GiFamilyTree } from "react-icons/gi";
import { IoGolf } from "react-icons/io5";
import { MdSportsGolf } from "react-icons/md";

const About = () => {
  return (
    <div>
      <HeroComp $heroImage={IMAGES.image1} height={"30vh"}>
        <div>
          <h3 className="display-4 fw-bold">
            About <span className="text-success">Us</span>
          </h3>
        </div>
      </HeroComp>

      <Container className="my-5">
        <h2 className="text-center mb-4 display-6">
          <span className="fw-bold" style={{ color: "var(--primary-color)" }}>
            RockMade
          </span>{" "}
          Golf
        </h2>
        <p className="text-center mx-auto w-75 fs-5">
          RockMadeGolf was created out of a passion for the game and a desire to
          make it more engaging. Traditional scorekeeping and golf communities
          are often fragmented. Our platform brings golfers together, offering
          fun modes of play, social connections, and competitive tournaments.
        </p>
        <div className="d-flex flex-column align-items-center justify-content-center mt-5">
          <h3 className="text-center fw-bold h2">Why Join Us</h3>
          <div className="fs-5">
            <p>
              <GiCheckMark color="green" /> Lorem ipsum dolor sit amet
              consectetur adipisicing elit.
            </p>
            <p>
              <GiCheckMark color="green" /> Error aliquam delectus pariatur quam
              deserunt facere sed.
            </p>
            <p>
              <GiCheckMark color="green" /> Lorem ipsum dolor sit amet
              consectetur adipisicing elit.
            </p>
            <p>
              <GiCheckMark color="green" /> Lorem ipsum dolor sit amet
              consectetur adipisicing elit.
            </p>
            <p>
              <GiCheckMark color="green" /> Error aliquam delectus pariatur quam
              deserunt facere sed.
            </p>
            <p>
              <GiCheckMark color="green" /> Error aliquam delectus pariatur quam
              deserunt facere sed.
            </p>
            <p>
              <GiCheckMark color="green" /> Lorem ipsum dolor sit amet
              consectetur adipisicing elit.
            </p>
            <p>
              <GiCheckMark color="green" /> Error aliquam delectus pariatur quam
              deserunt facere sed.
            </p>
            <p>
              <GiCheckMark color="green" /> Lorem ipsum dolor sit amet
              consectetur adipisicing elit.
            </p>
          </div>
        </div>
      </Container>
      {/* Features Highlight */}
      <Container className="my-5">
        <h2 className="text-center">Our Match Modes</h2>
        <Row className="mt-4">
          <Col md={4} className="mb-3">
            <div className="p-3 border h-100">
              <h3>
                {" "}
                <IoGolf className="me-2" color="var(--primary-color)" /> Member
                Games
              </h3>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius
                vero expedita?
              </p>
            </div>
          </Col>
          <Col md={4} className="mb-3">
            <div className="p-3 border h-100">
              <h3>
                {" "}
                <GiFamilyTree
                  className="me-2"
                  color="var(--secondary-color)"
                />{" "}
                Tournament Games
              </h3>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eius
                vero expedita?
              </p>
            </div>
          </Col>
          <Col md={4} className="mb-3">
            <div className="p-3 border h-100">
              <h3>
                {" "}
                <img
                  className="me-2"
                  src={IMAGES.versus_icon}
                  width={"40px"}
                  alt=""
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
      {/*  */}
      {/* Mission & Vision */}
      <Container className="mt-5 fs-5">
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
      {/*  */}
      <Container className="mb-5 fs-5">
        <Row>
          <Col className="px-0" md={"6"}>
            <img src={IMAGES.image3} className="img-fluid" alt="" />
          </Col>
          <Col md={6} className="text-center">
            <div className="h-100 d-flex flex-column justify-content-center align-items-center p-4">
              <h3
                className="display-6 fw-bold"
                style={{ color: "var(--secondary-color)" }}
              >
                Our Vision
              </h3>
              <p>
                We envision a global golfing community where every game,
                tournament, and rivalry is connected through RockMadeGolf.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
      {/*  */}
      <section className="about-section section-padding" id="section_2">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-12 mb-4 mb-lg-0 d-flex align-items-center">
              <div className="services-info">
                <h2 className="text-white mb-4">About RockMade Golf</h2>
                <p className="text-white">
                  RockMade Golf is a modern golf community platform that
                  connects players of all levels to enjoy, compete, and track
                  their progress.
                </p>
                <h6 className="text-white mt-4">Golf for Everyone</h6>
                <p className="text-white">
                  Whether you’re a beginner learning your first swing or a pro
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
                    <h3>Play Together</h3>
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
      </section>

      {/* Core Values */}
      <Container className="my-5 text-center">
        <h2>Our Core Values</h2>
        <Row className="mt-4 d-flex justify-content-center">
          {[
            { name: "Sportsmanship", icon: IMAGES.svg_playing_golf },
            { name: "Innovation", icon: IMAGES.svg_idea },
            { name: "Community", icon: IMAGES.svg_online_community_SECONDARY },
            { name: "Fair Play", icon: IMAGES.svg_golf },
            { name: "Passion", icon: IMAGES.svg_team_SECONDARY },
          ].map(({ name, icon }, idx) => (
            <Col key={idx} md={2} sm={6} className="mb-3 mx-center">
              <Card className="p-3 shadow-sm d-flex flex-column align-items-center align-items-evenly gap-3">
                <img src={icon} width={"55px"} height={"55px"} />
                <h5>{name}</h5>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* <div className="row mb-n12">
        <div className="col-12 col-lg-6 mb-12">
          <div className="mw-md">
            <div className="d-flex align-items-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-light rounded-pill"
                style={{ width: "32px", height: "32px" }}
              >
                🏥
              </div>
              <h5 className="ms-3 mb-0">Inclusive Health Package</h5>
            </div>
            <p className="mb-0 text-light-dark">
              We care for your well-being with dental and vision benefits. No
              health expense stress.
            </p>
          </div>
        </div>
        <div className="col-12 col-lg-6 mb-12">
          <div className="mw-md">
            <div className="d-flex align-items-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-light rounded-pill"
                style={{ width: "32px", height: "32px" }}
              >
                🏋
              </div>
              <h5 className="ms-3 mb-0">Free Gym Membership</h5>
            </div>
            <p className="mb-0 text-light-dark">
              Enjoy a complimentary gym membership for your fitness and
              well-being.
            </p>
          </div>
        </div>
        <div className="col-12 col-lg-6 mb-12">
          <div className="mw-md">
            <div className="d-flex align-items-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-light rounded-pill"
                style={{ width: "32px", height: "32px" }}
              >
                🕞
              </div>
              <h5 className="ms-3 mb-0">Flexible Working Style</h5>
            </div>
            <p className="mb-0 text-light-dark">
              We are 100% remote-friendly, work with team mates from different
              time zones.
            </p>
          </div>
        </div>
        <div className="col-12 col-lg-6 mb-12">
          <div className="mw-md">
            <div className="d-flex align-items-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-light rounded-pill"
                style={{ width: "32px", height: "32px" }}
              >
                🏖️
              </div>
              <h5 className="ms-3 mb-0">Balanced Working Life</h5>
            </div>
            <p className="mb-0 text-light-dark">
              We offer a flexible 4-weeks vacation policy. Recharge whenever you
              need to.
            </p>
          </div>
        </div>
        <div className="col-12 col-lg-6 mb-12">
          <div className="mw-md">
            <div className="d-flex align-items-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-light rounded-pill"
                style={{ width: "32px", height: "32px" }}
              >
                🌍
              </div>
              <h5 className="ms-3 mb-0">Diversity and Inclusion</h5>
            </div>
            <p className="mb-0 text-light-dark">
              Our strength lies in team members diversity and inclusive culture.
            </p>
          </div>
        </div>
        <div className="col-12 col-lg-6 mb-12">
          <div className="mw-md">
            <div className="d-flex align-items-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-light rounded-pill"
                style={{ width: "32px", height: "32px" }}
              >
                💰
              </div>
              <h5 className="ms-3 mb-0">Generous Perks Program</h5>
            </div>
            <p className="mb-0 text-light-dark">
              We provide perk stipends for home office, learning, wellness, and
              connectivity.
            </p>
          </div>
        </div>
      </div> */}
      {/* Team Section */}
      <Container className="my-5 text-center">
        <h2>Meet the Team</h2>
        <p>
          RockMadeGolf is built with passion by golf enthusiasts and developers
          who believe in making the game more exciting.
        </p>
        <Row className="mt-4">
          <Col md={4}>
            <Card className="p-3 shadow border-0">
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                className="rounded-circle mx-auto mb-3"
              />
              <h5>Joshua Odunbaku</h5>
              <p>Founder & Developer</p>
            </Card>
          </Col>
          {/* Add more team members here if needed */}
        </Row>
      </Container>

      {/* CTA */}
      <div
        style={{
          background: "var(--bg-gradient)",
          color: "white",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h2>Ready to Elevate Your Golf Experience?</h2>
        <p>Join RockMadeGolf today and become part of the future of golf.</p>
        <Button
          variant="light"
          style={{ color: "var(--primary-color)", fontWeight: "bold" }}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default About;
