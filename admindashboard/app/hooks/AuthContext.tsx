"use client"

import React, { createContext, useEffect, useState, useContext } from 'react'
import type { User } from 'firebase/auth'
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';

type AuthContextType = {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
                router.push('/');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div>loading..</div>;
    }

    return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

export const useAuth = (): AuthContextType => {
    return useContext(AuthContext);
}