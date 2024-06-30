import Image from "next/image";
import Send from "./Frames/Send"
import SideBar from "./Frames/SideBar";

export default function Home() {
  return (
    <div className="flex flex-row-reverse h-full w-span">
      <SideBar></SideBar>
      <div></div>
      <Send></Send>
    </div>
  );
}
