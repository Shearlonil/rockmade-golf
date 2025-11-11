import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowToRight } from "react-icons/bi";
import IMAGES from "../assets/images";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import AnimatedCard from "../Components/AnimatedCard";
import { capitalizeFirstLetter } from "../Components/Utils/helpers";
import { GameModeCard, Wrapper } from "../Styles/HomeStyle";

const Home = () => {
  const navigate = useNavigate();

  const tournaments = [
    {
      title: "Spring Invitational",
      image: IMAGES.image3,
      details: {
        date: "March 20, 2025",
        location: "Palm Valley Golf Club",
        entry: "Free",
      },
    },
    {
      title: "Summer Cup",
      image: IMAGES.image2,
      details: {
        date: "July 15, 2025",
        location: "Palm Valley Golf Club",
        entry: "$25",
      },
    },
    {
      title: "Championship Series",
      image: IMAGES.image1,
      details: {
        date: "September 10, 2025",
        location: "Royal Pines Golf Course",
        entry: "$50",
      },
    },
  ];

  const topPlayers = [
    {
      player_name: "Debby D. McLean",
      handicapIndex: "5",
      country: "United States",
      image: IMAGES.player1,
    },
    {
      player_name: "Kyong W. Woodward",
      handicapIndex: "4",
      country: "China",
      image: IMAGES.player2,
    },
    {
      player_name: "Norma C. Knapp",
      handicapIndex: "8",
      country: "Mexico",
      image: IMAGES.player3,
    },
  ];

  return (
    <Wrapper>
      {/* HERO CAROUSEL */}
      <section className="hero" id="section_1">
        <div className="container-fluid h-100">
          <div className="row h-100">
            <div
              id="carouselExampleCaptions"
              className="carousel hero-carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <div className="container position-relative h-100">
                    <div className="carousel-caption d-flex flex-column justify-content-center">
                      <span className="small-title fw-bold fs-5">
                        Golf Reimagined with{" "}
                        <span className="word-span">RockMadeGolf</span>
                      </span>
                      <h1 className="display-5 fw-bold">
                        Play. Compete. Connect.
                      </h1>
                      <p className="fs-5 col-md-8 d-none d-sm-block">
                        Experience golf like never before with games,
                        tournaments, and challenges. Explore.
                      </p>
                      <div className="d-flex align-items-center mt-4">
                        <a className="custom-btn btn" href="#section_2">
                          Join a Tournament <BiArrowToRight />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="carousel-image-wrap">
                    <img
                      src={IMAGES.image4}
                      className="img-fluid carousel-image"
                      alt="Golf hero"
                    />
                  </div>
                </div>

                <div className="carousel-item">
                  <div className="container position-relative h-100">
                    <div className="carousel-caption d-flex flex-column justify-content-center">
                      <span className="small-title fw-bold fs-5">
                        Challenge <span className="word-span">Yourself</span>
                      </span>
                      <h1 className="display-5 fw-bold">
                        Compete in tournaments or versus matches to test{" "}
                        <span className="word-span">your skills.</span>
                      </h1>
                      <div className="d-flex align-items-center mt-4">
                        <a className="custom-btn btn" href="#section_2">
                          Explore Capabilities <BiArrowToRight />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="carousel-image-wrap">
                    <img
                      src={IMAGES.image3}
                      className="img-fluid carousel-image"
                      alt="Competition"
                    />
                  </div>
                </div>

                <div className="carousel-item">
                  <div className="container position-relative h-100">
                    <div className="carousel-caption d-flex flex-column justify-content-center">
                      <span className="small-title fw-bold fs-5">
                        Track Your <span className="word-span">Progress</span>
                      </span>
                      <h1 className="display-5 fw-bold">
                        Join the <span className="word-span">Leaderboard</span>
                      </h1>
                      <p className="fs-5 col-md-8 d-none d-sm-block">
                        Follow your handicap and climb the leaderboard while
                        enjoying the game you love.
                      </p>
                      <div className="d-flex align-items-center mt-4">
                        <a className="custom-btn btn" href="#section_2">
                          Explore Capabilities <BiArrowToRight />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="carousel-image-wrap">
                    <img
                      src={IMAGES.image1}
                      className="img-fluid carousel-image"
                      alt="Leaderboard"
                    />
                  </div>
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 – Intro */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container text-center mt-4 p-4 col-lg-8 mx-auto"
        id="section_2"
      >
        <h2 className="display-5 fw-bold mb-4">
          Rock<span className="word-span">Made</span>Golf Connects Golfers{" "}
          <span className="word-span">With Exciting Matches</span>
        </h2>
        <p className="lead mb-4">
          Golf is more than just a sport, it's a lifestyle. RockMadeGolf was
          created to connect golfers with the games they love. Whether you're a
          beginner looking for casual rounds or a pro chasing trophies, we bring
          the community, the competition, and the passion all in one platform.
        </p>
      </motion.div>

      {/* SECTION 3 – Game Modes */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="my-5"
        id="section_3"
      >
        <Container fluid>
          <div className="text-center mb-4">
            <h2 className="display-5 fw-bold">Our Game Modes</h2>
          </div>
          <Row>
            <Col md={4} className="mb-4">
              <GameModeCard bg={IMAGES.image3}>
                <div className="overlay d-flex flex-column justify-content-center align-items-center">
                  <h3 className="fw-bold mb-3">Member Game</h3>
                  <p className="mb-4">
                    Perfect for casual play or practice. Invite friends or join
                    a friendly round at registered golf courses near you.
                  </p>
                  <Link
                    className="btn btn-outline-light rounded-0 px-5 py-2"
                    to="/gameMode"
                  >
                    Play Now <BiArrowToRight />
                  </Link>
                </div>
              </GameModeCard>
            </Col>
            <Col md={4} className="mb-4">
              <GameModeCard bg={IMAGES.image5}>
                <div className="overlay d-flex flex-column justify-content-center align-items-center">
                  <h3 className="fw-bold mb-3">Tournament Game</h3>
                  <p className="mb-4">
                    Compete in structured competitions and climb the
                    leaderboard.
                  </p>
                  <Link
                    className="btn btn-outline-light rounded-0 px-5 py-2"
                    to="/gameMode"
                  >
                    Play Now <BiArrowToRight />
                  </Link>
                </div>
              </GameModeCard>
            </Col>
            <Col md={4} className="mb-4">
              <GameModeCard bg={IMAGES.image2}>
                <div className="overlay d-flex flex-column justify-content-center align-items-center">
                  <h3 className="fw-bold mb-3">Versus Game</h3>
                  <p className="mb-4">
                    Challenge friends in head-to-head matches or join public
                    versus games.
                  </p>
                  <Link
                    className="btn btn-outline-light rounded-0 px-5 py-2"
                    to="/gameMode"
                  >
                    Play Now <BiArrowToRight />
                  </Link>
                </div>
              </GameModeCard>
            </Col>
          </Row>
        </Container>
      </motion.section>

      {/* SECTION 4 – Upcoming Tournaments */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="my-5"
        id="section_4"
      >
        <Container>
          <div className="text-center mb-4">
            <h2 className="display-5 fw-bold">Upcoming Tournaments</h2>
          </div>
          <Row>
            {tournaments.map(({ title, image, details }, index) => (
              <Col key={index} md={4} className="mb-4">
                <Card className="h-100 shadow border-0 rounded-3">
                  <Card.Img
                    variant="top"
                    src={image}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fw-bold">{title}</Card.Title>
                    <Card.Text className="flex-grow-1 small">
                      {Object.entries(details).map(([key, value]) => (
                        <span key={key} className="d-block">
                          <strong>{capitalizeFirstLetter(key)}:</strong> {value}
                        </span>
                      ))}
                    </Card.Text>

                    <Button
                      variant="outline-primary rounded-3 px-4"
                      onClick={() => navigate("/tournaments")}
                    >
                      Explore <BiArrowToRight />
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </motion.section>

      {/* SECTION 5 – How It Works */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="my-5"
        id="section_5"
        style={{ backgroundColor: "var(--tertiary-color)" }}
      >
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">How It Works</h2>
            <p className="lead col-md-8 mx-auto">
              Get started in three simple steps.
            </p>
          </div>
          <Row className="g-4 pb-3">
            <Col md={4}>
              <div
                className="text-center p-4 rounded-3 colorful-border"
                style={{ height: "100%" }}
              >
                <h4
                  className="fw-bold mb-3"
                  style={{ color: "var(--primary-color)" }}
                >
                  1. Sign Up
                </h4>
                <p>Create your profile and join the RockMadeGolf community.</p>
              </div>
            </Col>
            <Col md={4}>
              <div
                className="text-center p-4 rounded-3 colorful-border"
                style={{ height: "100%" }}
              >
                <h4
                  className="fw-bold mb-3"
                  style={{ color: "var(--secondary-color)" }}
                >
                  2. Choose a Mode
                </h4>
                <p>Pick between Normal, Tournament, or Versus games.</p>
              </div>
            </Col>
            <Col md={4}>
              <div
                className="text-center p-4 rounded-3 colorful-border"
                style={{ height: "100%" }}
              >
                <h4
                  className="fw-bold mb-3"
                  style={{ color: "var(--primary-color)" }}
                >
                  3. Play & Compete
                </h4>
                <p>
                  Hit the course, track your performance, and climb the
                  leaderboard.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </motion.section>

      {/* SECTION 6 – Top Players */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="my-5"
        id="section_6"
      >
        <Container>
          <div className="text-center mb-4">
            <h2 className="display-5 fw-bold">Top Players</h2>
          </div>
          <Row>
            {topPlayers.map(
              ({ player_name, handicapIndex, country, image }, index) => (
                <Col key={index} md={4} className="mb-4">
                  <AnimatedCard>
                    <div className="text-center py-2">
                      <img
                        src={image}
                        alt={player_name}
                        className="rounded-circle mb-3 volunteer-img"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                      <h5 className="fw-bold">{player_name}</h5>
                      <div className="d-flex justify-content-center gap-3 mb-2">
                        <p className="mb-0 small">
                          <strong>Handicap:</strong> {handicapIndex}
                        </p>
                        <p className="mb-0 small">
                          <strong>Country:</strong> {country}
                        </p>
                      </div>
                    </div>
                  </AnimatedCard>
                </Col>
              )
            )}
          </Row>
        </Container>
      </motion.section>

      {/* SECTION 7 */}
      <motion.section
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="my-5"
        id="section_7"
      >
        <div className="container-fluid p-0">
          <div className="row g-0">
            <Col md={6}>
              <img
                src={IMAGES.image1}
                className="img-fluid h-100 w-100"
                alt="About us"
                style={{ objectFit: "cover" }}
              />
            </Col>
            <Col
              md={6}
              className="d-flex align-items-center p-5"
              style={{ backgroundColor: "var(--secondary-color)" }}
            >
              <div>
                <h3 className="display-5 fw-bold mb-3 text-white">
                  A Very Lovely Welcome <br /> to Our Company
                </h3>
                <p className="lead mb-4 text-white">
                  Join us for a comprehensive support program designed
                  specifically for parents in the Medway area facing financial
                  challenges.
                </p>
                <Link to="/about" className="btn custom-btn">
                  Know More About Us <BiArrowToRight />
                </Link>
              </div>
            </Col>
          </div>
        </div>
      </motion.section>
    </Wrapper>
  );
};

export default Home;
