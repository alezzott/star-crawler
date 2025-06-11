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

## Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para configuração do banco de dados, RabbitMQ e outros serviços.

1. **Crie o arquivo `.env` na raiz do projeto** a partir do exemplo:
   ```sh
   cp .env.example .env
   ```
2. **Edite o arquivo `.env` conforme necessário.**  
   Exemplo de variáveis disponíveis:
   ```
   DB_HOST=db
   DB_PORT=3306
   DB_USER=user
   DB_PASSWORD=password
   DB_NAME=starcrawler

   RABBITMQ_USER=guest
   RABBITMQ_PASS=guest
   RABBITMQ_HOST=rabbitmq
   RABBITMQ_PORT=5672
   RABBITMQ_QUEUE=star-crawler-queue
   ```

## Como executar com Docker

1. **Clone o repositório e acesse a pasta do projeto:**
   ```sh
   git clone <repo-url>
   cd star-crawler
   ```

2. **Configure as variáveis de ambiente:**  
   ```sh
   cp .env.example .env
   ```
   Edite o arquivo `.env` conforme necessário.

3. **Suba os containers com Docker Compose:**
   ```sh
   docker-compose up --build
   ```

   Isso irá subir:
   - Backend (NestJS)
   - Banco de dados (MariaDB)
   - Fila de mensagens (RabbitMQ)

4. **Acesse a API:**  
   O backend estará disponível em [http://localhost:3000](http://localhost:3000).

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