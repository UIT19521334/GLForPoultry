import React from 'react';

export const OnMultiKeyEvent = (callback, key) => {
    React.useEffect(() => {
        const keyPressHandler = (event) => {
            if (event.key === key && event.altKey) {
                callback();
            }
            // console.log(event);
        };
        window.addEventListener('keydown', keyPressHandler);
        return () => {
            window.removeEventListener('keydown', keyPressHandler);
        };
    }, [callback, key]);
};

export default OnMultiKeyEvent;
