import styled from "styled-components";
import IMAGES from "../assets/images";

export const GameModeCard = styled.div`
  position: relative;
  height: 350px;
  border-radius: 50px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ bg }) => `url(${bg}) no-repeat center/cover`};
    transition: transform 0.3s ease;
    z-index: 0;
  }

  &:hover::before {
    transform: scale(1.05);
  }

  .overlay {
    position: relative;
    z-index: 1;
    background: rgba(0, 0, 0, 0.5);
    color: var(--white-color);
    text-align: center;
    padding: 2rem;
    border-radius: 50px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .overlay h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .overlay p {
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }
`;

export const Wrapper = styled.div`
  /* Hero Carousel */
  .hero {
    position: relative;
    height: calc(100vh - 80px); /* Adjusted for navbar */
  }

  .carousel {
    padding-right: 0;
    padding-left: 0;
  }

  .hero-carousel,
  .carousel-inner,
  .carousel-item {
    height: 100%;
  }

  .carousel-image-wrap::before {
    content: "";
    background: linear-gradient(
      to top,
      var(--background-dark),
      transparent 90%
    );
    position: absolute;
    z-index: 2;
    top: 0;
    right: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 0.7;
  }

  .carousel-caption {
    z-index: 9;
    top: 32%;
    bottom: 0;
    left: 0;
    text-align: left;
    width: 50%;
    margin-right: 12px;
    margin-left: 12px;
  }

  .carousel-image-wrap {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    margin-left: auto;
  }

  .carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .carousel-control-next,
  .carousel-control-prev {
    top: auto;
    bottom: 50px;
    opacity: 1;
  }

  .carousel-control-prev {
    left: auto;
    right: 70px;
  }

  .carousel-control-next-icon,
  .carousel-control-prev-icon {
    width: 70px;
    height: 70px;
  }

  /* Small title */
  .small-title {
    color: var(--secondary-color);
  }

  /* Game Mode Cards – now defined above */
  ${GameModeCard} {
    position: relative;
    height: 350px;
    border-radius: 50px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }

  /* Tournament Cards */
  .card {
    border-radius: 50px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }

  .card-img-top {
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
  }

  /* How It Works Cards */
  .colorful-border {
    border: 4px solid transparent;
    border-radius: 50px;
    background-image: linear-gradient(
        var(--background-light),
        var(--background-light)
      ),
      linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    background-origin: border-box;
    background-clip: padding-box, border-box;
    transition: transform 0.3s ease;
  }

  .colorful-border:hover {
    transform: translateY(-4px);
  }

  /* Top Players */
  .volunteer-img {
    border: 3px solid var(--primary-color);
    transition: border-color 0.3s ease;
  }

  .volunteer-img:hover {
    border-color: var(--secondary-color);
  }

  /* Custom Button */
  .custom-btn {
    background: var(--secondary-color);
    border-radius: 100px;
    color: var(--white-color);
    font-weight: var(--font-weight-bold);
    padding: 0.75rem 2rem;
    border: none;
    transition: background-color 0.3s ease;
  }

  .custom-btn:hover {
    background: var(--primary-color);
    color: var(--white-color);
  }
`;
