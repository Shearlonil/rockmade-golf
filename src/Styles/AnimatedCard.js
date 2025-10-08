import styled from "styled-components";

export const Wrapper = styled.div`
  .volunteer-card {
    background-color: white;
    border-radius: 12px;
    /* border: 1px solid var(--background-dark); */
    /* padding: 20px; */
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1); /* Slight shadow to lift the div */
    transition: transform 0.3s ease-in-out; /* Smooth hover effect */
    text-align: center;
  }

  .volunteer-card:hover {
    transform: translateY(-10px); /* Lift the card on hover */
  }

  .volunteer-card h4 {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .volunteer-card p {
    color: #666;
    font-size: 1rem;
  }

  .volunteer-img-container {
    width: 150px;
    min-height: 150px;
    margin: 0 auto;
    border-radius: 50%;
    overflow: hidden;
    /* margin-bottom: 15px; */
  }

  .volunteer-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
