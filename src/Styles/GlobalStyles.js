import { createGlobalStyle } from "styled-components";
import IMAGES from "../assets/images";

const GlobalStyle = createGlobalStyle`
  /* Importing Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Mulish:ital,wght@0,200..1000;1,200..1000&family=Rubik+Doodle+Shadow&family=Rubik+Mono+One&family=Rubik:ital,wght@0,300..900;1,300..900&family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap');

  /* Root Variables */
  :root {
    --primary-color: #414dba;
    /* --secondary-color: #ff6f61; */
    --secondary-color: #ff5b51;
    --tertiary-color: rgba(189, 250, 203, 1);
    --background-light: #f8f9fa;
    --background-dark: #161718ff;
    --text-color: #333333;
    --navbar-color: #ffffff;
    --cta-color: #ff6f61;
    --footer-bg: #343a40;
    --hover-color: #218838;
    --bg-gradient: linear-gradient(180deg, #28a745, #1b4d3e);
  }

  /* General Styles */
  body {
    background-color: var(--background-light) !important;
    font-family: 'Mulish', serif;
    font-family: Arial, Helvetica, sans-serif;
    margin: 0;
    padding: 0;
  }
  *{
    margin: 0;
    padding: 0;
  }
  .word-span{
    color: var(--primary-color);
    font-weight: bold;
  }
  a {
    font-weight: 500;
    /* color: #646cff; */
    text-decoration: inherit;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: "Bricolage Grotesque", sans-serif !important;
    font-optical-sizing: auto;
    font-style: normal;
  }

  /* Navigation styles */
  nav, nav>* {
    font-family: "Mulish", serif;
  }

  /* Donate button styles */
  .btn-div {
    position: relative !important;
    top: 0;
    overflow: hidden;
  }

  .donate-btn {
    background-color: var(--primary-color) !important;
    border: none !important;
    outline: none !important;
  }

  .donate-btn::before, .btn-slideToRight::before{
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    /* background-color: rgba(255, 255, 255, 0.2); */
    background-color: var(--background-light);
    opacity: 0.1;
    /* Light overlay */
    transition: 0.4s ease-in-out;
  }

  .donate-btn:hover::before, .btn-slideToRight:hover::before {
    left: 0;
    /* Slide overlay from left to right */
  }

  .donate-btn:hover,.btn-slideToRight::hover {
    background-color: var(--hover-color);
  }
  
  .colorful-border {
    border: 4px solid transparent;
    border-radius: 12px;
    background-image: linear-gradient(var(--background-light), var(--background-light)),
      linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    background-origin: border-box;
    background-clip: padding-box, border-box;
  }

/*---------------------------------------
  ABOUT              
-----------------------------------------*/
.about-section { 
  background-image: url(${IMAGES.image1});
  background-color: #704010; /* fallback */
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
  z-index: 0;
  padding: 40px 0
}

.about-section::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(32, 77, 14, 0.4); /* overlay color with opacity */
  backdrop-filter: blur(8px);          /* blur effect */
  -webkit-backdrop-filter: blur(8px); /* safari support */
  z-index: 1;
}

/* put your content ABOVE the overlay */
.about-section .container {
  position: relative;
  z-index: 2;
}

.about-image {
  border-radius: 50px;
  display: block;
}

.about-text-wrap {
  position: relative;
}

.about-text-icon {
  background: var(--primary-color);
  border-radius: 100%;
  font-size: var(--h3-font-size);
  width: 70px;
  height: 70px;
  line-height: 70px;
  text-align: center;
}

.about-text-info {
  backdrop-filter: blur(5px) saturate(180%);
  -webkit-backdrop-filter: blur(5px) saturate(180%);
  background-color: rgba(255, 255, 255, 0.45);
  border-radius: 50px;
  border: 1px solid rgba(209, 213, 219, 0.3);
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  margin: 20px;
  padding: 15px;
  max-height: 80%;
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


  ///////////////////////////////////////////* Font family classes *///////////////////////////////////////////
  .space-grotesk {
    font-family: "Space Grotesk", sans-serif !important;
    font-optical-sizing: auto;
    font-style: normal;
  }

  .space-mono-regular {
    font-family: "Space Mono", monospace !important;
    font-style: normal;
  }

  .space-mono-bold {
    font-family: "Space Mono", monospace !important;
    font-style: normal;
  }

  .bricolage-grotesque {
    font-family: "Bricolage Grotesque", sans-serif !important;
    font-optical-sizing: auto;
    font-variation-settings: "wdth" 100;
  }

  .rubik-mono-one-regular {
    font-family: "Rubik Mono One", monospace !important;
    font-weight: 400;
    font-style: normal;
  }

  .rubik {
    font-family: "Rubik", sans-serif !important;
    font-optical-sizing: auto;
    font-style: normal;
  }

  .rubik-doodle-shadow-regular {
    font-family: "Rubik Doodle Shadow", system-ui !important;
    font-weight: 400;
    font-style: normal;
  }

  .mulish {
    font-family: "Mulish", serif !important;
    font-optical-sizing: auto;
    font-style: normal;
  }
 
`;

export default GlobalStyle;
