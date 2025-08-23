import "react";

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-6 mt-auto">
            <div className="container mx-auto text-center">
                <p>
                    &copy; {new Date().getFullYear()} Eventify. All rights
                    reserved.
                </p>
                <div className="mt-2 space-x-4">
                    <a href="/about" className="text-gray-300 hover:text-white">
                        About
                    </a>
                    <a
                        href="/contact"
                        className="text-gray-300 hover:text-white"
                    >
                        Contact
                    </a>
                    <a
                        href="/privacy"
                        className="text-gray-300 hover:text-white"
                    >
                        Privacy Policy
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
