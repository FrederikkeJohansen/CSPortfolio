"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type SearchContextType = {
    searchQuery: string
    setSearchQuery: (query: string) => void
    isSearchOpen: boolean
    openSearch: (query?: string) => void
    closeSearch: () => void
}

const SearchContext = createContext<SearchContextType>({
    searchQuery: "",
    setSearchQuery: () => {},
    isSearchOpen: false,
    openSearch: () => {},
    closeSearch: () => {},
})

export function SearchProvider({ children }: { children: ReactNode }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    const openSearch = (query?: string) => {
        if (query !== undefined) setSearchQuery(query)
        setIsSearchOpen(true)
    }

    const closeSearch = () => {
        setIsSearchOpen(false)
        setSearchQuery("")
    }

    return (
        <SearchContext.Provider value={{ searchQuery, setSearchQuery, isSearchOpen, openSearch, closeSearch }}>
            {children}
        </SearchContext.Provider>
    )
}

export function useSearch() {
    return useContext(SearchContext)
}
