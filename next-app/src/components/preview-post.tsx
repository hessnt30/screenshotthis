import { Heart } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CldImage } from "next-cloudinary";

interface PreviewPostProps {
  imageURL: string;
  width: number;
  height: number;
}

export default function PreviewPost({
  imageURL,
  width,
  height,
}: PreviewPostProps) {
  return (
    <div className="relative w-full">
      {/* Image */}
      <CldImage src={imageURL} alt="Preview" width={width} height={height} />

      {/* Header */}
      <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-black/60 to-transparent p-3 flex justify-between text-white z-10">
        <div className="flex flex-row items-center">
          <Avatar>
            <AvatarImage src="https://lh3.googleusercontent.com/a/ACg8ocKODFZbJbQIndpIBSUcVyx-qoCrtM2EzmNQ3PYo1yWp1D0J_QFi=s96-c" />
            <AvatarFallback>NH</AvatarFallback>
          </Avatar>
          <span className="ml-1">nicknats</span>
        </div>
        <div className="flex flex-row items-center">
          <Heart />
          <span className="ml-1">4</span>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-3 text-white z-10">
        <span>your computer setup</span>
      </div>
    </div>
  );
}
