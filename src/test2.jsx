import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";

// Sample images (replace with your assets)
import IMAGES from "./assets/images";
import { Wrapper } from "./Styles/HomeStyle";

const HomePage = () => {
  return (
    <Wrapper>
      {/* 🏌️ Hero Section */}
      <Carousel fade>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={IMAGES.image1}
            alt="First slide"
            style={{ objectFit: "cover", height: "600px" }}
          />
          <Carousel.Caption
            className="text-start carouselContentBackground"
            style={{ left: "5%", right: "auto" }}
          >
            <h1>Welcome to RockMadeGolf</h1>
            <p>Experience golf like never before — Play. Compete. Win.</p>
            <Button variant="success">Join a Tournament</Button>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={IMAGES.image2}
            alt="Second slide"
            style={{ objectFit: "cover", height: "600px" }}
          />
          <Carousel.Caption className="carouselContentBackground">
            <h1>Register Your Golf Course</h1>
            <p>Connect your course with golfers in your area.</p>
            <Button variant="primary">Register Now</Button>
          </Carousel.Caption>
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src={IMAGES.image3}
            alt="Third slide"
            style={{ objectFit: "cover", height: "600px" }}
          />
          <Carousel.Caption className="text-end carouselContentBackground">
            <h1>Compete One-on-One</h1>
            <p>Challenge players in exciting versus games.</p>
            <Button variant="warning">Start a Match</Button>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>

      {/* 📖 About Section */}
      <Container className="my-5 text-center">
        <h2>About RockMadeGolf</h2>
        <p className="lead">
          RockMadeGolf connects golfers with exciting matches — from casual
          games to high-stakes tournaments — across registered golf courses in
          your area.
        </p>
      </Container>

      {/* ⛳ Game Modes Section */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Choose Your Game Mode</h2>
        <Row>
          <Col md={4}>
            <Card className="text-center shadow">
              <Card.Body>
                <Card.Title>Normal Game</Card.Title>
                <Card.Text>
                  Play casual golf games with friends or practice on your own.
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
                  Compete in structured competitions and climb the leaderboard.
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
                  Challenge opponents in exciting one-on-one matchups.
                </Card.Text>
                <Button variant="warning">Start a Match</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/*  */}
      <Container fluid className="my-5">
        <h2 className="text-center mb-4">Our Game Modes</h2>
        <Row>
          <Col md={4} className="p0">
            <div className="game-mode-card normal-game">
              <div className="overlay">
                <h3>Normal Game</h3>
                <p>
                  Perfect for casual play or practice. Invite friends or join a
                  friendly round at registered golf courses near you.
                </p>
                <Button variant="success">Play Now</Button>
              </div>
            </div>
          </Col>
          <Col md={4} className="p0">
            <div className="game-mode-card normal-game">
              <div className="overlay">
                <h3>Normal Game</h3>
                <p>
                  Perfect for casual play or practice. Invite friends or join a
                  friendly round at registered golf courses near you.
                </p>
                <Button variant="success">Play Now</Button>
              </div>
            </div>
          </Col>
          <Col md={4} className="p0">
            <div className="game-mode-card normal-game">
              <div className="overlay">
                <h3>Normal Game</h3>
                <p>
                  Perfect for casual play or practice. Invite friends or join a
                  friendly round at registered golf courses near you.
                </p>
                <Button variant="success">Play Now</Button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* 📍 Course Registration */}
      <Container className="my-5 text-center">
        <h2>Are You a Course Owner?</h2>
        <p>
          Register your golf course today and connect with golfers looking for
          the perfect spot to play.
        </p>
        <Button variant="outline-dark">Register Your Course</Button>
      </Container>

      {/* 🏆 Upcoming Tournaments */}
      <Container className="my-5">
        <h2 className="text-center mb-4">Upcoming Tournaments</h2>
        <Row>
          <Col md={4}>
            <Card className="shadow">
              <Card.Body>
                <Card.Title>Spring Invitational</Card.Title>
                <Card.Text>Date: March 20, 2025</Card.Text>
                <Button variant="primary">View Details</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow">
              <Card.Body>
                <Card.Title>Summer Cup</Card.Title>
                <Card.Text>Date: July 15, 2025</Card.Text>
                <Button variant="primary">View Details</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="shadow">
              <Card.Body>
                <Card.Title>Championship Series</Card.Title>
                <Card.Text>Date: November 5, 2025</Card.Text>
                <Button variant="primary">View Details</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* 👥 Testimonials */}
      <Container className="my-5 text-center">
        <h2>What Our Players Say</h2>
        <Row className="mt-4">
          <Col md={4}>
            <blockquote>
              "RockMadeGolf helped me find amazing matches in my area!"
            </blockquote>
            <p>- Sarah, Golfer</p>
          </Col>
          <Col md={4}>
            <blockquote>
              "The tournaments are well organized and fun!"
            </blockquote>
            <p>- James, Tournament Player</p>
          </Col>
          <Col md={4}>
            <blockquote>
              "Finally, an easy way to challenge friends to versus games."
            </blockquote>
            <p>- Daniel, Casual Golfer</p>
          </Col>
        </Row>
      </Container>

      {/* 📩 Newsletter Signup */}
      <Container fluid className="bg-dark text-light py-5 text-center">
        <h2>Stay Updated</h2>
        <p>Subscribe for updates on tournaments, matches, and courses.</p>
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
          &copy; {new Date().getFullYear()} RockMadeGolf. All Rights Reserved.
        </p>
      </Container>
    </Wrapper>
  );
};

export default HomePage;
