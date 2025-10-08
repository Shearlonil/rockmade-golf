import styled from "styled-components";

export const Wrapper = styled.div`
  /*---------------------------------------
  FOOTER              
-----------------------------------------*/
  /*  */

  .navbar-expand-lg .navbar-nav .nav-link {
    border-radius: var(--border-radius-large);
    margin: 10px;
    padding: 10px 20px;
  }

  .navbar-nav .nav-link {
    display: inline-block;
    color: var(--white-color);
    font-size: var(--p-font-size);
    font-weight: var(--font-weight-normal);
    position: relative;
    padding-top: 15px;
    padding-bottom: 15px;

    :active {
      color: var(--secondary-color);
    }
    :hover {
      color: var(--secondary-color);
    }
  }
`;
