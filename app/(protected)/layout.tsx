"use client";
import RightPane from "@/components/rightPane";
import Sidebar from "@/components/sidebar";
import UserState from "@/context/user/userState";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <UserState>
                <div className="flex min-h-screen justify-between py-5 h-screen ">
                    <Sidebar />
                    <div className="w-full h-full">
                        {children}
                    </div>
                    <div className="hidden md:block border-l w-1/3">
                        <RightPane />
                    </div>
                </div>
            </UserState>
        </>
    );
}