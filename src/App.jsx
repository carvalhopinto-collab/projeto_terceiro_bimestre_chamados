import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./paginas/Home";
import FormChamado from "./paginas/FormChamado";
import DetalheChamado from "./paginas/DetalheChamado";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/novo" element={<FormChamado />} />
        <Route path="/editar/:id" element={<FormChamado />} />
        <Route path="/chamado/:id" element={<DetalheChamado />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;