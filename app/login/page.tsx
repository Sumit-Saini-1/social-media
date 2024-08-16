"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Renders the login page component.
 *
 * @return {JSX.Element} The rendered login page.
 */
export default function Login(): JSX.Element {
    const userDetails: { emailOrUsername: string; password: string } = {
        emailOrUsername: "",
        password: "",
    }
    const [error, setError] = useState('');
    const router=useRouter();
    async function handleLogin(e: React.MouseEvent<HTMLInputElement, MouseEvent>) {
        e.preventDefault();
        if (!userDetails.emailOrUsername || !userDetails.password) {
            alert("Enter email and password");
            return;
        }

        const result = await signIn('credentials', {
            redirect: false,
            emailOrUsername: userDetails.emailOrUsername,
            password: userDetails.password,
        });

        if (result?.error) {
            setError(result.error);
        } else {
            router.push('/'); 
        }
    }
    return (
        <div className="flex flex-col md:flex-row py-5 px-5 sm:px-10 md:px-20 min-h-screen items-center justify-center">
            {/* Left Section: Image */}
            <div className="hidden md:flex w-full md:w-1/2 h-full justify-end pl-10">
                <Image
                    src="/instaLogin.png"
                    alt="Instagram login illustration"
                    width={300}
                    height={290}
                    className="rounded-md m-4"
                />
            </div>

            {/* Right Section: Login Form */}
            <div className="w-full md:w-1/2 h-full md:h-auto px-5 md:px-10 flex flex-col justify-center">
                <div className="flex border border-gray-300 rounded-md flex-col justify-evenly py-10 md:py-8 h-full">
                    <div className="flex items-center justify-center w-full min-h-20 mb-6">
                        <h1 className="text-5xl sm:text-6xl font-bold text-gray-800" style={{ fontFamily: 'Pacifico, cursive' }}>
                            Instagram
                        </h1>
                    </div>
                    <div className="flex flex-col items-center gap-4 justify-center">
                        <input onChange={(e) => userDetails.emailOrUsername = e.target.value.toLowerCase()} type="text" className="w-3/4 bg-gray-100 border border-gray-300 rounded-md px-4 py-2" placeholder="Phone number, username, or email" />
                        <input onChange={(e) => userDetails.password = e.target.value} type="password" placeholder="Password" className="w-3/4 bg-gray-100 border border-gray-300 rounded-md px-4 py-2" />
                        <input onClick={handleLogin} type="submit" value="Log in" className="w-3/4 bg-blue-500 text-white font-bold rounded-md px-4 py-2 cursor-pointer" />
                        {error && <p className="text-red-500">{error}</p>}
                        <div className="flex items-center w-3/4 px-8">
                            <hr className="flex-grow border-t border-gray-300" />
                            <span className="px-3 text-md text-gray-500">OR</span>
                            <hr className="flex-grow border-t border-gray-300" />
                        </div>
                        <div>
                            <Link href="#" className="text-blue-500">Forgot password?</Link>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center p-4 mt-4 border border-gray-300">
                    Don&apos;t have an account? <Link className="text-blue-500 ml-2" href="/signup">Sign up</Link>
                </div>

                <div className="flex flex-col items-center justify-center mt-4">
                    <div>Get the app.</div>
                    <div className="flex items-center justify-center mt-2 space-x-4">
                        <Image src="/playstore.png" className="cursor-pointer" width={150} height={50} alt="Google Play Store" />
                        <Image src="/microsoft.png" width={150} height={50} alt="Microsoft Store" className="rounded-md cursor-pointer" />
                    </div>
                </div>
            </div>
        </div>
    );
}
