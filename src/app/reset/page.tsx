"use client";

import { getDefaultCards, DASHBOARD_VERSION } from '@/lib/dashboard-migration';

export default function ResetStorage() {
    function clearStorage() {
        localStorage.clear();
        alert('All localStorage data cleared! Please refresh the dashboard.');
    }
    function showStorage() {
        const data = Object.keys(localStorage).reduce((acc, key) => {
            acc[key] = localStorage.getItem(key);
            return acc;
        }, {} as Record<string, string | null>);
        document.getElementById('storage-data')!.textContent = JSON.stringify(data, null, 2);
    }
    function resetAllVisibleCards() {
        const defaultCards = getDefaultCards();

        localStorage.setItem('devdashboard-card-order', JSON.stringify(defaultCards));
        localStorage.setItem('devdashboard-version', DASHBOARD_VERSION);
        alert('All cards set to visible! Please refresh the dashboard.');
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Dashboard Reset Tool</h1>

            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-2">Storage Management</h2>
                    <button
                        onClick={showStorage}
                        className="px-4 py-2 bg-blue-500 text-white rounded mr-4"
                    >
                        Show Current Card Order
                    </button>

                    <button
                        onClick={clearStorage}
                        className="px-4 py-2 bg-red-500 text-white rounded mr-4"
                    >
                        Clear Card Order
                    </button>

                    <button
                        onClick={resetAllVisibleCards}
                        className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                        Reset All Cards to Visible
                    </button>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">Storage Data</h2>
                    <pre id="storage-data" className="p-4 bg-gray-100 rounded-lg overflow-auto max-h-96 w-full"></pre>
                </div>

                <div className="mt-8">
                    <a href="/dashboard" className="px-4 py-2 bg-purple-500 text-white rounded">
                        Go to Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
}
