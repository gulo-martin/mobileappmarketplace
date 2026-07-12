"use client"

import React, { useCallback, useEffect, useState } from 'react'
import BGImage from "@/public/home.jpg"
import Image from 'next/image';
import { useAuth } from '@/app/hooks/AuthContext';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { db, storage } from '@/app/lib/firebase';
import { 
  BellIcon, 
  UserGroupIcon, 
  ShoppingBagIcon, 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShoppingCartIcon,
  FireIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

type ProductSummary = {
    id: string;
    name: string;
    category: string;
    price: number;
    stock?: number;
    imageUrl?: string;
    images?: string[] | string;
    isActive?: boolean;
    createdAt?: { seconds: number } | null;
    soldCount?: number;
    unitsSold?: number;
    salesCount?: number;
    sold?: number;
    quantitySold?: number;
};

function HomeScreen() {
    const { user } = useAuth();
    const [recentProducts, setRecentProducts] = useState<ProductSummary[]>([]);
    const [productStats, setProductStats] = useState({
        totalProducts: 0,
        activeProducts: 0,
        inventoryValue: 0,
        productsSold: 0,
        bestSeller: 'No sales yet',
    });
    const [erroredImages, setErroredImages] = useState<Record<string, boolean>>({});
    const [resolvedImageUrls, setResolvedImageUrls] = useState<Record<string, string>>({});

    const normalizeImageUrl = (raw?: string) => {
        if (!raw) return "";
        const s = raw.trim();
        if (!s) return "";
        if (s.startsWith("//")) return `https:${s}`;
        if (/^https?:\/\//i.test(s)) return s;
        if (/^[^/]+\.[^/]+/.test(s)) return `https://${s}`;
        return s;
    };

    const getRawFirstImage = useCallback((product: ProductSummary) => {
        if (typeof product.imageUrl === "string" && product.imageUrl.trim()) {
            return normalizeImageUrl(product.imageUrl);
        }

        if (!product.images) return "";
        if (Array.isArray(product.images)) {
            if (!product.images.length) return "";
            return normalizeImageUrl(product.images[0]);
        }
        const parsed = product.images
            .split(",")
            .map((url) => url.trim())
            .filter(Boolean);
        return normalizeImageUrl(parsed[0] ?? "");
    }, []);

    const resolveGsUrl = async (raw: string) => {
        if (!raw || !raw.startsWith("gs://")) return raw;

        try {
            return await getDownloadURL(ref(storage, raw));
        } catch (err) {
            console.error("Failed to resolve gs:// URL:", raw, err);
            return "";
        }
    };

    const getFirstImage = useCallback((product: ProductSummary) => {
        const raw = getRawFirstImage(product);
        if (!raw) return "";
        if (raw.startsWith("gs://")) {
            return resolvedImageUrls[product.id] || "";
        }
        return raw;
    }, [getRawFirstImage, resolvedImageUrls]);

    useEffect(() => {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const products = snapshot.docs.slice(0, 5).map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<ProductSummary, 'id'>),
            })) as ProductSummary[];

            const totalProducts = snapshot.size;
            const activeProducts = snapshot.docs.filter((doc) => {
                const data = doc.data() as { isActive?: boolean };
                return data.isActive === true;
            }).length;
            const inventoryValue = snapshot.docs.reduce((sum, doc) => {
                const data = doc.data() as { price?: number; stock?: number };
                return sum + ((data.price ?? 0) * (data.stock ?? 0));
            }, 0);

            const salesSummary = snapshot.docs.reduce((summary, doc) => {
                const data = doc.data() as { name?: string; soldCount?: number; unitsSold?: number; salesCount?: number; sold?: number; quantitySold?: number; };
                const salesCandidates = [data.soldCount, data.unitsSold, data.salesCount, data.sold, data.quantitySold];
                let salesCount = 0;

                for (const candidate of salesCandidates) {
                    if (typeof candidate === 'number' && Number.isFinite(candidate) && candidate >= 0) {
                        salesCount = candidate;
                        break;
                    }

                    if (typeof candidate === 'string') {
                        const parsed = Number(candidate);
                        if (Number.isFinite(parsed) && parsed >= 0) {
                            salesCount = parsed;
                            break;
                        }
                    }
                }

                summary.productsSold += salesCount;

                if (salesCount > summary.bestSellerSales) {
                    summary.bestSellerSales = salesCount;
                    summary.bestSellerName = data.name || 'Unknown product';
                }

                return summary;
            }, { productsSold: 0, bestSellerSales: -1, bestSellerName: 'No sales yet' });

            setRecentProducts(products);
            setProductStats({
                totalProducts,
                activeProducts,
                inventoryValue,
                productsSold: salesSummary.productsSold,
                bestSeller: salesSummary.bestSellerSales > 0 ? salesSummary.bestSellerName : 'No sales yet',
            });
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const productsNeedingResolution = recentProducts.filter((product) => {
            const raw = getRawFirstImage(product);
            return raw.startsWith("gs://") && !resolvedImageUrls[product.id];
        });

        if (productsNeedingResolution.length === 0) return;

        let active = true;
        const loadUrls = async () => {
            const resolved: Record<string, string> = {};
            await Promise.all(
                productsNeedingResolution.map(async (product) => {
                    const raw = getRawFirstImage(product);
                    const url = await resolveGsUrl(raw);
                    if (url) {
                        resolved[product.id] = url;
                    }
                })
            );
            if (!active) return;
            setResolvedImageUrls((prev) => ({ ...prev, ...resolved }));
        };

        loadUrls();
        return () => {
            active = false;
        };
    }, [recentProducts, resolvedImageUrls, getRawFirstImage]);

    const stats = [
        {
            title: 'Total Products',
            value: productStats.totalProducts.toString(),
            trend: 'up',
            icon: ShoppingBagIcon,
            color: 'purple'
        },
        {
            title: 'Inventory Value',
            value: `MK${productStats.inventoryValue.toLocaleString()}`,
            trend: 'up',
            icon: CurrencyDollarIcon,
            color: 'green'
        },
        {
            title: 'Products Sold',
            value: productStats.productsSold.toString(),
            trend: 'up',
            icon: ShoppingCartIcon,
            color: 'blue'
        },
        {
            title: 'Best Seller',
            value: productStats.bestSeller,
            trend: 'up',
            icon: FireIcon,
            color: 'pink'
        },
        {
            title: 'Total Users',
            value: user ? '1' : '0',
            trend: 'down',
            icon: UserGroupIcon,
            color: 'orange'
        },
    ];

    const router = useRouter();

    return (
        <div className="w-[95%] mx-auto h-full overflow-y-auto pb-8">
            {/* Welcome Banner */}
            <div className="relative w-full rounded-b-2xl overflow-hidden mb-6">
                <div className="relative h-70 md:h-65 w-full">
                    <Image 
                        src={BGImage} 
                        className="h-full w-full object-cover" 
                        alt="Dashboard banner"
                        priority
                    />
                    
                    {/* Gradient Overlay - Improved */}
                    <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-blue-600/40"></div>
                    
                    {/* Content */}
                    <div className="absolute  inset-0 flex flex-col justify-between p-6 md:p-10">
                        <div className="flex justify-end items-start gap-3">
                            <button className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors relative">
                                <BellIcon className="w-5 h-5 text-white" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                                    3
                                </span>
                            </button>
                            <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-400 to-purple-400 animate-pulse"></div>
                        </div>

                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                                Welcome back, <br className="sm:hidden" />
                                <span className="bg-linear-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                                    {user?.displayName || user?.email?.split('@')[0] || 'User'}
                                </span>
                            </h1>
                            <p className="text-white/80 text-sm md:text-base max-w-xl leading-relaxed">
                                Here&apos;s what&apos;s happening with your marketplace today. Track your sales, manage products, and grow your business.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    const colorClasses = {
                        blue: 'bg-blue-50 text-blue-600 border-blue-200',
                        purple: 'bg-purple-50 text-purple-600 border-purple-200',
                        green: 'bg-green-50 text-green-600 border-green-200',
                        orange: 'bg-orange-50 text-orange-600 border-orange-200',
                        pink: 'bg-pink-50 text-pink-600 border-pink-200',
                    };
                    const borderColor = {
                        blue: 'hover:border-blue-300',
                        purple: 'hover:border-purple-300',
                        green: 'hover:border-green-300',
                        orange: 'hover:border-orange-300',
                        pink: 'hover:border-pink-300',
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
                                    <Icon className="w-6 h-6" />
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
                            <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{stat.value}</h3>
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
                        <h2 className="text-lg font-semibold text-gray-900">Recently Added Products</h2>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View All
                        </button>
                    </div>
                    <div className="space-y-4">
                        {recentProducts.length === 0 ? (
                            <p className="text-sm text-gray-500">No products added yet.</p>
                        ) : (
                            recentProducts.map((product) => (
                                <div key={product.id} className="flex items-center gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-gray-100">
                                        {getFirstImage(product) && !erroredImages[product.id] ? (
                                            <Image
                                                src={getFirstImage(product)}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                onError={() => setErroredImages((p) => ({ ...p, [product.id]: true }))}
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs font-semibold text-gray-400">
                                                IMG
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-800">
                                            <span className="font-medium">{product.name}</span>
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {product.category} • MK{product.price.toLocaleString()} • {product.isActive ? 'Active' : 'Inactive'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <button onClick={()=>{ router.push('/dashboard/products')}}  className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group">
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

            {/* bottom-text */}
            <div className="mt-8 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} ZipMarketPlace. All rights reserved.
            </div>
        </div>
    )
}

export default HomeScreen