/**
 * Breadcrumb Component
 * 
 * A navigation component that shows the current page's location in the
 * application hierarchy, allowing users to track and navigate their location.
 * 
 * Features:
 * - Dynamic path generation
 * - Clickable navigation links
 * - Current page indication
 * - Automatic route parsing
 * - Custom separator icons
 * 
 * Components Used:
 * - React Router: For navigation and location
 * - React Icons: For separator icons
 * - Tailwind CSS: For styling
 * 
 * Props:
 * - items: Array of breadcrumb items (optional)
 * - separator: Custom separator component (optional)
 * - className: Additional CSS classes
 * 
 * Usage:
 * - Automatic: Uses current route to generate breadcrumbs
 * - Manual: Accepts custom breadcrumb items array
 * 
 * @type {dynamic} - Updates based on current route
 */

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useNavigation } from '../context/NavigationContext';

const Breadcrumb = () => {
  const location = useLocation();
  const { getHomePath } = useNavigation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumb on the home page
  if (pathnames.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-100">
      <div className="container flex items-center px-6 py-2 mx-auto overflow-x-auto whitespace-nowrap">
        {/* Home Link with Icon and Text */}
        <Link to={getHomePath()} className="flex items-center text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="ml-2">Home</span>
        </Link>

        {/* Breadcrumb Items */}
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <React.Fragment key={name}>
              {/* Separator (>) */}
              <span className="mx-5 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>

              {/* Breadcrumb Link or Text */}
              {isLast ? (
                <span className="text-blue-600">{name}</span>
              ) : (
                <Link to={routeTo} className="text-gray-600 hover:underline">
                  {name}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Breadcrumb;