'use client'

import Link from "next/link";
import { Site } from "@/lib/data";
import { useEffect, useState } from "react";
import Contact from "./contact";
import { Button } from "./ui/button";

export default function Header({ site }: { site: Site }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // Log isOpen whenever it changes
  useEffect(() => {
    console.log('Menu open state:', isOpen);
  }, [isOpen]);

    return (
        <header className="py-8 flex justify-between flex-row items-center relative z-50">
            <Link href="/">
              <h1 className={`text-2xl font-bold underline text-${site.color}-500 decoration-${site.color}-800 hover:text-${site.color}-600 transition-all duration-300`}>
                {site.name}.com
              </h1>
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex flex-row gap-4 items-center">
              <Link href="/#listings" className={`hover:text-${site.color}-800 transition-all duration-300`}>  
                Listings
              </Link>
              <Link href="/#articles" className={`hover:text-${site.color}-800 transition-all duration-300`}>
                Articles
              </Link>
              <Button
                onClick={() => setContactOpen(true)}
                className={`text-white px-4 py-2 rounded-md bg-${site.color}-500 hover:bg-${site.color}-600 transition-all duration-300`}
              >
                {site["call to action"]}
              </Button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
              <div className="absolute top-20 left-0 right-0 bg-white shadow-lg md:hidden flex flex-col items-left gap-4 p-4 py-8 z-50">
                <Link href="/#listings" className={`hover:text-${site.color}-800 transition-all duration-300`}>  
                  Listings
                </Link>
                <Link href="/#articles" className={`hover:text-${site.color}-800 transition-all duration-300`}>
                  Articles
                </Link>
                <Button
                  onClick={() => setContactOpen(true)}
                  className={`text-white px-4 py-2 rounded-md bg-${site.color}-500 hover:bg-${site.color}-600 transition-all duration-300`}
                >
                  {site["call to action"]}
                </Button>
              </div>
            )}

            {/* Add Contact Modal */}
            <Contact site={site} isOpen={contactOpen} setIsOpen={setContactOpen} />
        </header>
    )
}