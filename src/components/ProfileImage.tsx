import { Profile } from "next-auth";
import Image from "next/image";

type ProfileIamgeProps = {
  src?: string | null;
  className?: string;
};

export function ProfileImage({ src, className = "" }: ProfileIamgeProps) {
  return (
    <div
      className={`relative h-12 w-12 overflow-hidden rounded-full ${className}`}
    >
      (src == null ? null :{" "}
      <Image src={src} alt="Profile image" quality={100} fill />)
    </div>
  );
}
