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
        "relative overflow-hidden mb-5 h-full flex items-center justify-center",
        {
          "rounded-lg": isActive,
          "rounded-md h-min w-[200px] shadow-[0px_0px_11px_-1px_rgba(0,0,0,0.75)]": !isActive,        }
      )}
    >
      {playing && !hasError ? (
        <ReactPlayer
          url={url}
          muted={muted}
          playing={playing}
          width="100%"
          height="100%"
          onError={handleError}
        />
      ) : (
        <UserSquare2
          className="text-white"
          size={isActive ? 400 : 150}
        />
      )}

      {!isActive && (
        muted ? (
          <MicOff className="text-white absolute right-2 bottom-2" size={20} />
        ) : (
          <Mic className="text-white absolute right-2 bottom-2" size={20} />
        )
      )}
    </div>
  );
};

export default Player;