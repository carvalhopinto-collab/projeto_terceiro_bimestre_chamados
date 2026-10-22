import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

export default function FormChamado() {

  const navigate = useNavigate();
  const { id } = useParams(); // Resgata o ID da URL se estiver na rota /editar/:id

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("");
  const [local, setLocal] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [data_abertura, setData_abertura] = useState("");

  const [tipos, setTipos] = useState([]);
  const [locais, setLocais] = useState([]);
  const [prioridades, setPrioridades] = useState([]);

  const [ carregando, setCarregando] = useState(true);

    useEffect(() => {
    async function carregarOpcoes() {
      try {
        const resgatarTipos = await api.get("/tipos")
        setTipos(resgatarTipos.data);
        const resgatarLocais = await api.get("/locais")
        setLocais(resgatarLocais.data);
        const resgatarPrioridades = await api.get("/prioridades")
        setPrioridades(resgatarPrioridades.data);

        // Se houver um ID na URL, busca os dados do chamado para preencher o formulário na edição
        if (id) {
          const resgatarChamado = await api.get(`/chamados/${id}`);
          const dados = resgatarChamado.data;
          setTitulo(dados.titulo || "");
          setDescricao(dados.descricao || "");
          setTipo(dados.tipo || "");
          setLocal(dados.local || "");
          setPrioridade(dados.prioridade || "");
          setData_abertura(dados.data_abertura || "");
        }
      } catch (error) {
        console.error("Erro ao carregar as opções:", error);
      } finally {
        setCarregando(false);
      }
    } 

    carregarOpcoes();
  }, [id])

    async function handleSubmit(e) {
      e.preventDefault();

      try {
        const payload = {
          titulo,
          descricao,
          tipo,
          local,
          prioridade,
          data_abertura
        };

        if (id) {
          // Se existir ID, atualiza o chamado existente (PUT /chamados/:id)
          await api.put(`/chamados/${id}`, payload);
        } else {
          // Se não existir ID, cria um novo chamado (POST /chamados)
          await api.post("/chamados", payload);
        }

        navigate("/") // Redireciona para Home
      } catch (error) {
        console.error("Erro ao salvar chamado:", error); // mensagem ao desenvolvedor 
        alert("Erro ao cadastrar o chamado. Verifique os campos."); // mensagem ao usuário
      }
  }

    // 1. Condicional para feedback visual de carregamento
    if (carregando) {
      return (
        <div className="container">
          <div className="mensagem-feedback carregando">
            <p>Carregando opções…</p>
          </div>
        </div>
      );
    }

    return (
      <div className="container-form">
        <div className="card-form">
          <h1>{id ? "Editar Chamado" : "Formulário de Chamado"}</h1>
          <form onSubmit={handleSubmit} className="form-chamado">
            <div className="form-group">
              <label>Título do chamado:</label>
              <input 
                value={titulo}  
                type="text" 
                className="input-field"
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Data de início:</label>
              <input 
                type="date" 
                value={data_abertura}
                className="input-field"
                onChange={(e) => setData_abertura(e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label>Descrição:</label>
              <textarea
                value={descricao}
                className="input-field textarea-field"
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Tipo:</label>
              <select className="select-field" value={tipo} onChange={(e) => setTipo(e.target.value)} required>
                <option value="">Selecione o tipo</option>
                {tipos.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Local:</label>
              <select className="select-field" value={local} onChange={(e) => setLocal(e.target.value)} required>
                <option value="">Selecione o local</option>
                {locais.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Prioridade:</label>
              <select className="select-field" value={prioridade} onChange={(e) => setPrioridade(e.target.value)} required>
                <option value="">Selecione a prioridade</option>
                {prioridades.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-acoes">
              <button type="submit" className="btn btn-submeter">
                {id ? "Salvar Alterações" : "Submeter"}
              </button>
              <button type="button" className="btn btn-voltar" onClick={() => navigate("/")}>Voltar</button>
            </div>
          </form>
        </div>
      </div>  
    );
}