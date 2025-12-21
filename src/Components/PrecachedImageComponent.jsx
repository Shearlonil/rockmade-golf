import { useEffect, useState } from 'react';

// also look at https://github.com/mcarlucci/react-precache-img
// for react native, look at https://blog.logrocket.com/caching-images-react-native-tutorial-with-examples/
// Below code from Gemini
const PrecachedImageComponent = ({ imageUrls }) => {
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        const cacheImages = async () => {
        const promises = imageUrls.map((url) => {
            return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve();
            img.onerror = () => reject();
            });
        });

        await Promise.all(promises);
        setImagesLoaded(true);
        };

        cacheImages();
    }, [imageUrls]);

    if (!imagesLoaded) {
        return <div>Loading images...</div>; // Or a spinner component
    }

    return (
        <div>
        {imageUrls.map((url, index) => (
            // The images will load from the browser cache instantly here
            <img key={index} src={url} alt={`Preloaded ${index}`} style={{ display: 'block', margin: '10px' }} />
        ))}
        </div>
    );
};

export default PrecachedImageComponent;
