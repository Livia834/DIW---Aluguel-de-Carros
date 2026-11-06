# 🚗 Drivo — Sistema Web de Gestão e Aluguel de Automóveis

O **Drivo** (antigo *CarFlow*) é um sistema web responsivo desenvolvido para a disciplina de **Desenvolvimento de Interfaces Web (DIW)** da **PUC Minas**. A plataforma permite que clientes solicitem reservas de automóveis com envio de dados de identificação e rendimento, além de oferecer às locadoras e instituições financeiras uma interface completa para gestão de frota, análise cadastral e alteração de status de pedidos.

---

## 🚀 Funcionalidades Principais

### 👤 Módulo do Cliente (Contratante)
* **Cadastro Completo:** Registro de dados de identificação (RG, CPF, endereço), profissão e até 3 entidades empregadoras com rendimentos mensais.
* **Catálogo de Veículos:** Consulta detalhada da frota disponível com identificação da propriedade do veículo (Empresa, Cliente ou Banco/Financiadora).
* **Solicitação de Aluguel:** Seleção de veículo, estimativa de custos por período e envio da solicitação para análise da loja.
* **Central de Notificações & Sino:** Notificações em tempo real com indicador visual no cabeçalho sobre a aprovação ou recusa do contrato.
* **Painel do Cliente:** Gestão de solicitações ativas e histórico com opção de cancelamento de reservas pendentes.

### 🏢 Módulo da Loja / Funcionário (Locadora & Banco)
* **Gestão de Frota (CRUD):** Cadastro de novos veículos com suporte a *Drag & Drop* para upload de fotos em Base64, definição de diária e status.
* **Análise Cadastral e Aprovação:** Visualização completa da ficha cadastral do cliente (RG, CPF, empregadores) para análise financeira.
* **Ações de Contrato:** Aprovação, rejeição ou cancelamento de contratos com atualização automática da disponibilidade do veículo.
* **Notificações da Empresa:** Sino e central dedicada para alertas de novos pedidos recebidos.

### 🎨 Suporte Acessível a Temas (Light & Dark Mode)
* Alternância dinâmica de tema (claro/escuro) com persistência da preferência do usuário via `localStorage`.
* Suporte nativo via CSS para alternância automática das logos (`logo-drivo.png` e `logo-drivo-escuro.png`).

---

## 🛠️ Arquitetura Híbrida de Dados (JSON Server + LocalStorage / Vercel)

O projeto conta com uma camada de dados adaptável no arquivo `script.js`:
* **Ambiente Local:** Comunica-se via chamadas HTTP (`GET`, `POST`, `PATCH`, `DELETE`) com o **JSON Server** rodando na porta `3000` (utilizando o arquivo `db.json`).
* **Ambiente em Nuvem (Vercel):** Caso a API local esteja indisponível, o sistema detecta a ausência do backend e chaveia automaticamente para a simulação em **LocalStorage**, garantindo que todas as telas e persistências funcionem perfeitamente em hospedagens estáticas.

---

## ⚙️ Como Executar o Projeto Localmente

### Pré-requisitos
* **Node.js** instalado (para executar o `json-server`).
* Qualquer navegador web moderno (Chrome, Edge, Firefox).

### Passo a Passo

1. **Descompactar o arquivo `.zip`:**
   Extraia todo o conteúdo do arquivo ZIP recebido para uma pasta em seu computador.

2. **Iniciar o JSON Server:**
   Abra o terminal de sua preferência (Prompt de Comando, PowerShell ou Terminal do VS Code) na pasta raiz do projeto e execute:
   ```bash
   npx json-server --watch db.json --port 3000
   ```
   > O terminal exibirá que a API está rodando em `http://localhost:3000/`.

3. **Abrir a Aplicação:**
   Abra o arquivo `index.html` diretamente no seu navegador ou utilize a extensão **Live Server** no VS Code.

---

## 🔑 Credenciais de Teste Pré-cadastradas

O banco de dados (`db.json`) já vem alimentado com os seguintes perfis padrão:

| Perfil | E-mail | Senha | Descrição |
| :--- | :--- | :--- | :--- |
| **Cliente / Contratante** | `cliente@email.com` | `123` | Contratante de teste (Ana Souza) com RG, CPF e empregadores já cadastrados. |
| **Funcionário / Loja** | `loja@drivo.com` | `123` | Gestor da locadora *Horizonte Rent a Car*. |

---

## 🧪 Cenários de Teste Recomendados

Para testar todos os requisitos acadêmicos e fluxos da aplicação, siga os cenários abaixo:

### 🔹 Teste 1: Fluxo do Cliente (Reservar um Veículo)
1. Acesse `login.html` e entre com a conta do cliente:
   * **E-mail:** `cliente@email.com`
   * **Senha:** `123`
2. Clique no botão **"Catálogo"** no menu superior.
3. Clique em **"Ver Detalhes e Reservar"** no veículo *Toyota Corolla XEi*.
4. Na tela de detalhes, confira as informações de propriedade e clique em **"Solicitar Reserva"**.
5. Confirme a ação na janela modal.
6. Você será redirecionado para `cliente-painel.html`, onde verá seu pedido listado com o status `Pendente Análise`.

### 🔹 Teste 2: Fluxo da Loja (Análise Financeira e Aprovação)
1. Faça logout ou abra uma janela anônima para acessar `login.html`.
2. Entre com a conta da loja:
   * **E-mail:** `loja@drivo.com`
   * **Senha:** `123`
3. Você será direcionado para `loja-solicitacoes.html`. Observe o alerta no **Sino de Notificações**.
4. Na tabela de solicitações, examine os dados do cliente (RG, CPF e rendimento das empresas empregadoras).
5. Clique no botão verde **"Aprovar Análise"** e confirme a ação.
6. Volte à conta de cliente (`cliente@email.com`) e observe a notificação em tempo real informando que o contrato foi aprovado.

### 🔹 Teste 3: Cadastro de Veículo com Upload e Propriedade
1. Logado como funcionário da loja, navegue até a aba **"Veículos Oferecidos (Frota)"** (`loja-frota.html`).
2. Clique em **"Cadastrar Novo Carro"**.
3. Preencha o modelo, marca, ano, placa e valor da diária.
4. Escolha quem é o proprietário no campo **"Registrado como Propriedade de:"** (*Empresa*, *Cliente* ou *Banco*).
5. Arraste uma imagem para a área de *Drop Zone* ou selecione um arquivo de imagem do computador.
6. Clique em **"Salvar Veículo na Frota"**. O novo carro será exibido no grid da loja e no catálogo público.

### 🔹 Teste 4: Troca de Tema (Modo Claro / Modo Escuro)
1. Em qualquer página, clique no ícone de lua/sol (`#btn-tema`) localizado no topo.
2. Observe que todo o layout adapta suas cores e a logo no topo alterna suavemente entre `logo-drivo.png` e `logo-drivo-escuro.png`.

---

## 📁 Estrutura de Arquivos do Projeto

```text
├── db.json                     # Banco de dados do JSON Server
├── index.html                  # Página Inicial (Landing Page)
├── login.html                  # Tela de Autenticação
├── cadastro.html               # Tela de Cadastro de Usuários e Empregadores
├── catalogo.html               # Catálogo Geral de Veículos
├── detalhes-veiculo.html       # Detalhes do Veículo e Solicitação de Reserva
├── cliente-painel.html         # Painel do Cliente (Reservas, Dados e Notificações)
├── loja-solicitacoes.html      # Painel da Loja (Fila de Análise e Notificações)
├── loja-frota.html             # Painel de Gestão da Frota (CRUD de Carros)
├── style.css                   # Estilos Globais e Alternância de Logos por Tema
├── script.js                  # Lógica Frontend, Controle de Sessão e API Híbrida
├── logo-drivo.png              # Logo para Modo Claro
└── logo-drivo-escuro.png       # Logo para Modo Escuro
```

---
## 🔗 Documentações Utilizadas

* 🌐 **HTML5:** [Documentação de Referência Web da MDN (HTML)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
* 🎨 **CSS3:** [Documentação de Referência Web da MDN (CSS)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
* 💻 **JavaScript (ES6+ & Fetch API):** [Documentação da API Fetch (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)
* 📱 **Bootstrap 5:** [Documentação Oficial do Bootstrap 5.3](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
* 📦 **JSON Server:** [Repositório Oficial e Guia do JSON Server (GitHub)](https://github.com/typicode/json-server)

## 👥 Autores

* **Aluno/Desenvolvedor:** Livia Duarte Silva 

* **Professor Orientador:** Prof. Dr. João Paulo Aramuni

## 🙏 Agradecimentos
Em ambiente acadêmico, citar fontes e inspirações é crucial (integridade acadêmica). Em ambiente profissional, mostra humildade e conexão com a comunidade.

Gostaria de agradecer aos seguintes canais e pessoas que foram fundamentais para o desenvolvimento deste projeto:

* [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/) - Pelo apoio institucional, estrutura acadêmica e fomento à inovação e boas práticas de engenharia.
* [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni) - Pelos valiosos ensinamentos sobre **Arquitetura de Software** e **Padrões de Projeto**.
* [**Fernanda Kipper**](https://www.instagram.com/kipper.dev/) - Pelos valiosos ensinamentos em **Desenvolvimento Web**, **DevOps** e melhores práticas em **Front-end**.
* [**Rodrigo Branas**](https://branas.io/) - Pela didática excepcional em **Clean Architecture** e **Clean Code**.
* [**Código Fonte TV**](https://codigofonte.tv/) - Pelo vasto conteúdo e cobertura de notícias, tutoriais e apoio à comunidade de **Desenvolvimento Web**.
