import { useState } from "react";
import { SearchWrapper } from "./search.style";

interface IProps {
  onSubmit: (input: string) => void;
}

function Search({ onSubmit }: IProps) {
  const [input, setInput] = useState<string>("");
  return (
    <SearchWrapper>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(input);
        }}
      >
        <input
          type="text"
          placeholder="type City and hit Enter"
          onChange={(e) => {
            setInput(e.target.value);
          }}
          value={input}
        />
      </form>
    </SearchWrapper>
  );
}

export default Search;
