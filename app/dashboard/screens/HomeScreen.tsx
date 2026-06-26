"use client"

import React from 'react'
import BGImage from "@/public/home.jpg"
import Image from 'next/image';
import { useAuth } from '@/app/hooks/AuthContext';
import { 
  BellIcon, 
  UserGroupIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

function HomeScreen() {
    const { user } = useAuth();
    
    // Mock data - replace with actual data
    const stats = [
        { 
            title: 'Active Products', 
            value: '247', 
            trend: 'up',
            color: 'blue'
        },
        { 
            title: 'Total Products', 
            value: '1,284', 
            trend: 'up',
            color: 'purple'
        },
        { 
            title: 'Revenue', 
            value: 'MK400,008,392', 
            trend: 'up',
            color: 'green'
        },
        { 
            title: 'Total Users', 
            value: '3,842', 
            trend: 'down',
            icon: UserGroupIcon,
            color: 'orange'
        },
    ];

    const recentActivity = [
        { user: 'Mike Johnson', action: 'updated', item: 'Product Pricing', time: '1 hour ago' },
    ];

    return (
        <div className="w-[95%] mx-auto h-full overflow-y-auto pb-8">
            {/* Welcome Banner */}
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
                                Welcome back, <br className="sm:hidden" />
                                <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                                    {user?.displayName || user?.email?.split('@')[0] || 'User'}
                                </span>
                            </h1>
                            <p className="text-white/80 text-sm md:text-base max-w-xl leading-relaxed">
                                Here's what's happening with your marketplace today. Track your sales, manage products, and grow your business.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {stats.map((stat, index) => {
                    // const Icon = stat.icon;
                    const colorClasses = {
                        blue: 'bg-blue-50 text-blue-600 border-blue-200',
                        purple: 'bg-purple-50 text-purple-600 border-purple-200',
                        green: 'bg-green-50 text-green-600 border-green-200',
                        orange: 'bg-orange-50 text-orange-600 border-orange-200',
                    };
                    const borderColor = {
                        blue: 'hover:border-blue-300',
                        purple: 'hover:border-purple-300',
                        green: 'hover:border-green-300',
                        orange: 'hover:border-orange-300',
                    };

                    return (
                        <div 
                            key={index}
                            className={`
                                bg-white p-6 rounded-2xl shadow-sm border border-gray-100 
                                hover:shadow-md hover:scale-[1.02] transition-all duration-200
                                ${borderColor[stat.color as keyof typeof borderColor]}
                            `}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`
                                    p-3 rounded-xl ${colorClasses[stat.color as keyof typeof colorClasses]}
                                `}>
                                    {/* <Icon className="w-6 h-6" /> */}
                                </div>
                                <div className={`
                                    flex items-center gap-1 text-xs font-medium
                                    ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}
                                `}>
                                    {stat.trend === 'up' ? (
                                        <ArrowTrendingUpIcon className="w-3 h-3" />
                                    ) : (
                                        <ArrowTrendingDownIcon className="w-3 h-3" />
                                    )}
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
                                    {activity.user.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-800">
                                        <span className="font-medium">{activity.user}</span>
                                        <span className="text-gray-500"> {activity.action} </span>
                                        <span className="font-medium text-gray-700">{activity.item}</span>
                                    </p>
                                    <p className="text-xs text-gray-400">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500 rounded-lg text-white group-hover:scale-110 transition-transform">
                                    <ShoppingBagIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Add New Product</p>
                                    <p className="text-xs text-gray-500">List a new item</p>
                                </div>
                            </div>
                        </button>
                        <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500 rounded-lg text-white group-hover:scale-110 transition-transform">
                                    <CurrencyDollarIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">View Analytics</p>
                                    <p className="text-xs text-gray-500">Check your stats</p>
                                </div>
                            </div>
                        </button>
                        <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-xl transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-500 rounded-lg text-white group-hover:scale-110 transition-transform">
                                    <UserGroupIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Manage Users</p>
                                    <p className="text-xs text-gray-500">View all members</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomeScreen