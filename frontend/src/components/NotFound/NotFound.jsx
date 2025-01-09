import React from 'react';
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className='page not found'>
        <div className='content'>
            <img src="/notfound.png" alt="notfound"/>
            <Link to={"/"}>Return to home</Link>
            
        </div>


    </section>
  )
}

export default NotFound;
