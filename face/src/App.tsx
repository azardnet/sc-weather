import styled from "styled-components";
import Search from "./components/Search";

const AppWrapper = styled.section`
  padding: 40px;
`;

const OPEN_WEATHER_KEY = import.meta.env.VITE_OPENWEATHER;

function App() {
  // console.log(console.log(OPEN_WEATHER_KEY));

  const onSubmit = (input: string) => {
    (async function () {
      const response = await fetch(
        `
https://api.openweathermap.org/data/2.5/weather?lang=en&q=${input}&APPID=${OPEN_WEATHER_KEY}&units=metric`
      );

      const body = await response.json();
      console.log("rrr", body);
    })();
  };
  return (
    <AppWrapper>
      <div>SC-weather</div>
      <Search onSubmit={onSubmit} />
    </AppWrapper>
  );
}

export default App;
