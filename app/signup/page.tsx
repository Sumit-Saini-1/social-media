"use client";
import CInput from "@/components/cinput";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useState } from "react";

interface IUser {
    email: string;
    name: string;
    username: string;
    password: string;
}

/**
 * Renders the sign up form for Instagram.
 *
 * @return {JSX.Element} The sign up form with input fields for mobile number, full name, username, password, and links to the terms, data policy, and cookies policy.
 */
export default function SignUp(): JSX.Element {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const [user, setUser] = useState<IUser>({email: '', name: '', username: '', password: ''});
    const router = useRouter();
    function handleSignUp(e: React.MouseEvent<HTMLInputElement, MouseEvent>) {
        e.preventDefault();
        if(!emailRegex.test(user.email)){
            alert('Enter a valid email');
            return;
        }
        if(user.name.trim()==''){
            alert('Enter your name');
            return;
        }
        if(user.username.trim()==''||user.username.length<5){
            if(user.username){
                alert('Enter a valid username. It should be atleast 4 characters long');
                return;
            }
            alert('Enter a valid username');
            return;
        }
        if(!passwordRegex.test(user.password)){
            alert('Enter a valid password. It should be atleast 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number');
            return;
        }
        fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        }).then((response)=>{
            if(response.status==200){
                alert('Sign up successful. Please login to continue');
                router.push('/login');
            }
            else if(response.status==409){
                alert('User already exists. Please login to continue');
                router.push('/login');
            }
            else{
                alert('Sign up failed. Please try again');
            }
        });
    }
    return (
        <div className="flex sm:px-10 md:px-20 min-h-screen justify-center items-center">
            <div className="sm:w-3/4 md:w-2/3 lg:w-1/3 my-5 px-5 py-5 flex flex-col items-center gap-4 rounded-md border border-gray-300">
                <div className="flex items-center justify-center w-full min-h-20">
                    <h1 className="text-5xl sm:text-6xl font-bold text-gray-800" style={{ fontFamily: 'Pacifico, cursive' }}>
                        Instagram
                    </h1>
                </div>
                <div className="text-gray-500 text-center p-2  sm:px-6">Sign up to see photos and videos from your friends</div>
                <button className="w-full sm:w-3/4 bg-blue-500 text-white font-bold rounded-md px-4 py-2 cursor-pointer">Log in with Facebook</button>
                <div className="flex items-center w-full px-2">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="px-3 text-md text-gray-500">OR</span>
                    <hr className="flex-grow border-t border-gray-300" />
                </div>
                <CInput placeholder="email address" onChange={(e)=>{setUser({...user, email:e.target.value.toLowerCase()})}} />
                <CInput placeholder="Full Name" onChange={(e)=>{setUser({...user, name:e.target.value})}} />
                <CInput placeholder="Username" onChange={(e)=>{setUser({...user, username:e.target.value.toLowerCase()})}} />
                <CInput placeholder="Password" type="password" onChange={(e)=>{user.password=e.target.value}} />
                <div className="text-gray-500 text-sm text-center py-2 px-4">
                    By signing up, you agree to our <Link href="#">Terms</Link>, <Link href="#">Data Policy</Link> and <Link href="#">Cookies Policy</Link>
                </div>
                <input type="submit" onClick={handleSignUp} value="Sign up" className="w-full sm:w-3/4 bg-blue-500 text-white font-bold rounded-md px-4 py-2 cursor-pointer" />
            </div>
        </div>
    );
}
