import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
                    Privacy Policy
                </h1>
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        1. Introduction
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        Eventify ("we," "our," or "us") is committed to
                        protecting your privacy. This Privacy Policy explains
                        how we collect, use, disclose, and safeguard your
                        information when you use our event management platform.
                    </p>
                </div>
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        2. Information We Collect
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
                        We may collect the following types of information:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                        <li>
                            Personal Information: Name, email address, student
                            ID, and department.
                        </li>
                        <li>
                            Profile Information: Profile picture (optional).
                        </li>
                        <li>
                            Event Registration Data: Events you register for or
                            attend.
                        </li>
                        <li>
                            Technical Data: IP address, browser type, and device
                            information.
                        </li>
                    </ul>
                </div>
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        3. How We Use Your Information
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                        <li>Provide and improve our services.</li>
                        <li>Manage event registrations and attendance.</li>
                        <li>Communicate with you about events and updates.</li>
                        <li>
                            Ensure the security and integrity of our platform.
                        </li>
                    </ul>
                </div>
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        4. How We Share Your Information
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        We do not sell or rent your personal information. We may
                        share your information with:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                        <li>
                            University clubs and organizers for event management
                            purposes.
                        </li>
                        <li>
                            Service providers who assist us in operating our
                            platform.
                        </li>
                        <li>
                            Law enforcement or government agencies if required
                            by law.
                        </li>
                    </ul>
                </div>
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        5. Data Security
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        We implement security measures to protect your data,
                        including encryption and secure storage. However, no
                        method of transmission over the internet is 100% secure.
                    </p>
                </div>
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        6. Your Rights
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        You have the right to:
                    </p>
                    <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                        <li>
                            Access, update, or delete your personal information.
                        </li>
                        <li>Opt-out of receiving marketing communications.</li>
                        <li>Request a copy of the data we hold about you.</li>
                    </ul>
                </div>
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        7. Changes to This Policy
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        We may update this Privacy Policy from time to time. We
                        will notify you of any changes by posting the new policy
                        on this page.
                    </p>
                </div>
                <div className="text-center mt-8">
                    <p className="text-gray-600 dark:text-gray-300">
                        Last updated: August 23, 2025
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
