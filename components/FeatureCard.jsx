export default function FeatureCard({ icon, title, description }) {
    return (
        <div className="transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
            <div className="p-6">
                <div className="flex justify-center">
                    {icon}
                </div>
                <div className="mt-4 text-center">
                    <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                    <p className="text-gray-600">{description}</p>
                </div>
            </div>
        </div>
    )
}