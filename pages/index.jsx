import { useSession, signIn } from 'next-auth/react'
import Navbar from '../components/Navbar'
import { Github, Globe, Users, PenTool } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <main className="max-w-6xl px-4 py-20 mx-auto">
        {/* Hero Section */}
        <div className="mb-20 text-center">
          <h1 className="mb-6 text-6xl font-bold">
            Create Stories Together
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Join the world&apos;s most creative storytelling community
          </p>
          {!session ? (
            <button
              onClick={() => signIn()}
              className="px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Get Started For Free
            </button>
          ) : (
            <Link
              href="/dashboard"
              className="px-6 py-3 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
          )}
        </div>

        {/* Features Section */}
        <div className="grid gap-8 mb-20 md:grid-cols-3">
          <FeatureCard
            icon={<PenTool className="w-8 h-8 text-blue-500" />}
            title="Real-time Collaboration"
            description="Write and edit stories together with fellow authors in real-time"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-blue-500" />}
            title="Active Community"
            description="Join thousands of writers sharing feedback and inspiration"
          />
          <FeatureCard
            icon={<Globe className="w-8 h-8 text-blue-500" />}
            title="Global Reach"
            description="Share your stories with readers from around the world"
          />
        </div>
      </main>
    </div>
  )
}

// FeatureCard Component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="p-6 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-blue-50">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}