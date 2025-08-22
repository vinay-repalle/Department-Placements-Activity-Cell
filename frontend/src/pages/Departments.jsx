import React from 'react'
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import DepartmentMembers from '../components/DepartmentMembers';
import Footer from '../components/Footer';
import PlacementsProgres from '../components/PlacementsProgres';
const branches = [
  {
    name: 'Computer Science and Engineering',
    img: 'src/assets/cse-blog.jpg',
    color: 'from-blue-500 to-blue-700',
    desc: 'CSE students at RGUKT Nuzvid secure placements in top IT companies specializing in Web Development, Artificial Intelligence (AI), Machine Learning (ML), Data Science, Cloud Computing, and Cybersecurity. Every year, companies like TCS, Infosys, Wipro, and Capgemini recruit a significant number of graduates. Many students also get placed in startups and product-based companies working on cutting-edge technologies. A few students opt for higher studies in top universities in India and abroad to specialize in advanced computing fields.',
    icon: '💻',
  },
  {
    name: 'Electronics and Communication Engineering',
    img: 'src/assets/ece-blog.jpeg',
    color: 'from-green-500 to-green-700',
    desc: 'ECE graduates have strong placement opportunities in VLSI Design, Embedded Systems, Signal Processing, and Telecommunication. Leading companies such as Intel, Qualcomm, Texas Instruments, and TCS visit the campus for recruitment. Some students take up roles in software development due to their programming expertise, while others explore careers in robotics and IoT-based industries. A portion of students pursue higher studies (M.Tech/MS) in reputed institutes like IITs and NITs to specialize in advanced electronics.',
    icon: '📡',
  },
  {
    name: 'Electrical and Electronics Engineering',
    img: 'src/assets/eee-blog.jpg',
    color: 'from-purple-500 to-purple-700',
    desc: 'EEE students at RGUKT Nuzvid find placements in Power Systems, Electrical Design, Automation, and Renewable Energy sectors. Companies like Siemens, ABB, Schneider Electric, and Tata Power recruit graduates for core electrical roles. Some students enter the software industry, leveraging their programming skills. A few students qualify for Public Sector Undertakings (PSUs) like NTPC, BHEL, and ONGC through competitive exams. Many opt for higher studies in power electronics and automation.',
    icon: '⚡',
  },
  {
    name: 'Civil Engineering',
    img: 'src/assets/civil-blog.jpg',
    color: 'from-indigo-500 to-indigo-700',
    desc: 'Civil Engineering graduates have excellent career opportunities in Structural Engineering, Construction Management, Transportation, and Geotechnical Engineering. L&T, Tata Projects, and GMR Group are among the major recruiters. Many students secure jobs in government departments and PSUs like CPWD, PWD, and NHAI after clearing competitive exams. Some graduates become entrepreneurs in construction and real estate, while others pursue higher studies in IITs and NITs to specialize in smart city planning and sustainable infrastructure.',
    icon: '🏗️',
  },
  {
    name: 'Mechanical Engineering',
    img: 'src/assets/mech-blog.jpg',
    color: 'from-red-500 to-red-700',
    desc: 'Mechanical Engineering students secure placements in Automobile, Manufacturing, Robotics, and Thermal Engineering sectors. Companies like Tata Motors, Mahindra, Ashok Leyland, and Bajaj Auto regularly recruit from the campus. A few students opt for roles in product design and CAD/CAM industries, while others enter aerospace and defense technology. Many graduates aim for PSU jobs in organizations like BHEL, GAIL, and ISRO. Higher studies in mechanical design and automation are also a preferred choice.',
    icon: '🛠️',
  },
  {
    name: 'Chemical Engineering',
    img: 'src/assets/chem-blog.jpg',
    color: 'from-yellow-400 to-yellow-600',
    desc: 'Chemical Engineering graduates find placements in Petroleum, Process Design, Environmental Engineering, and Pharmaceuticals. Companies like ONGC, Reliance Industries, Indian Oil, and Dr. Reddy’s Laboratories recruit chemical engineers from RGUKT Nuzvid. Some students get opportunities in biotechnology and nanotechnology-based startups. A considerable number of students clear GATE to secure M.Tech admissions in IITs/NITs or PSU jobs in refineries and research institutes.',
    icon: '⚗️',
  },
  {
    name: 'Metallurgical and Materials Engineering',
    img: 'src/assets/mme-blog.jpg',
    color: 'from-teal-500 to-teal-700',
    desc: 'MME graduates have career opportunities in Steel, Mining, Aerospace, and Materials Science industries. Companies like JSW Steel, Tata Steel, Hindalco, and BARC offer placements for core metallurgical roles. Some students take up positions in welding and quality control sectors. A few opt for higher studies in material science, nanotechnology, and composite materials. Many students aim for PSU jobs in SAIL, NMDC, and IOCL, while others explore research opportunities in IITs and IISc.',
    icon: '🔬',
  },
];
const Departments = () => {
  return (
    <div>
      <Header />
      <hr />
      <Breadcrumb />
      <DepartmentMembers />
      {/* Placements Content Start */}
      <div className="bg-gradient-to-b from-blue-50 via-white to-white min-h-screen">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center text-center py-12 px-4 md:px-0 bg-gradient-to-br from-blue-100/80 via-white to-blue-50 overflow-hidden">
          <div className="max-w-3xl mx-auto z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 drop-shadow">Placements at RGUKT Nuzvid</h1>
            <p className="text-lg md:text-xl text-gray-700 mb-6 font-medium">Empowering students with top career opportunities through strong industry connections, rigorous training, and a vibrant alumni network.</p>
          </div>
          {/* Decorative shapes */}
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-gradient-to-br from-blue-200/40 to-blue-400/10 rounded-full blur-2xl opacity-60 z-0"></div>
          <div className="absolute -bottom-24 right-0 w-80 h-80 bg-gradient-to-tr from-blue-100/40 to-blue-400/10 rounded-full blur-2xl opacity-50 z-0"></div>
        </section>
        {/* About Placements Section */}
        <section className="max-w-4xl mx-auto py-10 px-4 md:px-0">
          <div className="bg-white/90 rounded-2xl shadow-lg p-8 border border-blue-100">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">About Placements</h2>
            <p className="mb-3 text-gray-700">Rajiv Gandhi University of Knowledge Technologies (RGUKT), Nuzvid, has a strong track record of placements, providing students with excellent career opportunities in top companies. The university collaborates with leading industries and organizations, ensuring students receive exposure to diverse career paths in software development, data science, cloud computing, and core engineering fields.</p>
            <p className="mb-3 text-gray-700">With a rigorous academic curriculum, hands-on projects, and dedicated placement training, RGUKT Nuzvid equips students with the skills needed to excel in competitive job markets. Every year, reputed companies like TCS, Infosys, Wipro, and Capgemini, among others, visit the campus to recruit talented graduates. The placement cell actively conducts mock interviews, aptitude tests, and coding challenges to enhance students' employability.</p>
            <p className="mb-1 text-gray-700">The university’s focus on industry-driven learning ensures that students are well-prepared to secure placements with competitive salary packages, setting a strong foundation for their professional careers. It also provides internship opportunities that help students gain practical experience before entering the workforce. The alumni network plays a key role in mentoring and guiding students through the placement process.</p>
          </div>
        </section>
        {/* Branch-wise Placements Section */}
        <section className="max-w-7xl mx-auto py-10 px-4 md:px-0">
          <h2 className="text-3xl font-extrabold text-blue-900 mb-8 text-center drop-shadow">Branch-wise Placements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {branches.map((b, i) => (
              <div
                key={b.name}
                className="group bg-white rounded-2xl shadow-xl border-t-4 border-blue-200 flex flex-col overflow-hidden transition-all duration-500 ease-out hover:scale-[1.035] hover:-translate-y-2 hover:shadow-2xl hover:border-transparent hover:ring-4 hover:ring-blue-300/30 relative"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={b.img}
                    alt={b.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-95"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${b.color} opacity-60 group-hover:opacity-80 transition-all`}></div>
                  <div className="absolute bottom-3 left-4 flex items-center gap-2">
                    <span className="text-2xl text-white drop-shadow group-hover:animate-spin-slow">{b.icon}</span>
                    <span className="text-xl font-bold text-white drop-shadow">{b.name}</span>
                  </div>
                </div>
                <div className="flex-1 p-5 flex flex-col">
                  <p className="text-gray-700 mb-2 text-sm md:text-base">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Custom keyframes for slow spin */}
        <style>{`
          @keyframes spin-slow { 100% { transform: rotate(360deg); } }
          .animate-spin-slow { animation: spin-slow 2.5s linear infinite; }
        `}</style>
      </div>
      {/* Placements Content End */}
      <Footer />
    </div>
  )
}

export default Departments