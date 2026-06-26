"use client"
import React from 'react'
import BGImage from "@/public/home.jpg"
import Image from 'next/image';
import Pic from "@/public/home.jpg"

import { useAuth } from '@/app/hooks/AuthContext';
import { BellIcon } from '@heroicons/react/16/solid';


function page() {
    const  user  = useAuth();
  return (
    <div className="starting:opacity-0 w-[95%] mx-auto flex flex-col min-h-screen ease-in-out transition-all delay-200">
        <div className="flex flex-1 h-full  w-full  flex-col">
            {/* image-banner */}
           <div className="relative w-full rounded-b-2xl overflow-hidden mb-6">
                <div className="relative h-[280px] md:h-[320px] w-full">
                    <Image 
                        src={BGImage} 
                        className="h-full w-full object-cover" 
                        alt="Dashboard banner"
                        priority
                    />
                    
                    {/* Gradient Overlay - Improved */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-blue-600/40"></div>
                    
                    {/* Content */}
                    <div className="absolute  inset-0 flex flex-col justify-between p-6 md:p-10">
                        <div className="flex justify-end items-start gap-3">
                            <button className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors relative">
                                <BellIcon className="w-5 h-5 text-white" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                                    3
                                </span>
                            </button>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse"></div>
                        </div>

                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                               My Settings
                                
                            </h1>
                            <p className="text-white/80 text-sm md:text-base max-w-xl leading-relaxed">
                                Manage your account settings and preferences.
                            </p>
                        </div>
                    </div>
                </div>
        </div>

            <div  className="profile  h-full w-[60%] ml-3 border-2 p-5 border-slate-200 bg-white   cursor-pointer mt-2 shadow-2xs flex justify-start items-center gap-3 select-none">
                <Image src={Pic} className=" w-35 h-35 rounded-full object-cover"  alt="image" />
                <div className="text w-full flex flex-col h-full ">
                    <h1 className=" font-bold text-black">{user?.displayName || user?.email || 'User'}</h1>
                    <p className=" text-gray-500">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam mollitia optio aspernatur! Tempora, quaerat, nemo ipsa sapiente</p>
                    <p className=" mt-2 text-gray-900">Email: <span className=" text-green-500">Verified</span></p>
                    <p className=" px-5 py-2 mt-2 bg-blue-800 w-[40%] p-1 rounded-2xl text-center text-white font-bold">Super admin</p>
                </div>
            </div>

        </div>

        <p className=" text-sm w-full text-center p-2">&copy; {new Date().getFullYear()} Zipmarketplace - panda</p>


    </div>
  )
}

export default page