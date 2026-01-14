
import { supabase } from '@/lib/supabaseClient'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    const { count: farmerCount } = await supabase.from('farmers').select('*', { count: 'exact', head: true })
    const { count: farmCount } = await supabase.from('farms').select('*', { count: 'exact', head: true })

    // Mock data for visual appeal in absence of real heavy traffic
    const stats = [
        { title: "Total Farmers Onboarded", value: farmerCount || 0, change: "+12% this week" },
        { title: "Active Digital Twins", value: farmCount || 0, change: "+5% this week" },
        { title: "Advisories Sent", value: 1240, change: "+18% this week" }, // Mock
        { title: "Pest Issues Resolved", value: 85, change: "+22% this week" } // Mock
    ]

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Krishi Co - Admin Command Center</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full mt-2 inline-block">
                                {stat.change}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {/* Mock list */}
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">R</div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Ramesh Patil</p>
                                        <p className="text-xs text-gray-500">Uploaded a leaf image • 2m ago</p>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-blue-600">Pest Diagnosis</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
