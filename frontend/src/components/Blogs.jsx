import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const cardData = [
  {
    title: 'Ongoing Sessions',
    img: 'src/assets/type4OS.jpg',
    alt: 'Ongoing Sessions',
    link: '/sessions#ongoing-sessions',
    subtitle: 'Sessions currently happening on campus',
    description: 'Join our ongoing sessions to interact with experts and peers, and enhance your learning experience in real time.',
    accent: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    btn: 'from-cyan-500 to-blue-500',
  },
  {
    title: 'Upcoming Sessions',
    img: 'src/assets/type4US.jpg',
    alt: 'Upcoming Sessions',
    link: '/sessions#upcoming-sessions',
    subtitle: 'Exciting sessions scheduled for the future',
    description: 'Stay tuned for our upcoming sessions featuring industry leaders and alumni sharing their insights and journeys.',
    accent: 'bg-gradient-to-r from-yellow-400 to-pink-400',
    btn: 'from-yellow-400 to-pink-400',
  },
  {
    title: 'Previous Sessions',
    img: 'src/assets/type4PS.jpg',
    alt: 'Previous Sessions',
    link: '/sessions#previous-sessions',
    subtitle: 'Explore our archive of past sessions',
    description: 'Browse through our previous sessions to revisit valuable discussions and resources shared by our community.',
    accent: 'bg-gradient-to-r from-purple-500 to-pink-500',
    btn: 'from-purple-500 to-pink-500',
  },
];

const Blogs = () => {
  const { user } = useAuth();
  
  // Only show session cards for alumni users
  if (!user || user.role !== 'alumni') {
    return null;
  }

  return (
    <div className="mx-auto p-2 mt-12 mb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {cardData.map((card, idx) => (
          <div
            key={card.title}
            className="relative flex flex-col items-center bg-white/60 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-2xl pt-16 pb-8 px-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.25)] hover:ring-2 hover:ring-blue-200 group"
            style={{ minHeight: '370px' }}
          >
            {/* Circular Image - Overlapping Card */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full shadow-lg border-4 border-white overflow-hidden flex items-center justify-center bg-gray-100 group-hover:scale-105 transition-transform duration-300">
              <img
                src={card.img}
                alt={card.alt}
                className="w-full h-full object-cover object-center"
              />
          </div>
            {/* Title with Accent Underline */}
            <h3 className="mt-6 text-2xl font-extrabold text-gray-900 text-center tracking-tight">
              {card.title}
            </h3>
            <div className={`mx-auto mt-2 mb-3 w-16 h-1 rounded-full ${card.accent} opacity-80`} />
            {/* Subtitle/Description */}
            <p className="text-gray-700 text-center text-base mb-2 min-h-[32px]">
              {card.subtitle}
            </p>
            {/* New Description */}
            <p className="text-sm text-gray-600 text-center mb-6 min-h-[40px]">
              {card.description}
            </p>
            {/* Button */}
            <Link
              className={`mt-auto px-7 py-2 rounded-full bg-gradient-to-r ${card.btn} text-lg font-semibold text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-200`}
              to={card.link}
            >
              View More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;


    // Code for different tpe of cars\d model ....

        {/* // <section class="px-4 py-4 mx-auto max-w-7xl broder border-black">
        // <h2 class="mb-2 text-2xl font-extrabold leading-tight text-gray-900">Skcript Blog</h2>
        // <div class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        //     <div>
        //     <a href="#">
        //         <img src="src/assets/type1OS.jpg"" class="object-cover w-full h-56 mb-5 bg-center rounded" alt="Kutty" loading="lazy" />
        //     </a>
        //     <h2 class="mb-2 text-lg font-semibold text-gray-900">
        //         <a href="#" class="text-gray-900 hover:text-purple-700">Process Documents Using Artificial Intelligence For RPA Bots</a>
        //     </h2>
        //     </div>
        //     <div>
        //     <a href="#">
        //         <img src="src/assets/type1OS.jpg"" class="object-cover w-full h-56 mb-5 bg-center rounded" alt="Kutty" loading="lazy" />
        //     </a>
        //     <h2 class="mb-2 text-lg font-semibold text-gray-900">
        //         <a href="#" class="text-gray-900 hover:text-purple-700">Implement Dark Mode in Your Android App</a>
        //     </h2>
        //     </div>
        //     <div>
        //     <a href="#">
        //         <img src="src/assets/type1OS.jpg"" class="object-cover w-full h-56 mb-5 bg-center rounded" alt="Kutty" loading="lazy" />
        //     </a>
        //     <h2 class="mb-2 text-lg font-semibold text-gray-900">
        //         <a href="#" class="text-gray-900 hover:text-purple-700">Why is Mental Health one of the Important Issues to Address?</a>
        //     </h2>
        //     </div>
        //    </div>
        // </section> */}

