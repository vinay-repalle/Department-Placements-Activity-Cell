/**
 * Header Component
 * 
 * A reusable header component that provides page titles and contextual
 * information for different sections of the application.
 * 
 * Features:
 * - Dynamic page titles
 * - Breadcrumb navigation
 * - Action buttons (conditional)
 * - Role-based content
 * - Responsive design
 * 
 * Components Used:
 * - Breadcrumb: For navigation path
 * - React Router: For location awareness
 * - AuthContext: For user role checks
 * - Tailwind CSS: For styling
 * 
 * Props:
 * - title: Page title
 * - subtitle: Optional subtitle
 * - showBreadcrumb: Whether to show breadcrumb
 * - actions: Array of action buttons
 * 
 * Layout:
 * - Left: Title and breadcrumb
 * - Right: Action buttons
 * - Mobile: Stacked layout
 * 
 * @type {dynamic} - Content changes based on current page and user role
 */

import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/RGUKT logo.png';
// import './Header.css'; // Import CSS for this component

const Header = () => {
  return (
    <>
      {/* Header */}
      <div className="text-red-800 flex text-center justify-center leading-[1.1]">
        <div>
        <img src={logo} className="hidden lg:block h-20"  alt='Rgukt logo' / >
        </div>
        <div>
          <span className="font-bold lg:text-[25px] sm:text-[20px] select-none">  Department Placements Activity Cell</span> <br />
          <span className=" lg:text-[18px] select-none">   Rajiv Gandhi University of Knowledge Technologies - Nuzvid (AP) </span> <br />
          <span className="hidden md:inline text-[14px] select-none">
          Catering to the Educational Needs of Gifted Rural Youth of Andhra <br />
          (Established by the Govt. of Andhra Pradesh and recognized as per Section 2(f) of UGC Act, 1956) <br /> 
          Accredited by <b>'NAAC'</b> with <b>'B+'</b> Grade</span>
          {/* --<span class="tel hidden-xs">రాజీవ్ గాంధీ వైజ్ఞానిక సాంకేతిక విశ్వవిద్యాలయం, నూజివీడు </span><br> */}
        </div>
      </div>  
       {/* <Link to ='/'>Home </Link> */}
    </>
  );
};

export default Header;
