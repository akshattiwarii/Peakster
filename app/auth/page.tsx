"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, Mail, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AuthPage() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;

                if (data.session) {
                    // Auto-confirmed (no email verification needed)
                    router.push("/");
                } else {
                    // Email verification needed
                    setMessage({ text: "Account created! Check email to confirm.", type: "success" });
                    setIsSignUp(false); // Switch to Sign In mode automatically
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.refresh(); // Refresh server components to recognize new session
                router.push("/");
            }
        } catch (error: any) {
            setMessage({ text: error.message, type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative">
            {/* Background with overlay matching Hero */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat fixed"
                style={{ backgroundImage: "url('/hero-bg.png')" }}
            >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            </div>

            <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-300">

                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent drop-shadow-md">
                            Peakster
                        </h1>
                    </Link>
                    <p className="text-slate-200 mt-2 font-light">
                        {isSignUp ? "Create an account to save your trips" : "Welcome back, traveler"}
                    </p>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-orange-500 transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (isSignUp ? "Sign Up" : "Sign In")}
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-slate-300">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                        onClick={() => { setIsSignUp(!isSignUp); setMessage(null); }}
                        className="text-orange-400 hover:text-orange-300 font-semibold underline underline-offset-4 ml-1"
                    >
                        {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                </p>
            </div>

            {/* Toast Notification */}
            {message && (
                <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 ${message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                    {message.type === 'success' ? (
                        <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                    ) : (
                        <div className="h-2 w-2 rounded-full bg-white/50" />
                    )}
                    <span className="font-medium text-sm">{message.text}</span>
                </div>
            )}
        </div>
    );
}
