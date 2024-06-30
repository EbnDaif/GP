import "./App.css";
import { Link } from "react-router-dom";

const App = () => {
  return (
    <div className="App">
      <h1>What to display ?</h1>
      <Link to={"/face-regester"}>face-regester</Link>
      <br />
      <Link to={"/face-signin"}>face-signin</Link>

    </div>
  )
};

export default App;