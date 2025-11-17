import { useRef, useState } from 'react'
import IMAGES from '../assets/images';

/*  refs:
    https://github.com/atapas/youtube/blob/main/react/28-react-image-uploader/src/components/ImageUpload.jsx
    https://www.youtube.com/watch?v=nOqsd8LoUYs
*/
const DpUploader = ({ setImageURL }) => {
    const [avatarURL, setAvatarURL] = useState(IMAGES.image3);

    const fileUploadRef = useRef();

    const handleImageUpload = (event) => {
        event?.preventDefault();
        fileUploadRef.current.click();
    }

    const uploadImageDisplay = async () => {
        const uploadedFile = fileUploadRef.current.files[0];
        const cachedURL = URL.createObjectURL(uploadedFile);
        setAvatarURL(cachedURL);
        setImageURL(uploadedFile);
    }

    return (
        <div className="position-relative m-1" style={{height: 200, width: 250}} onClick={() => handleImageUpload()}>
            <img src={avatarURL} alt ="Avatar" className="h-100 w-100 rounded-circle" />
            <div>
                <input type="file" id="file" ref={fileUploadRef} onChange={uploadImageDisplay} hidden accept="image/jpeg"/>
            </div>  
        </div>
    )
}

export default DpUploader;