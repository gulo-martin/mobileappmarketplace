"use client";

import React from 'react';
import Image from 'next/image';
import BGImage from '@/public/home.jpg';
import Pic from '@/public/home.jpg';
import { useAuth } from '@/app/hooks/AuthContext';
import {
  BellIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  MoonIcon,
  BellAlertIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

function Page() {
  const { user } = useAuth();

  const accountDetails = [
    { label: 'Name', value: user?.displayName || user?.email?.split('@')[0] || 'User' },
    { label: 'Email', value: user?.email || 'No email available' },
    { label: 'Role', value: 'Super Admin' },
    { label: 'Status', value: 'Verified', highlight: true },
  ];

  const preferences = [
    { title: 'Dark mode', description: 'Use a darker theme for late-night work', icon: MoonIcon },
    { title: 'Email notifications', description: 'Get updates about new products and orders', icon: BellAlertIcon },
  ];

  return (
    <div className="mx-auto flex min-h-screen w-[95%] flex-col gap-6 py-4">
      <div className="relative overflow-hidden rounded-[28px]">
        <Image src={BGImage} alt="Settings banner" className="h-60 w-full object-cover" priority />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950/80 via-slate-900/55 to-blue-600/40" />
        <div className="absolute inset-0 flex flex-col justify-start items-center w-full h-full p-6 md:p-10">
          

          <div className=" w-full h-full flex flex-col justify-center items-start">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.35em] text-blue-200">Account settings</p>
            <h1 className="text-3xl font-bold text-white md:text-4xl">Manage your profile</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-200 md:text-base">
              Customize your workspace, secure your account, and keep your admin profile up to date.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-blue-100">
                <Image src={Pic} alt="Profile" fill className="object-cover w-full h-full" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  {user?.displayName || user?.email?.split('@')[0] || 'User'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Keep your profile polished and your admin workspace secure.
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600">
                  <CheckCircleIcon className="h-4 w-4" />
                  Verified account
                </div>
              </div>
            </div>
            <button className="rounded-2xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
              Edit profile
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {accountDetails.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className={`mt-1 font-semibold ${item.highlight ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-50 p-2.5 text-blue-600">
              <ShieldCheckIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Security</h3>
              <p className="text-sm text-slate-500">Protect your admin access</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <button className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              <span>Change password</span>
              <Cog6ToothIcon className="h-4 w-4 text-slate-400" />
            </button>
            <button className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              <span>Enable two-factor authentication</span>
              <ShieldCheckIcon className="h-4 w-4 text-slate-400" />
            </button>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="h-4 w-4 text-blue-500" />
                <span>We will send security updates to your email.</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800">Preferences</h3>
        <div className="mt-5 space-y-3">
          {preferences.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-white p-2 text-slate-600 shadow-sm">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.description}</p>
                  </div>
                </div>
                <button className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
                  On
                </button>
              </div>
            );
          })}
        </div>
      </section> */}

      <p className="pb-2 text-center text-sm text-slate-500">&copy; {new Date().getFullYear()} Zipmarketplace</p>
    </div>
  );
}

export default Page;