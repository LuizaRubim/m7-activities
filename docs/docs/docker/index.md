---
title: Conteinerização da aplicação
---

## Introdução

A aplicação foi contêinerizada para que possa ser executada em qualquer ambiente, sem problemas de dependência ou incompatibilidades com sistemas operacionais. A contêinerização foi feita utilizando o Docker, que é uma plataforma que facilita a criação, o deploy e a execução de aplicações dentro de contêineres. O Docker foi a ferramenta escolhida para a contêinerização por ser uma ferramenta já utilizada em outros projetos e facilitar a execução da aplicação em qualquer ambiente. A conteinerização incluiu a seuinte estrutura:

## Dockerfile

O Dockerfile é um arquivo de configuração que contém as instruções necessárias para criar uma imagem do Docker. As imagens criadas foram para o frontend e o backend. Não houve a necessidade de criar para o banco de dados pois o supabase já está hospedado em nuvem. Assim, a aplicação completa pode ser executada por meio de um único comando.

### Dockerfile do backend

```Dockerfile
    FROM python:3.10

    WORKDIR /app

    COPY requirements.txt ./

    RUN pip install --upgrade pip

    RUN pip install --no-cache-dir -r requirements.txt

    COPY . .

    EXPOSE 3000

    CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3000"]

```

Em resumo, o Dockerfile do backend faz o seguinte:
- Define a imagem base como `python:3.10`.
- Define o diretório de trabalho como `/app`.
- Copia o arquivo `requirements.txt` para o diretório de trabalho.
- Instala as dependências do projeto.
- Copia o restante dos arquivos do projeto para o diretório de trabalho.
- Expõe a porta `3000`.
- Define o comando para iniciar a aplicação.

### Dockerfile do frontend

```Dockerfile
    FROM node:20

    WORKDIR /app

    COPY package*.json ./

    RUN npm install

    COPY . .

    RUN npm run build

    EXPOSE 3000
    
    CMD ["npm", "start"]
```

Em resumo, o Dockerfile do frontend faz o seguinte:
- Define a imagem base como `node:20`.
- Define o diretório de trabalho como `/app`.
- Copia os arquivos `package.json` e `package-lock.json` para o diretório de trabalho.
- Instala as dependências do projeto.
- Copia o restante dos arquivos do projeto para o diretório de trabalho.
- Executa o comando `npm run build` para gerar a build da aplicação.
- Expõe a porta `3000`.
- Define o comando para iniciar a aplicação.

Vale lembrar que, mesmo cada container rodando na porta 3000 internamente, o docker-compose faz o mapeamento das portas para que a aplicação possa ser acessada por outra porta, no caso, na porta 3002.

## Docker Compose

O Docker compose arquivo de configuração, que fica na raiz do projeto, no caso na pasta src, que define os serviços, redes e volumes da aplicação. Esse arquivo é o responsável por administrar a criação e inicialização os contêineres da aplicação.

```yaml
services:
  frontend:
    build: ./frontend/criptorpheu
    image: src/frontend/criptorpheu
    restart: unless-stopped
    # environment:
    #   NEXT_PUBLIC_BACKEND_URL: "http://backend:3000"
    ports:
      - "3002:3000"
    container_name: criptorpheu-frontend
    depends_on:
      - backend
    
  backend:
    build: ./backend
    image: src/backend
    restart: unless-stopped
    # environment:
    #   DATABASE_URL: ${DATABASE_URL}
    ports:
      - "3000:3000"
    container_name: criptorpheu-backend
    # env_file:
    #   - .env
    volumes:
      - ./backend:/app/backend
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_KEY=${SUPABASE_KEY}
```

Em resumo, o arquivo `docker-compose.yml` faz o seguinte:
- Define dois serviços: `frontend` e `backend`.
- Para cada serviço, define alguns parâmetros de como a criação e inicialização do contêiner devem ser feitas.
    - Para o serviço `frontend`, define o build do Dockerfile do frontend, a imagem, qual porta ele vai inicializar, o nome do container e a dependência do serviço `backend`.
    - Para o serviço `backend`, define o build do Dockerfile do backend, a imagem, o restart, qual porta ele vai inicializar, o nome do container, o volume e as variáveis de ambiente.

Ou seja, a partir do Docker compose, é possível criar e iniciar os contêineres da aplicação com um único comando.

## Como rodar a aplicação com Docker

Para rodar a aplicação com Docker, é necessário ter o Docker instalado na máquina. Para instalar o Docker, siga as instruções disponíveis no site oficial do Docker: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/).

## Estrutura
Para gerar a imagem da aplicação, foi utilizado o Dockerfile, que é um arquivo de configuração que contém as instruções necessárias para criar uma imagem do Docker. 

Após instalar o Docker, siga os seguintes passos para rodar a aplicação:

1. Clone o repositório do projeto:
```bash
git clone git@github.com:LuizaRubim/m7-activities.git
```
2. Vá até a pasta `src` do projeto:
```bash
cd m7-activities/src
```
3. Crie a imagem da aplicação por meio do docker compose:
```bash
docker compose up --build
```
4. Acesse a aplicação no link
```bash
http://localhost:3002
```

Obs: para a execução do Docker funcionar corretamente, não se esqueça de adicionar as variáveis de ambiente no arquivo `.env` do projeto. Siga o `.env.example` e entre em contato com o time de desenvolvimento para obter as variáveis necessárias.