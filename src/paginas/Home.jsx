import { useState, useEffect } from "react";
import api from "../services/api"
import { Link } from "react-router-dom";


export default function Home() {
  const [usuario, setUsuario] = useState(null);
  const [chamados, setChamados] = useState([]);
  const [carregando, setCarregando] = useState(true);
 
  // texto e busca
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  
  // Opções da API
  const [tipos, setTipos] = useState([]);
  const [locais, setLocais] = useState([]);
  const [prioridades, setPrioridades] = useState([]);

  // Opções selecionadas pelo usuário
  const [tipo, setTipo] = useState("");
  const [local, setLocal] = useState("");
  const [prioridade, setPrioridade] = useState("");


  useEffect(() => {
    async function carregarDados() {
      try {
        const resgatarUsuario = await api.get("/eu");
        setUsuario(resgatarUsuario.data);
        
        const resgateTipos = await api.get("/tipos")
        setTipos(resgateTipos.data);

        const resgateLocais = await api.get("/locais")
        setLocais(resgateLocais.data);

        const resgatePrioridades = await api.get("/prioridades")
        setPrioridades(resgatePrioridades.data);
        // Monta os parâmetros dinamicamente
        // Cria um objeto vazio para guardar apenas os filtros que o usuário preencheu
        const params = {};
        // Se o usuário digitou algum texto na busca, adiciona a busca ao objeto params
        if (busca) params.busca = busca;
        // Se o usuário selecionou algum status, adiciona o status ao objeto params
        if (status) params.status = status;
        if (tipo) params.tipo = tipo;
        if (local) params.local = local;
        if (prioridade) params.prioridade = prioridade;
        

        const buscarChamados = await api.get("/chamados", { params });
        setChamados(buscarChamados.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [busca, status, tipo, local, prioridade]);

      return (
        <div className="container">
          <header className="header">
            <div className="usuario-badge">
              <span>Olá, <strong>{usuario?.nome || "Usuário"}</strong></span>
            </div>
            <Link to="/novo" className="btn btn-abrir">+ Abrir chamado</Link>
          </header>

          <section className="filtros-container">
            <input 
              type="text" 
              value={busca} 
              className="input-busca"
              placeholder="Busque por título ou descrição..." 
              onChange={(e) => setBusca(e.target.value)}
            /> 
            
            <div className="selects-grid">
              <select className="select-filtro" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Todos os status</option>
                <option value="aberto">Aberto</option>
                <option value="em andamento">Em andamento</option>
                <option value="resolvido">Resolvido</option>   
              </select>

              <select className="select-filtro" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="">Todos os tipos</option>
                {tipos.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select className="select-filtro" value={local} onChange={(e) => setLocal(e.target.value)}>
                <option value="">Todos os locais</option>
                {locais.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>

              <select className="select-filtro" value={prioridade} onChange={(e) => setPrioridade(e.target.value)}>
                <option value="">Todas as prioridades</option>
                {prioridades.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <div className="titulo-secao">
            <h1>Lista de Chamados</h1>
          </div>

          {carregando ? (
            <div className="mensagem-feedback carregando">
              <p>Carregando chamados…</p>
            </div>
          ) : (
            <div>
              {/* Se a lista estiver vazia, .map() não é executado, por isso o ternário fica fora. */}
              {chamados.length === 0 ? (
                <div className="mensagem-feedback vazia">
                  <p>Nenhum chamado encontrado.</p>
                </div>
              ) : (
                <div className="chamados-grid">
                  {chamados.map((chamado) => (
                    <div className="card-chamado" key={chamado.id}>
                      <h3>{chamado.titulo}</h3>
                      <div className="badges-container">
                        <span className={`badge status-${chamado.status?.toLowerCase().replace(" ", "-")}`}>
                          {chamado.status}
                        </span>
                        <span className={`badge prioridade-${chamado.prioridade?.toLowerCase()}`}>
                          {chamado.prioridade}
                        </span>
                      </div>
                      <Link to={`/chamado/${chamado.id}`} className="btn-link">
                        Ver detalhes →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
  );
}