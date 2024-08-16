import NewPost from "@/components/newPost";
import { Modal } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { FaRegSquarePlus } from "react-icons/fa6";
import { FiMenu } from "react-icons/fi";
import { MdHomeFilled } from "react-icons/md";

export default function Sidebar() {
    const [uploadMdal, setUploadMdal] = useState<boolean>(false);
    const router = useRouter();
    
    return (

        <div className="hidden md:block w-1/3 border-r border-gray-300 h-full">
            <div className="flex items-center ml-8 w-full min-h-20">
                <h1 className="text-3xl sm:text-3xl font-bold text-gray-800" style={{ fontFamily: 'Pacifico, cursive' }}>
                    Instagram
                </h1>
            </div>
            <div className="flex flex-col gap-5 w-full h-fit">
                <div className="flex gap-2 items-center ml-8 cursor-pointer " onClick={() => router.push("/")}><MdHomeFilled className="text-2xl" /> Home</div>
                {/* <div className="flex gap-2 items-center ml-8 cursor-pointer" ><IoSearch className="text-2xl" /> Search</div> */}
                {/* <div className="flex gap-2 items-center ml-8 cursor-pointer" ><MdOutlineExplore className="text-2xl" /> Explore</div> */}
                {/* <div className="flex gap-2 items-center ml-8 cursor-pointer"><BiMoviePlay className="text-2xl" /> Reels</div> */}
                {/* <div className="flex gap-2 items-center ml-8 cursor-pointer"><BiMessageRoundedDetail className="text-2xl" /> Messsage</div> */}
                <div className="flex gap-2 items-center ml-8 cursor-pointer" onClick={() => router.push("/notification")} ><FaRegHeart className="text-2xl" /> Notification</div>
                <div onClick={() => {
                    setUploadMdal(true);
                }} className="flex gap-2 items-center ml-8 cursor-pointer"><FaRegSquarePlus className="text-2xl" /> Create</div>
                {/* <div className="flex gap-2 items-center ml-8 cursor-pointer"><Image src="/profile.png" alt="profile" width={32} height={32} className="rounded-full" /> Profile</div> */}
            </div>
            <div className="flex gap-2 items-center ml-8 cursor-pointer w-full min-h-20 mt-4">
                <FiMenu className="text-2xl" /> More
            </div>
            <Modal title="Create Post" maskClosable={true} footer={null} open={uploadMdal} onOk={() => setUploadMdal(false)} onCancel={() => setUploadMdal(false)} >
                <NewPost setUploadMdal={setUploadMdal} />
            </Modal>
        </div>
    );
}