import { useState } from "react";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus(null);
        try {
            const formURL = import.meta.env.VITE_FORMSPREE_URL;
            const response = await fetch(formURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setSubmitStatus("success");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: "",
                });
            } else {
                throw new Error("Failed to send message.");
            }
        } catch (error) {
            console.error("Error:", error);
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
                    Contact Us
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
                    If you have any questions, feedback, or reports, feel free
                    to reach out to us.
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Your name"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Your email"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Phone (Optional)
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Your phone number"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="subject"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Subject
                        </label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Subject of your message"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="message"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows="5"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Your message"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-2 px-4 rounded-lg text-white font-medium transition ${
                            isSubmitting
                                ? "bg-blue-400"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                    {submitStatus === "success" && (
                        <p className="text-green-600 text-center mt-4">
                            Message sent successfully!
                        </p>
                    )}
                    {submitStatus === "error" && (
                        <p className="text-red-600 text-center mt-4">
                            Failed to send message. Please try again.
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}