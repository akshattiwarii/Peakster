"use client";

import Link from "next/link";
import { ChevronDown, MapPin, Search, Loader2, Calendar, Users, DollarSign, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// CITIES array removed as we are now using global search
export function HeroSection() {
    const [loading, setLoading] = useState(false);
    const [destination, setDestination] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredCities, setFilteredCities] = useState<string[]>([]);
    const [days, setDays] = useState("");
    const [budget, setBudget] = useState("");
    const [travelers, setTravelers] = useState("Couple");
    const [result, setResult] = useState<string | null>(null);
    const [tripId, setTripId] = useState<string | null>(null);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const router = useRouter();

    // Debounced search for global places
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (destination.length > 2) {
                try {
                    // Using Photon API for better autocomplete and POI support
                    const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(destination)}&limit=10`);
                    if (!response.ok) throw new Error("Network response was not ok");

                    const data = await response.json();

                    // Photon returns GeoJSON features
                    const formattedCities = data.features.map((feature: any) => {
                        const p = feature.properties;
                        // Construct a readable location string
                        const parts = [p.name, p.city, p.state, p.country].filter(Boolean);
                        return [...new Set(parts)].join(", "); // Remove duplicates and join
                    });

                    setFilteredCities(formattedCities);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Error fetching places:", error);
                    setFilteredCities([]);
                }
            } else {
                setShowSuggestions(false);
            }
        }, 300); // 300ms delay for faster feel

        return () => clearTimeout(delayDebounceFn);
    }, [destination]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handlePlanTrip = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loading) return;

        // 1. Verify User is Logged In
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push("/auth");
            return;
        }

        if (Number(days) <= 0 || Number(budget) <= 0) {
            setMessage({ text: "Please enter positive values for Days and Budget!", type: "error" });
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch("/api/plan-trip", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    destination,
                    days,
                    budget,
                    travelers,
                    userId: session.user.id // Pass User ID for credit check
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error && data.error.includes("Insufficient credits")) {
                    setMessage({ text: "You have 0 credits left! 😢", type: "error" });
                } else {
                    setMessage({ text: data.error || "An unknown error occurred.", type: "error" });
                }
                setLoading(false);
                return;
            }

            // Dispatch event to update navbar credits
            window.dispatchEvent(new Event('credits-updated'));

            setResult(data.result);

            // Save Trip to Database (Keep this logic)
            if (data.result) {
                const { data: tripData, error } = await supabase
                    .from('trips')
                    .insert([
                        {
                            user_id: session.user.id,
                            destination: destination,
                            budget: budget,
                            days: days,
                            plan_data: data.result // Correct column name, storing text directly
                        }
                    ])
                    .select();

                if (error) {
                    console.error("Error saving trip:", error);
                } else if (tripData) {
                    setTripId(tripData[0].id);
                }
            }

        } catch (error) {
            console.error("Error:", error);
            setMessage({ text: "Something went wrong. Please try again.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative z-20 w-full min-h-screen flex flex-col items-center justify-center pb-20">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat fixed"
                style={{ backgroundImage: "url('/hero-bg.png')" }}
            >
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent dark:from-black/90 dark:via-transparent dark:to-transparent" />
            </div>

            <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center mt-32">
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4 dark:text-white drop-shadow-md">
                    Plan Your Mountain<br />
                    Trip on a Budget!
                </h1>

                <p className="text-lg text-slate-800 mb-10 max-w-lg font-medium dark:text-slate-200 drop-shadow-sm">
                    Affordable trips for young travelers.<br />
                    Discover the best budget-friendly itineraries.
                </p>

                {/* Trip Planner Widget */}
                <div className="relative z-30 bg-white/80 dark:bg-black/60 backdrop-blur-md p-2 rounded-2xl shadow-xl w-full max-w-4xl border border-white/20">
                    <div className="flex flex-col md:flex-row gap-2">

                        {/* Budget Input */}
                        <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-left border border-transparent focus-within:border-orange-500 transition-colors relative">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                Your Budget
                            </label>
                            <div className="flex items-center">
                                <span className="text-lg font-bold text-slate-900 dark:text-white mr-1">₹</span>
                                <input
                                    type="number"
                                    placeholder="5000"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    className="w-full bg-transparent text-lg font-bold text-slate-900 dark:text-white outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                />
                            </div>
                        </div>

                        {/* Days Input */}
                        <div className="w-full md:w-32 bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-left border border-transparent focus-within:border-orange-500 transition-colors relative">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                Days
                            </label>
                            <input
                                type="number"
                                placeholder="3"
                                value={days}
                                onChange={(e) => setDays(e.target.value)}
                                className="w-full bg-transparent text-lg font-bold text-slate-900 dark:text-white outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700"
                            />
                        </div>

                        {/* Destination Input */}
                        <div className="flex-[1.5] bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-left border border-transparent focus-within:border-orange-500 transition-colors relative z-50">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                Destination
                            </label>
                            <div className="relative flex items-center">
                                <MapPin className="absolute left-0 h-5 w-5 text-orange-500" />
                                <input
                                    type="text"
                                    placeholder="Search any place in the world..."
                                    className="w-full bg-transparent text-lg font-bold text-slate-900 dark:text-white outline-none placeholder:text-slate-300 dark:placeholder:text-slate-700 pl-7"
                                    value={destination}
                                    onChange={(e) => {
                                        setDestination(e.target.value);
                                    }}
                                    onBlur={() => {
                                        setTimeout(() => setShowSuggestions(false), 200);
                                    }}
                                />
                                {showSuggestions && filteredCities.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-slate-100 dark:border-zinc-800 max-h-60 overflow-y-auto custom-scrollbar z-50 overflow-hidden">
                                        {filteredCities.map((city, index) => {
                                            const parts = city.split(', ');
                                            const mainName = parts[0];
                                            const subText = parts.slice(1).join(', ');

                                            return (
                                                <div
                                                    key={index}
                                                    className="px-4 py-3 hover:bg-orange-50 dark:hover:bg-zinc-800 cursor-pointer flex items-center gap-2 group transition-colors border-b border-slate-50 dark:border-zinc-800/50 last:border-0"
                                                    onClick={() => {
                                                        setDestination(mainName);
                                                        setShowSuggestions(false);
                                                    }}
                                                >
                                                    <div className="bg-slate-100 dark:bg-zinc-800 p-2 rounded-full group-hover:bg-orange-100 dark:group-hover:bg-orange-900/30 transition-colors shrink-0">
                                                        <MapPin className="h-4 w-4 text-slate-400 group-hover:text-orange-500 transition-colors" />
                                                    </div>
                                                    <div className="flex flex-col overflow-hidden">
                                                        <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 truncate">
                                                            {mainName}
                                                        </span>
                                                        {subText && (
                                                            <span className="text-xs text-slate-400 dark:text-slate-500 truncate">
                                                                {subText}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handlePlanTrip}
                            disabled={loading}
                            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-lg px-8 py-3 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
                        >
                            {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Plan My Trip"}
                        </button>
                    </div>
                </div>

                {/* Toast Notification */}
                {message && (
                    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 bg-red-500 text-white">
                        <div className="h-2 w-2 rounded-full bg-white/50" />
                        <span className="font-medium text-sm">{message.text}</span>
                    </div>
                )}

                {/* Plan Result */}
                {result && (
                    <div className="relative z-10 mt-10 bg-white/90 dark:bg-black/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-4xl border border-white/20 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Your Trip Plan</h2>
                        <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-300">
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
                                {result}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>

            {/* Decorative Wave Bottom (Optional aesthetic touch) */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent dark:from-black dark:to-transparent z-10" />
        </div>
    );
}
