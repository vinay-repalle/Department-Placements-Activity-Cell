import React from 'react'
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import DPNMembers from '../components/DPNMembers';
import Footer from '../components/Footer';
import logo from '../assets/RGUKT logo.png';

const features = [
  {
    title: 'Alumni Sessions',
    description: 'Alumni can host webinars, workshops, and interactive sessions to share their expertise and guide students.',
    icon: '🎤',
  },
  {
    title: 'Mentorship',
    description: 'Students can connect with alumni for personalized mentorship, career advice, and professional support.',
    icon: '🤝',
  },
  {
    title: 'Job & Internship Opportunities',
    description: 'Alumni post job and internship openings, helping students kickstart their careers.',
    icon: '💼',
  },
  {
    title: 'Faculty Collaboration',
    description: 'Faculty oversee and approve initiatives, ensuring alignment with institutional goals.',
    icon: '🎓',
  },
  {
    title: 'Community Feedback',
    description: 'Students can share feedback after events, helping improve future initiatives.',
    icon: '💬',
  },
];

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 via-white to-white min-h-screen">
      <Header />
      <Breadcrumb />
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center py-12 px-4 md:px-0 bg-gradient-to-br from-blue-100/80 via-white to-blue-50 overflow-hidden">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 drop-shadow">About the RGUKT Alumni Portal</h1>
        <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-700 mb-6 font-medium">
          Bridging the gap between RGUKT alumni and current students, fostering meaningful connections, mentorship, and opportunities for a brighter future.
        </p>
        {/* Decorative shapes */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-gradient-to-br from-blue-200/40 to-blue-400/10 rounded-full blur-2xl opacity-60 z-0"></div>
        <div className="absolute -bottom-24 right-0 w-80 h-80 bg-gradient-to-tr from-blue-100/40 to-blue-400/10 rounded-full blur-2xl opacity-50 z-0"></div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto py-10 px-4 md:px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={feature.title} className="bg-white/90 rounded-2xl shadow-lg p-8 border border-blue-100 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">{feature.title}</h3>
              <p className="text-gray-700 text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Text Section */}
      <section className="max-w-3xl mx-auto py-8 px-4 md:px-0">
        <div className="bg-white/80 rounded-2xl shadow p-6 border border-blue-100">
          <h2 className="font-bold text-2xl text-blue-900 mb-4">Our Mission</h2>
          <p className="mb-3 text-gray-700 text-lg">
            This platform is designed to bridge the gap between RGUKT alumni and current students, fostering meaningful connections and opportunities. Alumni can conduct sessions, share job and internship openings, and guide students through their professional journeys. Faculty members oversee and approve these initiatives to ensure alignment with institutional goals. Students gain access to approved events, opportunities, and mentorship, empowering them to grow academically and professionally. Together, we build a stronger RGUKT community, where knowledge, experience, and collaboration thrive.
          </p>
          <p className="mb-3 text-gray-700 text-lg">
            Alumni can host webinars, workshops, and interactive sessions, post job and internship opportunities, and offer mentorship. Faculty members review and approve alumni requests, ensuring alignment with the institution’s objectives. Students can explore approved job postings, internships, and events tailored to their interests and career goals, gaining industry insights and practical knowledge.
          </p>
          <p className="mb-3 text-gray-700 text-lg">
            This platform is more than just a tool—it’s a community where alumni, faculty, and students come together to create a brighter future. Join us today and be a part of this transformative journey.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-8 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-2">Ready to Connect?</h2>
        <p className="text-gray-700 mb-4">Join the RGUKT Alumni Portal and be part of a vibrant, supportive community!</p>
        <a href="/signin" className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300">Get Started</a>
      </section>

      {/* DPN Members and Footer */}
      <DPNMembers />
      <Footer />
    </div>
  )
}

export default AboutUs