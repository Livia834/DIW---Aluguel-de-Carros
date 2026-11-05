<!-- Template adaptado para o Projeto Drivo - DIW / PUC Minas -->

---

# 🏷️ Drivo — Sistema Web de Gestão e Aluguel de Automóveis 👨‍💻

> Plataforma web híbrida e integrada para aluguel, gestão de frotas e validação cadastral entre clientes contratantes, locadoras e instituições financeiras.

## 📚 Índice

* [Sobre o Projeto](#-sobre-o-projeto)
* [Funcionalidades Principais](#-funcionalidades-principais)
* [Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [Arquitetura e Persistência de Dados](#-arquitetura-e-persistência-de-dados)
* [Instalação e Execução](#-instalação-e-execução)
* [Perfis e Credenciais para Testes](#-perfis-e-credenciais-para-testes)
* [Plano de Testes (Cenários Passo a Passo)](#-plano-de-testes-cenários-passo-a-passo)
* [Estrutura de Pastas](#-estrutura-de-pastas)
* [Autores](#-autores)

## 📝 Sobre o Projeto

O **Drivo** é uma solução web responsiva desenvolvida para otimizar e intermediar o processo de locação de veículos.

* **Problema que resolve:** Elimina a burocracia na consulta de frotas e na validação cadastral de clientes por parte das locadoras e bancos parceiros.
* **Valor entregue:** Permite que clientes pesquisem veículos, verifiquem o registro de propriedade (Empresa, Cliente ou Banco) e enviem propostas com ficha cadastral completa (RG, CPF e fontes de renda). As lojas dispõem de um painel integrado para análise financeira, aprovação de contratos, gestão de frotas e central de notificações em tempo real.
* **Contexto:** Trabalho prático desenvolvido no âmbito acadêmico da PUC Minas para a disciplina de Desenvolvimento de Interfaces Web (DIW).

## ✨ Funcionalidades Principais

* 🔐 **Autenticação e Perfis Distintos:** Cadastro e login segregados para *Clientes* (Contratantes) e *Funcionários* (Locadoras/Bancos).
* 🚗 **Catálogo Dinâmico e Detalhes:** Visualização completa da frota com especificação de diárias, status de disponibilidade e registro de propriedade.
* 📋 **Ficha de Renda e Empregadores:** Cadastro de até 3 entidades empregadoras e rendimentos mensais pelo cliente.
* 📥 **Gestão de Solicitações (Loja):** Fila de pedidos recebidos com visualização dos dados cadastrais do cliente e botões de *Aprovar Análise*, *Rejeitar* ou *Cancelar*.
* 🔔 **Central de Notificações com Sino:** Alertas em tempo real tanto para o cliente (mudança de status do pedido) quanto para a loja (novas reservas).
* 🌓 **Alternância de Temas (Light/Dark Mode):** Suporte completo a temas com substituição automática inteligente das imagens da logo (`logo-drivo.png` e `logo-drivo-escuro.png`).

## 🛠 Tecnologias Utilizadas

* **Front-end:** HTML5 semântico, CSS3 customizado, Bootstrap 5.3 e Bootstrap Icons.
* **Lógica e Dinâmica:** JavaScript (ES6+, Async/Await, Fetch API, manipulação do DOM).
* **Persistência de Dados:** Arquitetura Híbrida com **JSON Server** (`db.json`) e fallback automático para **LocalStorage** (compatível com Vercel).

## 🏗 Arquitetura e Persistência de Dados

A aplicação utiliza um modelo de dados flexível implementado em `script.js`:

1. **Ambiente Local (`JSON Server`):** Conecta-se à porta `3000` operando diretamente sobre o arquivo `db.json`.
2. **Ambiente de Nuvem / Estático (`LocalStorage`):** Caso o servidor local esteja offline (como em deploys no Vercel), o script chaveia automaticamente para o armazenamento local do navegador, mantendo todas as telas funcionais.

## 🔧 Instalação e Execução

### Pré-requisitos

* **Node.js** instalado na máquina.
* Navegador web moderno (Chrome, Edge, Firefox).

### Como Executar a Aplicação Localmente

1. Extraia o pacote ZIP do projeto.
2. Abra o terminal na pasta raiz onde está o arquivo `db.json`.
3. **Inicie o JSON Server:**
   ```bash
   npx json-server --watch db.json --port 3000
   ```
4. Abra o arquivo **`index.html`** em seu navegador (ou utilize a extensão *Live Server* do VS Code).

## 👤 Perfis e Credenciais para Testes

O banco de dados pré-carregado (`db.json`) já inclui os seguintes usuários de teste:

| Perfil de Acesso | E-mail | Senha | Descrição |
| :--- | :--- | :--- | :--- |
| **Cliente / Contratante** | `cliente@email.com` | `123` | Perfil de Ana Souza (com RG, CPF, profissão e empregadores). |
| **Funcionário / Loja** | `loja@drivo.com` | `123` | Perfil da locadora *Horizonte Rent a Car*. |

## 🧪 Plano de Testes (Cenários Passo a Passo)

### Cenário 1: Solicitação de Reserva (Cliente)
1. Acesse `login.html` e entre com `cliente@email.com` / `123`.
2. Navegue até o **Catálogo** (`catalogo.html`).
3. Escolha um veículo (ex: *Toyota Corolla XEi*) e clique em **Ver Detalhes e Reservar**.
4. Confira as informações de propriedade e clique em **Solicitar reserva**, confirmando o modal.
5. O sistema redirecionará para o seu painel (`cliente-painel.html`), exibindo o pedido com o status `Pendente Análise`.

### Cenário 2: Análise Financeira e Aprovação (Loja)
1. Faça logout e acesse a conta da loja com `loja@drivo.com` / `123`.
2. Acesse a aba **Solicitações Recebidas** (`loja-solicitacoes.html`).
3. Visualize os dados cadastrais e de renda enviados pelo cliente.
4. Clique em **Aprovar Análise**. O veículo ficará indisponível na frota e o contrato será aprovado.

### Cenário 3: Alternância de Tema e Logos
1. Clique no botão de alternar tema (ícone de lua/sol no cabeçalho).
2. Note que o esquema de cores e a imagem da logo no topo mudam automaticamente entre o modo claro (`logo-drivo.png`) e escuro (`logo-drivo-escuro.png`).

## 📂 Estrutura de Pastas

```
.
├── db.json                     # Banco de dados do JSON Server
├── index.html                  # Landing page da aplicação
├── login.html                  # Tela de login com design centralizado
├── cadastro.html               # Tela de cadastro (Cliente ou Funcionário)
├── catalogo.html               # Vitrine de veículos disponíveis
├── detalhes-veiculo.html       # Ficha técnica e formulário de reserva
├── cliente-painel.html         # Painel do cliente e central de notificações
├── loja-solicitacoes.html      # Fila de pedidos e aprovação de contratos
├── loja-frota.html             # Gestão e cadastro de frotas da loja
├── style.css                   # Estilos globais e regras de troca de logo
├── script.js                   # Lógica da aplicação e cliente HTTP hibrido
├── logo-drivo.png              # Logotipo oficial (modo claro)
└── logo-drivo-escuro.png       # Logotipo adaptado (modo escuro)
```

## 👥 Autores

| 👤 Nome | 🖼️ Foto | :octocat: GitHub | 💼 LinkedIn | 📤 E-mail |
| :--- | :--- | :--- | :--- | :--- |
| **Lívia Duarte Silva** | | | | |

* **Professor Orientador:** Prof. Dr. João Paulo Aramuni

## 📄 Licença

Este projeto é desenvolvido para fins educacionais no âmbito da disciplina de Desenvolvimento de Interfaces Web da **PUC Minas**.