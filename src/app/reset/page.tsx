"use client";

export default function ResetStorage() {
  function clearStorage() {
    localStorage.removeItem('devdashboard-card-order');
    alert('Card order reset successfully! Please refresh the dashboard.');
  }
  function showStorage() {
    const data = localStorage.getItem('devdashboard-card-order');
    const element = document.getElementById('storage-data');
    if (element) {
      element.innerText = data || 'No data found';
    }
  }

  function resetAllVisibleCards() {    const defaultCards = [
      { id: 'github-activity', title: 'Recent Activity Heatmap', type: 'github-activity', colSpan: 'col-span-1 lg:col-span-2', visible: true },
      { id: 'commit-line-chart', title: 'Commit Activity Over Time', type: 'commit-line-chart', colSpan: 'col-span-1 lg:col-span-2', visible: true },
      { id: 'goals', title: "Today's Goals", type: 'goals', colSpan: 'col-span-1', visible: true },
      { id: 'pomodoro', title: 'Pomodoro Timer', type: 'pomodoro', colSpan: 'col-span-1', visible: true },
      { id: 'quick-links', title: 'Quick Links', type: 'quick-links', colSpan: 'col-span-1', visible: true },
      { id: 'quick-notes', title: 'Quick Notes', type: 'quick-notes', colSpan: 'col-span-1 lg:col-span-2', visible: true },
      { id: 'languages', title: 'Languages Used', type: 'languages', colSpan: 'col-span-1', visible: true },
      { id: 'pull-requests', title: 'Pull Requests', type: 'pull-requests', colSpan: 'col-span-1 lg:col-span-2', visible: true },
      { id: 'repositories', title: 'Top Repositories', type: 'repositories', colSpan: 'col-span-1 lg:col-span-2', visible: true }
    ];
    
    localStorage.setItem('devdashboard-card-order', JSON.stringify(defaultCards));
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
