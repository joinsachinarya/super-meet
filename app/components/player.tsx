import React from 'react'
import ReactPlayer from "react-player/lazy"

const Player = ({url}: {url: string}) => {
    return (
        <div className=''>
            <ReactPlayer
                url={url}
                playing={true}  
                width="100%"
                height="100%"
                style={{ borderRadius: "1rem" }}
                controls
            />
        </div>
    )
}

export default Player