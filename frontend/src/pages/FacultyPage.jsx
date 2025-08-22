import React from 'react'
import Header from '../components/Header';
import MainNavbar from '../components/MainNavbar';
import Carousel from '../components/Carousel';
import PlacementsProgres from '../components/PlacementsProgres';
import Blogs from '../components/Blogs';
import PlacementDriveCards from '../components/PlacementDriveCards';
import RequestSession from '../components/RequestSession';
import Footer from '../components/Footer';
const FacultyPage = () => {
  return (
    <>
        <Header />
        <MainNavbar />
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
        <Blogs />
        <PlacementDriveCards />
        <RequestSession />
        <Footer />
    </>
  )
}

export default FacultyPage