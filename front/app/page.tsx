import Image from "next/image";
import Send from "./Components/Send"

export default function Home() {
  return (
    <div className="flex flex-row-reverse h-full w-span">
      <div></div>
      <Send></Send>
    </div>
  );
}
