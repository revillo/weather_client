import React from 'react';

function LoadingIndicator()
{
    return(
        <svg className="spinner" viewBox="0 0 128 128">
            <circle className="spinner-circle" cx="64" cy="64" r="45"/>
        </svg>
    );
}

export default LoadingIndicator