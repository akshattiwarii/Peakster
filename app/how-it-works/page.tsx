"use client";

import { Navbar } from "@/components/navbar";
import { MoveRight, UserPlus, FileText, Sparkles, Save, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-black">
            {/* Background with overlay matching Hero */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat fixed"
                style={{ backgroundImage: "url('/hero-bg.png')" }}
            >
                <div className="absolute inset-0 bg-white/90 dark:bg-black/90 backdrop-blur-md" />
            </div>

            <div className="relative z-10">
                <Navbar />

                <div className="container mx-auto px-4 pt-32 pb-20">
                    <div className="max-w-4xl mx-auto space-y-16">

                        {/* Header */}
                        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                🏔️ How <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Peakster</span> Works
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium">
                                Plan smart. Travel more. Stay within budget.
                            </p>
                            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                                Peakster uses AI to create budget-friendly mountain trips for travelers who don’t want to overpay or overthink.
                            </p>
                        </div>

                        {/* Steps Section */}
                        <div className="space-y-12">
                            <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-8">
                                ✨ Step-by-Step: How It Works
                            </h2>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Step 1 */}
                                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 hover:shadow-xl transition-shadow relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold px-4 py-1 rounded-bl-xl">
                                        Step 1
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl text-emerald-600 dark:text-emerald-400">
                                            <UserPlus className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Create an Account</h3>
                                            <p className="text-slate-600 dark:text-slate-400 mb-4">Sign up using your email in seconds.</p>
                                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> New users get <strong className="text-slate-900 dark:text-white">5 free credits</strong>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Each trip plan uses 1 credit
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> No login = no credits (keeps things fair)
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 hover:shadow-xl transition-shadow relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold px-4 py-1 rounded-bl-xl">
                                        Step 2
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400">
                                            <FileText className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Enter Your Trip Budget</h3>
                                            <p className="text-slate-600 dark:text-slate-400 mb-4">Tell us your budget, destination, and days.</p>
                                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-blue-500" /> Your total budget
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-blue-500" /> Destination (mountains, hills, nature)
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-blue-500" /> Number of days
                                                </li>
                                            </ul>
                                            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-500 italic">That’s it. No long forms.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 hover:shadow-xl transition-shadow relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 font-bold px-4 py-1 rounded-bl-xl">
                                        Step 3
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-xl text-purple-600 dark:text-purple-400">
                                            <Sparkles className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">AI Plans Everything</h3>
                                            <p className="text-slate-600 dark:text-slate-400 mb-4">Our AI instantly creates a realistic trip plan, including:</p>
                                            <ul className="grid grid-cols-1 gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <li className="flex items-center gap-2">🚍 Cheapest transport options</li>
                                                <li className="flex items-center gap-2">🏨 Budget stays (hostels / homestays)</li>
                                                <li className="flex items-center gap-2">🍴 Food cost estimate</li>
                                                <li className="flex items-center gap-2">🗓️ Day-wise itinerary</li>
                                                <li className="flex items-center gap-2">💰 Clear budget breakdown</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Step 4 */}
                                <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-8 hover:shadow-xl transition-shadow relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold px-4 py-1 rounded-bl-xl">
                                        Step 4
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-orange-100 dark:bg-orange-900/40 rounded-xl text-orange-600 dark:text-orange-400">
                                            <Save className="h-8 w-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Save & Revisit Anytime</h3>
                                            <p className="text-slate-600 dark:text-slate-400 mb-4">Your trip is automatically saved in <span className="font-semibold text-slate-900 dark:text-white">My Trips</span>.</p>
                                            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-orange-500" /> Reuse plans anytime
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-orange-500" /> Share with friends
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-orange-500" /> Plan again when you want
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Credits & Benefits Section */}
                        <div className="grid md:grid-cols-2 gap-8">

                            {/* How Credits Work */}
                            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl p-8 border border-slate-200 dark:border-zinc-800">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                    💳 How Credits Work
                                </h3>
                                <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-700">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white font-semibold">
                                            <tr>
                                                <th className="px-4 py-3">Action</th>
                                                <th className="px-4 py-3">Credits</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200 dark:divide-zinc-700 bg-white dark:bg-zinc-900">
                                            <tr>
                                                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Sign up</td>
                                                <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-bold">+5 credits</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Generate 1 trip</td>
                                                <td className="px-4 py-3 text-red-500 font-bold">−1 credit</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Credits = 0</td>
                                                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">Trip planning locked</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 text-center">
                                    Credits refill in 24 hours ⏳
                                </p>
                            </div>

                            {/* Why People Use Peakster */}
                            <div className="bg-gradient-to-br from-slate-900 to-black text-white rounded-3xl p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 relative z-10">
                                    🎯 Why People Use Peakster
                                </h3>
                                <ul className="space-y-4 relative z-10">
                                    <li className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-orange-500"></div> Designed for budget travelers
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-orange-500"></div> Perfect for mountain & nature trips
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-orange-500"></div> No fake luxury plans
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-orange-500"></div> Fast, simple, and realistic
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-orange-500"></div> Built for students & working professionals
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="text-center py-12">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
                                🚀 Ready to Plan Your Trip?
                            </h2>
                            <Link href="/">
                                <button className="bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-slate-200 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center gap-2 mx-auto">
                                    Start planning smarter with Peakster <MoveRight className="h-5 w-5" />
                                </button>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
