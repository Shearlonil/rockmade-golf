import { Button, Carousel } from "react-bootstrap";
import IMAGES from "../assets/images";

const MyCarousel = () => (
  <>
    <Carousel fade>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={IMAGES.image1}
          alt="First slide"
          style={{ objectFit: "cover", height: "600px" }}
        />
        <Carousel.Caption className="text-start p-3">
          <div className="container carouselContentBackground">
            <h1>Golf Reimagined with RockMadeGolf</h1>
            <p>
              Play. Compete. Connect. Experience golf like never before with
              games, tournaments, and challenges.
            </p>
            <Button variant="success" className="me-2">
              Join a Tournament
            </Button>
            <Button variant="outline-light">Learn More</Button>
          </div>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src={IMAGES.image2}
          alt="Second slide"
          style={{ objectFit: "cover", height: "600px" }}
        />
        <Carousel.Caption className="text-center carouselContentBackground p-3">
          <div>
            <h1>Challenge Yourself</h1>
            <p>Compete in tournaments or versus matches to test your skills.</p>
            <Button variant="primary">Start Competing</Button>
          </div>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src={IMAGES.image3}
          alt="Third slide"
          style={{ objectFit: "cover", height: "600px" }}
        />
        <Carousel.Caption className="text-end carouselContentBackground p-3">
          <div className="">
            <h1>Track Your Progress</h1>
            <p>
              Follow your handicap and climb the leaderboard while enjoying the
              game you love.
            </p>
            <Button variant="warning">View Leaderboard</Button>
          </div>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  </>
);

export default MyCarousel;
