import Link from 'next/link'
import { Settings } from 'lucide-react'

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
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 dark:text-indigo-300 mb-3">Connect</p>
                            <div className="flex items-center gap-2">
                                <a
                                    href="https://www.instagram.com/csaudk/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="text-zinc-500 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 64 64" fill="currentColor">
                                        <path d="M44,57H20A13,13,0,0,1,7,44V20A13,13,0,0,1,20,7H44A13,13,0,0,1,57,20V44A13,13,0,0,1,44,57ZM20,9A11,11,0,0,0,9,20V44A11,11,0,0,0,20,55H44A11,11,0,0,0,55,44V20A11,11,0,0,0,44,9Z" />
                                        <path d="M32,43.67A11.67,11.67,0,1,1,43.67,32,11.68,11.68,0,0,1,32,43.67Zm0-21.33A9.67,9.67,0,1,0,41.67,32,9.68,9.68,0,0,0,32,22.33Z" />
                                        <path d="M44.5,21A3.5,3.5,0,1,1,48,17.5,3.5,3.5,0,0,1,44.5,21Zm0-5A1.5,1.5,0,1,0,46,17.5,1.5,1.5,0,0,0,44.5,16Z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://www.facebook.com/datalogi"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="text-zinc-500 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 64 64" fill="currentColor">
                                        <path d="M44,7H20A13,13,0,0,0,7,20V44A13,13,0,0,0,20,57H44A13,13,0,0,0,57,44V20A13,13,0,0,0,44,7ZM33,55V38a1,1,0,0,0-1-1H27V31h5a1,1,0,0,0,1-1V22a5,5,0,0,1,5-5h8v6H42a3,3,0,0,0-3,3v4a1,1,0,0,0,1,1h6v6H40a1,1,0,0,0-1,1V55ZM55,44A11,11,0,0,1,44,55H41V39h6a1,1,0,0,0,1-1V30a1,1,0,0,0-1-1H41V26a1,1,0,0,1,1-1h5a1,1,0,0,0,1-1V16a1,1,0,0,0-1-1H38a7,7,0,0,0-7,7v7H26a1,1,0,0,0-1,1v8a1,1,0,0,0,1,1h5V55H20A11,11,0,0,1,9,44V20A11,11,0,0,1,20,9H44A11,11,0,0,1,55,20Z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-900 pt-4 flex items-center justify-center gap-2">
                    <p className="text-xs text-zinc-400 dark:text-zinc-300">
                        &copy; {new Date().getFullYear()} CS Portfolio. All rights reserved.
                    </p>
                    <Link href="/admin" aria-label="Admin" className="text-zinc-300 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors">
                        <Settings className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </footer >
    )
}