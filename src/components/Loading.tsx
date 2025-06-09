import { Loader2Icon } from "lucide-react";

const Loading = () => {
  return (
    <div className="w-full absolute top-0 left-0 h-full z-50 flex justify-center items-center bg-black/30">
      <Loader2Icon className="animate-spin" />
    </div>
  )
};

export default Loading;
