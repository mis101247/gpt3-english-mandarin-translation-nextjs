import Link from "next/link";
import Chat from "../components/Chat";

const IndexPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800 p-10">
      <Chat />
    </div>
  );
};

export default IndexPage;
