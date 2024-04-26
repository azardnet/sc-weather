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
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 0H14V14H0V0ZM0 38H14V52H0V38ZM14 76H0V90H14V76Z"
                fill="black"
              />
            </svg>
          </button>
        </header>
        <section>
          <div className="temperature">
          <div className="feels-like">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 53 85" x="0px" y="0px"><path fill="#000000" d="M219,1031.29131 L219,1023.9962 C219,1020.68537 221.690006,1018 225,1018 C228.313372,1018 231,1020.68392 231,1023.9962 L231,1031.29131 C232.8833,1032.9753 234,1035.39489 234,1038 C234,1042.97056 229.970563,1047 225,1047 C220.029437,1047 216,1042.97056 216,1038 C216,1035.39489 217.1167,1032.9753 219,1031.29131 Z M223,1032.25469 C223,1032.90849 222.680436,1033.52102 222.144196,1033.89506 C220.809431,1034.82609 220,1036.34323 220,1038 C220,1040.76142 222.238576,1043 225,1043 C227.761424,1043 230,1040.76142 230,1038 C230,1036.34323 229.190569,1034.82609 227.855804,1033.89506 C227.319564,1033.52102 227,1032.90849 227,1032.25469 L227,1023.9962 C227,1022.89397 226.105134,1022 225,1022 C223.897601,1022 223,1022.89605 223,1023.9962 L223,1032.25469 Z M197,1082 L197,1069 C197,1068.44772 196.552285,1068 196,1068 L194,1068 C193.447715,1068 193,1068.44772 193,1069 L193,1082 C193,1083.10457 192.104569,1084 191,1084 L187,1084 C185.895431,1084 185,1083.10457 185,1082 L185,1065 L183,1065 C181.895431,1065 181,1064.10457 181,1063 L181,1046 C181,1041.58172 184.581722,1038 189,1038 L201,1038 C205.418278,1038 209,1041.58172 209,1046 L209,1063 C209,1064.10457 208.104569,1065 207,1065 L205,1065 L205,1082 C205,1083.10457 204.104569,1084 203,1084 L199,1084 C197.895431,1084 197,1083.10457 197,1082 Z M195,1034 C190.029437,1034 186,1029.97056 186,1025 C186,1020.02944 190.029437,1016 195,1016 C199.970563,1016 204,1020.02944 204,1025 C204,1029.97056 199.970563,1034 195,1034 Z" transform="translate(-181 -1016)"/></svg>
            <div className="value">
              <strong>27.1</strong>
              <span>°C</span>
            </div>
          </div>
            <div className="main-value">
              <strong>26.6</strong>
              <span>°C</span>
            </div>
            <h3 className="weather-state">few clouds</h3>
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
                  <strong>27.2</strong>
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
              <defs>
                <clipPath id="a">
                  <path
                    fill="none"
                    d="M12 35l-5.28-4.21-2-6 1-7 4-5 5-3h6l5 1 3 3L33 20l-6 4h-6l-3 3v4l-4 2-2 2z"
                  />
                </clipPath>
              </defs>
              <g clipPath="url(#a)">
                <g>
                  <path
                    fill="none"
                    stroke="#f59e0b"
                    strokeLinecap="round"
                    strokeMiterlimit="10"
                    strokeWidth="2"
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
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M43.67 45.5h2.83a7 7 0 000-14h-.32a10.49 10.49 0 00-19.11-8 7 7 0 00-10.57 6 7.21 7.21 0 00.1 1.14A7.5 7.5 0 0018 45.5a4.19 4.19 0 00.5 0v0"
              />
              <g>
                <path
                  fill="none"
                  stroke="#2885c7"
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
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
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
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
                  strokeLinecap="round"
                  strokeMiterlimit="10"
                  strokeWidth="2"
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
