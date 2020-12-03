import styled from "styled-components"
import logo from "./check.svg";

const StyledDiv = styled.div`
  color: darkgreen;
  font-size: 2rem;
`;

function App() {
  return <>
    <StyledDiv className="App">
      There is text.
    </StyledDiv>
	<img src={logo} alt="" />
  </>;
}

export default App;
