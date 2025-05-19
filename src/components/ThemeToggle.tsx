import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils";

export const ThemeToggle = () => {

    const [isDarkMode, setDarkMode] = useState<boolean>(false);

    useEffect(() => {
        const storedItem = localStorage.getItem("theme");

        if (storedItem === "dark") {
            setDarkMode(true);
            document.documentElement.classList.add("dark");
        }
        else {
            localStorage.setItem("theme", "light");
            setDarkMode(false);
        }
    })

    const toggleTheme = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setDarkMode(false);
        }
        else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setDarkMode(true);
        }
    }
    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "fixed max-sm:right-0 top-5 right-2 z-50 p-2 rounded-full transition-colors duration-300 focus:outline-hidden"
            )}>
            {isDarkMode ? <Sun className="h-6 w-6 text-yellow-300" /> : <Moon className="h-6 w-6 text-blue-900" />}
        </button>
    )
}
