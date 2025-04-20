'use client'

import Player from "../component/Player";
import Bottom from "../component/Bottom";
import CopySection from "../component/CopySection";
import useRoom from "../views/room/use-room";

const Room: React.FC = () => {
    const { players, playerHighlighted, nonHighlightedPlayers, leaveRoom, toggleAudio, toggleVideo, roomId } = useRoom();

    return (
        <>
            <div className="w-full h-full">
                {playerHighlighted ? (
                    <Player
                        url={playerHighlighted.url}
                        muted={playerHighlighted.muted}
                        playing={playerHighlighted.playing}
                        isActive
                    />
                ) : (
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">Loading stream...</div>
                )}
            </div>
            <div className="w-full h-full">
                {Object.keys(nonHighlightedPlayers).map((playerId) => {
                    const { url, muted, playing } = nonHighlightedPlayers[playerId];
                    console.log("url", url, muted, playing);
                    return (
                        <Player
                            key={playerId}
                            url={url}
                            muted={muted}
                            playing={playing}
                            isActive={false}
                        />
                    );
                })}
            </div>
            <CopySection roomId={roomId as string} />
            <Bottom
                muted={playerHighlighted?.muted || false}
                playing={playerHighlighted?.playing || false}
                toggleAudio={toggleAudio}
                toggleVideo={toggleVideo}
                leaveRoom={leaveRoom}
            />
        </>
    );
};

export default Room;
