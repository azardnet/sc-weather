import styled from "styled-components";
import Search from "./components/Search";

const AppWrapper = styled.section`
  padding: 40px;
`;

const OPEN_WEATHER_KEY = import.meta.env.VITE_OPENWEATHER;

function App() {
  console.log(console.log(OPEN_WEATHER_KEY));
  return (
    <AppWrapper>
      <div>SC-weather</div>
      <Search />
    </AppWrapper>
  );
}

export default App;
