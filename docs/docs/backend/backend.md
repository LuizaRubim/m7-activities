# Backend da solução

O backend da solução foi desenvolvido utilizando o framework fastapi, que é um framework web assíncrono moderno, fácil de usar e rápido para Python, além de ter uma documentação ampla na internet. Como se tratava de uma aplicação simples, o fastapi foi uma otima ferraemnta para o desenvolvimento do backend.

## Como rodar o backend

Caso queira rodar o backend localmente, é necessário instalar as dependências do projeto. Para isso, vamos criar primeiramente um ambiente virtual e seguir os seguintes passos:

1. Vá até a pasta do backend:
```bash
cd src/backend
```
2. Crie um ambiente virtual:
```bash
python3 -m venv venv
```

3. Ative o ambiente virtual:
no Linux:
```bash
source venv/bin/activate
```
no Windows:
```bash
venv\Scripts\activate
```
4. Instale as dependências do projeto:
```bash
pip install -r requirements.txt
```

5. Rode o backend:
```bash
uvicorn main:app --reload
```

Pronto! O backend estará rodando na porta 8000.

