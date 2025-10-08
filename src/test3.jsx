import React from "react";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import IMAGES from "./assets/images";

// Example images (replace with your own)

const HomePageTwo = () => {
  return (
    <>
      {/**/}
      <Carousel fade>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={IMAGES.image1}
            alt="First slide"
            style={{ objectFit: "cover", height: "600px" }}
          />
          <Carousel.Caption className="text-start" style={{ left: "5%" }}>
            <h1>Golf Reimagined with RockMadeGolf</h1>
            <p>
              Play. Compete. Connect. Experience golf like never before with
              games, tournaments, and challenges.
            </p>
            <Button variant="success" className="me-2">
              Join a Tournament
            </Button>
            <Button variant="outline-light">Learn More</Button>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={IMAGES.image1}
            alt="Second slide"
            style={{ objectFit: "cover", height: "600px" }}
          />
          <Carousel.Caption className="text-center">
            <h1>Challenge Yourself</h1>
            <p>Compete in tournaments or versus matches to test your skills.</p>
            <Button variant="primary">Start Competing</Button>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={IMAGES.image1}
            alt="Third slide"
            style={{ objectFit: "cover", height: "600px" }}
          />
          <Carousel.Caption className="text-end" style={{ right: "5%" }}>
            <h1>Track Your Progress</h1>
            <p>
              Follow your handicap and climb the leaderboard while enjoying the
              game you love.
            </p>
            <Button variant="warning">View Leaderboard</Button>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/**/}
      <Container className="my-5 text-center">
        <h2>About RockMadeGolf</h2>
        <p className="lead">
          Golf is more than just a sport — it’s a lifestyle. RockMadeGolf was
          created to connect golfers with the games they love. Whether you’re a
          beginner looking for casual rounds or a pro chasing trophies, we bring
          the community, the competition, and the passion all in one platform.
        </p>
      </Container>

      {/**/}
      <Container className="my-5">
        <h2 className="text-center mb-4">Our Game Modes</h2>
        <Row>
          <Col md={4}>
            <Card className="text-center shadow">
              <Card.Body>
                <Card.Title>Normal Game</Card.Title>
                <Card.Text>
                  Perfect for casual play or practice. Invite friends or join a
                  friendly round at registered golf courses near you.
                </Card.Text>
                <Button variant="success">Play Now</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center shadow">
              <Card.Body>
                <Card.Title>Tournament Game</Card.Title>
                <Card.Text>
                  Structured competitions with scores, leaderboards, and prizes.
                  Compete regionally or nationally.
                </Card.Text>
                <Button variant="primary">View Tournaments</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center shadow">
              <Card.Body>
                <Card.Title>Versus Game</Card.Title>
                <Card.Text>
                  Challenge another golfer one-on-one. Set the stakes, track the
                  results, and claim victory.
                </Card.Text>
                <Button variant="warning">Start a Match</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/**/}
      <Container className="my-5 text-center">
        <h2>How It Works</h2>
        <Row className="mt-4">
          <Col md={4}>
            <h4>1. Sign Up</h4>
            <p>Create your profile and join the RockMadeGolf community.</p>
          </Col>
          <Col md={4}>
            <h4>2. Choose a Mode</h4>
            <p>Pick between Normal, Tournament, or Versus games.</p>
          </Col>
          <Col md={4}>
            <h4>3. Play & Compete</h4>
            <p>
              Hit the course, track your performance, and climb the leaderboard.
            </p>
          </Col>
        </Row>
      </Container>

      {/* 🏆 Upcoming Tournaments */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Upcoming Tournaments</h2>
        <Row>
          <Col md={4}>
            <Card className="shadow">
              <Card.Body>
                <Card.Title>Spring Invitational</Card.Title>
                <Card.Text>
                  <strong>Date:</strong> March 20, 2025 <br />
                  <strong>Location:</strong> Palm Valley Golf Club <br />
                  <strong>Entry:</strong> Free
                </Card.Text>
                <Button variant="primary">Register</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow">
              <Card.Body>
                <Card.Title>Summer Cup</Card.Title>
                <Card.Text>
                  <strong>Date:</strong> July 15, 2025 <br />
                  <strong>Location:</strong> Green Meadows Golf Park <br />
                  <strong>Entry:</strong> $25
                </Card.Text>
                <Button variant="primary">Register</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow">
              <Card.Body>
                <Card.Title>Championship Series</Card.Title>
                <Card.Text>
                  <strong>Date:</strong> Nov 5, 2025 <br />
                  <strong>Location:</strong> Royal Pines Golf Course <br />
                  <strong>Entry:</strong> $50
                </Card.Text>
                <Button variant="primary">Register</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* 🏅 Leaderboard */}
      <Container className="my-5 text-center">
        <h2>Top Players</h2>
        <Row className="mt-4">
          <Col md={4}>
            <h4>1. Sarah Johnson</h4>
            <p>Handicap: 5.2</p>
          </Col>
          <Col md={4}>
            <h4>2. James Brown</h4>
            <p>Handicap: 7.8</p>
          </Col>
          <Col md={4}>
            <h4>3. Daniel Smith</h4>
            <p>Handicap: 9.1</p>
          </Col>
        </Row>
      </Container>

      {/* 👥 Testimonials */}
      <Container className="my-5 text-center">
        <h2>What Our Players Say</h2>
        <Row className="mt-4">
          <Col md={4}>
            <blockquote>
              "RockMadeGolf helped me find new courses and friendly matches in
              my city."
            </blockquote>
            <p>- Sarah, Golfer</p>
          </Col>
          <Col md={4}>
            <blockquote>
              "The tournaments are fun, competitive, and well organized!"
            </blockquote>
            <p>- James, Tournament Player</p>
          </Col>
          <Col md={4}>
            <blockquote>
              "Versus matches keep me motivated to improve every week."
            </blockquote>
            <p>- Daniel, Casual Golfer</p>
          </Col>
        </Row>
      </Container>

      {/* 📩 Newsletter Signup */}
      <Container fluid className="bg-dark text-light py-5 text-center">
        <h2>Stay Updated</h2>
        <p>
          Join over 1,000 golfers and get the latest on matches, tournaments,
          and events.
        </p>
        <Form className="d-flex justify-content-center">
          <Form.Control
            type="email"
            placeholder="Enter your email"
            className="w-25 me-2"
          />
          <Button variant="success">Subscribe</Button>
        </Form>
      </Container>

      {/* 📞 Footer */}
      <Container fluid className="bg-light py-4 text-center">
        <p>
          &copy; {new Date().getFullYear()} RockMadeGolf | All Rights Reserved
        </p>
        <p>
          <a href="#about">About</a> | <a href="#games">Games</a> |{" "}
          <a href="#tournaments">Tournaments</a> |{" "}
          <a href="#contact">Contact</a>
        </p>
      </Container>
    </>
  );
};

export default HomePageTwo;
