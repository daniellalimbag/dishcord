export default function Footer() {
    return (
        <footer className="flex flex-col sm:flex-row justify-between items-center w-full border-t border-gray-300 p-4 text-foreground bg-transparent tracking-wide">
            <div className="text-left sm:text-start mb-2 sm:mb-0">
                <h1 className="text-2xl sm:text-3xl text-primary font-bold mb-1">Dishcord</h1>
                <p className="text-base sm:text-lg font-medium">Your go-to place for real food reviews and local gems</p>
            </div>
            <div className="text-center sm:text-right text-sm">
                <p className="mb-1">© 2025 Dishcord. All rights reserved.</p>
                <p className="text-xs font-normal italic">
                    Developed by <a href="https://github.com/daniellalimbag" className="underline hover:text-accent">Daniella Limbag</a>
                </p>
            </div>
        </footer>
    );
}
