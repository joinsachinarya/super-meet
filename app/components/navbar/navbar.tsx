"use client"

import React from 'react'
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

type NavbarProps = {
}

const Navbar: React.FC<NavbarProps> = () => {

  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  let links = [
    {
      name: "About",
      link: "#about",
    },
    {
      name: "Work Experience & Projects",
      link: "#work-experience-and-projects",
    },

    {
      name: "Blogs & Videos",
      link: "#blogs-and-videos",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];

  return (
    <div className="flex space-x-4 justify-center">
      {links.map((navLink, index) => (
        <Link key={navLink.name} href={navLink.link}>
          <div
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative rounded-xl px-4 py-2 text-sm text-gray-700 transition-all delay-150 hover:text-gray-900"
          >
            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.span
                  className="absolute inset-0 rounded-lg bg-gray-100"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15 } }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>

            <span className="relative z-10">{navLink.name}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Navbar