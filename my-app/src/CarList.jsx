import React, { useState, useEffect } from 'react';
import carData from './locations.json'; // Import the JSON file
import './CarList.css'; // Import the CSS file

const CarList = () => {
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    interior: 'all',
    exterior: 'all',
    minFuel: 0,
  });
  const [sortOption, setSortOption] = useState('name'); // Default sorting option
  const [fuelSortOrder, setFuelSortOrder] = useState('ascending'); // For fuel sorting order

  useEffect(() => {
    // Set the car data from the imported JSON file
    setCars(carData.placemarks);
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };

  // Handle sorting option change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Handle fuel sort order change (ascending/descending)
  const handleFuelSortOrderChange = (e) => {
    setFuelSortOrder(e.target.value);
  };

  // Filter and search logic
  const filteredCars = cars.filter((car) => {
    const matchesSearchTerm = car.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInterior = filter.interior === 'all' || car.interior === filter.interior;
    const matchesExterior = filter.exterior === 'all' || car.exterior === filter.exterior;
    const matchesFuel = car.fuel >= filter.minFuel;

    return matchesSearchTerm && matchesInterior && matchesExterior && matchesFuel;
  });

  // Sorting logic (applied to the filtered cars)
  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortOption === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'fuel') {
      return fuelSortOrder === 'ascending' ? a.fuel - b.fuel : b.fuel - a.fuel;
    }
    return 0;
  });

  return (
    <div>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
        />

        <div className="filter-group">
          <label>Interior Condition:</label>
          <select name="interior" onChange={handleFilterChange} value={filter.interior}>
            <option value="all">All</option>
            <option value="GOOD">Good</option>
            <option value="UNACCEPTABLE">Unacceptable</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Exterior Condition:</label>
          <select name="exterior" onChange={handleFilterChange} value={filter.exterior}>
            <option value="all">All</option>
            <option value="GOOD">Good</option>
            <option value="UNACCEPTABLE">Unacceptable</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Minimum Fuel Level:</label>
          <input
            type="number"
            name="minFuel"
            onChange={handleFilterChange}
            value={filter.minFuel}
            className="number-input"
            min="0"
            max="100"
          />
        </div>

        {/* Sorting Option */}
        <div className="filter-group">
          <label>Sort By:</label>
          <select name="sortOption" onChange={handleSortChange} value={sortOption}>
            <option value="name">Name</option>
            <option value="fuel">Fuel Level</option>
          </select>
        </div>

        {/* Fuel Sort Order (only visible if sorting by fuel) */}
        {sortOption === 'fuel' && (
          <div className="filter-group">
            <label>Fuel Sort Order:</label>
            <select name="fuelSortOrder" onChange={handleFuelSortOrderChange} value={fuelSortOrder}>
              <option value="ascending">Ascending</option>
              <option value="descending">Descending</option>
            </select>
          </div>
        )}
      </div>

      <div className="car-list">
        {sortedCars.map((car) => (
          <div key={car.vin} className="car-card">
            <h3>{car.name}</h3>
            <p><strong>Address:</strong> {car.address}</p>
            <p><strong>Engine Type:</strong> {car.engineType}</p>
            <p><strong>Fuel Level:</strong> {car.fuel}%</p>
            <p><strong>Interior Condition:</strong> {car.interior}</p>
            <p><strong>Exterior Condition:</strong> {car.exterior}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarList;
