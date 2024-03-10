import React, { useState } from 'react';
import './AlertN.css'

export default function AlertN() {

    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <>
            <div>
                {isVisible && (
                    <div className="notification-bar">
                        <span className="notification-message">This is a notification message!</span>
                        <button className="close-button" onClick={handleClose}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
