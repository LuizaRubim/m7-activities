from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sklearn.metrics import mean_absolute_error, mean_squared_error
import yfinance as yf
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt
from io import BytesIO
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Permite o frontend Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Função para preparar os dados e treinar o modelo LSTM
def train_lstm(data, look_back=60):
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data)

    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data)

    # Separação treino e teste
    train_size = int(len(scaled_data) * 0.8)
    train_data = scaled_data[:train_size]
    test_data = scaled_data[train_size:]
    
    # X, y = [], []
    # for i in range(look_back, len(scaled_data)):
    #     X.append(scaled_data[i-look_back:i, 0])
    #     y.append(scaled_data[i, 0])

    def create_dataset(data, time_step=60):
        x, y = [], []
        for i in range(len(data)-time_step-1):
            x.append(data[i:i+time_step, 0])
            y.append(data[i+time_step, 0])
        return np.array(x), np.array(y)
    
    # X, y = np.array(X), np.array(y)
    # X = np.reshape(X, (X.shape[0], X.shape[1], 1))

    X_train, y_train = create_dataset(train_data)
    X_test, y_test = create_dataset(test_data)

    time_step = 60
    X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 1)
    X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)

    model = Sequential()
    model.add(LSTM(units=50, return_sequences=True, input_shape=(time_step, 1)))
    model.add(LSTM(units=50))
    model.add(Dense(units=1))
    model.compile(optimizer='adam', loss='mean_squared_error')
    model.fit(X_train, y_train, epochs=20, batch_size=32)

    test_predict = model.predict(X_test)
    test_predict = scaler.inverse_transform(test_predict)

    y_test_rescaled = scaler.inverse_transform(y_test.reshape(-1, 1))

    mse = mean_squared_error(y_test_rescaled, test_predict)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_test_rescaled, test_predict)

    print(f'MSE: {mse}, RMSE: {rmse}, MAE: {mae}')

    return model, scaler, mse, rmse, mae

# Função para prever os valores futuros
def predict_future(model, data, scaler, days_to_predict, look_back=60):
    last_data = data[-look_back:]
    scaled_last_data = scaler.transform(last_data)
    X_input = scaled_last_data.reshape(1, -1, 1)
    
    predictions = []
    for _ in range(days_to_predict):
        pred = model.predict(X_input)
        predictions.append(pred[0][0])
        X_input = np.append(X_input[0][1:], pred[0][0])
        X_input = X_input.reshape(1, -1, 1)

    predictions = scaler.inverse_transform(np.array(predictions).reshape(-1, 1))
    return predictions


@app.post("/predict")
async def predict(request: Request):
    body = await request.json()
    training_period = body.get("training_period", "1y")
    prediction_days = int(body.get("prediction_days", 30))  # Garantir que seja int

    # Puxar os dados históricos do Bitcoin
    btc_data = yf.download('BTC-USD', period=training_period)['Close'].values.reshape(-1, 1)

    if btc_data.size == 0:
        return {"error": "Nenhum dado disponível para o período solicitado."}

    # Treinar o modelo
    model, scaler, mse, rmse, mae = train_lstm(btc_data)

    # Prever os próximos valores
    predictions = predict_future(model, btc_data, scaler, prediction_days)

    # Gerar gráfico
    plt.figure(figsize=(10, 5))

    # Plotar o histórico dos últimos 365 dias
    plt.plot(btc_data[-365:], label="Histórico BTC")

    # A previsão começará após o último ponto de histórico
    future_index = range(len(btc_data), len(btc_data) + prediction_days)
    plt.plot(future_index, predictions, label="Previsão BTC", color='red')

    plt.legend()

    # Converter gráfico para base64
    img = BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    graph_url = base64.b64encode(img.getvalue()).decode()

    return {"graph": f"data:image/png;base64,{graph_url}", "mse": mse, "rmse": rmse, "mae": mae}