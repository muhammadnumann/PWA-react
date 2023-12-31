import React from 'react'
import PanicSection from '../../Components/Dashboard Components/PanicSection'
import AllProducts from '../../Components/Dashboard Components';

const HomeRetailer = (props) => {
    const { children } = props;
    return (
        <div>
            <PanicSection />
            <AllProducts> 
                {children}
            </AllProducts>
        </div>
    )
}

export default HomeRetailer