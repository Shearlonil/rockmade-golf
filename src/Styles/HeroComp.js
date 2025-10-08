import styled from "styled-components";

export const HeroWrapper = styled.div`
  background-image: ${(prop) => `url(${prop.$heroImage})`};
  background-size: cover;
  background-position: center;
  height: ${(prop) => `${prop.height || "40vh"}`};
  width: 100%;
  position: relative;
  color: white;
  z-index: 10;

  .overlay {
    background-color: rgba(54, 54, 54, 0.6);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 15;
  }

  .child-1 {
    position: relative;
    z-index: 30;
    max-width: 700px;
  }
`;
