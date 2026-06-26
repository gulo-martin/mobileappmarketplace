"use client"

import Image from 'next/image';
import React, { useState } from 'react'
import Pic from "@/public/home.jpg"
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  CreditCardIcon, 
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';


import { signOut } from 'firebase/auth'
import { auth } from '@/app/lib/firebase';

import { useAuth } from '@/app/hooks/AuthContext';


function MainLayout() {
    const [show, setShow] = useState<boolean>(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
    const pathname = usePathname()

    const { user } = useAuth();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Products', href: '/dashboard/products', icon: ShoppingBagIcon },
        { name: 'Payments', href: '/dashboard/payments', icon: CreditCardIcon },
        { name: 'My Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
    ]

    const isActive = (path: string) => pathname === path;
    const router = useRouter();

    return (
        <>
            {/* Mobile menu toggle button */}
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-gray-50 transition-colors"
            >
                {isMobileMenuOpen ? (
                    <XMarkIcon className="w-6 h-6 text-gray-700" />
                ) : (
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <div className={`
                left-section relative z-40 font-sans bg-white h-screen w-full lg:w-72 flex flex-col 
                ${isMobileMenuOpen ? 'fixed inset-y-0 left-0' : 'hidden lg:flex'}
                shadow-2xl lg:shadow-lg transition-all duration-300 ease-in-out
            `}>
                {/* Header */}
                <Link 
                    href={'/dashboard'} 
                    className="header flex items-center gap-3 px-4 py-6 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">ZM</span>
                    </div>
                    <h1 className="text-xl font-bold">
                        <span className="text-blue-600">ZIP</span>
                        <span className="text-gray-800">MarketPlace</span>
                    </h1>
                </Link>

                <div className="flex-1 flex flex-col overflow-hidden px-3 py-4">
                    {/* Navigation */}
                    <nav className="flex-1 space-y-1.5 overflow-y-auto">
                        {navigation.map((item) => {
                            const active = isActive(item.href)
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                                        transition-all duration-200 group relative
                                        ${active 
                                            ? 'bg-blue-50 text-blue-700 shadow-sm' 
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                                        }
                                    `}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <item.icon className={`
                                        w-5 h-5 transition-colors
                                        ${active ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}
                                    `} />
                                    <span className="flex-1">{item.name}</span>
                                    {active && (
                                        <span className="absolute right-2 w-1.5 h-6 bg-blue-600 rounded-full" />
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Profile Section */}
                    <div className="relative mt-4 pt-4 border-t border-gray-200">
                        {/* Dropdown */}
                        {show && (
                            <div className="absolute -top-30 right-0 left-0 mx-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20">
                                <div className="py-2">
                                    <Link 
                                        href={'/dashboard/settings'} 
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                        onClick={() => {
                                            setShow(false)
                                            setIsMobileMenuOpen(false)
                                        }}
                                    >
                                        <UserCircleIcon className="w-5 h-5" />
                                        <span>Profile Settings</span>
                                    </Link>
                                    <button 
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                                        onClick={() => {
                                            // Handle logout
                                            setShow(false)
                                        }}
                                    >
                                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                        <span onClick={()=> {signOut(auth); router.push('/')}}>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        <div 
                            onClick={() => setShow(!show)} 
                            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                        >
                            <div className="relative flex-shrink-0">
                                <Image 
                                    src={Pic} 
                                    className="w-11 h-11 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-colors" 
                                    alt="Profile" 
                                />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-sm font-semibold text-gray-800 truncate">{user?.displayName || user?.email || 'User'}</h1>
                                <p className="text-xs text-gray-500">Super Admin</p>
                            </div>
                            <ChevronDownIcon className={`
                                w-4 h-4 text-gray-400 transition-transform duration-200
                                ${show ? 'rotate-180' : ''}
                            `} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MainLayout