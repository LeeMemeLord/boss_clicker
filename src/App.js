import './App.css';
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import MainGame from "./Game/MainGame";
import CharacterMenu from "./Scenes/MenuScenes/CharacterMenu";

function App() {
  return (
      <Router>
        <Routes>
            <Route path="/" element={<MainGame />}/>
        </Routes>
      </Router>
  );
}

export default App;
