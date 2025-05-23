"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { Code, CheckCircle, PieChart, Clock, Star, ExternalLink } from 'lucide-react';

export default function Home() {
  // Force dark mode for the landing page
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);

  // Animated elements for orbit effect
  const [animateOrbit, setAnimateOrbit] = useState(false);
  
  useEffect(() => {
    // Start animation after page load
    const timer = setTimeout(() => setAnimateOrbit(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-violet-950/30 to-gray-950 text-white overflow-hidden">
      {/* Header/Navigation */}
      <header className="border-b border-gray-800/40 backdrop-blur-lg bg-black/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2 pl-2">
            <div className="h-7 w-7 rounded-full overflow-hidden flex items-center justify-center transform hover:scale-110 transition-all duration-300">
              <Image src="/Group 2.svg" alt="DevDashboard Logo" width={28} height={28} className="h-full w-full" />
            </div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-blue-500 font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>DevDashboard</h1>
          </div>
          <nav className="hidden md:flex items-center justify-center space-x-6 text-xs font-medium flex-1 mx-6">
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
            <Link href="#why" className="text-gray-300 hover:text-white transition-colors">Why DevDashboard</Link>
            <Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors">Testimonials</Link>
          </nav>
          <div className="flex space-x-3">
            <Link href="/dashboard" className="px-3 py-1.5 rounded-md bg-gray-800/80 text-gray-300 border border-gray-700/30 hover:bg-gray-700/80 transition-all duration-300 text-xs font-medium">
              Try Demo
            </Link>
            <button className="px-3 py-1.5 rounded-md bg-violet-600/20 text-violet-400 border border-violet-600/30 hover:bg-violet-600/30 transition-all duration-300 text-xs font-medium font-mono button-hover" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
              Sign In
            </button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%238B5CF6\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
        
        {/* Animated blobs */}
        <div className="absolute top-20 -left-32 w-96 h-96 bg-violet-600/20 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 -right-32 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-1/2 bg-gradient-to-b from-violet-500/5 to-transparent rounded-full opacity-30 blur-3xl"></div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center justify-center max-w-4xl mx-auto text-center">
            {/* Top badge */}
            <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs text-violet-400 animate-fade-in">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse"></span>
              Dev Metrics + Productivity in One Platform
            </div>
            
            {/* Heading */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight font-mono animate-slide-up" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
              Unlock Your 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-purple-500 to-blue-500 px-2">Developer</span>
              Potential
            </h1>
            
            <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-4 leading-relaxed animate-slide-up animate-delay-100">
              The all-in-one dashboard that brings together your GitHub activity, productivity metrics, and daily goals in one beautifully designed interface.
            </p>
            
            <p className="text-sm text-gray-400 max-w-lg mx-auto mb-8 animate-slide-up animate-delay-200">
              Connect your GitHub account, track your progress, and boost your productivity with our intuitive developer dashboard.
            </p>
          
            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 mb-10 animate-fade-in animate-delay-300">
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-400 mb-1">25k+</div>
                <div className="text-xs text-gray-400">Developers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-1">1M+</div>
                <div className="text-xs text-gray-400">Commits Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-1">99.9%</div>
                <div className="text-xs text-gray-400">Uptime</div>
              </div>
            </div>
            
            {/* Feature badges */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-300 mb-8 animate-slide-up animate-delay-300">
              <div className="flex items-center px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-colors duration-300 cursor-pointer">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div> GitHub Integration
              </div>
              <div className="flex items-center px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 hover:bg-violet-500/20 transition-colors duration-300 cursor-pointer">
                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full mr-1.5"></div> Privacy Focused
              </div>
              <div className="flex items-center px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors duration-300 cursor-pointer">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></div> Dark Mode
              </div>
              <div className="flex items-center px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 transition-colors duration-300 cursor-pointer">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-1.5"></div> Free to Use
              </div>
            </div>
            
            {/* CTA Section */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-12 relative z-10 animate-slide-up animate-delay-400">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full p-3 bg-gray-900/80 border border-gray-700 rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 text-sm"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-purple-900/30 text-sm font-mono button-hover button-press" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                Get Early Access
              </button>
            </div>

            {/* Orbit visualization */}
            <div className="relative w-full max-w-2xl h-80 mx-auto mb-12">
              {/* Center hub */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mb-2 shadow-lg shadow-violet-500/20 overflow-hidden">
                    <Image src="/Group 2.svg" alt="DevDashboard Logo" width={64} height={64} className="h-full w-full" />
                  </div>
                  <div className="text-sm font-semibold text-white">DevDashboard</div>
                </div>
              </div>

              {/* Orbit circles */}
              <div className={`absolute top-1/2 left-1/2 w-40 h-40 border border-gray-700/30 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${animateOrbit ? 'animate-spin-slow' : ''}`} style={{ animationDuration: '30s' }}>
                <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-green-900/80 border border-green-500/50 flex items-center justify-center shadow-lg shadow-green-500/10">
                  <Code className="w-3 h-3 text-green-400" />
                </div>
              </div>
              <div className={`absolute top-1/2 left-1/2 w-72 h-72 border border-gray-700/20 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${animateOrbit ? 'animate-spin-slow-reverse' : ''}`} style={{ animationDuration: '45s' }}>
                <div className="absolute -right-3 top-1/4 w-6 h-6 rounded-full bg-blue-900/80 border border-blue-500/50 flex items-center justify-center shadow-lg shadow-blue-500/10">
                  <CheckCircle className="w-3 h-3 text-blue-400" />
                </div>
                <div className="absolute left-1/4 -bottom-3 w-6 h-6 rounded-full bg-purple-900/80 border border-purple-500/50 flex items-center justify-center shadow-lg shadow-purple-500/10">
                  <PieChart className="w-3 h-3 text-purple-400" />
                </div>
              </div>
              <div className={`absolute top-1/2 left-1/2 w-96 h-96 border border-gray-700/10 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${animateOrbit ? 'animate-spin-slow' : ''}`} style={{ animationDuration: '60s' }}>
                <div className="absolute -left-3 bottom-1/3 w-6 h-6 rounded-full bg-orange-900/80 border border-orange-500/50 flex items-center justify-center shadow-lg shadow-orange-500/10">
                  <Clock className="w-3 h-3 text-orange-400" />
                </div>
                <div className="absolute right-1/3 -top-3 w-6 h-6 rounded-full bg-pink-900/80 border border-pink-500/50 flex items-center justify-center shadow-lg shadow-pink-500/10">
                  <Star className="w-3 h-3 text-pink-400" />
                </div>
              </div>
            </div>

            {/* Demo button */}
            <div className="animate-fade-in animate-delay-500">
              <Link href="/dashboard" 
                className="px-6 py-3 bg-gray-800/80 hover:bg-gray-700/80 text-white font-medium rounded-lg transition-all duration-300 border border-gray-700 flex items-center justify-center gap-2 text-sm font-mono mx-auto button-hover button-press" 
                style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                <span>View Live Demo</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
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
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-6 w-6 rounded-full overflow-hidden flex items-center justify-center">
                <Image src="/Group 2.svg" alt="DevDashboard Logo" width={24} height={24} className="h-full w-full" />
              </div>
              <div>
                <h3 className="text-base font-bold font-mono" style={{ fontFamily: 'var(--font-jetbrains-mono)' }}>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-blue-500">DevDashboard</span>
                </h3>
                <p className="text-gray-400 text-xs">The developer&apos;s productivity hub.</p>
              </div>
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
