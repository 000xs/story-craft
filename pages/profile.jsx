import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'

export default function Profile() {
    const { data: session, status } = useSession()
    const router = useRouter()

    if (status === 'loading') {
        return <div>Loading...</div>
    }

    if (!session) {
        router.push('/')
        return null
    }

    return (
        <div>
            <Navbar />
            <div className="max-w-6xl px-4 py-8 mx-auto">
                <div className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-lg">
                    <div className="pb-4 border-b">
                        <h1 className="text-2xl font-bold">Profile</h1>
                    </div>
                    <div className="mt-4 space-y-4">
                        <div>
                            <img
                                src={session.user.image}
                                alt={session.user.name}
                                className="w-24 h-24 rounded-full"
                            />
                        </div>
                        <div>
                            <h2 className="font-semibold">Name</h2>
                            <p>{session.user.name}</p>
                        </div>
                        <div>
                            <h2 className="font-semibold">Email</h2>
                            <p>{session.user.email}</p>
                        </div>
                        <div>
                            <h2 className="font-semibold">Member Since</h2>
                            <p>{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}