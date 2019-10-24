import { useState, useEffect } from 'react';

const useKeyPress = (targetKeyCode) => {
    const [keyPressed,setKeyPressed] = useState(false);

    const keyDownhandler = ({ keyCode }) => {
        if( keyCode === targetKeyCode )
            setKeyPressed(true);
    }
    const keyUphandler = ({ keyCode }) => {
        if( keyCode === targetKeyCode )
            setKeyPressed(false);
    }
    useEffect(() => {
        document.addEventListener('keydown',keyDownhandler);
        document.addEventListener('keyup',keyUphandler);
        return () => {
            document.removeEventListener('keydown',keyDownhandler);
            document.removeEventListener('keyup',keyUphandler);
        }
    })

    return keyPressed;
}

export default useKeyPress;