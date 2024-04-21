import Search from "./components/Search";
import { useEffect, useState } from "react";
import WeatherData from "./components/WeatherData";
import { AppWrapper } from "./styled";


const OPEN_WEATHER_KEY = import.meta.env.VITE_OPENWEATHER;

function App() {
  const [data, setData] = useState({ loading: false, response: {} });

  const Fetch = (input: string) => {
    setData({ loading: true, response: {} });
    (async function () {
      const response = await fetch(
        `
https://api.openweathermap.org/data/2.5/weather?lang=en&q=${input}&APPID=${OPEN_WEATHER_KEY}&units=metric`
      );

      const json = await response.json();
      setData({ loading: false, response: json });
    })();
  };

  useEffect(() => {
    Fetch("Tehran");
  }, []);

  const onSubmit = (input: string) => {
    Fetch(input);
  };

  return (
    <AppWrapper>
      {/* <div>SC-weather</div>
      <Search onSubmit={onSubmit} />
      <WeatherData />
      {data.loading ? (
        "Loading"
      ) : (
        <pre>
          {Object.keys(data.response).length === 0
            ? ""
            : JSON.stringify(data.response, null, 4)}
        </pre>
      )} */}
      <div className="t-main">
        <header>
          <img src="https://azardnet.github.io/sc-weather/img/gb.35dbacd736781608964ae37a3b390b48.svg" width={18} height={18} alt="uk" />
          <h1>Liverpool</h1>
          <button onClick={() => alert('search')}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 100" fill="none" x="0px" y="0px"><path fill-rule="evenodd" clip-rule="evenodd" d="M0 0H14V14H0V0ZM0 38H14V52H0V38ZM14 76H0V90H14V76Z" fill="black" /></svg>
          </button>
        </header>
        <section>
          <div className="temp">26.6°C</div>
        </section>
      </div>
    </AppWrapper>
  );
}

export default App;
