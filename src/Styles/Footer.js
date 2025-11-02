import styled from "styled-components";

export const Wrapper = styled.div`
  /*---------------------------------------
  FOOTER              
-----------------------------------------*/
  /* FOOTER LINK HOVER */
  .footer-link {
    color: #adb5bd !important;
    transition: color 0.3s ease;
  }
  .footer-link:hover {
    color: var(--secondary-color) !important;
  }

  /* SOCIAL ICON HOVER */
  .social-icon {
    transition: color 0.3s ease, transform 0.2s ease;
  }
  .social-icon:hover {
    color: var(--secondary-color) !important;
    transform: translateY(-2px);
  }
`;
