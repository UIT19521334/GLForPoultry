import React from 'react';

export const OnKeyEvent = (callback, key) => {
    React.useEffect(() => {
        const keyPressHandler = (event) => {
            if (event.key === key) {
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
