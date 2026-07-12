"use client"

import Image from "next/image";
import BGImage from "@/public/home.jpg"
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from '@/app/lib/firebase';
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/16/solid";

export default function Home() {
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [confirm, setConfirm] = useState<boolean>(false);

  const router = useRouter();

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setConfirm(false);

      if (!email && !password) {
        setError("Please provide correct details");
        return;
      }

      if (!email) {
        setError("Please enter a valid email");
        return;
      }

      if (!password) {
        setError("Please enter your password");
        return;
      }

      const response = await signInWithEmailAndPassword(auth, email, password);

      if (response.user) {
        setConfirm(true);
        setEmail("");
        setPassword("");
        router.push("/dashboard");
      } else {
        setConfirm(false);
        setError("Wrong credentials");
      }
    } catch (err) {
      console.error(err);
      setConfirm(false);
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/invalid-email':
            setError('Enter a valid email address.');
            break;
          case 'auth/user-disabled':
            setError('This account has been disabled.');
            break;
          case 'auth/user-not-found':
            setError('No account found with this email.');
            break;
          case 'auth/wrong-password':
            setError('Incorrect password. Please try again.');
            break;
          case 'auth/too-many-requests':
            setError('Too many login attempts. Try again later.');
            break;
          default:
            setError('Login failed. Please check your email and password.');
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full starting:opacity-0 ease-in-out transition-all duration-300 grid grid-cols-1 md:grid-cols-2 min-h-screen items-start justify-center bg-zinc-50 font-sans ">

      {/* left-section */}
      <div className="w-full relative contain-content h-[20vh] md:h-[90vh] rounded-b-[10px] md:rounded-b-[100px]">
        <Image src={BGImage} className="w-full object-cover h-full" alt="image"/>
        <h1 className="z-20 absolute top-4 left-5 text-white backdrop-blur-sm p-3 rounded-xl text-sm font-bold">Zip Store</h1>
      </div>

      {/* right-section */}
      <div className="login overflow-x-hidden relative w-full bg-amber-500/0 flex flex-col justify-center items-center h-full">
          <p className=" absolute right-10 top-10  bg-blue-800 w-10 h-10 rounded-full"></p>

          {/* login-form */}
          <form onSubmit={handleFormSubmit} className=" w-[90%] md:w-[70%] border border-white starting:-mr-80 starting:opacity-0 transition-all delay-300 bg-white p-7 py-10 rounded-xl shadow-xl" >
            <h1 className=" text-4xl md:text-5xl font-bold text-gray-900">Welcome back</h1>

            <p className=" text-gray-600 text-sm md:text-base font-normal mt-4 leading-relaxed">
              Sign in to manage products, track sales, and keep your store organized in one place.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">Inventory</span>
              <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">Sales</span>
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">Secure</span>
            </div>

            <div className="input mt-5 w-full flex flex-col gap-4">

              <div className="input-field w-full">

                {/* error message */}
                {error && (
                  <p className=" bg-red-200 p-2 mb-2 rounded text-sm text-red-800 flex gap-2 justify-left items-center"><XCircleIcon className=" w-5"/> {error}</p>
                )}

                {/* confirm message */}
                {confirm && (
                  <p className=" bg-green-200 p-2 mb-2 rounded text-sm text-green-800 flex gap-2 justify-left items-center"><CheckCircleIcon className=" text-green-600 w-5"/>Login successfully</p>
                )} 

                <input value={email} onChange={(e)=> setEmail(e.target.value)} type="email" disabled={loading} className=" border-2 disabled:border-blue-50 border-blue-900/20 w-full p-3 rounded-3xl" placeholder="Email address" />
              </div>

              <div className="input-field w-full">
                <input value={password} onChange={(e)=> setPassword(e.target.value)} type="password" disabled={loading} className=" disabled:border-blue-50 border-2 border-blue-900/20 outline-0 w-full p-3 rounded-3xl" name="password"  placeholder="Password" />
              </div>

              <button disabled={loading} className=" transition-all delay-200 ease-in-out  bg-linear-to-r from-blue-700 hover:from-blue-600 via-blue-600 hover:via-blue-500 to-blue-800 hover:to-blue-700 p-4 font-bold text-white rounded-3xl shadow cursor-pointer">{loading ?"Signing in..." :"Sign in"}</button>
               
                
           </div>
            
          </form>


          {/* bottom-image */}
          <div className="images-bottom w-full flex gap-5 mt-10 justify-center items-center">
            <p className="animate-pulse bg-blue-800 w-30 h-3 rounded-full"></p>
          </div>

      </div>


    </div>
  );
}
