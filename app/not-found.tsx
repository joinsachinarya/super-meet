import Link from 'next/link'
import React from 'react'

const NotFount = () => {
    return (
        <div className="grid min-h-screen place-items-center p-8 font-[family-name:var(--font-geist-sans)]">
            <div className="flex flex-col items-center gap-6 text-center">
                <h1 className="text-6xl font-bold">404</h1>
                <h2 className="text-2xl font-medium">Page Not Found</h2>
                <p className="text-base text-foreground/70">
                    The page you are looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="mt-4 rounded-full bg-foreground px-6 py-3 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
                >
                    Return Home
                </Link>
            </div>
        </div>
    )
}

export default NotFount