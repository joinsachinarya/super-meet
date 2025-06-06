import ReactPlayer from "react-player";
import cx from "classnames";
import { Mic, MicOff, UserSquare2 } from "lucide-react";
import React from "react";

const Player = (props) => {
  const { url, muted, playing, isActive } = props;
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    setHasError(true);
  };
  console.log(!hasError, playing);
  return (
    <div
      className={cx(
        " relative overflow-hidden mb-5 flex items-center justify-center bg-black/70 rounded-2xl",
        "w-full",
        isActive
          ? "max-w-[700px] max-h-[60vh] min-h-[200px] md:min-h-[400px] mx-auto"
          : "max-w-[95vw] max-h-[40vh] min-h-[120px] md:min-h-[200px] mx-auto my-2"
      )}
      style={{ aspectRatio: isActive ? '16/9' : '4/3' }}
    >
      {playing && !hasError ? (
        <ReactPlayer
          url={url}
          muted={muted}
          playing={playing}
          width="100%"
          height="100%"
          className="rounded-2xl"
          onError={handleError}
        />
      ) : (
        <UserSquare2
          className="text-white"
          size={isActive ? (window.innerWidth < 768 ? 180 : 400) : (window.innerWidth < 768 ? 60 : 150)}
        />
      )}

      {!isActive && (
        muted ? (
          <MicOff className="text-white absolute right-2 bottom-2" size={window.innerWidth < 768 ? 14 : 20} />
        ) : (
          <Mic className="text-white absolute right-2 bottom-2" size={window.innerWidth < 768 ? 14 : 20} />
        )
      )}
    </div>
  );
};

export default Player;