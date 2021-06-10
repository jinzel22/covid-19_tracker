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
import {sortData, prettyPrintStat} from "./uti.js";
import LineGraph from "./LineGraph.js";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('Worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState ([]);
  const [mapCenter, setMapCenter] = useState ({ lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState (3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

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
        setMapCountries(data);
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

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
    });
  }

  return (
    <div className="app">

      <div className="app__name">
        <article>
          <h1> COVID-19 TRACKER</h1>
        </article>
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
                        isRed
                        cases={prettyPrintStat(countryInfo.todayCases)}
                        total={countryInfo.cases}
                        onClick={(e) => setCasesType('cases')}
                        active={casesType === "cases"}
              />

              <StatsBox title="Recovered"
                        cases={prettyPrintStat(countryInfo.todayRecovered)}
                        total={countryInfo.recovered}
                        onClick={(e) => setCasesType('recovered')}
                        active={casesType === "recovered"}
              />

              <StatsBox title="Death"
                        isRed
                        cases={prettyPrintStat(countryInfo.todayDeaths)}
                        total={countryInfo.deaths}
                        onClick={(e) => setCasesType('deaths')}
                        active={casesType === "deaths"}
              />
            </div>

            <div className="app__map">
                <Map
                  casesType={casesType}
                  countries={mapCountries}
                  center={mapCenter}
                  zoom={mapZoom}
                />
            </div>

          </div>
        </div>

        <Card className="app__rightSide">
          <CardContent>
            <h3> Live cases by country </h3>
            <Table
              countries={tableData}
            />
          </CardContent>
        </Card>



      </div>
      <div className="app__footer">
      <Card>
        <CardContent>
          <h3 className="foot"> Worldwide new {casesType} </h3>
          <LineGraph
            casesType={casesType}
          />
        </CardContent>
      </Card>
      </div>
    </div>
  );
}

export default App;
