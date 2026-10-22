import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom"; // Importa Link para navegação entre páginas
import api from "../services/api";

export default function DetalheChamado() {
  const navigate = useNavigate();
  
  const { id } = useParams(); // Pega o ID dinâmico que vem na rota (ex: /chamado/15 -> id vale 15)
  const [chamado, setChamado] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function detalharChamado() {
      try {
        const buscarDados = await api.get(`/chamados/${id}`);
        setChamado(buscarDados.data);
      } catch (error) {
        console.error("Erro ao carregar os detalhes:", error);
      } finally {
        setCarregando(false);
      }
    }

    detalharChamado();
  }, [id]);

  async function iniciarAtendimento() {
    const responsavel = prompt("Digite o nome do(a) responsável pelo atendimento:");
    if (!responsavel) {
      alert("O nome do responsável é obrigatório para iniciar o atendimento!"); // alert: Apenas exibe um aviso simples com botão "OK"
      return;
    }

    try {
      const resposta = await api.patch(`/chamados/${id}/iniciar`, { responsavel });   
      setChamado(resposta.data);
    } catch (error) {
      console.error("Erro ao iniciar atendimento:", error);
    }
  }

  async function resolverChamado() {
    const solucao = prompt("Por favor, descreva a solução do chamado:");
    if (!solucao) {
      alert("A descrição da solução é obrigatória para iniciar o atendimento!");
      return;
    }

    try {
      const resposta = await api.patch(`/chamados/${id}/resolver`, { solucao });   
      setChamado(resposta.data);
    } catch (error) {
      console.error("Erro ao resolver chamado", error);
    }
  }

  async function excluirManualmente() {
    // window.confirm: Pergunta "OK" ou "Cancelar" e retorna true/false
    const confirmacao = window.confirm("Tem certeza que quer excluir o chamado?");

    if (confirmacao) {
      try {
        await api.delete(`/chamados/${id}`);

        navigate("/");
      } catch (error) {
        console.error("Erro ao excluir o chamado", error);
        alert("Não foi possível excluir o chamado.");
      }
    }
  }

  if (carregando) {
    return (
      <div className="container">
        <div className="mensagem-feedback carregando">
          <p>Carregando…</p>
        </div>
      </div>
    );
  } 

  if (!chamado) { // Se houver algo no chamado, o if não pode ser executado, por isso coloca-se o oposto (!). Caso não haja algo, ele deve ser executado. Por isso de false vai para true com ! para que a mensagem seja mostrada ao usuário.
    return (
      <div className="container">
        <div className="mensagem-feedback erro">
          <p>Chamado não encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-detalhe">
      <div className="card-detalhe">
        <header className="detalhe-header">
          <Link to="/" className="btn-voltar-link">← Voltar para lista</Link>
          <h1>Detalhes do Chamado</h1>
        </header>

        <h2 className="detalhe-titulo">{chamado.titulo}</h2>
        
        <div className="detalhe-info-grid">
          <p><strong>Descrição:</strong> {chamado.descricao}</p>
          <p><strong>Tipo:</strong> {chamado.tipo} | <strong>Local:</strong> {chamado.local} | <strong>Prioridade:</strong> <span className={`badge prioridade-${chamado.prioridade?.toLowerCase()}`}>{chamado.prioridade}</span></p>
          <p><strong>Status:</strong> <span className={`badge status-${chamado.status?.toLowerCase().replace(" ", "-")}`}>{chamado.status}</span> | <strong>Abertura:</strong> {chamado.data_abertura}</p>
          
          {chamado.responsavel && <p><strong>Responsável:</strong> {chamado.responsavel}</p>} 
          {chamado.solucao && <p><strong>Solução:</strong> {chamado.solucao}</p>} {/* Só serão executados se existirem */}
        </div>

        <div className="detalhe-acoes">
          {chamado.status === "aberto" && (
            <button className="btn btn-iniciar" onClick={iniciarAtendimento}>Iniciar atendimento</button>
          )}
          {chamado.status === "em andamento" && (
            <button className="btn btn-resolver" onClick={resolverChamado}>Resolver chamado</button>
          )}
          {chamado.status !== "resolvido" && (
            <Link className="btn btn-editar" to={`/editar/${id}`}>Editar</Link> // Link altera rotas (URL), enquanto <button> dispara ações/funções no clique
          )}
          
          <button className="btn btn-excluir" onClick={excluirManualmente}>Excluir</button>
        </div>
      </div>
    </div>
  );
}