"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/navbar";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";

export default function MyTrips() {
    const [trips, setTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session) {
                setUser(session.user);
                const { data, error } = await supabase
                    .from('trips')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) console.error(error);
                else setTrips(data || []);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (!loading && !user) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-black">
                <Navbar />
                <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">Please Log In</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">You need to be signed in to view your trips.</p>
                    <button
                        onClick={() => router.push('/auth')}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold transition-colors"
                    >
                        Go to Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-white dark:bg-black">
            {/* Background with overlay matching Hero */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat fixed"
                style={{ backgroundImage: "url('/hero-bg.png')" }}
            >
                <div className="absolute inset-0 bg-white/90 dark:bg-black/80 backdrop-blur-sm" />
            </div>

            <div className="relative z-10">
                <Navbar />

                <div className="container mx-auto px-4 pt-32 pb-20">
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-12 text-center">
                        My Trips
                    </h1>

                    {loading ? (
                        <div className="flex justify-center">
                            <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
                        </div>
                    ) : trips.length === 0 ? (
                        <div className="text-center text-slate-500 dark:text-slate-400 text-lg">
                            No trips planned yet. Go back home and plan one!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8">
                            {trips.map((trip) => (
                                <div key={trip.id} className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-white/20 dark:border-zinc-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                                    <div className="flex flex-wrap justify-between items-start mb-4 border-b border-black/5 dark:border-white/5 pb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                                Trip to {trip.destination}
                                            </h2>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                                {new Date(trip.created_at).toLocaleDateString()} • {trip.days} Days • ₹{trip.budget} Budget
                                            </p>
                                        </div>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                        <div className="prose prose-sm dark:prose-invert max-w-none text-slate-800 dark:text-slate-300">
                                            <ReactMarkdown
                                                components={{
                                                    a: ({ node, ...props }) => (
                                                        <a
                                                            {...props}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 underline font-semibold transition-colors"
                                                        />
                                                    ),
                                                }}
                                            >
                                                {trip.plan_data}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
