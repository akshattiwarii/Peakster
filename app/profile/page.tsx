"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/navbar";
import { Loader2, Camera, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [fullName, setFullName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUser(session.user);
                setFullName(session.user.user_metadata.full_name || "");
                setAvatarUrl(session.user.user_metadata.avatar_url || "");
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // ... existing handlers ...

    if (!loading && !user) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-black">
                <Navbar />
                <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800">
                    <h2 className="text-xl font-bold mb-4 dark:text-white">Please Log In</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">You need to be signed in to view your profile.</p>
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

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: fullName, avatar_url: avatarUrl }
            });
            if (error) throw error;
            setMessage({ text: "Profile updated successfully!", type: "success" });
            router.refresh();
        } catch (error: any) {
            setMessage({ text: error.message, type: "error" });
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;
        setSaving(true);

        try {
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            setAvatarUrl(data.publicUrl);
            setMessage({ text: "Image uploaded! Click Save to apply.", type: "success" });
        } catch (error: any) {
            setMessage({ text: error.message, type: "error" });
        } finally {
            setSaving(false);
        }
    };

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

                <div className="container mx-auto px-4 pt-32 pb-20 flex justify-center">
                    <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
                            Edit Profile
                        </h1>

                        {loading ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                            </div>
                        ) : (
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                {/* Avatar Section */}
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative group">
                                        <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-orange-500 bg-slate-200 dark:bg-zinc-800 flex items-center justify-center">
                                            {avatarUrl ? (
                                                <Image src={avatarUrl} alt="Avatar" width={96} height={96} className="object-cover h-full w-full" />
                                            ) : (
                                                <User className="h-10 w-10 text-slate-400" />
                                            )}
                                        </div>
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                                            <Camera className="h-6 w-6" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarUpload}
                                                className="hidden"
                                                disabled={saving}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Tap image to change</p>
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">
                                        {user?.email}
                                    </p>
                                </div>

                                {/* Name Section */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500 transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-slate-200 font-bold py-3 rounded-xl shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
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
        </div>
    );
}
