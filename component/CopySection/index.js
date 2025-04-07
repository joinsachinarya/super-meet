import { CopyToClipboard } from "react-copy-to-clipboard";
import { Copy } from "lucide-react";


const CopySection = (props) => {
  const { roomId } = props;

  return (
    <div className="flex flex-col absolute text-white border border-white rounded p-2 left-[30px] bottom-[100px]">
      <hr className="my-1" />
      <div className="text-base">Copy Room ID:</div>
      <div className="flex items-center text-sm">
        <span>{roomId}</span>
        <CopyToClipboard text={roomId}>
          <Copy className="ml-3 cursor-pointer" />
        </CopyToClipboard>
      </div>
    </div>
  );
};

export default CopySection;