import { useEffect, useState } from 'react'
import './App.css'

export default function App() {

  const [countries, setCountries] = useState([]) 
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(true);


useEffect(() => {
  fetch('https://restcountries.com/v3.1/all')
    .then(r => r.json())
    .then(data => {
      setCountries(data)
      
    })
    
}, [])
const filteredCountries = countries.filter(country => {
  const matchesSearch = country.name.common.toLowerCase().includes(searchTerm.toLowerCase());
  const matchesRegion = regionFilter ? country.region === regionFilter : true;
  return matchesSearch && matchesRegion
});
  
    function SelectedCountry({ country }) {
  const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
  const currencies = country.currencies
    ? Object.values(country.currencies).map(cur => cur.name).join(', ')
    : 'N/A';
  return(
    <>
    <div className="detail-container">
    <button className='back-btn' onClick={() => setSelectedCountry(null)}>Back</button>
    <div className="selected-country-card">
      <div className="selected-country-info">
        <img src={selectedCountry.flags.png} alt="" />
        <div className="infos">
        <div className="info-1">
        <h2>{selectedCountry.name.common}</h2>
        <p><strong>Native Name: </strong>{selectedCountry.name.official} </p>
        <p><strong>Population: </strong>{selectedCountry.name.common} </p>
        <p><strong>Region: </strong>{selectedCountry.region} </p>
        <p><strong>Sub Region: </strong>{selectedCountry.subregion || " - "} </p>
        <p><strong>Capital: </strong>{selectedCountry.capital} </p>
        </div>
        <div className="info-2">
        <p><strong>Top Level Domain: </strong>{selectedCountry.tld} </p>
        <p><strong>Currencies: </strong>{currencies} </p>
        <p><strong>Languages: </strong>{languages} </p>
      </div>
      </div>
      </div>
      <div className="border-countries">
        <h3>Border Countries:</h3>
        <div className="border-country">
          {selectedCountry.borders ? selectedCountry.borders.map((border) => {
            const borderCountry = countries.find((country) => country.cca3 === border);
            return (
              <div className="border-country-card" key={border} onClick={() => setSelectedCountry(borderCountry)}>
                <img src={borderCountry.flags.png} alt="" />
                <p>{borderCountry.name.common}</p>
              </div>
            )
          }) : "No Border Countries"}
        </div>
      </div>
    </div>
    </div>
    </>
  )
}

  return (
    <>
      <div className={`container ${isDarkMode ? 'dark' : ''}`}>
        <div className={`header ${isDarkMode ? 'dark' : ''}`}>
          <h1>Where in the world?</h1>
          <button className='theme-btn' onClick={() => setIsDarkMode(!isDarkMode)}>
          <i className="fa-solid fa-moon"></i> {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
          {selectedCountry ? (
          <SelectedCountry country={selectedCountry} />
          ) : (
        <div className="main">
          <div className="filter-bar">
          <div className="search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input 
            type="text" 
            placeholder='Search for a country...' value={searchTerm} 
            onChange={(e)=> setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter">
            <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
              <option value="">Filter by Region</option>
              <option value="Africa">Africa</option>
              <option value="Americas">America</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
            </select>
          </div>
          </div>
          <div className="countries">
          {filteredCountries.map((country) => (
            <div
              className="country-card"
              key={country.cca3}
              onClick={() => setSelectedCountry(country)}>
              <img src={country.flags.png} alt="" />
              <div className="country-info">
                <h2>{country.name.common}</h2>
                <p><strong>Population: </strong> {country.population}</p>
                <p><strong>Region: </strong> {country.region}</p>
                <p><strong>Capital: </strong> {country.capital}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
        )}
      </div>
    </>
  )
}


