import { useState } from "react";
import Fuse from "fuse.js";
import faqs from "../../assets/faqs.json";

const fuse = new Fuse(faqs, {
    keys: ["keywords"],
    threshold: 0.3
});

async function getGeminiAnswer(question, faqs) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;    
    const faqContent = faqs
        .map((faq) => `Question: ${faq.question}\nKeywords: ${faq.keywords}\nAnswer: ${faq.answer}`)
        .join("\n\n");

    const prompt = `
        You are a chatbot for Eventify. Below is a list of FAQs with their questions, keywords, and answers. 
        Try to answer the user's question based on the provided FAQs if possible. 
        If no relevant FAQ is found, provide a general answer based on your knowledge about Eventify.

        FAQs:
        ${faqContent}

        User's Question: ${question}
    `;

    const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
            apiKey,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        }
    );
    const data = await res.json();
    return (
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I couldn't find an answer."
    );
}

function getFaqAnswer(msg) {
    const result = fuse.search(msg);
    if (result.length > 0) {
        return result[0].item.answer;
    }
    return null;
}

export default function Chatbot() {
    const [messages, setMessages] = useState([
        { from: "bot", text: "Hi! Ask me a question about Eventify." }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const send = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMsg = { from: "user", text: input };
        setMessages((m) => [...m, userMsg]);
        setLoading(true);
        let answer = getFaqAnswer(input);
        if (!answer) {
            answer = await getGeminiAnswer(input, faqs);
        }
        setMessages((m) => [...m, { from: "bot", text: answer }]);
        setInput("");
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 border rounded-2xl shadow-sm">
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((m, i) => (
                    <div
                        key={i}
                        className={m.from === "user" ? "text-right" : "text-left"}
                    >
                        <span
                            className={`inline-block px-3 py-2 rounded-xl ${
                                m.from === "user"
                                    ? "bg-gray-600 dark:bg-gray-500 text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                            }`}
                        >
                            {m.text}
                        </span>
                    </div>
                ))}
                {loading && (
                    <div className="text-left text-gray-500 dark:text-gray-400">
                        Bot is typing...
                    </div>
                )}
            </div>
            <form onSubmit={send} className="p-3 border-t flex gap-2">
                <input
                    className="flex-1 border rounded-xl px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                />
                <button className="px-4 py-2 bg-gray-900 dark:bg-blue-800 text-white rounded-xl">
                    Send
                </button>
            </form>
        </div>
    );
}