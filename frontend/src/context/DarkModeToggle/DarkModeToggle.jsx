import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

const DarkModeToggle = () => {
    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem("theme") === "dark"
    );

    useEffect(() => {
        const root = document.documentElement;

        if (darkMode) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    return (
        <button
            className="px-4 py-4 mb-1 rounded-full bg-gray-700 dark:bg-white text-white dark:text-gray-700 shadow"
            onClick={() => setDarkMode((prev) => !prev)}
        >
            {darkMode ? (
                <Icon
                    icon="material-symbols:moon-stars"
                    className="material-symbols--moon-stars"
                />
            ) : (
                <Icon
                    icon="material-symbols:sunny"
                    className="material-symbols--sunny"
                />
            )}
        </button>
    );
};

export default DarkModeToggle;
