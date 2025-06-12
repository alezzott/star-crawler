# Star Crawler - Backend

Backend do projeto **Star Crawler**, responsável por pesquisar, importar, exportar e gerenciar repositórios do GitHub, com processamento assíncrono via RabbitMQ.

## Funcionalidades

- **Pesquisa de repositórios do GitHub:**  
  Busque todos os repositórios públicos de um usuário do GitHub.

- **Exportação de repositórios:**  
  Exporte repositórios filtrados em formato CSV.

- **Importação de repositórios via CSV:**  
  Importe repositórios a partir de um arquivo CSV, processando os dados em background via RabbitMQ.

- **Visualização e filtros:**  
  Liste e filtre repositórios persistidos no banco de dados, com paginação e múltiplos filtros.

- **Status de importação:**  
  Consulte o status do processamento de importação de arquivos CSV.

## Endpoints Principais

- `GET /repositories/github/:username`  
  Retorna todos os repositórios públicos de um usuário do GitHub.

- `GET /repositories`  
  Lista repositórios persistidos no banco de dados.  
  **Suporta filtros via query params:**
  - `name`: filtra pelo nome do repositório (exato)
  - `owner`: filtra pelo nome do proprietário
  - `stars`: filtra pela quantidade de estrelas (exato)
  - `url`: filtra pela URL do repositório (exato)
  - `page`: número da página (padrão: 1)
  - `limit`: quantidade de itens por página (padrão: 20)

  **Exemplo de uso:**
  ```
  GET /repositories?name=repo1&owner=owner1&stars=10&page=2&limit=50
  ```

- `GET /repositories/export/csv`  
  Exporta repositórios filtrados em formato CSV.  
  **Aceita os mesmos filtros do endpoint `/repositories`.**

- `POST /repositories/import/csv`  
  Importa um arquivo CSV de repositórios. O processamento é feito em background via RabbitMQ.  
  Retorna um `jobId` para acompanhamento do status.

- `GET /repositories/import/status/:jobId`  
  Consulta o status do processamento de importação de um arquivo CSV (`processing`, `done`, `error`).

## Como executar com Docker

1. **Clone o repositório e acesse a pasta do projeto:**
   ```sh
   git clone <repo-url>
   cd star-crawler
   ```

2. **Configure as variáveis de ambiente para cada serviço:**

   - **Backend:**
     ```sh
     cp backend/.env.example backend/.env
     ```
     Edite o arquivo `backend/.env` conforme necessário.

   - **Frontend:**
     ```sh
     cp frontend/.env.example frontend/.env
     ```
     Edite o arquivo `frontend/.env` conforme necessário.

3. **Para ambiente de desenvolvimento:**  
   Use o arquivo padrão, que já está configurado para hot reload e volumes:
   ```sh
   docker-compose up --build
   ```

4. **Para ambiente de produção:**  
   Use o arquivo `docker-compose.prod.yml` (caso exista) para builds otimizados e comandos de produção:
   ```sh
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

   Isso irá subir:
   - Backend (NestJS)
   - Frontend (Next.js)
   - Banco de dados (MariaDB)
   - Fila de mensagens (RabbitMQ)

5. **Acesse a aplicação:**
   - **Frontend:** [http://localhost:3001](http://localhost:3001)
   - **Backend/API:** [http://localhost:3000](http://localhost:3000)

---

**Importante:**  
Não existe mais `.env` na raiz do projeto.  
Cada serviço (backend e frontend) deve ter seu próprio arquivo `.env` na respectiva pasta.

## Estrutura dos Containers

- **star-crawler-backend:** API REST (porta 3000)
- **star-crawler-db:** Banco de dados MariaDB (porta 3306)
- **star-crawler-rabbitmq:** RabbitMQ (portas 5672 e 15672)

## Observações

- O processamento de importação é feito de forma assíncrona. Use o endpoint de status para acompanhar o progresso.
- Os dados importados são persistidos no banco de dados e podem ser consultados e filtrados via API.
- O backend está pronto para integração com o frontend.

---

Para dúvidas ou sugestões, abra uma issue no repositório.