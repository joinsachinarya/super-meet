import cx from "classnames";
import { Mic, Video, Phone, MicOff, VideoOff } from "lucide-react";

type RoomFooterProps = {
    muted: boolean;
    playing: boolean;
    toggleAudio: () => void;
    toggleVideo: () => void;
    leaveRoom: () => void;
}


const RoomFooter = ({ muted, playing, toggleAudio, toggleVideo, leaveRoom }: RoomFooterProps) => {
        console.log(muted, playing);

    return (
        <div className={'flex justify-around items-center fixed bottom-6 w-[50%] mx-auto'}>
            {muted ? (
                <MicOff
                    className={cx(' cursor-pointer')}
                    size={55}
                    onClick={toggleAudio}
                />
            ) : (
                <Mic className={'cursor-pointer'} size={55} onClick={toggleAudio} />
            )}
            {playing ? (
                <Video className={'cursor-pointer'} size={55} onClick={toggleVideo} />
            ) : (
                <VideoOff
                    className={cx('cursor-pointer')}
                    size={55}
                    onClick={toggleVideo}
                />
            )}
            <Phone size={55} className={'cursor-pointer'} onClick={leaveRoom} />
        </div>
    );
};

export default RoomFooter;