import { useEffect, useState } from 'react'
import './App.css'

export default function App() {

  const [countries, setCountries] = useState([]) 
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    setIsLoading(true);
    const fields = 'name,flags,population,region,capital,subregion,currencies,languages,borders,cca3';
    fetch(`https://restcountries.com/v3.1/all?fields=${fields}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCountries(data);
        } else {
          console.error('API Error:', data);
          setCountries([]);
        }
      })
      .catch(err => {
        console.error('Fetch Error:', err);
        setCountries([]);
      })
      .finally(() => setIsLoading(false));
  }, [])

  const filteredCountries = Array.isArray(countries) ? countries.filter(country => {
    const matchesSearch = (country.name?.common || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter ? country.region === regionFilter : true;
    return matchesSearch && matchesRegion
  }) : [];

  function SkeletonGrid() {
    return (
      <div className="countries">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="country-card skeleton" style={{ height: '336px' }}></div>
        ))}
      </div>
    );
  }

  function SelectedCountry({ country }) {
    const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
    const currencies = country.currencies
      ? Object.values(country.currencies).map(cur => cur.name).join(', ')
      : 'N/A';

    return (
      <div className="detail-container">
        <button className='back-btn' onClick={() => setSelectedCountry(null)}>
          <i className="fa-solid fa-arrow-left-long"></i> Back
        </button>
        <div className="selected-country-card">
          <img src={country.flags?.png} alt={`${country.name?.common} flag`} />
          <div className="infos">
            <h2>{country.name?.common}</h2>
            <div className="info-1">
              <p><strong>Native Name: </strong>{country.name?.official} </p>
              <p><strong>Population: </strong>{country.population?.toLocaleString()} </p>
              <p><strong>Region: </strong>{country.region} </p>
              <p><strong>Sub Region: </strong>{country.subregion || " - "} </p>
              <p><strong>Capital: </strong>{country.capital || " - "} </p>
            </div>
            <div className="info-2">
              <p><strong>Top Level Domain: </strong>{country.tld?.[0] || " - "} </p>
              <p><strong>Currencies: </strong>{currencies} </p>
              <p><strong>Languages: </strong>{languages} </p>
            </div>
            <div className="border-countries">
              <h3>Border Countries:</h3>
              <div className="border-country">
                {country.borders && country.borders.length > 0 ? country.borders.map((border) => {
                  const borderCountry = countries.find((c) => c.cca3 === border);
                  return (
                    <div className="border-country-card" key={border} onClick={() => borderCountry && setSelectedCountry(borderCountry)}>
                      {borderCountry?.flags?.png && <img src={borderCountry.flags.png} alt="" />}
                      <span>{borderCountry?.name?.common || border}</span>
                    </div>
                  )
                }) : <span className="no-border-text">This country is an island or has no land borders.</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='container'>
      <header className="header">
        <h1 onClick={() => setSelectedCountry(null)}>Where in the world?</h1>
        <button className='theme-btn' onClick={() => setIsDarkMode(!isDarkMode)}>
          <i className={isDarkMode ? "fa-solid fa-sun" : "fa-solid fa-moon"}></i>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>

      <main className="main">
        {selectedCountry ? (
          <SelectedCountry country={selectedCountry} />
        ) : (
          <>
            <div className="filter-bar">
              <div className="search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  placeholder='Search for a country...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="filter">
                <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
                  <option value="">Filter by Region</option>
                  <option value="Africa">Africa</option>
                  <option value="Americas">Americas</option>
                  <option value="Asia">Asia</option>
                  <option value="Europe">Europe</option>
                  <option value="Oceania">Oceania</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <SkeletonGrid />
            ) : (
              <div className="countries">
                {filteredCountries.map((country) => (
                  <div
                    className="country-card"
                    key={country.cca3}
                    onClick={() => setSelectedCountry(country)}>
                    <img src={country.flags.png} alt={country.name.common} loading="lazy" />
                    <div className="country-info">
                      <h2>{country.name.common}</h2>
                      <p><strong>Population: </strong> {country.population?.toLocaleString()}</p>
                      <p><strong>Region: </strong> {country.region}</p>
                      <p><strong>Capital: </strong> {country.capital}</p>
                    </div>
                  </div>
                ))}
                {filteredCountries.length === 0 && (
                  <p style={{ textAlign: 'center', gridColumn: '1/-1', padding: '40px' }}>
                    No countries found matching your criteria.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}



