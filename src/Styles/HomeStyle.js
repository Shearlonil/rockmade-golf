import styled from "styled-components";
import IMAGES from "../assets/images";

export const Wrapper = styled.div`
  #section-4 {
    /* width: 100%; */
    background: var(--secondary-color);
  }

  .carouselContentBackground {
    background: rgba(0, 0, 0, 0.5); /* semi-transparent black */
    padding: 20px;
    border-radius: 10px;
  }

  .carouselContentBackground h1,
  .carouselContentBackground p {
    color: #fff; /* make text always visible */
  }

  .donate {
    background-color: #28a745;
    color: #fff;
    font-weight: bold;
    border-radius: 20px;
    padding: 6px 16px;
  }
  /* .carouselContentBackground {
    background: rgba(0, 0, 0, 0.5);
    padding: 20px;
    border-radius: 10px;
    display: inline-block; so it only wraps the content, not full width
  } */

  /*---------------------------------------
  HERO              
-----------------------------------------*/
  .hero {
    position: relative;
    height: calc(100vh - 133px);
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

  /*---------------------------------------
  CUSTOM ICON               
-----------------------------------------*/
  .custom-icon {
    display: inline-block;
    height: 45px;
    width: 45px;
    line-height: 45px;
    border: 3px solid var(--white-color);
    text-align: center;
    border-radius: 50%;
    font-size: 20px;
    position: relative;
  }

  .custom-icon::before,
  .custom-icon::after {
    box-sizing: inherit;
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: 50%;
  }

  .custom-icon::before {
    border: 3px solid transparent;
  }

  .custom-icon::after {
    border: 0 solid transparent;
  }

  .custom-icon:hover {
    border-color: transparent;
  }

  .custom-icon:hover::before {
    border-top-color: var(--primary-color);
    border-right-color: var(--primary-color);
    border-bottom-color: var(--primary-color);
    transition: border-top-color 0.15s linear,
      border-right-color 0.15s linear 0.1s,
      border-bottom-color 0.15s linear 0.2s;
  }

  .custom-icon:hover::after {
    border-top: 3px solid var(--primary-color);
    border-left-width: 3px;
    border-right-width: 3px;
    transform: rotate(270deg);
    transition: transform 0.4s linear 0s, border-left-width 0s linear 0.35s;
  }

  .play-icon::before {
    position: relative;
    left: 1px;
  }

  /*---------------------------------------
  CUSTOM BUTTON               
-----------------------------------------*/
  .custom-btn {
    background: var(--secondary-color);
    border-radius: 100px;
    color: var(--white-color);
    font-size: var(--copyright-text-font-size);
    font-weight: var(--font-weight-bold);
    padding: 12px 24px;
  }

  .custom-btn:hover {
    background: var(--primary-color);
    color: var(--white-color);
  }

  .custom-bg-primary {
    background: var(--primary-color);
  }

  .custom-bg-primary:hover {
    background: var(--white-color);
    color: var(--dark-color);
  }
`;

export const GameModeCard = styled.div`
  position: relative;
  height: 350px;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);

  /* background layer */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ bg }) => `url(${bg}) no-repeat center/cover`};
    transition: transform 0.6s ease;
    z-index: 0;
  }

  /* zoom only background */
  &:hover::before {
    transform: scale(1.1);
  }

  /* overlay content */
  .overlay {
    position: relative;
    z-index: 1;
    background: rgba(0, 0, 0, 0.4);
    color: white;
    text-align: center;
    padding: 20px;
    border-radius: 15px;
    width: 100%;
  }

  .overlay h3 {
    font-size: 1.5rem;
    margin-bottom: 10px;
  }

  .overlay p {
    font-size: 0.95rem;
    margin-bottom: 15px;
  }
`;
