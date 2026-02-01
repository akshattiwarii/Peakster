import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin (checks RLS/Auth)
// Initialize outside to keep scope, but we need headers per request
// So we will recreate it inside the handler or use a helper
// For simplicity in this route, we'll Create it inside.

export async function POST(req) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            global: {
                headers: {
                    Authorization: req.headers.get('Authorization'),
                },
            },
        }
    );
    try {
        const { destination, source, days, budget, travelers, userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized: User ID missing" }, { status: 401 });
        }

        // 1. Get current profile status
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('credits, last_reset_at')
            .eq('id', userId)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ error: "User profile not found" }, { status: 404 });
        }

        let currentCredits = profile.credits;
        let lastReset = new Date(profile.last_reset_at);
        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        let updated = false;

        // 2. CHECK RESET: Has it been 24 hours since last reset?
        if ((now.getTime() - lastReset.getTime()) > oneDay) {
            currentCredits = 5; // Reset to 5
            lastReset = now;    // Update reset time
            updated = true;
        }

        // 3. CHECK BALANCE
        if (currentCredits <= 0) {
            return NextResponse.json({ error: "Insufficient credits. Consumed 5/5 trips today. Resets in 24h." }, { status: 403 });
        }

        // 4. Generate AI Plan
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `You are a budget travel planner. Create a trip plan for:
- User is traveling from ${source} to ${destination}
- Duration: ${days} days
- Budget: ₹${budget} (Indian Rupees)
- Travelers: ${travelers}

STRICT FORMAT RULES:
1. Use short bullet points, NO long paragraphs
2. Be realistic about the budget
3. Use emojis for visual appeal

REQUIRED SECTIONS (in this exact order):

## ✅ Trip at a Glance
(4 short bullets max, each starting with ✔)
- Is the trip possible within budget?
- What type of traveler is this best for?
- Key highlights

## 🚌 Getting There (${source} ➔ ${destination})
- Best Intercity Options (Train/Bus/Shared Cab) with approx costs
- Travel duration advice

## 🟢 Quick Summary
(2-3 lines max describing the trip)

## 💰 Budget Breakdown
(Use bullet format like this:)
- 🏨 Stay: ₹XXX–XXX
- 🍴 Food: ₹XXX–XXX
- 🚕 Local travel: ₹XXX–XXX
- 🚌 Intercity travel: ₹XXX–XXX
- 🎫 Entry fees: ₹XXX (if any)
- 💵 Total: ₹XXX

## 📅 Day-wise Plan
For each day use format:
### Day X
- Morning: (activity + cost)
- Afternoon: (activity + cost)
- Evening: (activity + cost)
- Food: (suggestion + cost)

## ⚠️ Pro Tips
(Max 4 short bullets with money-saving advice)

## 🔗 Book Your Trip
Always include these exact links at the end:
- 🚕 [Check cabs on Rapido](https://www.rapido.bike/)
- 🚌 [Book bus on RedBus](https://www.redbus.in/)
- 🏨 [Find stays on OYO](https://www.oyorooms.com/)
- ✈️ [Explore on Goibibo](https://www.goibibo.com/)

Keep it scannable. Make it product-ready, not essay-style.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // 5. DEDUCT CREDIT & UPDATE DB
        const finalCredits = currentCredits - 1;

        // We update both credits and last_reset_at (if it changed)
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                credits: finalCredits,
                last_reset_at: lastReset.toISOString()
            })
            .eq('id', userId);

        if (updateError) {
            console.error("Failed to update credits:", updateError);
            // Continue anyway since user got their result, effectively a "free" glitch but better than crashing
        }

        return NextResponse.json({ result: text });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
