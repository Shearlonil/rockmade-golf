import { Wrapper } from "../Styles/CustomButton";

const CustomButton = ({ children }) => {
  return (
    <Wrapper>
      <span className="custom-btn btn custom-link">{children}</span>
    </Wrapper>
  );
};

export default CustomButton;
