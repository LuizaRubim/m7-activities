# import uvicorn
# from fastapi import FastAPI

# app = FastAPI ()

# @app.get("/")
# def read_root():
#     # retorna quais são os tipos de cripto e um gráfico com os dados históricos 
#     return {"Hello": "World"}

# @app.get("/get_logs")
# def read_logs():
#     return {"logs": "logs"}

# @app.post("/predict")
# def predict():
#     return {"predict": "predict"}


# if __name__ == "__main__":
#     uvicorn.run(app, host="localhost", port=8000)

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
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

# Função para carregar os dados com base na moeda
def load_data(ticker, period):
    df = yf.download(ticker, period=period)
    return df['Close']

# Função para treinar o modelo e retornar as previsões e métricas
def predict_future(crypto, days_to_predict, period):
    # Carregar dados
    data = load_data(crypto, period)
    data = np.array(data).reshape(-1, 1)

    # Normalização
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data)

    # Separação treino e teste
    train_size = int(len(scaled_data) * 0.8)
    train_data = scaled_data[:train_size]
    test_data = scaled_data[train_size:]

    # Preparação dos dados para LSTM
    def create_dataset(data, time_step=60):
        x, y = [], []
        for i in range(len(data)-time_step-1):
            x.append(data[i:i+time_step, 0])
            y.append(data[i+time_step, 0])
        return np.array(x), np.array(y)

    time_step = 60
    X_train, y_train = create_dataset(train_data, time_step)
    X_test, y_test = create_dataset(test_data, time_step)

    X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 1)
    X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)

    # Modelo LSTM
    model = Sequential([
        LSTM(50, return_sequences=True, input_shape=(time_step, 1)),
        LSTM(50, return_sequences=False),
        Dense(25),
        Dense(1)
    ])

    model.compile(optimizer='adam', loss='mean_squared_error')
    model.fit(X_train, y_train, batch_size=1, epochs=1)

    # Previsão dos dados de teste
    test_predict = model.predict(X_test)
    test_predict = scaler.inverse_transform(test_predict)

    y_test_rescaled = scaler.inverse_transform(y_test.reshape(-1, 1))

    # Previsão para o futuro
    temp_input = test_data[-time_step:].reshape(1, -1).tolist()[0]
    future_output = []

    for i in range(int(days_to_predict)):
        if len(temp_input) > time_step:
            temp_input = temp_input[1:]
        input_data = np.array(temp_input).reshape(1, time_step, 1)
        prediction = model.predict(input_data)
        future_output.append(prediction[0][0])
        temp_input.append(prediction[0][0])

    future_output_rescaled = scaler.inverse_transform(np.array(future_output).reshape(-1, 1))

    # Métricas de desempenho
    mse = mean_squared_error(y_test_rescaled, test_predict)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_test_rescaled, test_predict)

    return data, test_predict, future_output_rescaled, mse, rmse, mae

# Classe de dados de entrada
class PredictionRequest(BaseModel):
    crypto: str
    days_to_predict: int
    period: str

# Endpoint de previsão
@app.post("/predict")
async def predict(request: PredictionRequest):
    data, predicted_test, future_pred, mse, rmse, mae = predict_future(
        crypto=request.crypto,
        days_to_predict=request.days_to_predict,
        period=request.period
    )

    return {
        "data": data.tolist(),
        "predicted_test": predicted_test.tolist(),
        "future_pred": future_pred.tolist(),
        "mse": mse,
        "rmse": rmse,
        "mae": mae
    }