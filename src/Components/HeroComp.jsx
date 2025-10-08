import React from "react";
import { HeroWrapper } from "../Styles/HeroComp";

const HeroComp = ({ $heroImage, children }) => {
  return (
    <>
      <HeroWrapper
        className="d-flex align-items-center justify-content-center gap-5"
        $heroImage={$heroImage}
      >
        <div className="overlay"></div>
        <div className="child-1 px-4">{children}</div>
      </HeroWrapper>
    </>
  );
};

export default HeroComp;
