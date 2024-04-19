import styled from "styled-components";
import Search from "./components/Search";
import { useEffect, useState } from "react";
import WeatherData from "./components/WeatherData";

const AppWrapper = styled.section`
  display: flex;
  justify-content: center;
  height: 100vh;
  align-items: center;

.t-main {
  background-color: rgb(255 255 255 / 10%);
  position: relative;
  width: 325px;
  height: 220px;
  box-shadow: 10px 8px 14px -4px rgb(0 0 0 / 16%), 4px 4px 0px 1px rgb(255 255 255 / 10%);
  border: 1px solid rgb(255 255 255 / 15%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.t-main:before {
  content: "";
    position: absolute;
    width: 26px;
    height: 26px;
    background-color: rgb(145, 132, 69);
    top: -13px;
    left: -15px;
    border-right: 1px solid rgba(255, 255, 255, 0.72);
    border-radius: 1px;
    transform: rotate(43deg);
}
.t-main header {
  position: relative;
  width: 100%;
  &:before {
    content: "";
    position: absolute;
    top: 18px;
    width: 100%;
    height: 1px;
    background-color: rgb(255 255 255 / 15%);
  }
  img {
    position: absolute;
    right: 0px;
    z-index: -1;
    top: 0px;
    height: 18px;
    opacity: 0.4;
  }
  h1 {
    color: rgb(255, 255, 255);
    font-size: 24px;
    line-height: 19px;
    letter-spacing: 0px;
    text-align: center;
    margin: 0px;
    padding-left: 18px;
    text-transform: uppercase;
    text-shadow: 1px 0px 0px rgb(0 0 0 / 30%), 0px 0px 2px rgb(0 0 0 / 11%);
  }
}
`;

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
        </header>
      </div>
    </AppWrapper>
  );
}

export default App;
