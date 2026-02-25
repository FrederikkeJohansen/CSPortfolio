export default function Footer() {
    return (
        <footer className="w-full bg-gray-50 dark:bg-black border-t border-zinc-200 dark:border-zinc-900">
            <div className="max-w-7xl mx-auto px-8 pt-8 pb-4 flex flex-col gap-10">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-10 md:gap-16">
                    <p className="text-sm text-zinc-500 dark:text-zinc-200 leading-relaxed max-w-sm">
                        All projects displayed on this platform have been developed by students enrolled in
                        IT Product Development or Computer Science at Aarhus University, at both bachelor
                        and master&apos;s level. All rights to individual projects belong to their respective creators.
                    </p>

                    <div className="flex flex-col md:flex-row gap-10 md:gap-16 md:shrink-0">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 dark:text-indigo-300 mb-3">Programmes</p>
                            <ul className="flex flex-col gap-2">
                                <li>
                                    <a
                                        href="https://bachelor.au.dk/itproduktudvikling"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-zinc-500 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                    >
                                        IT Product Development
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="https://bachelor.au.dk/datalogi"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-zinc-500 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                    >
                                        Computer Science
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 dark:text-indigo-300 mb-3">Contact</p>
                            <a
                                href="mailto:cs-portfolio@cs.au.dk"
                                className="text-sm text-zinc-500 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors"
                            >
                                cs-portfolio@cs.au.dk
                            </a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-900 pt-4 flex flex-col items-center">
                    <p className="text-xs text-zinc-400 dark:text-zinc-300">
                        &copy; {new Date().getFullYear()} CS Portfolio. All rights reserved.
                    </p>
                </div>
            </div>
        </footer >
    )
}