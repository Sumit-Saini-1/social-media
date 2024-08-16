import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { CiHeart } from "react-icons/ci";
import { TfiComment, TfiSave } from "react-icons/tfi";
import { MdDelete } from "react-icons/md";
import { Popconfirm } from "antd";
import UserContext from "@/context/user/userContext";
import { FaHeart } from "react-icons/fa";

export interface IPost {
    postId: string;
    username: string;
    profile: string;
    image: string;
    caption: string;
    likes: number;
    likedBy: string[];
    comments: number;
    time: string;
    removePost: (postId: string) => void;
}

/**
 * @param {IPost} props - The properties of the post.
 * @return {JSX.Element} The rendered post component.
 */
export default function Post(props: IPost): JSX.Element {
    const [isExpanded, setIsExpanded] = useState(false);
    const user = useContext(UserContext);
    const [liked, setLiked] = useState(props.likedBy?.includes(user?.username));
    const [likes, setLikes] = useState(props.likes);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    useEffect(() => {
        if (!user.username) {
            fetch("/api/user").then(res => {
                if (res.status == 200) {
                    return res.json();
                }
            }).then(json => {
                // console.log(json);
                user.setProfilePic(json.profilePic);
                user.setUsername(json.username);
                // console.log(props.likedBy?.includes(json.username));
                setLiked(props.likedBy?.includes(json.username));
            });
        }
    }, [props.likedBy, user]);

    function handleLike() {
        fetch("/api/posts/like", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                postId: props.postId,
                likedBy: user?.username,
            }),
        }).then((res) => res.json()).then((json) => {
            if (json.success) {
                // alert(json.success);
                if (liked) {
                    setLikes(likes - 1);
                }
                else {
                    setLikes(likes + 1);
                }
                setLiked(!liked);
            } else {
                alert("Something went wrong");
            }
        }).catch((err) => {
            alert("Something went wrong\n" + err.message);
        });
    }
    function deletePost() {
        fetch("/api/posts/" + props.postId, {
            method: "DELETE",
        }).then(res => {
            if (res.ok) {
                props.removePost(props.postId);
            }
            else {
                alert("Something went wrong");
            }
        }).catch(err => {
            alert("Something went wrong");
        })
    }

    return (
        <div className="flex flex-col w-full sm:w-1/2 md:w-1/3 gap-2 p-2 shadow-sm shadow-gray-300">
            {/* User Info */}
            <div className="flex items-center gap-2">
                <Image src={props.profile} className="rounded-full" alt="profile" width={32} height={32} />
                <div className="flex justify-between w-full">
                    <div className="font-bold">{props.username}</div>
                    <div className="text-gray-500 text-sm">{new Date(props.time).toLocaleDateString()}</div>
                </div>
            </div>

            {/* Post Image */}
            <div>
                <Image src={props.image} className="rounded-md w-full" alt="post" layout="responsive" width={300} height={300} />
            </div>

            {/* Caption */}
            <div className="flex flex-col">
                <div className={`text-sm ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {props.caption}
                </div>
                {props.caption.length > 100 && (
                    <button
                        className="text-blue-500 mt-1 text-sm self-start"
                        onClick={toggleExpand}
                    >
                        {isExpanded ? "See Less" : "See More"}
                    </button>
                )}
            </div>

            {/* Interaction Icons */}
            <div className="flex items-center justify-between py-2 px-2">
                <div className="flex gap-2 ">
                    {
                        liked ? <FaHeart className="cursor-pointer text-red-500" onClick={handleLike} /> : <CiHeart onClick={handleLike} className="cursor-pointer" />
                    }
                    <span className="text-sm text-gray-500">{likes}</span>
                </div>
                <TfiComment onClick={() => console.log("clicked")} className="cursor-pointer" />
                {/* <TfiSave onClick={() => console.log("clicked")} className="cursor-pointer" /> */}
                {
                    user.username === props.username ?
                        <Popconfirm title="Delete the task" okText="Yes" cancelText="No" onConfirm={deletePost} description="Are you sure you want to delete this post?">
                            <MdDelete title="Delete" className="text-red-500 cursor-pointer" />
                        </Popconfirm>
                        : <div></div>
                }
            </div>
            {/* LikedBy */}
            <div className="flex gap-2 text-sm text-gray-500 line-clamp-1 border-t border-gray-300 pt-2 pl-1 select-none">
                Liked by:{
                    props.likedBy?.map((username) => {
                        return (
                            <span key={username} >{username},</span>
                        );
                    })
                }
            </div>
        </div>
    );
}
