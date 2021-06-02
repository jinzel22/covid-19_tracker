import React, {useState, useEffect} from 'react';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from '@material-ui/core';
import "./App.css";
import StatsBox from "./StatsBox.js";
import Map from "./Map.js";
import Table from "./Table.js";
import {sortData} from "./uti.js";
import LineGraph from "./LineGraph.js";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('Worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState ([]);
  const [mapCenter, setMapCenter] = useState ({ lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState ({});

  useEffect(()=> {
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, [])

  useEffect(() => {
      const getCountriesData = async () => {
        await fetch ("https://disease.sh/v3/covid-19/countries")
        .then((response) =>response.json())
        .then((data) => {
          const countries = data.map((country)=> (
            {
            name: country.country,
            value: country.countryInfo.iso2
            }
        ));

        const sortedData=sortData(data);
        setTableData(sortedData);
        setCountries(countries);
      });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode ==='Worldwide'
    ? 'https://disease.sh/v3/covid-19/all'
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode);
        setCountryInfo(data);
    })
  }

  return (
    <div className="app">

      <div className="app__name">
        <h1> COVID-19 TRACKER</h1>
      </div>

      <div className="app__header">
        <h1>Choose country</h1>
        <FormControl className="app__dropdown">
          <Select
          variant="outlined"
          value={country}
          onChange={onCountryChange}
          >
          <MenuItem value="Worldwide">Worldwide</MenuItem>
            {
              countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
        </div>

    <div className="left_right_side">

      <div className="app__lefSide">



          <div className="app__content">
            <div className="app__statsBox">
              <StatsBox title="Coronavirus cases"
                        cases={countryInfo.todayCases}
                        total={countryInfo.cases}
              />

              <StatsBox title="Recovered"
                        cases={countryInfo.todayRecovered}
                        total={countryInfo.recovered}
              />

              <StatsBox title="Death"
                        cases={countryInfo.todayDeaths}
                        total={countryInfo.deaths}
              />
            </div>

            <div className="app__map">
                <Map
                  center={mapCenter}
                  zoom={mapZoom}
                />
            </div>

          </div>
        </div>

        <Card className="rightSide">
          <CardContent>
            <h3> Live cases by country </h3>
            <Table countries={tableData} />
            <h3> Worldwide new cases </h3>
            <LineGraph />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

export default App;
