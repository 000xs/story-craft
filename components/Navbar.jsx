import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function Navbar() {
    const { data: session } = useSession()

    return (
        <nav className="bg-white border-b">
            <div className="max-w-6xl px-4 mx-auto">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
                        StoryCraft
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-4">
                        {session ? (
                            <>
                                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                                    Dashboard
                                </Link>
                                <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                                    Profile
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="px-4 py-2 text-gray-600 transition-colors rounded-lg hover:text-gray-900 hover:bg-gray-50"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => signIn()}
                                    className="px-4 py-2 text-gray-600 transition-colors rounded-lg hover:text-gray-900 hover:bg-gray-50"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={() => signIn()}
                                    className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    Get Started
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}