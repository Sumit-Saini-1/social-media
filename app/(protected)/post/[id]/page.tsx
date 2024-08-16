"use client"
import UserContext from "@/context/user/userContext";
import { Popconfirm } from "antd";
import mongoose from "mongoose";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { TfiComment } from "react-icons/tfi";

interface IPost {
    _id: mongoose.Types.ObjectId
    caption: string,
    image: string
    likedBy: string[]
    likes: number
    postId: mongoose.Types.ObjectId
    profile: string
    time: Date
    username: string

}

export default function PostDetail({ params }: { params: { id: string } }) {
    const [post, setPost] = useState<IPost>();
    const [isExpanded, setIsExpanded] = useState(false);
    const [likes, setLikes] = useState(post?.likes);
    const user = useContext(UserContext);
    const [liked, setLiked] = useState(post?.likedBy?.includes(user?.username));
    useEffect(() => {
        fetch("/api/posts/" + params.id).then(res => {
            if (res.status == 200) {
                return res.json();
            }
        }).then(post => {
            setPost(post);
            setLikes(post?.likes);
        });
    }, [params.id]);
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
                // console.log(post?.likedBy?.includes(json.username));
                setLiked(post?.likedBy?.includes(json.username) as boolean);
            });
        }
        else{
            setLiked(post?.likedBy?.includes(user.username) as boolean);
        }
    }, [post?.likedBy, user]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    function deletePost() {
        fetch("/api/posts/" + post?.postId, {
            method: "DELETE",
        }).then(res => {
            if (res.ok) {
                // Post.removePost(props.postId);
            }
            else {
                alert("Something went wrong");
            }
        }).catch(err => {
            alert("Something went wrong");
        })
    }

    function handleLike() {
        fetch("/api/posts/like", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                postId: post?.postId,
                likedBy: user?.username,
            }),
        }).then((res) => res.json()).then((json) => {
            if (json.success) {
                // alert(json.success);
                if (liked) {
                    setLikes(likes as number - 1);
                }
                else {
                    setLikes(likes as number + 1);
                }
                setLiked(!liked);
            } else {
                alert("Something went wrong");
            }
        }).catch((err) => {
            alert("Something went wrong\n" + err.message);
        });
    }

    return (
        <div className="w-full md:w-1/2 mx-auto">
            <div className="flex flex-col w-full gap-2 p-2 shadow-sm shadow-gray-300">
                {/* User Info */}
                <div className="flex items-center gap-2">
                    <Image src={post?.profile as string} className="rounded-full" alt="profile" width={32} height={32} />
                    <div className="flex justify-between w-full">
                        <div className="font-bold">{post?.username}</div>
                        <div className="text-gray-500 text-sm">{new Date(post?.time as Date).toLocaleDateString()}</div>
                    </div>
                </div>

                {/* Post Image */}
                <div>
                    <Image src={post?.image as string} className="rounded-md w-full" alt="post" layout="responsive" width={300} height={300} />
                </div>

                {/* Caption */}
                <div className="flex flex-col">
                    <div className={`text-sm ${isExpanded ? '' : 'line-clamp-2'}`}>
                        {post?.caption}
                    </div>
                    {post?.caption?.length as number > 100 && (
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
                        user.username ===post?.username ?
                            <Popconfirm title="Delete the task" okText="Yes" cancelText="No" onConfirm={deletePost} description="Are you sure you want to delete this post?">
                                <MdDelete title="Delete" className="text-red-500 cursor-pointer" />
                            </Popconfirm>
                            : <div></div>
                    }
                </div>
                {/* LikedBy */}
                <div className="flex gap-2 text-sm text-gray-500 line-clamp-1 border-t border-gray-300 pt-2 pl-1 select-none">
                    Liked by:{
                        post?.likedBy?.map((username) => {
                            return (
                                <span key={username} >{username},</span>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
}