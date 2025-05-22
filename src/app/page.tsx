"use client";

import { useEffect } from "react";

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
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-blue-500">DevDashboard</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#why" className="text-gray-300 hover:text-white transition-colors">Why DevDashboard</a>
            <a href="#how" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
          </nav>
          <div>
            <button className="px-4 py-2 rounded-lg bg-violet-600/20 text-violet-400 border border-violet-600/30 hover:bg-violet-600/30 transition-colors text-sm font-medium">
              Sign In
            </button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden border-b border-gray-800/40">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.2) 2px, transparent 0)' }}></div>
        
        {/* Animated blobs */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-violet-600/20 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 left-40 w-72 h-72 bg-purple-600/20 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center justify-center max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-violet-500/10 border border-violet-500/20 text-sm text-violet-400">
              <span className="mr-2 h-2 w-2 rounded-full bg-violet-500"></span>
              Developer-focused productivity
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500">DevDashboard</span>
            </h1>
            
            <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-4 leading-relaxed">
              A lightweight, personal productivity web app made specifically for developers.
            </p>
            
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              Combine GitHub insights with a simple daily goals tracker in one centralized space.
            </p>
            
            <p className="mb-6 text-gray-400 text-sm max-w-lg mx-auto">&quot;DevDashboard transformed my workflow completely. I finally have all my critical dev metrics in one place. It&#39;s like having a personal assistant that keeps me focused on what matters.&quot;</p>
          
            {/* Feature badges */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-300 mb-10">
              <div className="flex items-center px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div> Live GitHub data
              </div>
              <div className="flex items-center px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full mr-2"></div> Privacy focused
              </div>
              <div className="flex items-center px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div> Free to use
              </div>
            </div>
            
            {/* Email signup */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-12 relative z-10">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full p-3.5 bg-gray-900/80 border border-gray-700 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="px-6 py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-purple-900/30">
                  Get Early Access
                </button>
                <a href="/dashboard" className="px-6 py-3.5 bg-gray-800/80 hover:bg-gray-700/80 text-white font-medium rounded-lg transition-all duration-200 border border-gray-700 flex items-center justify-center">
                  View Dashboard Demo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-b border-gray-800/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to stay productive and organized in your development workflow.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:bg-gray-900/80 transition-all duration-200">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">GitHub Activity</h3>
              <p className="text-gray-400">Track your commits, PRs, and issues across all your repositories in one centralized view.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:bg-gray-900/80 transition-all duration-200">
              <div className="w-12 h-12 bg-violet-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Daily Goals</h3>
              <p className="text-gray-400">Set and track your daily development goals with a simple, distraction-free interface.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:bg-gray-900/80 transition-all duration-200">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Privacy Focused</h3>
              <p className="text-gray-400">Your data stays on your machine. We don&apos;t track, store, or sell your information.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-violet-600/20 to-blue-600/20 border border-violet-500/20 rounded-2xl p-10 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Start boosting your productivity today</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Join other developers who have streamlined their workflow with DevDashboard.
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-purple-900/30 text-lg">
              Get Started – It&apos;s Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-blue-500">DevDashboard</span>
              </h3>
              <p className="text-gray-400">Your development companion.</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} DevDashboard. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
