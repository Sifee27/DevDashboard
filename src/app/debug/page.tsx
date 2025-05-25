"use client";

export default function CheckLocalStorage() {
  // Add a button to clear localStorage for dashboard
  function clearDashboardLocalStorage() {
    localStorage.removeItem('devdashboard-card-order');
    localStorage.removeItem('devdashboard-visual-settings');
    localStorage.removeItem('devdashboard-checklist');
    localStorage.removeItem('devdashboard-theme');
    alert('Dashboard localStorage cleared. Please refresh the page.');
  }
  function showDashboardLocalStorage() {
    const cardOrder = localStorage.getItem('devdashboard-card-order');
    const visualSettings = localStorage.getItem('devdashboard-visual-settings');
    
    const element = document.getElementById('localStorage-results');
    if (element) {
      element.innerText = 
        `Card Order: ${cardOrder}\n\nVisual Settings: ${visualSettings}`;
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard localStorage Debugger</h1>
      <div className="space-y-4">
        <button 
          onClick={showDashboardLocalStorage}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Show localStorage Content
        </button>
        <button 
          onClick={clearDashboardLocalStorage}
          className="px-4 py-2 bg-red-500 text-white rounded ml-4"
        >
          Clear Dashboard localStorage
        </button>
        <pre id="localStorage-results" className="mt-4 p-4 bg-gray-100 rounded overflow-auto max-h-96"></pre>
      </div>
    </div>
  );
}
