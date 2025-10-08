import styled from "styled-components";

export const Wrapper = styled.div`
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
