"use client";
import { INotification } from "@/models/Notification";
import { useEffect, useState } from "react"

export default function Notification() {
    const [notifications, setNotifications] = useState<INotification[]>([]);
    useEffect(() => {
        fetch("/api/notifications").then(res => {
            if (!res.ok) {
                throw new Error("Failed to fetch notifications");
            }
            return res.json();
        }).then(json => {
            setNotifications(json.notifications);
        }).catch(err => {
            console.log(err)
        });
    }, [])
    return (
        <div className="w-full p-2">
            {
                notifications.map((notification, index) => {
                    if (!notification.seen) {
                        fetch("/api/notifications", {
                            method: "PATCH",
                            body: JSON.stringify({ id: notification._id }),
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }).then(res => {
                            if (!res.ok) {
                                throw new Error("Failed to fetch notifications");
                            }
                            return res.json();
                        }).then(json => {
                            console.log(json);
                        });
                    }
                    return (
                        <div className="ml-8 border-b pt-2 pb-2 select-none" key={index}>
                            {notification.username} {notification.type === "like" ? "liked your post" : "commented on your post"}
                        </div>
                    )
                })
            }
        </div>
    )
}