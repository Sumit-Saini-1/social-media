"use client";
import React from "react";

interface InputProps {
    placeholder?: string;
    type?: string;
    className?: string;
    onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function CInput({
    placeholder = "Enter here",
    type = "text",
    className = "w-full sm:w-3/4 border border-gray-300 rounded-md py-2 px-4",
    onChange,
}: InputProps) {
    return (
        <input type={type} onChange={onChange} placeholder={placeholder} className={className} />
    );
}