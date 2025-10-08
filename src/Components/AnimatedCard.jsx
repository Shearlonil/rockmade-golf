import { Wrapper } from "../Styles/AnimatedCard";

const AnimatedCard = ({ image, children }) => {
  return (
    <Wrapper>
      <div className="volunteer-card">{children}</div>
    </Wrapper>
  );
};

export default AnimatedCard;
