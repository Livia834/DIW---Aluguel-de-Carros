// ==========================================
// CLIENTE HTTP E INFRAESTRUTURA HÍBRIDA (JSON Server + LocalStorage / Vercel)
// ==========================================
const API_URL = 'http://localhost:3000';
let usandoJsonServer = false;

// Testar se o JSON Server está rodando localmente
async function testarConexaoApi() {
  try {
    const res = await fetch(`${API_URL}/carros`, { method: 'GET' });
    if (res.ok) {
      usandoJsonServer = true;
      console.log('🔗 Conectado ao JSON Server (http://localhost:3000)');
    }
  } catch (e) {
    usandoJsonServer = false;
    console.log('⚡ JSON Server offline. Usando persistência via LocalStorage (Compatível com Vercel).');
  }
}

// Métodos de dados unificados (Getters e Setters transparentes)
async function getColecao(chave) {
  if (usandoJsonServer) {
    try {
      const res = await fetch(`${API_URL}/${chave}`);
      return await res.json();
    } catch (e) {
      console.error(`Erro ao buscar ${chave} no JSON Server`, e);
    }
  }
  return JSON.parse(localStorage.getItem(chave)) || [];
}

async function salvarItem(chave, item) {
  if (usandoJsonServer) {
    try {
      const res = await fetch(`${API_URL}/${chave}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      return await res.json();
    } catch (e) {
      console.error(`Erro ao salvar em ${chave} no JSON Server`, e);
    }
  }
  let lista = JSON.parse(localStorage.getItem(chave)) || [];
  lista.push(item);
  localStorage.setItem(chave, JSON.stringify(lista));
  return item;
}

async function atualizarItem(chave, id, dadosAtualizados) {
  if (usandoJsonServer) {
    try {
      const res = await fetch(`${API_URL}/${chave}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizados)
      });
      return await res.json();
    } catch (e) {
      console.error(`Erro ao atualizar ${chave} id ${id}`, e);
    }
  }
  let lista = JSON.parse(localStorage.getItem(chave)) || [];
  const idx = lista.findIndex(i => String(i.id) === String(id));
  if (idx !== -1) {
    lista[idx] = { ...lista[idx], ...dadosAtualizados };
    localStorage.setItem(chave, JSON.stringify(lista));
  }
}

async function deletarItem(chave, id) {
  if (usandoJsonServer) {
    try {
      await fetch(`${API_URL}/${chave}/${id}`, { method: 'DELETE' });
      return;
    } catch (e) {
      console.error(`Erro ao deletar em ${chave}`, e);
    }
  }
  let lista = JSON.parse(localStorage.getItem(chave)) || [];
  lista = lista.filter(i => String(i.id) !== String(id));
  localStorage.setItem(chave, JSON.stringify(lista));
}

// Inicialização de Dados Padrão no LocalStorage para rodar liso no Vercel
function inicializarLocalStoragePadrao() {
  if (!localStorage.getItem('usuarios')) {
    const usuariosIniciais = [
      { id: "1", nome: "João Loja Alpha", email: "loja@drivo.com", senha: "123", tipo: "funcionario", empresa: "Horizonte Rent a Car" },
      { id: "2", nome: "Ana Souza", email: "cliente@email.com", senha: "123", tipo: "cliente", rg: "MG-15.892.441", cpf: "111.222.333-44", endereco: "Av. Afonso Pena, 1500 - Centro - Belo Horizonte/MG", profissao: "Engenheira de Software", empregadores: [{ nome: "Tech Solutions Ltda", rendimento: 8500 }, { nome: "Consultoria Inovação S.A.", rendimento: 3200 }] }
    ];
    localStorage.setItem('usuarios', JSON.stringify(usuariosIniciais));
  }

  if (!localStorage.getItem('carros')) {
    const carrosIniciais = [
      { id: "1", modelo: "Toyota Corolla XEi", marca: "Toyota", ano: 2024, placa: "ABC-1234", preco: 219, empresa: "Horizonte Rent a Car", propriedade: "Empresa (Locadora)", status: "Disponível", imagem: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200" },
      { id: "2", modelo: "Hyundai HB20 Sense", marca: "Hyundai", ano: 2024, placa: "XYZ-9876", preco: 120, empresa: "Horizonte Rent a Car", propriedade: "Banco (Instituição Financeira / Crédito)", status: "Disponível", imagem: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1200" },
      { id: "3", modelo: "Jeep Renegade Sport", marca: "Jeep", ano: 2025, placa: "JEP-5544", preco: 220, empresa: "Beta Locadora", propriedade: "Cliente", status: "Disponível", imagem: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200" }
    ];
    localStorage.setItem('carros', JSON.stringify(carrosIniciais));
  }

  if (!localStorage.getItem('reservas')) localStorage.setItem('reservas', JSON.stringify([]));
  if (!localStorage.getItem('notificacoes')) localStorage.setItem('notificacoes', JSON.stringify([]));
}

// Inicializar aplicação
(async function() {
  await testarConexaoApi();
  inicializarLocalStoragePadrao();
  executarLogicaPaginas();
})();

// ==========================================
// LOGICA GLOBAL DE COMPONENTES E TEMA
// ==========================================
const btnTema = document.getElementById('btn-tema');
const iconeTema = document.getElementById('icone-tema');
const htmlElement = document.documentElement;

const temaSalvo = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-bs-theme', temaSalvo);
atualizarIconeTema(temaSalvo);

if (btnTema) {
  btnTema.addEventListener('click', () => {
    const temaAtual = htmlElement.getAttribute('data-bs-theme');
    const novoTema = temaAtual === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-bs-theme', novoTema);
    localStorage.setItem('theme', novoTema);
    atualizarIconeTema(novoTema);
  });
}

function atualizarIconeTema(tema) {
  if (!iconeTema) return;
  if (tema === 'dark') {
    iconeTema.classList.remove('bi-moon');
    iconeTema.classList.add('bi-sun-fill');
  } else {
    iconeTema.classList.remove('bi-sun-fill');
    iconeTema.classList.add('bi-moon');
  }
}

// ---- CONTROLADOR DE SESSÃO DO NAVEGADOR ----
const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
const authButtons = document.getElementById('auth-buttons');
const userMenu = document.getElementById('user-menu');
const navUsername = document.getElementById('nav-username');
const linkPainel = document.getElementById('link-painel');

if (usuarioLogado) {
  if (authButtons) authButtons.classList.add('d-none');
  if (userMenu) userMenu.classList.remove('d-none');
  if (navUsername) navUsername.innerText = usuarioLogado.nome;
  if (linkPainel) {
    if (usuarioLogado.tipo === 'funcionario') {
      linkPainel.href = 'loja-solicitacoes.html';
      linkPainel.innerText = 'Painel da Loja';
    } else {
      linkPainel.href = 'cliente-painel.html';
      linkPainel.innerText = 'Meu Painel / Reservas';
    }
  }
}

// ---- MODAL GLOBAL DE CONFIRMAÇÃO ----
const modalConfirmacaoEl = document.getElementById('modalConfirmacao');
let bsModalConfirmacao = modalConfirmacaoEl ? new bootstrap.Modal(modalConfirmacaoEl) : null;

function dispararConfirmacao(titulo, texto, callbackSim) {
  document.getElementById('modal-titulo-conf').innerText = titulo;
  document.getElementById('modal-texto-conf').innerText = texto;
  const btnSim = document.getElementById('btn-confirma-acao');
  
  const novoBtn = btnSim.cloneNode(true);
  btnSim.parentNode.replaceChild(novoBtn, btnSim);

  novoBtn.addEventListener('click', () => {
    if (bsModalConfirmacao) bsModalConfirmacao.hide();
    callbackSim();
  });

  if (bsModalConfirmacao) bsModalConfirmacao.show();
}

function abrirModalConfirmacaoLogout() {
  dispararConfirmacao(
    "Deseja sair?",
    "Você será desconectado da sua conta no Drivo.",
    () => {
      localStorage.removeItem('usuarioLogado');
      window.location.href = 'index.html';
    }
  );
}

// ==========================================
// EXECUÇÃO DE LÓGICA ESPECÍFICA DE CADA PÁGINA
// ==========================================
async function executarLogicaPaginas() {
  // 1. CADASTRO
  const formCadastro = document.getElementById('form-cadastro');
  const tipoUsuarioSelect = document.getElementById('tipo-usuario');
  const divEmpresa = document.getElementById('div-empresa');
  const secaoClienteDados = document.getElementById('secao-cliente-dados');

  if (tipoUsuarioSelect) {
    tipoUsuarioSelect.addEventListener('change', () => {
      if (tipoUsuarioSelect.value === 'funcionario') {
        if (divEmpresa) divEmpresa.style.display = 'block';
        if (secaoClienteDados) secaoClienteDados.style.display = 'none';
      } else {
        if (divEmpresa) divEmpresa.style.display = 'none';
        if (secaoClienteDados) secaoClienteDados.style.display = 'block';
      }
    });
  }

  if (formCadastro) {
    formCadastro.addEventListener('submit', async (e) => {
      e.preventDefault();
      dispararConfirmacao(
        "Confirmar Cadastro",
        "Deseja criar esta nova conta no Drivo com os dados informados?",
        async () => {
          const nome = document.getElementById('nome').value;
          const email = document.getElementById('email').value;
          const senha = document.getElementById('senha').value;
          const tipo = document.getElementById('tipo-usuario').value;
          const empresa = document.getElementById('empresa') ? document.getElementById('empresa').value : '';

          let empregadores = [];
          if (tipo === 'cliente') {
            for (let i = 1; i <= 3; i++) {
              const empNome = document.getElementById(`emp${i}-nome`).value;
              const empRend = document.getElementById(`emp${i}-rendimento`).value;
              if (empNome && empRend) {
                empregadores.push({ nome: empNome, rendimento: parseFloat(empRend) });
              }
            }
          }

          let usuarios = await getColecao('usuarios');
          if (usuarios.some(u => u.email === email)) {
            alert('E-mail já cadastrado!');
            return;
          }

          const novoUsuario = {
            id: String(Date.now()),
            nome, email, senha, tipo,
            empresa: empresa || 'Minha Loja',
            rg: tipo === 'cliente' ? document.getElementById('rg').value : '',
            cpf: tipo === 'cliente' ? document.getElementById('cpf').value : '',
            endereco: tipo === 'cliente' ? document.getElementById('endereco').value : '',
            profissao: tipo === 'cliente' ? document.getElementById('profissao').value : '',
            empregadores
          };

          await salvarItem('usuarios', novoUsuario);
          alert('Cadastro realizado com sucesso! Faça login.');
          window.location.href = 'login.html';
        }
      );
    });
  }

  // 2. LOGIN
  const formLogin = document.getElementById('form-login');
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const senha = document.getElementById('senha').value;

      const usuarios = await getColecao('usuarios');
      const user = usuarios.find(u => u.email === email && u.senha === senha);

      if (user) {
        localStorage.setItem('usuarioLogado', JSON.stringify(user));
        if (user.tipo === 'funcionario') {
          window.location.href = 'loja-solicitacoes.html';
        } else {
          window.location.href = 'catalogo.html';
        }
      } else {
        alert('E-mail ou senha incorretos!');
      }
    });
  }

  // 3. CATÁLOGO
  const gridCatalogo = document.getElementById('grid-catalogo');
  if (gridCatalogo) {
    const carros = await getColecao('carros');
    gridCatalogo.innerHTML = '';
    carros.forEach(carro => {
      const badgeStatus = carro.status === 'Disponível' ? 'bg-success' : 'bg-secondary';
      gridCatalogo.innerHTML += `
        <div class="col-md-4">
          <div class="card h-100 shadow-sm border-0 cursor-pointer transition-hover" onclick="verDetalhesCarro('${carro.id}')">
            <img src="${carro.imagem}" class="card-img-top" alt="${carro.modelo}" style="height: 200px; object-fit: cover;">
            <div class="card-body d-flex flex-column">
              <h5 class="fw-bold">${carro.modelo} (${carro.ano})</h5>
              <p class="text-secondary mb-1">Marca: ${carro.marca} | Placa: ${carro.placa}</p>
              <p class="text-secondary mb-1">Propriedade: <span class="badge bg-dark">${carro.propriedade || 'Empresa'}</span></p>
              <p class="text-secondary mb-1">Oferecido por: <strong>${carro.empresa}</strong></p>
              <p class="text-primary fw-bold fs-5 mt-2">R$ ${parseFloat(carro.preco).toFixed(2)} / dia</p>
              <div class="mb-3"><span class="badge ${badgeStatus}">${carro.status}</span></div>
              <button class="btn btn-outline-primary mt-auto w-100 fw-semibold">
                Ver Detalhes e Reservar
              </button>
            </div>
          </div>
        </div>
      `;
    });
  }

  // 4. DETALHES DO VEÍCULO
  const detalheModelo = document.getElementById('detalhe-modelo');
  if (detalheModelo) {
    const carroId = localStorage.getItem('carroSelecionadoId') || "1";
    const carros = await getColecao('carros');
    const carro = carros.find(c => String(c.id) === String(carroId)) || carros[0];

    document.getElementById('detalhe-modelo').innerText = carro.modelo;
    document.getElementById('bread-modelo').innerText = carro.modelo;
    document.getElementById('detalhe-loja').innerText = carro.empresa;
    document.getElementById('loja-nome-card').innerText = carro.empresa;
    document.getElementById('card-preco').innerHTML = `R$ ${parseFloat(carro.preco).toFixed(2)} <span class="fs-6 fw-normal text-secondary">/ diária</span>`;
    document.getElementById('valor-diaria-calc').innerText = `R$ ${parseFloat(carro.preco).toFixed(2)}`;
    
    const subtotal = carro.preco * 3;
    const total = subtotal + 60;
    document.getElementById('subtotal-calc').innerText = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById('total-estimado').innerText = `R$ ${total.toFixed(2)}`;

    document.getElementById('img-principal').src = carro.imagem;
    document.getElementById('detalhe-propriedade').innerText = `Registrado como Propriedade de: ${carro.propriedade || 'Empresa (Locadora)'}`;
    
    const badgeDisp = document.getElementById('badge-disponibilidade');
    if (carro.status !== 'Disponível') {
      badgeDisp.className = 'badge bg-danger-subtle text-danger border border-danger border-opacity-25 px-2 py-1 small';
      badgeDisp.innerHTML = `<i class="bi bi-circle-fill small"></i> Indisponível no momento`;
    }
  }

  // 5. PAINEL DO CLIENTE
  const perfilClienteDetalhes = document.getElementById('perfil-cliente-detalhes');
  const tabelaMeusPedidos = document.getElementById('tabela-meus-pedidos');

  if (usuarioLogado && usuarioLogado.tipo === 'cliente') {
    const usuarios = await getColecao('usuarios');
    const uAtual = usuarios.find(u => u.email === usuarioLogado.email) || usuarioLogado;

    if (perfilClienteDetalhes) {
      let empregadoresHtml = '<ul class="mb-0 text-muted"><li>Nenhum empregador cadastrado.</li></ul>';
      if (uAtual.empregadores && uAtual.empregadores.length > 0) {
        empregadoresHtml = '<ul class="mb-0">';
        uAtual.empregadores.forEach(emp => {
          empregadoresHtml += `<li><strong>${emp.nome}</strong> — Rendimento: R$ ${parseFloat(emp.rendimento).toFixed(2)}/mês</li>`;
        });
        empregadoresHtml += '</ul>';
      }

      perfilClienteDetalhes.innerHTML = `
        <div class="row g-3">
          <div class="col-md-4">
            <p class="mb-1 text-secondary small text-uppercase fw-bold">Nome Completo</p>
            <p class="fw-semibold text-body">${uAtual.nome}</p>
          </div>
          <div class="col-md-4">
            <p class="mb-1 text-secondary small text-uppercase fw-bold">E-mail</p>
            <p class="fw-semibold text-body">${uAtual.email}</p>
          </div>
          <div class="col-md-4">
            <p class="mb-1 text-secondary small text-uppercase fw-bold">Profissão</p>
            <p class="fw-semibold text-body">${uAtual.profissao || 'Não informada'}</p>
          </div>
          <div class="col-md-4">
            <p class="mb-1 text-secondary small text-uppercase fw-bold">RG</p>
            <p class="fw-semibold text-body">${uAtual.rg || 'Não informado'}</p>
          </div>
          <div class="col-md-4">
            <p class="mb-1 text-secondary small text-uppercase fw-bold">CPF</p>
            <p class="fw-semibold text-body">${uAtual.cpf || 'Não informado'}</p>
          </div>
          <div class="col-md-4">
            <p class="mb-1 text-secondary small text-uppercase fw-bold">Endereço</p>
            <p class="fw-semibold text-body">${uAtual.endereco || 'Não informado'}</p>
          </div>
          <div class="col-12"><hr class="my-2 border-secondary opacity-25"></div>
          <div class="col-12">
            <p class="mb-1 text-secondary small text-uppercase fw-bold"><i class="bi bi-briefcase"></i> Entidades Empregadoras e Rendimentos</p>
            ${empregadoresHtml}
          </div>
        </div>
      `;
    }

    carregarNotificacoesCliente();
  }

  if (tabelaMeusPedidos && usuarioLogado) {
    const reservas = await getColecao('reservas');
    const minhasReservas = reservas.filter(r => r.clienteEmail === usuarioLogado.email);
    
    tabelaMeusPedidos.innerHTML = '';
    if (minhasReservas.length === 0) {
      tabelaMeusPedidos.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Nenhum pedido realizado ainda.</td></tr>`;
    } else {
      minhasReservas.forEach(r => {
        let badge = 'bg-warning text-dark';
        if (r.status === 'Aprovado' || r.status === 'Contrato Executado') badge = 'bg-success';
        if (r.status === 'Rejeitado' || r.status === 'Cancelado') badge = 'bg-danger';

        tabelaMeusPedidos.innerHTML += `
          <tr>
            <td><strong>${r.modeloCarro}</strong></td>
            <td>${r.empresa}</td>
            <td>${r.data}</td>
            <td><span class="badge ${badge}">${r.status}</span></td>
            <td>
              ${r.status === 'Pendente Análise' ? `<button class="btn btn-sm btn-outline-danger" onclick="confirmarCancelamentoReserva('${r.id}')">Cancelar</button>` : '<span class="text-muted">Finalizado</span>'}
            </td>
          </tr>
        `;
      });
    }
  }

  // 6. PAINEL DA LOJA (SOLICITAÇÕES)
  const tabelaReservasLoja = document.getElementById('tabela-reservas-loja');
  const empresaNomeNav = document.getElementById('empresa-nome-nav');
  const badgeReservasLoja = document.getElementById('badge-reservas-loja');

  if (usuarioLogado && usuarioLogado.tipo === 'funcionario') {
    if (empresaNomeNav) empresaNomeNav.innerText = usuarioLogado.empresa;
    carregarNotificacoesLoja();
  }

  if (tabelaReservasLoja && usuarioLogado) {
    const reservas = await getColecao('reservas');
    const reservasLoja = reservas.filter(r => r.empresa === usuarioLogado.empresa);

    if (badgeReservasLoja) badgeReservasLoja.innerText = reservasLoja.filter(r => r.status === 'Pendente Análise').length + ' pendentes';

    tabelaReservasLoja.innerHTML = '';
    if (reservasLoja.length === 0) {
      tabelaReservasLoja.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">Nenhuma reserva recebida no momento.</td></tr>`;
    } else {
      reservasLoja.forEach(r => {
        let badgeSt = 'bg-warning text-dark';
        if (r.status === 'Aprovado') badgeSt = 'bg-success';
        if (r.status === 'Rejeitado' || r.status === 'Cancelado pela Loja') badgeSt = 'bg-danger';

        let empregadoresTxt = '';
        if (r.clienteEmpregadores && r.clienteEmpregadores.length > 0) {
          empregadoresTxt = r.clienteEmpregadores.map(e => `${e.nome} (R$ ${e.rendimento})`).join(', ');
        } else {
          empregadoresTxt = 'Nenhum informado';
        }

        let dadosContratanteHtml = `
          <div class="text-start small">
            <strong>RG:</strong> ${r.clienteRg || 'N/I'} | <strong>CPF:</strong> ${r.clienteCpf || 'N/I'}<br>
            <strong>Profissão:</strong> ${r.clienteProfissao || 'N/I'}<br>
            <strong>Endereço:</strong> ${r.clienteEndereco || 'N/I'}<br>
            <strong>Empregadores/Rend.:</strong> ${empregadoresTxt}
          </div>
        `;

        let botoesAcao = '';
        if (r.status === 'Pendente Análise') {
          botoesAcao = `
            <button class="btn btn-sm btn-success px-3 me-1 fw-semibold mb-1" onclick="confirmarAprovacaoReserva('${r.id}', '${r.carroId}')"><i class="bi bi-check-lg"></i> Aprovar Análise</button>
            <button class="btn btn-sm btn-danger px-3 fw-semibold mb-1" onclick="confirmarRejeicaoReserva('${r.id}')"><i class="bi bi-x-lg"></i> Rejeitar</button>
          `;
        } else if (r.status === 'Aprovado') {
          botoesAcao = `
            <span class="text-success fw-semibold me-2 d-block">Contrato Aprovado</span>
            <button class="btn btn-sm btn-outline-danger px-3 fw-semibold" onclick="confirmarCancelamentoLoja('${r.id}', '${r.carroId}')"><i class="bi bi-slash-circle"></i> Cancelar</button>
          `;
        } else {
          botoesAcao = `<span class="text-muted fw-semibold">${r.status}</span>`;
        }

        tabelaReservasLoja.innerHTML += `
          <tr>
            <td class="fw-semibold text-start">${r.clienteNome}<br><small class="text-muted">${r.clienteEmail}</small></td>
            <td>${dadosContratanteHtml}</td>
            <td>${r.modeloCarro}</td>
            <td><span class="badge ${badgeSt} px-3 py-2">${r.status}</span></td>
            <td>${botoesAcao}</td>
          </tr>
        `;
      });
    }
  }

  // 7. FROTA DA LOJA
  const gridFrotaLoja = document.getElementById('grid-frota-loja');
  if (gridFrotaLoja && usuarioLogado) {
    if (empresaNomeNav) empresaNomeNav.innerText = usuarioLogado.empresa;
    carregarFrotaLoja();
  }
}

// ---- FUNÇÕES AUXILIARES DE NAVEGAÇÃO E REQUISIÇÕES ----
function verDetalhesCarro(id) {
  localStorage.setItem('carroSelecionadoId', id);
  window.location.href = 'detalhes-veiculo.html';
}

function trocarImagem(src) {
  const imgP = document.getElementById('img-principal');
  if (imgP) imgP.src = src;
}

function abrirModalConfirmacaoReserva() {
  if (!usuarioLogado || usuarioLogado.tipo !== 'cliente') {
    alert('Você precisa estar logado como Cliente (Contratante) para solicitar reserva!');
    window.location.href = 'login.html';
    return;
  }

  dispararConfirmacao(
    "Confirmar Solicitação de Reserva",
    "Tem certeza de que deseja enviar sua solicitação de aluguel e seus dados cadastrais (RG, CPF, Empregadores) para análise financeira da loja?",
    async () => {
      const carroId = localStorage.getItem('carroSelecionadoId') || "1";
      const carros = await getColecao('carros');
      const carro = carros.find(c => String(c.id) === String(carroId));
      if (!carro) return;

      const novaReserva = {
        id: String(Date.now()),
        carroId: String(carro.id),
        modeloCarro: carro.modelo,
        empresa: carro.empresa,
        clienteEmail: usuarioLogado.email,
        clienteNome: usuarioLogado.nome,
        clienteRg: usuarioLogado.rg || 'Não informado',
        clienteCpf: usuarioLogado.cpf || 'Não informado',
        clienteEndereco: usuarioLogado.endereco || 'Não informado',
        clienteProfissao: usuarioLogado.profissao || 'Não informada',
        clienteEmpregadores: usuarioLogado.empregadores || [],
        data: new Date().toLocaleDateString('pt-BR'),
        status: 'Pendente Análise'
      };

      await salvarItem('reservas', novaReserva);
      
      // Notificação para a Loja
      await salvarItem('notificacoes', {
        id: String(Date.now() + 1),
        destino: 'loja',
        empresa: carro.empresa,
        emailCliente: usuarioLogado.email,
        mensagem: `Novo pedido de aluguel: ${carro.modelo} solicitado por ${usuarioLogado.nome}.`,
        lida: false,
        data: new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})
      });

      alert('Solicitação e dados cadastrais enviados para análise com sucesso!');
      window.location.href = 'cliente-painel.html';
    }
  );
}

// ---- NOTIFICAÇÕES VIA SINO ----
async function carregarNotificacoesCliente() {
  const notificacoes = await getColecao('notificacoes');
  const notifCliente = notificacoes.filter(n => n.destino === 'cliente' && n.emailCliente === usuarioLogado.email);
  const naoLidas = notifCliente.filter(n => !n.lida);

  const badgeSinoContador = document.getElementById('badge-sino-contador');
  const listaSinoDropdown = document.getElementById('lista-sino-dropdown');
  const centralNotificacoesContainer = document.getElementById('central-notificacoes-container');

  if (badgeSinoContador) {
    badgeSinoContador.innerText = naoLidas.length;
    badgeSinoContador.style.display = naoLidas.length === 0 ? 'none' : 'inline-block';
  }

  if (listaSinoDropdown) {
    let itensHtml = '<li><h6 class="dropdown-header text-uppercase fw-bold text-primary px-0">Notificações Recentes</h6></li><li><hr class="dropdown-divider"></li>';
    if (notifCliente.length === 0) {
      itensHtml += '<li class="text-muted small text-center py-2">Nenhuma notificação nova.</li>';
    } else {
      notifCliente.slice(-5).reverse().forEach(n => {
        itensHtml += `
          <li class="mb-2 p-2 rounded bg-body-tertiary small border">
            <i class="bi bi-info-circle-fill text-primary"></i> ${n.mensagem}
            <div class="text-muted text-end" style="font-size: 0.7rem;">${n.data || ''}</div>
          </li>
        `;
      });
    }
    listaSinoDropdown.innerHTML = itensHtml;
  }

  if (centralNotificacoesContainer) {
    if (notifCliente.length === 0) {
      centralNotificacoesContainer.innerHTML = `<p class="text-muted mb-0">Nenhuma notificação recente na central.</p>`;
    } else {
      let centralHtml = '';
      notifCliente.slice().reverse().forEach(n => {
        centralHtml += `
          <div class="alert alert-info py-2 mb-2 d-flex justify-content-between align-items-center">
            <div><i class="bi bi-bell-fill me-2"></i> ${n.mensagem}</div>
            <small class="text-muted">${n.data || ''}</small>
          </div>
        `;
      });
      centralNotificacoesContainer.innerHTML = centralHtml;
    }
  }
}

async function marcarNotificacoesLidas() {
  let notificacoes = await getColecao('notificacoes');
  for (let n of notificacoes) {
    if (n.destino === 'cliente' && n.emailCliente === usuarioLogado.email) {
      await atualizarItem('notificacoes', n.id, { lida: true });
    }
  }
  await carregarNotificacoesCliente();
  alert('Notificações marcadas como lidas.');
}

async function carregarNotificacoesLoja() {
  const notificacoes = await getColecao('notificacoes');
  const notifLoja = notificacoes.filter(n => n.destino === 'loja' && n.empresa === usuarioLogado.empresa);
  const naoLidasLoja = notifLoja.filter(n => !n.lida);

  const badgeSinoContadorLoja = document.getElementById('badge-sino-contador-loja');
  const listaSinoDropdownLoja = document.getElementById('lista-sino-dropdown-loja');
  const centralNotificacoesLojaContainer = document.getElementById('central-notificacoes-loja-container');

  if (badgeSinoContadorLoja) {
    badgeSinoContadorLoja.innerText = naoLidasLoja.length;
    badgeSinoContadorLoja.style.display = naoLidasLoja.length === 0 ? 'none' : 'inline-block';
  }

  if (listaSinoDropdownLoja) {
    let itensLojaHtml = '<li><h6 class="dropdown-header text-uppercase fw-bold text-primary px-0">Notificações da Loja</h6></li><li><hr class="dropdown-divider"></li>';
    if (notifLoja.length === 0) {
      itensLojaHtml += '<li class="text-muted small text-center py-2">Nenhuma notificação nova.</li>';
    } else {
      notifLoja.slice(-5).reverse().forEach(n => {
        itensLojaHtml += `
          <li class="mb-2 p-2 rounded bg-body-tertiary small border">
            <i class="bi bi-bell-fill text-primary"></i> ${n.mensagem}
            <div class="text-muted text-end" style="font-size: 0.7rem;">${n.data || ''}</div>
          </li>
        `;
      });
    }
    listaSinoDropdownLoja.innerHTML = itensLojaHtml;
  }

  if (centralNotificacoesLojaContainer) {
    if (notifLoja.length === 0) {
      centralNotificacoesLojaContainer.innerHTML = `<p class="text-muted mb-0">Nenhuma notificação recente para a empresa.</p>`;
    } else {
      let centralHtml = '';
      notifLoja.slice().reverse().forEach(n => {
        centralHtml += `
          <div class="alert alert-secondary py-2 mb-2 d-flex justify-content-between align-items-center">
            <div><i class="bi bi-inbox-fill me-2 text-primary"></i> ${n.mensagem}</div>
            <small class="text-muted">${n.data || ''}</small>
          </div>
        `;
      });
      centralNotificacoesLojaContainer.innerHTML = centralHtml;
    }
  }
}

async function marcarNotificacoesLidasLoja() {
  let notificacoes = await getColecao('notificacoes');
  for (let n of notificacoes) {
    if (n.destino === 'loja' && n.empresa === usuarioLogado.empresa) {
      await atualizarItem('notificacoes', n.id, { lida: true });
    }
  }
  await carregarNotificacoesLoja();
  alert('Notificações da loja marcadas como lidas.');
}

// ---- AÇÕES DA LOJA PARA APROVAR OU REJEITAR ----
function confirmarAprovacaoReserva(reservaId, carroId) {
  dispararConfirmacao(
    "Aprovar Análise Financeira e Contrato",
    "Tem certeza de que deseja aprovar este pedido após análise financeira? O veículo ficará indisponível e o contrato pronto.",
    () => mudarStatusReserva(reservaId, 'Aprovado', carroId, 'Alugado / Indisponível')
  );
}

function confirmarRejeicaoReserva(reservaId) {
  dispararConfirmacao(
    "Rejeitar Pedido",
    "Tem certeza de que deseja rejeitar este pedido de aluguel?",
    () => mudarStatusReserva(reservaId, 'Rejeitado', null, null)
  );
}

function confirmarCancelamentoLoja(reservaId, carroId) {
  dispararConfirmacao(
    "Cancelar Reserva Aprovada",
    "Deseja cancelar esta reserva já aprovada? O veículo voltará a ficar disponível para novos aluguéis.",
    () => mudarStatusReserva(reservaId, 'Cancelado pela Loja', carroId, 'Disponível')
  );
}

async function mudarStatusReserva(reservaId, novoStatus, carroId, statusCarroOp) {
  const reservas = await getColecao('reservas');
  const reserva = reservas.find(r => String(r.id) === String(reservaId));

  if (reserva) {
    await atualizarItem('reservas', reservaId, { status: novoStatus });
    
    if (carroId && statusCarroOp) {
      await atualizarItem('carros', carroId, { status: statusCarroOp });
    }
    
    // Notificação para o cliente
    await salvarItem('notificacoes', {
      id: String(Date.now()),
      destino: 'cliente',
      emailCliente: reserva.clienteEmail,
      empresa: reserva.empresa,
      mensagem: `Análise financeira concluída! Seu pedido para o veículo ${reserva.modeloCarro} (${reserva.empresa}) foi atualizado para: ${novoStatus}.`,
      lida: false,
      data: new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})
    });

    alert('Status atualizado com sucesso!');
    location.reload();
  }
}

function confirmarCancelamentoReserva(id) {
  dispararConfirmacao(
    "Cancelar Pedido",
    "Tem certeza de que deseja cancelar esta solicitação de reserva?",
    async () => {
      await deletarItem('reservas', id);
      alert('Reserva cancelada com sucesso.');
      location.reload();
    }
  );
}

// ---- FROTA E CADASTRO DE CARRO ----
async function carregarFrotaLoja() {
  const gridFrotaLoja = document.getElementById('grid-frota-loja');
  if (!gridFrotaLoja || !usuarioLogado) return;
  const carros = await getColecao('carros');
  const carrosLoja = carros.filter(c => c.empresa === usuarioLogado.empresa);

  gridFrotaLoja.innerHTML = '';
  if (carrosLoja.length === 0) {
    gridFrotaLoja.innerHTML = `<div class="col-12 text-center py-5"><p class="text-muted fs-5">Nenhum veículo cadastrado na sua frota. Utilize o botão acima para cadastrar.</p></div>`;
    return;
  }

  carrosLoja.forEach(carro => {
    const badgeCar = carro.status === 'Disponível' ? 'bg-success' : 'bg-danger';
    gridFrotaLoja.innerHTML += `
      <div class="col-md-4">
        <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
          <img src="${carro.imagem}" class="card-img-top" style="height: 200px; object-fit: cover;">
          <div class="card-body d-flex flex-column p-4">
            <h5 class="fw-bold">${carro.modelo}</h5>
            <p class="text-secondary mb-1">Placa: ${carro.placa} | Ano: ${carro.ano}</p>
            <p class="text-secondary mb-1">Propriedade: <span class="badge bg-primary">${carro.propriedade || 'Empresa'}</span></p>
            <p class="text-primary fw-bold fs-5 mb-2">R$ ${parseFloat(carro.preco).toFixed(2)} / dia</p>
            <div class="mb-3">Status: <span class="badge ${badgeCar}">${carro.status}</span></div>
            <div class="d-flex gap-2 mb-2">
              <button class="btn btn-sm btn-outline-success w-50 fw-semibold" onclick="confirmarStatusCarro('${carro.id}', 'Disponível')">Disponível</button>
              <button class="btn btn-sm btn-outline-danger w-50 fw-semibold" onclick="confirmarStatusCarro('${carro.id}', 'Alugado / Indisponível')">Indisponível</button>
            </div>
            <button class="btn btn-danger btn-sm w-100 mt-auto fw-semibold" onclick="confirmarExclusaoCarro('${carro.id}', '${carro.modelo}')">
              <i class="bi bi-trash-fill"></i> Excluir Veículo
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

function confirmarStatusCarro(carroId, novoStatus) {
  dispararConfirmacao(
    "Alterar Status do Veículo",
    `Deseja realmente alterar o status deste veículo para "${novoStatus}"?`,
    async () => {
      await atualizarItem('carros', carroId, { status: novoStatus });
      alert('Status atualizado!');
      await carregarFrotaLoja();
    }
  );
}

function confirmarExclusaoCarro(carroId, modeloCarro) {
  dispararConfirmacao(
    "Excluir Veículo",
    `Tem certeza de que deseja excluir permanentemente o veículo "${modeloCarro}" da sua frota?`,
    async () => {
      await deletarItem('carros', carroId);
      alert('Veículo excluído com sucesso!');
      await carregarFrotaLoja();
    }
  );
}

// Drag & Drop de imagem
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('car-img-file');
const previewContainer = document.getElementById('preview-container');
const imgPreview = document.getElementById('img-preview');
let imagemBase64Temp = "";

if (dropZone && fileInput) {
  dropZone.addEventListener('click', () => fileInput.click());

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add('border-primary', 'bg-primary-subtle');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-primary', 'bg-primary-subtle');
    });
  });

  dropZone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) processarArquivoImagem(files[0]);
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) processarArquivoImagem(e.target.files[0]);
  });
}

function processarArquivoImagem(file) {
  if (!file.type.startsWith('image/')) {
    alert('Envie apenas arquivos de imagem válidos.');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(event) {
    imagemBase64Temp = event.target.result;
    if (imgPreview && previewContainer) {
      imgPreview.src = imagemBase64Temp;
      previewContainer.classList.remove('d-none');
    }
  };
  reader.readAsDataURL(file);
}

function abrirModalConfirmacaoCadastroCarro() {
  const modelo = document.getElementById('car-modelo').value;
  const marca = document.getElementById('car-marca').value;
  const preco = document.getElementById('car-preco').value;

  if (!modelo || !marca || !preco) {
    alert('Preencha os campos obrigatórios do veículo.');
    return;
  }

  dispararConfirmacao(
    "Salvar Novo Veículo",
    `Deseja adicionar o veículo ${modelo} (${marca}) à frota da sua loja?`,
    async () => {
      const ano = parseInt(document.getElementById('car-ano').value) || 2024;
      const placa = document.getElementById('car-placa').value || 'ABC-1234';
      const propriedade = document.getElementById('car-propriedade').value || 'Empresa (Locadora)';
      const imagemFinal = imagemBase64Temp || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200";

      const novoCarro = {
        id: String(Date.now()),
        modelo, marca, ano, placa, preco: parseFloat(preco), 
        propriedade,
        imagem: imagemFinal,
        empresa: usuarioLogado.empresa,
        status: 'Disponível'
      };

      await salvarItem('carros', novoCarro);
      alert('Veículo cadastrado com sucesso!');
      location.reload();
    }
  );
}
