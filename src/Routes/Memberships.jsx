import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import HeroComp from "../Components/HeroComp";
import IMAGES from "../assets/images";
import ScoreTable from "./ScoreTable";

const Memberships = () => {
  return (
    <div>
      <HeroComp $heroImage={IMAGES.image3} height={"30vh"}>
        <div>
          <h3 className="display-4 fw-bold">
            Our{" "}
            <span style={{ color: "var(--secondary-color)" }}>Membership</span>{" "}
            Plans
          </h3>
          <p className="lead">
            Lorem, ipsum dolor sit amet consectetur adipisicing.
          </p>
        </div>
      </HeroComp>

      <div className="container">
        <ScoreTable />
      </div>
    </div>
  );
};

export default Memberships;
