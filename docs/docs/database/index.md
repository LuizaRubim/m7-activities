---
title: Banco de dados
---

# Banco de dados

O banco de dados foi utilizado no projeto para armazenar os logs do sistema, ou seja, as informações de cada ação que o usuário realizou no site. O banco criado foi o supabase, que é um banco de dados open source e que possui uma API para facilitar a integração com o backend.

O banco de dados foi criado com a seguinte estrutura:

Uma tabela chamada `logs` com as seguintes colunas:

- `id` (tipo: int): identificador único de cada log
- `acao` (tipo: text): ação realizada pelo usuário, com as pos´diveis ações de entrar no sistema e realiza a predição.
- `data` (tipo: timestamp): data e hora em que a ação foi realizada
- `resultado` (tipo: json): resultado da ação realizada, então se for entrar no sistema o resultado é ok e se for realizar a predição o resultado são as informações do modelo gerado, como numero de épocas, qual modelo utilizado e as métricas desse modelo, além da recomendação prevista.

Para integração do backend, foi necessário criar o client do supabase e realizar as queries necessárias.
