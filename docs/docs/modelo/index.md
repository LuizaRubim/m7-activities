---
title: Modelo preditivo do Bitcoin
---

## Introdução

Para realizar o sistema de recomendação, primeiramente foi feita uma análise dos dados históricos do Bitcoin, que foram obtidos através da API do Yahoo, a `yfinance`. 

Os notebooks data_exploring e build_model possuem o processo de análise e construção do modelo preditivo, respectivamente.

é possível encontrar esses notebooks na pasta `notebooks` do repositório.

## Análise dos dados

A partir da função `seasonal_decompose` da biblioteca `statsmodels`, foi possível decompor a série temporal do preço do Bitcoin em suas componentes de tendência, sazonalidade e resíduo.

Com a tendência, foi possível observar que o preço do Bitcoin tem uma tendência de crescimento ao longo do tempo, com alguns picos e vales.	

A sazonalidade, por sua vez, mostra que o preço do Bitcoin tem um comportamento cíclico, com períodos de alta e baixa, devido ao bitcoin halving e oscilações do mercado.

Com basde nisso, foi construído um modelo inicial que leva em conta os valores de fechamento da moeda para prever.

O modelo utilizado foi a Rede Neural LSTM, que é uma rede neural recorrente que aprende dependências de longo prazo. O motivo de escolher essa rede é, a partir de pesquisas sobre melhores modelos para prever ações do mercado, o LSTM se mostrou efizaz pois que ele é capaz de aprender dependências de longo prazo, o que é essencial para prever séries temporais.

O modelo foi treinado com 80% dos dados e testado com os 20% restantes.

Segue um exemplo do código de implementação do modelo:

```python
model = Sequential()
model.add(Bidirectional(LSTM(50, return_sequences=True), input_shape=(X.shape[1], 1)))
model.add(Dropout(0.2))
model.add(Bidirectional(LSTM(100, return_sequences=True)))
model.add(Dropout(0.2))
model.add(Bidirectional(LSTM(50)))
model.add(Dropout(0.2))
model.add(Dense(1))
model.compile(optimizer='adam', loss='mean_squared_error')
model.fit(X_train, y_train, epochs=100, batch_size=32)
```

## Resultados

O modelo foi capaz de prever o preço do Bitcoin com um RMSE médio de 1000 dólares, o que é um resultado que cabe melhorias futuras, mas que já é um bom começo.

Além disso, por estratégias de desenvolvimento, o foco foi aplicado na implementação do modelo na aplicação web e possibilitar ao usuário, por meio da interface, fazer ajustes nos parâmetros para obter melhores resultados.

## Implementação na aplicação web

Assim, a implementação contou com várias funções python que eram chamadas conforme a rota predict fornecia os parâmetros do modelo e ele era treinado com os dados históricos. A rota então fornecia um gráfico com os dados históricos e a previsão futura, além de métricas de avaliação do modelo e a recomendação de compra ou venda ou manter a moeda.

Apesar da rota demorar certo tempo para responder, estava a critério do usuário esperar o tempo necessário para obter a previsão, com base nod parâmetros escolhidos. Assim, o retreino do modelo era realizado a cada nova previsão, grantindo que o modelo estivesse sempre atualizado.

Segue um exemplo da implementação da rota predict:

```python
async def predict(request: Request):
    body = await request.json()
    training_period = body.get("training_period")
    prediction_days = int(body.get("prediction_days")) 
    epochs = int(body.get("epochs"))

    btc_data = yf.download('BTC-USD', period=training_period)['Close'].values.reshape(-1, 1)

    if btc_data.size == 0:
        return {"error": "Nenhum dado disponível para o período solicitado."}
    
    history = btc_data.size
    print(f"History: {history}")
    model, scaler, mse, rmse, mae = train_lstm(btc_data, epochs)
    predictions = predict_future(model, btc_data, scaler, prediction_days)


    plt.figure(figsize=(10, 5))
    plt.plot(btc_data[-history:], label="Histórico BTC")
    future_index = range(len(btc_data), len(btc_data) + prediction_days)
    plt.plot(future_index, predictions, label="Previsão BTC", color='red')
    plt.legend()
    plt.xlabel("Dias")
    plt.ylabel("Preço (USD)")
    img = BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    graph_url = base64.b64encode(img.getvalue()).decode()

    recomendation_text = recomendation(btc_data, predictions)

    log_entry = {
        "datetime": pd.Timestamp.now().isoformat(),
        "acao": "Usuário realizou uma predição",
        "resultado": {
            "periodo de treinamento": training_period,
            "dias de previsão": prediction_days,
            "épocas": epochs,
            "modelo": "LSTM",
            "mse": mse,
            "rmse": rmse,
            "mae": mae,
            "recomendacao": recomendation_text
        }
    }
    supabase.table("Logs").insert(log_entry).execute()

    return {"graph": f"data:image/png;base64,{graph_url}", "mse": mse, "rmse": rmse, "mae": mae, "recomendation": recomendation_text}
```

Portanto, o modelo foi implementado com sucesso na aplicação web e está disponível para uso no site do Criptorpheu.

