/**
 * Landing Page Component
 * 
 * The main entry point of the application showcasing key features
 * and providing access to different user roles.
 * 
 * Features:
 * - Hero section
 * - Feature highlights
 * - Role-based navigation
 * - Quick access links
 * 
 * Sections:
 * 1. Hero Section
 *    - Welcome message
 *    - Call to action
 *    - Background animation
 *    - Quick links
 * 
 * 2. Features Overview
 *    - Mentorship program
 *    - Knowledge sharing
 *    - Career guidance
 *    - Alumni network
 * 
 * 3. Role-based Content
 *    - Student resources
 *    - Alumni opportunities
 *    - Faculty portal
 *    - Admin access
 * 
 * 4. Information Sections
 *    - About RGUKT
 *    - Success stories
 *    - Latest updates
 *    - Contact info
 * 
 * Interactive Elements:
 * - Sign up buttons
 * - Feature cards
 * - Testimonial slider
 * - Contact forms
 * 
 * Responsive Design:
 * - Mobile optimization
 * - Tablet layouts
 * - Desktop views
 * - Dynamic content
 * 
 * Dependencies:
 * - Navigation components
 * - Authentication context
 * - Image assets
 * - Animation libraries
 * 
 * @component LandingPage
 * @example
 * ```jsx
 * <LandingPage 
 *   featuredContent={content}
 *   announcements={latest}
 * />
 * ```
 */

import React from 'react'
import Header  from '../components/Header';
import LandingPageNavbar from '../components/LandingPageNavbar'
import Carousel from '../components/Carousel';
import Footer from '../components/Footer';
import PlacementsProgres from '../components/PlacementsProgres';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <>
        <Header />
        <LandingPageNavbar />
        <div className="w-full pl-16 pr-4 flex flex-col md:flex-row justify-between">
            {/* Carousel - Full width on small screens, flexible on large screens */}
            <div className="w-full md:flex-1">
                <Carousel />
            </div>
            {/* PlacementsProgress - Fixed width on large screens */}
            <div className="w-full md:w-[450px] mt-4 md:mt-0 flex justify-center">
                <PlacementsProgres />
            </div>
        </div>
        <div className='m-1 p-2 border border-gray-400 rounded-2xl text-md '>
          <h2 className='font-bold mx-2 '></h2>
        This platform is designed to bridge the gap between RGUKT alumni and current students, fostering meaningful connections and opportunities. Alumni can conduct sessions, share job and internship openings, and guide students through their professional journeys. Faculty members oversee and approve these initiatives to ensure alignment with institutional goals. Students gain access to approved events, opportunities, and mentorship, empowering them to grow academically and professionally. Together, we build a stronger RGUKT community, where knowledge, experience, and collaboration thrive. Join us in shaping the future of RGUKT students!
        </div>

        {/* Why Join Us Section */}
        <section className="py-16 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 animate-fade-in">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-4xl font-extrabold text-center mb-10 text-blue-900 drop-shadow-lg">Why Join Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300 border-t-4 border-blue-400">
                <span className="text-6xl mb-4 animate-bounce">🤝</span>
                <h3 className="font-semibold text-xl mb-2 text-blue-700">Mentorship & Networking</h3>
                <p className="text-gray-600 text-center">Connect with experienced alumni and industry professionals for guidance and opportunities.</p>
              </div>
              <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300 border-t-4 border-purple-400">
                <span className="text-6xl mb-4 animate-pulse">🚀</span>
                <h3 className="font-semibold text-xl mb-2 text-purple-700">Career Growth</h3>
                <p className="text-gray-600 text-center">Access job openings, internships, and career resources tailored for RGUKT students and alumni.</p>
              </div>
              <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300 border-t-4 border-pink-400">
                <span className="text-6xl mb-4 animate-spin-slow">🌟</span>
                <h3 className="font-semibold text-xl mb-2 text-pink-700">Community Impact</h3>
                <p className="text-gray-600 text-center">Be part of a vibrant community that gives back, shares knowledge, and celebrates success together.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Alumni Success Stories Section */}
        <section className="py-16 bg-gradient-to-br from-white via-blue-50 to-purple-50 animate-fade-in">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-4xl font-extrabold text-center mb-10 text-purple-900 drop-shadow-lg">Alumni Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-blue-50 rounded-2xl p-8 shadow-xl flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-transform duration-300 border-b-4 border-blue-400 animate-fade-in-up">
                <img src="/src/assets/profile1.jpg" alt="Alumni 1" className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-white shadow-lg" />
                <h3 className="font-semibold text-lg text-blue-800">Priya Sharma</h3>
                <p className="text-gray-600 text-center mt-2 italic">“Thanks to the alumni network, I landed my dream job at a top tech company!”</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-8 shadow-xl flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-transform duration-300 border-b-4 border-purple-400 animate-fade-in-up delay-100">
                <img src="/src/assets/profile.jpg" alt="Alumni 2" className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-white shadow-lg" />
                <h3 className="font-semibold text-lg text-purple-800">Rahul Verma</h3>
                <p className="text-gray-600 text-center mt-2 italic">“Mentorship from seniors helped me crack competitive exams and grow professionally.”</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-8 shadow-xl flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-transform duration-300 border-b-4 border-pink-400 animate-fade-in-up delay-200">
                <img src="/src/assets/profile.webp" alt="Alumni 3" className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-white shadow-lg" />
                <h3 className="font-semibold text-lg text-pink-800">Ananya Rao</h3>
                <p className="text-gray-600 text-center mt-2 italic">“The community spirit at RGUKT is unmatched. I love giving back as a mentor!”</p>
              </div>
            </div>
          </div>
        </section>

        {/* Get Involved Section */}
        <section className="py-16 bg-gradient-to-r from-purple-200 via-blue-100 to-green-100 animate-fade-in">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold mb-6 text-blue-900 drop-shadow-lg">Get Involved</h2>
            <p className="mb-10 text-gray-700 text-lg">Ready to make a difference? Whether you’re a student, alumni, or faculty, there’s a place for you in our community. Join us and help shape the future!</p>
            <div className="flex flex-col md:flex-row justify-center gap-8">
              <button onClick={() => navigate('/studentsignup')} className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300 text-lg focus:outline-none focus:ring-4 focus:ring-blue-300">Join as Student</button>
              <button onClick={() => navigate('/alumnisignup')} className="bg-purple-600 text-white px-10 py-4 rounded-full font-bold shadow-lg hover:bg-purple-700 hover:scale-105 transition-all duration-300 text-lg focus:outline-none focus:ring-4 focus:ring-purple-300">Join as Alumni</button>
              <button onClick={() => navigate('/facultysignup')} className="bg-green-600 text-white px-10 py-4 rounded-full font-bold shadow-lg hover:bg-green-700 hover:scale-105 transition-all duration-300 text-lg focus:outline-none focus:ring-4 focus:ring-green-300">Join as Faculty</button>
            </div>
          </div>
        </section>
        <Footer />
    </>
  )
}

export default LandingPage;