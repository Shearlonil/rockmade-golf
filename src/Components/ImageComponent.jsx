import { useState } from "react";
// import { Blurhash } from "react-blurhash";
import { LazyLoadImage } from "react-lazy-load-image-component";
import styled from "styled-components";
import { useAxiosInterceptor } from "../axios/axios-interceptors";
import IMAGES from "../assets/images";

/*  refs: 
        https://hamon.in/blog/blurhash/
        https://github.com/ipenywis/img-lazy-loading/tree/master/src    OR  https://www.youtube.com/watch?v=8viWcH5bUE4
    */

const ImageWrapper = styled.div`
  position: relative;
`;

// const StyledBlurhash = styled(Blurhash)`
//   z-index: 20;
//   position: absolute !important;
//   top: 0;
//   left: 0;
// `;

const ImageComponent = ({ image, width, height, round }) => {
    const [isLoaded, setLoaded] = useState(false);
    const [isLoadStarted, setLoadStarted] = useState(false);
    const { getBaseURL } = useAxiosInterceptor();

    const handleLoad = () => {
        setLoaded(true);
    };

    const handleLoadStarted = () => {
        setLoadStarted(true);
    };
    return (
      <ImageWrapper>
        <LazyLoadImage
            key={image?.id}
            effect="blur"
            src={`${getBaseURL()}/users/dp/${image?.user_id}`}
            placeholderSrc={IMAGES.logo}
            width={width || "100%"}
            height={height || 200}
            onLoad={handleLoad}
            beforeLoad={handleLoadStarted}
            className={round ? 'rounded-circle' : ''}
        />
        {/* {!isLoaded && isLoadStarted && (
          <StyledBlurhash
              hash={image.blur_hash}
              width={width || "100%"}
              height={height || 200}
              resolutionX={32}
              resolutionY={32}
              punch={1}
          />
        )} */}
      </ImageWrapper>
    );
};

export default ImageComponent;
