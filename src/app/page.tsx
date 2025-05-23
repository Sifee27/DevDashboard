"use client";

import { useEffect } from "react";
// No icons needed after removing the How It Works section

export default function Home() {
  // Force dark mode for the landing page
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-black text-white">
      {/* Header/Navigation */}
      <header className="border-b border-gray-800/40 backdrop-blur-sm bg-black/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2 pl-2">
            <div className="h-7 w-7 rounded-md bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-blue-500 font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>DevDashboard</h1>
          </div>
          <nav className="hidden md:flex items-center justify-center space-x-6 text-xs font-medium flex-1 mx-6">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#why" className="text-gray-300 hover:text-white transition-colors">Why DevDashboard</a>
            <a href="#how" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
          </nav>
          <div>
            <button className="px-3 py-1.5 rounded-md bg-violet-600/20 text-violet-400 border border-violet-600/30 hover:bg-violet-600/30 transition-colors text-xs font-medium font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
              Sign In
            </button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden border-b border-gray-800/40">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2px, transparent 0)' }}></div>
        
        {/* Animated blobs */}
        <div className="absolute top-20 -left-20 w-80 h-80 bg-violet-600/20 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-80 h-80 bg-blue-500/20 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center justify-center max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-2 py-0.5 mb-4 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-400">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-violet-500"></span>
              Dev Metrics + Productivity
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500">DevDashboard</span>
            </h1>
            
            <p className="text-base text-gray-200 max-w-xl mx-auto mb-3 leading-relaxed">
              The lightweight productivity tool that developers actually need.
            </p>
            
            <p className="text-xs text-gray-400 max-w-lg mx-auto mb-5">
              Your GitHub activity and daily goals in one clean interface.
            </p>
          
            {/* Feature badges */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-300 mb-8">
              <div className="flex items-center px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-1 h-1 bg-green-500 rounded-full mr-1.5"></div> GitHub data
              </div>
              <div className="flex items-center px-2 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
                <div className="w-1 h-1 bg-violet-500 rounded-full mr-1.5"></div> Privacy first
              </div>
              <div className="flex items-center px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                <div className="w-1 h-1 bg-blue-500 rounded-full mr-1.5"></div> Free to use
              </div>
            </div>
            
            {/* Email signup */}
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mb-10 relative z-10">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full p-2 bg-gray-900/80 border border-gray-700 rounded-md backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 text-sm"
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium rounded-md transition-all duration-200 shadow-lg shadow-purple-900/30 text-sm font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                  Get Early Access
                </button>
                <a href="/dashboard" className="px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 text-white font-medium rounded-md transition-all duration-200 border border-gray-700 flex items-center justify-center text-sm font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                  View Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 border-b border-gray-800/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Key Features</h2>
            <p className="text-gray-400 max-w-lg mx-auto text-sm">
              Everything you need in one clean interface.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg p-5 hover:bg-gray-900/80 transition-all duration-200">
              <div className="w-10 h-10 bg-green-500/10 rounded-md flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-1.5 font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>GitHub Activity</h3>
              <p className="text-gray-400 text-sm">Track commits, PRs, and issues across all your repos in one view.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg p-5 hover:bg-gray-900/80 transition-all duration-200">
              <div className="w-10 h-10 bg-violet-500/10 rounded-md flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-1.5 font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Daily Goals</h3>
              <p className="text-gray-400 text-sm">Track development goals with a distraction-free interface.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg p-5 hover:bg-gray-900/80 transition-all duration-200">
              <div className="w-10 h-10 bg-blue-500/10 rounded-md flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-base font-bold mb-1.5 font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Privacy First</h3>
              <p className="text-gray-400 text-sm">Your data stays on your machine. No tracking or data collection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why DevDashboard Section */}
      <section id="why" className="py-12 border-b border-gray-800/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Why DevDashboard</h2>
            <p className="text-gray-400 max-w-lg mx-auto text-sm">
              Designed by developers, for developers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-center">
            <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg p-5">
              <h3 className="text-base font-bold mb-2 font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Focus on what matters</h3>
              <p className="text-gray-400 text-sm">No more context switching between GitHub, Jira, and your to-do list. Everything you need is in one dashboard.</p>
            </div>
            <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-lg p-5">
              <h3 className="text-base font-bold mb-2 font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Minimize distractions</h3>
              <p className="text-gray-400 text-sm">Clean, minimal interface designed to keep you in flow state. No ads, notifications, or other distractions.</p>
            </div>
          </div>
        </div>
      </section>


      
      {/* CTA Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-violet-600/20 to-blue-600/20 border border-violet-500/20 rounded-lg p-6 md:p-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>Ship faster</h2>
            <p className="text-sm text-gray-300 max-w-lg mx-auto mb-5">
              Join developers who have optimized their workflow with DevDashboard.
            </p>
            <button className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium rounded-md transition-all duration-200 shadow-lg shadow-purple-900/30 text-sm font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
              Start Now – It&apos;s Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-base font-bold mb-1.5 font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-blue-500">DevDashboard</span>
              </h3>
              <p className="text-gray-400 text-xs">The developer&apos;s productivity hub.</p>
            </div>
            <div className="flex gap-4 text-xs">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-500 text-xs">
            © {new Date().getFullYear()} DevDashboard. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
