import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <img src="/chakriChailogo.png" alt="Logo" style={{ maxWidth: '800px', marginBottom: '50px' }} />
      <h3 style={{ color: 'darkblue', fontSize: '1.2rem', margin: '10px 0' }}>
        A platform where employers can post their jobs. Job seekers can find their desired jobs easily. Register now and make your life easy with ChakriChai.
      </h3>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Link to="/register" style={{ marginRight: '10px' }}>
          <button style={{ fontSize: 'small', padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px' }}>Registration</button>
        </Link>
        <Link to="/login">
          <button style={{ fontSize: 'small', padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px' }}>Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
