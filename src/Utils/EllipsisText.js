import { useEffect, useState } from "react";

// ref: https://ilxanlar.medium.com/ellipsis-the-art-of-truncation-in-web-applications-8b141ce33774
// export default function truncate(message, maxLength = 50, showFullText = false) {
//     if (message?.length > maxLength && showFullText === false) {
//         let result = '';
        
//         const words = message.split(' ');

//         for (let i = 0; i < words.length; i++) {
//             result += ' ' + words[i];
//             if (result.length >= maxLength) {
//                 break;
//             }
//         }
        
//         if (result.length < message.length) {
//             result += '...';
//         }
        
//         return result;
//     }
    
//     return message;
// }

const EllipsisText = (props) => {
    const {message, maxLength = 50} = props;
    // true: showing ellipsis, false: showing full text
    const [ellipsisMode, setEllipsisMode] = useState(true);

    const [text, setText] = useState(message);

    useEffect( () => {
		display();
    }, []);

    const changeMode = () => {
        setEllipsisMode(!ellipsisMode);
        display();
    }

    const display = () => {
        if (ellipsisMode && message.length > maxLength) {
            let result = '';
            
            const words = message.split(' ');
    
            for (let i = 0; i < words.length; i++) {
                result += ' ' + words[i];
                if (result.length >= maxLength) {
                    break;
                }
            }
            
            if (result.length < message.length) {
                result += '...';
            }
            
            setText(result);
        }else {
            setText(message);
        }
    }

    return (
        <span onClick={() => changeMode()}>
            {text}
        </span>
    );
}

export default EllipsisText;