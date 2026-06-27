import React from 'react'
import BGImage from "@/public/home.jpg"
import Image from 'next/image';
import { BellIcon } from '@heroicons/react/16/solid';

function page() {
  return (
    <div className="starting:opacity-0 w-[95%] mx-auto ease-in-out transition-all delay-200">
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
                               Products Dashboard
                                
                            </h1>
                            <p className="text-white/80 text-sm md:text-base max-w-xl leading-relaxed">
                                View products simle and easy. You can manage your products, add new ones, and keep track of your inventory all in one place.
                            </p>
                        </div>
                    </div>
                </div>
        </div>
    </div>
  )
}

export default page