"use client";

import Link from "next/link";
import { ChevronDown, MapPin, Search, Loader2, Calendar, Users, DollarSign, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function HeroSection() {
    const [loading, setLoading] = useState(false);
    const [destination, setDestination] = useState("");
    const [days, setDays] = useState("");
    const [budget, setBudget] = useState("");
    const [travelers, setTravelers] = useState("Couple");
    const [result, setResult] = useState<string | null>(null);
    const [tripId, setTripId] = useState<string | null>(null);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const router = useRouter();

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

        if (!budget || !destination || !days) {
            setMessage({ text: "Please fill in all details!", type: "error" });
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
        <div className="relative w-full min-h-screen flex flex-col items-center justify-center pb-20">
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
                <div className="bg-white/80 dark:bg-black/60 backdrop-blur-md p-2 rounded-2xl shadow-xl w-full max-w-4xl border border-white/20">
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
                        <div className="flex-[1.5] bg-white dark:bg-slate-900 rounded-xl px-4 py-3 text-left border border-transparent focus-within:border-orange-500 transition-colors relative">
                            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                                Destination
                            </label>
                            <div className="relative flex items-center">
                                <select
                                    className="w-full bg-transparent text-lg font-bold text-slate-900 dark:text-white outline-none appearance-none cursor-pointer z-10"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                >
                                    <option value="" disabled className="text-black bg-white">Select a place</option>
                                    <option value="Agra" className="text-black bg-white">Agra</option>
                                    <option value="Ahmedabad" className="text-black bg-white">Ahmedabad</option>
                                    <option value="Alleppey" className="text-black bg-white">Alleppey</option>
                                    <option value="Amritsar" className="text-black bg-white">Amritsar</option>
                                    <option value="Andaman & Nicobar" className="text-black bg-white">Andaman & Nicobar</option>
                                    <option value="Auli" className="text-black bg-white">Auli</option>
                                    <option value="Bangalore" className="text-black bg-white">Bangalore</option>
                                    <option value="Chandigarh" className="text-black bg-white">Chandigarh</option>
                                    <option value="Chennai" className="text-black bg-white">Chennai</option>
                                    <option value="Coorg" className="text-black bg-white">Coorg</option>
                                    <option value="Dalhousie" className="text-black bg-white">Dalhousie</option>
                                    <option value="Darjeeling" className="text-black bg-white">Darjeeling</option>
                                    <option value="Delhi" className="text-black bg-white">Delhi</option>
                                    <option value="Dharamshala" className="text-black bg-white">Dharamshala</option>
                                    <option value="Gangtok" className="text-black bg-white">Gangtok</option>
                                    <option value="Goa" className="text-black bg-white">Goa</option>
                                    <option value="Gokarna" className="text-black bg-white">Gokarna</option>
                                    <option value="Gulmarg" className="text-black bg-white">Gulmarg</option>
                                    <option value="Hampi" className="text-black bg-white">Hampi</option>
                                    <option value="Haridwar" className="text-black bg-white">Haridwar</option>
                                    <option value="Hyderabad" className="text-black bg-white">Hyderabad</option>
                                    <option value="Jaipur" className="text-black bg-white">Jaipur</option>
                                    <option value="Jaisalmer" className="text-black bg-white">Jaisalmer</option>
                                    <option value="Jodhpur" className="text-black bg-white">Jodhpur</option>
                                    <option value="Kasol" className="text-black bg-white">Kasol</option>
                                    <option value="Kerala" className="text-black bg-white">Kerala</option>
                                    <option value="Kochi" className="text-black bg-white">Kochi</option>
                                    <option value="Kodaikanal" className="text-black bg-white">Kodaikanal</option>
                                    <option value="Kolkata" className="text-black bg-white">Kolkata</option>
                                    <option value="Ladakh" className="text-black bg-white">Ladakh</option>
                                    <option value="Lakshadweep" className="text-black bg-white">Lakshadweep</option>
                                    <option value="Leh" className="text-black bg-white">Leh</option>
                                    <option value="Lonavala" className="text-black bg-white">Lonavala</option>
                                    <option value="Madurai" className="text-black bg-white">Madurai</option>
                                    <option value="Manali" className="text-black bg-white">Manali</option>
                                    <option value="McLeod Ganj" className="text-black bg-white">McLeod Ganj</option>
                                    <option value="Mount Abu" className="text-black bg-white">Mount Abu</option>
                                    <option value="Mumbai" className="text-black bg-white">Mumbai</option>
                                    <option value="Munnar" className="text-black bg-white">Munnar</option>
                                    <option value="Mussoorie" className="text-black bg-white">Mussoorie</option>
                                    <option value="Mysore" className="text-black bg-white">Mysore</option>
                                    <option value="Nainital" className="text-black bg-white">Nainital</option>
                                    <option value="Ooty" className="text-black bg-white">Ooty</option>
                                    <option value="Pondicherry" className="text-black bg-white">Pondicherry</option>
                                    <option value="Pune" className="text-black bg-white">Pune</option>
                                    <option value="Puri" className="text-black bg-white">Puri</option>
                                    <option value="Pushkar" className="text-black bg-white">Pushkar</option>
                                    <option value="Rishikesh" className="text-black bg-white">Rishikesh</option>
                                    <option value="Shimla" className="text-black bg-white">Shimla</option>
                                    <option value="Srinagar" className="text-black bg-white">Srinagar</option>
                                    <option value="Tirupati" className="text-black bg-white">Tirupati</option>
                                    <option value="Udaipur" className="text-black bg-white">Udaipur</option>
                                    <option value="Varanasi" className="text-black bg-white">Varanasi</option>
                                    <option value="Varkala" className="text-black bg-white">Varkala</option>
                                    <option value="Wayanad" className="text-black bg-white">Wayanad</option>
                                </select>
                                <ChevronDown className="absolute right-0 h-5 w-5 text-slate-400 pointer-events-none" />
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
                    <div className="mt-10 bg-white/90 dark:bg-black/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-4xl border border-white/20 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
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
