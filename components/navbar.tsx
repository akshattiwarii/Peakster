"use client";

import Link from "next/link";
import { Menu, X, LogOut, User, Settings, Map } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [credits, setCredits] = useState<number>(0);
    const [lastReset, setLastReset] = useState<Date | null>(null);
    const [timeLeft, setTimeLeft] = useState<string>("");
    const router = useRouter();

    // Calculate time remaining for reset
    useEffect(() => {
        if (!lastReset || credits >= 5) {
            setTimeLeft("");
            return;
        }

        const calculateTime = () => {
            const now = new Date();
            const resetTime = new Date(lastReset.getTime() + 24 * 60 * 60 * 1000);
            const diff = resetTime.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft("Ready to reset");
            } else {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                setTimeLeft(`${hours}h ${minutes}m`);
            }
        };

        calculateTime(); // Initial calculation

        const interval = setInterval(calculateTime, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [lastReset, credits]);

    useEffect(() => {
        // Initial Data Fetch
        const fetchUserData = async (session: any) => {
            if (session?.user) {
                setUser(session.user);
                setAvatarUrl(session.user.user_metadata?.avatar_url ?? null);

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('credits, last_reset_at')
                    .eq('id', session.user.id)
                    .single();
                setCredits(profile?.credits ?? 0);
                if (profile?.last_reset_at) setLastReset(new Date(profile.last_reset_at));
            } else {
                setUser(null);
                setCredits(0);
                setLastReset(null);
                setAvatarUrl(null);
            }
        };

        // 1. Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            fetchUserData(session);
        }).catch((error) => {
            console.error("Session check error", error);
        });

        // 2. Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            fetchUserData(session);
        });

        const handleCreditUpdate = () => {
            // Refresh current user data when credit update event fires
            supabase.auth.getSession().then(({ data: { session } }) => {
                fetchUserData(session);
            }).catch(console.error);
        };

        window.addEventListener('credits-updated', handleCreditUpdate);

        return () => {
            subscription.unsubscribe();
            window.removeEventListener('credits-updated', handleCreditUpdate);
        };
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/auth");
        router.refresh();
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-12 backdrop-blur-md bg-white/70 dark:bg-black/50 border-b border-white/20 transition-all duration-300">
            <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-3 group">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-orange-600 dark:group-hover:text-amber-400 transition-colors">Peakster</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/how-it-works" className="font-semibold text-slate-700 hover:text-orange-600 dark:text-slate-200 dark:hover:text-amber-400 transition-colors">
                        How it Works
                    </Link>

                    {!user ? (
                        <Link href="/auth">
                            <button className="bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all dark:bg-white dark:text-black dark:hover:bg-slate-200">
                                Sign Up
                            </button>
                        </Link>
                    ) : (
                        <div className="relative flex items-center gap-4">
                            <div className="hidden md:block bg-slate-100 dark:bg-zinc-800 px-4 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700 relative group cursor-help">
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Credits: <span className="text-orange-600 dark:text-orange-400">{credits ?? '...'}</span>
                                </span>

                                {/* Tooltip for Time Remaining */}
                                {credits < 5 && timeLeft && (
                                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-32 bg-black text-white text-xs py-1 px-2 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center">
                                        Refill in: {timeLeft}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-2 focus:outline-none"
                            >
                                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-300 dark:border-slate-700 transition-transform active:scale-95">
                                    {avatarUrl ? (
                                        <Image src={avatarUrl} alt="Avatar" width={40} height={40} className="object-cover h-full w-full" />
                                    ) : (
                                        <User className="h-5 w-5 text-slate-500" />
                                    )}
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {userMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-slate-200 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                                    <div className="py-1">
                                        <Link
                                            href="/profile"
                                            className="px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center gap-2"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <Settings className="h-4 w-4" /> Profile
                                        </Link>
                                        <Link
                                            href="/my-trips"
                                            className="px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center gap-2"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <Map className="h-4 w-4" /> My Trips
                                        </Link>
                                        <div className="border-t border-slate-100 dark:border-zinc-800 my-1"></div>
                                        <button
                                            onClick={() => { handleSignOut(); setUserMenuOpen(false); }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                        >
                                            <LogOut className="h-4 w-4" /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-slate-800 dark:text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-gray-800 shadow-xl p-4 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
                    <Link
                        href="/how-it-works"
                        className="block px-4 py-2 text-lg font-medium text-slate-800 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg"
                        onClick={() => setIsOpen(false)}
                    >
                        How it Works
                    </Link>

                    {user && (
                        <>
                            <div className="px-4 py-2 bg-slate-100 dark:bg-zinc-800 rounded-lg flex flex-col gap-1">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                                        Credits: <span className="text-orange-600 dark:text-orange-400">{credits ?? '...'}</span>
                                    </span>
                                    {credits < 5 && timeLeft && (
                                        <span className="text-xs font-medium text-slate-500 bg-white dark:bg-black px-2 py-1 rounded-full border border-slate-200 dark:border-zinc-700 shadow-sm">
                                            Refill: {timeLeft}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <Link
                                href="/profile"
                                className="block px-4 py-2 text-lg font-medium text-slate-800 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg flex items-center gap-2"
                                onClick={() => setIsOpen(false)}
                            >
                                <Settings className="h-5 w-5" /> Profile
                            </Link>

                            <Link
                                href="/my-trips"
                                className="block px-4 py-2 text-lg font-medium text-slate-800 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg flex items-center gap-2"
                                onClick={() => setIsOpen(false)}
                            >
                                <Map className="h-5 w-5" /> My Trips
                            </Link>
                        </>
                    )}

                    {!user ? (
                        <Link href="/auth" onClick={() => setIsOpen(false)}>
                            <button className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl font-semibold dark:bg-white dark:text-black">
                                Sign Up
                            </button>
                        </Link>
                    ) : (
                        <button
                            onClick={() => { handleSignOut(); setIsOpen(false); }}
                            className="w-full text-left px-4 py-2 text-lg font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg flex items-center gap-2"
                        >
                            <LogOut className="h-5 w-5" /> Sign Out
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}
