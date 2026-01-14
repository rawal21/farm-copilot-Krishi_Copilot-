
import { supabase } from '@/lib/supabaseClient'

export default async function FarmerDashboard({ params }: { params: { id: string } }) {
    const { data: farm } = await supabase
        .from('farms')
        .select('*, farmers(*)')
        .eq('farmer_id', params.id)
        .single()

    if (!farm) {
        return <div className="p-8 text-center text-gray-500">Farm details not found.</div>
    }

    return (
        <div className="min-h-screen bg-green-50 p-4 font-sans">
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100">
                <div className="bg-green-600 p-6 text-white text-center">
                    <h1 className="text-2xl font-bold">Krishi Co</h1>
                    <p className="text-green-100 mt-1">Namaskar, {farm.farmers?.full_name}</p>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Your Farm Status</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Total Acres</p>
                                <p className="text-lg font-bold text-gray-800">{farm.total_acres}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-500">Location</p>
                                <p className="text-lg font-bold text-gray-800">{farm.location_pincode}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Current Week's Advice</h2>
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                            <p className="font-bold text-yellow-800 text-sm">Clear Skies Expected</p>
                            <p className="text-sm text-yellow-700 mt-1">
                                No rain for next 3 days. Soil moisture is adequate. No irrigation needed.
                            </p>
                        </div>
                    </div>

                    <button className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-green-700 transition">
                        Upload Photo (Disease Check)
                    </button>
                </div>
            </div>
        </div>
    )
}
