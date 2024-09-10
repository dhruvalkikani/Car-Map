import React from 'react';
import CarList from './CarList';
import CarMap from './CarMap';
import './App.css'; // Import the CSS file

function App() {
  return (
    <div className="main-layout">
      <div className="left-column">
       <h2>Car List</h2> 
        <CarList />
      </div>
      <div className="right-column">
       <h2>Map</h2>
        <CarMap />
      </div>
    </div>
  );
}

export default App;
