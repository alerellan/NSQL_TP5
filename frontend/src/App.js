import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import HeroList from "./HeroList";
import HeroDetail from "./HeroDetail";
import NewHeroForm from "./NewHeroForm";
import './App.css';

function App() {

  return (
    <Router>
      <div style={{ textAling: "center" }}>
        <img 
          src="/superheroes.jpeg"
          alt="Superheroes"
          style={{ width: "100%", height: "250px", objectFit: "cover" }}
          />
      </div>
      <Navbar bg="dark" variant="dark" className="justify-content-center">
        <Nav>
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/dc">DC</Nav.Link>
          <Nav.Link as={Link} to="/marvel">Marvel</Nav.Link>
          <Nav.Link as={Link} to="/new">Nuevo Heroe</Nav.Link>
        </Nav>
      </Navbar>
        <Routes>
          {/* Ruta principal de la card */}
          <Route path="/" element={<HeroList filter="all"/>} />
          <Route path="/dc" element={<HeroList filter="DC"/>} />
          <Route path="/marvel" element={<HeroList filter="MARVEL"/>} />
          <Route path="/new" element={<NewHeroForm />} />

           {/* Ruta dinamica para el detalle */}
          <Route path="/heroes/:name" element={<HeroDetail />} />
        </Routes>
    </Router>
  );
}

export default App;
