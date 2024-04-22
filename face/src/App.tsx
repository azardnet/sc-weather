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
          <img
            src="https://azardnet.github.io/sc-weather/img/gb.35dbacd736781608964ae37a3b390b48.svg"
            width={18}
            height={18}
            alt="uk"
          />
          <h1>Liverpool</h1>
          <button onClick={() => alert("search")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 14 100"
              fill="none"
              x="0px"
              y="0px"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0 0H14V14H0V0ZM0 38H14V52H0V38ZM14 76H0V90H14V76Z"
                fill="black"
              />
            </svg>
          </button>
        </header>
        <section>
          <div className="temperature">
            <div className="main-value">
              <strong>26.6</strong>
              <span>°C</span>
            </div>
            <div className="max-min">
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  x="0px"
                  y="0px"
                  viewBox="0 0 100 100"
                >
                  <path
                    fill="#ffffff"
                    d="M50,100c-0.6,0-1-0.4-1-1V2.2c-0.2,0.1-0.4,0.2-0.5,0.4L10.3,40.8c-0.4,0.4-1,0.4-1.4,0s-0.4-1,0-1.4L47.1,1.2  C47.8,0.4,48.9,0,50,0c1.1,0,2.2,0.4,2.9,1.2l38.1,38.1c0.4,0.4,0.4,1,0,1.4s-1,0.4-1.4,0L51.5,2.6c-0.2-0.2-0.3-0.3-0.5-0.4V99  C51,99.6,50.6,100,50,100z"
                  />
                </svg>
                <div>
                  <strong>21.2</strong>
                  <span>°C</span>
                </div>
              </span>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  x="0px"
                  y="0px"
                  viewBox="0 0 100 100"
                >
                  <path
                    fill="#ffffff"
                    d="M50,100c-0.6,0-1-0.4-1-1V2.2c-0.2,0.1-0.4,0.2-0.5,0.4L10.3,40.8c-0.4,0.4-1,0.4-1.4,0s-0.4-1,0-1.4L47.1,1.2  C47.8,0.4,48.9,0,50,0c1.1,0,2.2,0.4,2.9,1.2l38.1,38.1c0.4,0.4,0.4,1,0,1.4s-1,0.4-1.4,0L51.5,2.6c-0.2-0.2-0.3-0.3-0.5-0.4V99  C51,99.6,50.6,100,50,100z"
                  />
                </svg>
                <div>
                  <strong>20.9</strong>
                  <span>°C</span>
                </div>
              </span>
            </div>
            <h3 className="weather-state">few clouds</h3>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
              <defs>
                <clipPath id="a">
                  <path
                    fill="none"
                    d="M12 35l-5.28-4.21-2-6 1-7 4-5 5-3h6l5 1 3 3L33 20l-6 4h-6l-3 3v4l-4 2-2 2z"
                  />
                </clipPath>
              </defs>
              <g clip-path="url(#a)">
                <g>
                  <path
                    fill="none"
                    stroke="#f59e0b"
                    stroke-linecap="round"
                    stroke-miterlimit="10"
                    stroke-width="2"
                    d="M23.5 24a4.5 4.5 0 11-4.5-4.5 4.49 4.49 0 014.5 4.5zM19 15.67V12.5m0 23v-3.17m5.89-14.22l2.24-2.24M10.87 32.13l2.24-2.24m0-11.78l-2.24-2.24m16.26 16.26l-2.24-2.24M7.5 24h3.17m19.83 0h-3.17"
                  />
                  <animateTransform
                    attributeName="transform"
                    dur="45s"
                    from="0 19 24"
                    repeatCount="indefinite"
                    to="360 19 24"
                    type="rotate"
                  />
                </g>
              </g>
              <path
                fill="none"
                stroke="#e5e7eb"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M43.67 45.5h2.83a7 7 0 000-14h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0"
              />
              <g>
                <path
                  fill="none"
                  stroke="#2885c7"
                  stroke-linecap="round"
                  stroke-miterlimit="10"
                  stroke-width="2"
                  d="M24.39 43.03l-.78 4.94"
                />
                <animateTransform
                  attributeName="transform"
                  dur="0.7s"
                  repeatCount="indefinite"
                  type="translate"
                  values="1 -5; -2 10"
                />
                <animate
                  attributeName="opacity"
                  dur="0.7s"
                  repeatCount="indefinite"
                  values="0;1;1;0"
                />
              </g>
              <g>
                <path
                  fill="none"
                  stroke="#2885c7"
                  stroke-linecap="round"
                  stroke-miterlimit="10"
                  stroke-width="2"
                  d="M31.39 43.03l-.78 4.94"
                />
                <animateTransform
                  attributeName="transform"
                  begin="-0.4s"
                  dur="0.7s"
                  repeatCount="indefinite"
                  type="translate"
                  values="1 -5; -2 10"
                />
                <animate
                  attributeName="opacity"
                  begin="-0.4s"
                  dur="0.7s"
                  repeatCount="indefinite"
                  values="0;1;1;0"
                />
              </g>
              <g>
                <path
                  fill="none"
                  stroke="#2885c7"
                  stroke-linecap="round"
                  stroke-miterlimit="10"
                  stroke-width="2"
                  d="M38.39 43.03l-.78 4.94"
                />
                <animateTransform
                  attributeName="transform"
                  begin="-0.2s"
                  dur="0.7s"
                  repeatCount="indefinite"
                  type="translate"
                  values="1 -5; -2 10"
                />
                <animate
                  attributeName="opacity"
                  begin="-0.2s"
                  dur="0.7s"
                  repeatCount="indefinite"
                  values="0;1;1;0"
                />
              </g>
            </svg>
          </div>
        </section>
      </div>
    </AppWrapper>
  );
}

export default App;
