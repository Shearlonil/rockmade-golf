import { createGlobalStyle } from "styled-components";
import IMAGES from "../assets/images";

const GlobalStyle = createGlobalStyle`
  /* Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Mulish:ital,wght@0,200..1000;1,200..1000&family=Rubik+Doodle+Shadow&family=Rubik+Mono+One&family=Rubik:ital,wght@0,300..900;1,300..900&family=Space+Grotesk:wght@300..700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap');

  /* Root Variables */
  :root {
    --primary-color: #414dba;
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
    --white-color: #ffffff;
    --dark-color: #212529;
    --font-weight-bold: 700;
    --p-font-size: 1rem;
    --h5-font-size: 1.25rem;
    --border-radius-large: 50px;
  }

  /* Reset */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: var(--background-light) !important;
    font-family: 'Mulish', serif;
    color: var(--text-color);
  }

  /* Typography */
  .word-span { color: var(--primary-color); font-weight: bold; }

  h1, h2, h3, h4, h5, h6 {
    font-family: "Bricolage Grotesque", sans-serif !important;
    font-optical-sizing: auto;
    font-style: normal;
  }

  /* DON’T FORCE NAV LINK COLOR */
  /* Remove any global .navbar-nav .nav-link color rule */

  /* Buttons */
  .donate-btn {
    background-color: var(--primary-color) !important;
    border: none !important;
    color: white !important;
    position: relative;
    overflow: hidden;
    transition: background-color 0.3s ease;
  }
  .donate-btn::before {
    content: ""; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
    background-color: var(--background-light); opacity: 0.1; transition: left 0.4s ease-in-out;
  }
  .donate-btn:hover::before { left: 0; }
  .donate-btn:hover { background-color: var(--hover-color) !important; }

  .custom-btn {
    background: var(--secondary-color);
    border-radius: 100px;
    color: var(--white-color);
    font-weight: var(--font-weight-bold);
    padding: 12px 24px;
    border: none;
    font-size: 0.875rem;
  }
  .custom-btn:hover {
    background: var(--primary-color);
    color: var(--white-color);
  }

  /* GALLERY HOVER */
  .gallery-item:hover img { transform: scale(1.1); }
  .gallery-item:hover .caption { opacity: 1; }
  .caption { opacity: 0; transition: opacity 0.3s ease; }

  /* ABOUT SECTION */
  .about-section { 
    background-image: url(${IMAGES.image1});
    background-color: #704010;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    position: relative;
    z-index: 0;
    padding: 40px 0;
  }
  .about-section::before {
    content: ""; position: absolute; inset: 0;
    background: rgba(32, 77, 14, 0.4);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 1;
  }
  .about-section .container { position: relative; z-index: 2; }
/* About Page Tweaks */
.about-text-wrap {
  position: relative;
}

.about-image {
  border-radius: 50px;
  display: block;
  width: 100%;
}

.about-text-icon {
  background: var(--primary-color);
  border-radius: 100%;
  font-size: 1.25rem;
  width: 70px;
  height: 70px;
  line-height: 70px;
  text-align: center;
  color: var(--white-color);
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
  color: var(--text-color);
}

.about-text-info h5 {
  font-family: "Bricolage Grotesque", sans-serif;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.about-text-info p {
  font-family: "Mulish", serif;
  font-size: 0.875rem;
}

/* Core Values Cards */
.card {
  border-radius: 50px;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
}

/* CTA Button */
.custom-btn {
  background: var(--secondary-color);
  border-radius: 100px;
  color: var(--white-color);
  font-weight: var(--font-weight-bold);
  padding: 12px 24px;
  border: none;
  transition: background-color 0.3s ease;
}

.custom-btn:hover {
  background: var(--primary-color);
  color: var(--white-color);
}

  /* Font Classes */
  .space-grotesk { font-family: "Space Grotesk", sans-serif !important; }
  .space-mono-regular { font-family: "Space Mono", monospace !important; }
  .space-mono-bold { font-family: "Space Mono", monospace !important; font-weight: 700; }
  .bricolage-grotesque { font-family: "Bricolage Grotesque", sans-serif !important; }
  .rubik-mono-one-regular { font-family: "Rubik Mono One", monospace !important; }
  .rubik { font-family: "Rubik", sans-serif !important; }
  .rubik-doodle-shadow-regular { font-family: "Rubik Doodle Shadow", system-ui !important; }
  .mulish { font-family: "Mulish", serif !important; }
`;

export default GlobalStyle;
