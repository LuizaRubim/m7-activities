"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PredictionForm = () => {
    const [trainingPeriod, setTrainingPeriod] = useState('1y');
    const [predictionDays, setPredictionDays] = useState(30);
    const [loading, setLoading] = useState(false);
    const [graph, setGraph] = useState(null);
    const [mse, setMse] = useState(null);
    const [mae, setMae] = useState(null);
    const [rmse, setRmse] = useState(null);
    const [epochs, setEpochs] = useState(20);
    const [recomendation, setRecomendation] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`http://${window.location.hostname}:3000/predict`, {
                training_period: trainingPeriod,
                prediction_days: predictionDays,
                mse: mse,
                mae: mae,
                rmse: rmse,
                epochs: epochs,
                recomendation: recomendation
            });
            console.log(response.data);
            setGraph(response.data.graph);
            setMse(response.data.mse);
            setMae(response.data.mae);
            setRmse(response.data.rmse);
            setRecomendation(response.data.recomendation);
        } catch (error) {
            console.error('Erro ao fazer a previsão:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    try {
        const response = axios.get(`http://${window.location.hostname}:3000/`);
        console.log(response.data);
    } catch (error) {
        console.error('Erro ao fazer a previsão:', error);
    }
    }), [];

    return (
        <div className="flex flex-col items-center">
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <label>
                    Período de Treinamento:
                    <select value={trainingPeriod} onChange={(e) => setTrainingPeriod(e.target.value)} className="mb-4 p-2 border">
                        <option value="1mo">1 Mês</option>
                        <option value="3mo">3 Meses</option>
                        <option value="6mo">6 Meses</option>
                        <option value="1y">1 Ano</option>
                        <option value="2y">2 Anos</option>
                        <option value="3y">3 Anos</option>
                        <option value="5y">5 Anos</option>
                        <option value="ytd">Desde o inicio do ano</option>
                        <option value="max">Tudo</option>
                    </select>
                </label>
                <label>
                    Número de épocas:
                    <input
                        type="number"
                        value={epochs}
                        onChange={(e) => setEpochs(e.target.value)}
                        min="1"
                        max="1000"
                        className="mb-4 p-2 border"
                    />
                </label>
                <label>
                    Dias de Previsão:
                    <input
                        type="number"
                        value={predictionDays}
                        onChange={(e) => setPredictionDays(e.target.value)}
                        min="1"
                        max="365"
                        className="mb-4 p-2 border"
                    />
                </label>
                <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2">
                    Fazer Previsão
                </button>
                {loading ? <p>Carregando...</p> : null}
            </form>

            {graph && <img src={graph} alt="Gráfico de previsão do Bitcoin" />}
            { mse && mae && rmse && recomendation &&
            <div>
                <p>MAE: {mae}</p>
                <p>MSE: {mse}</p>
                <p>RMSE: {rmse}</p>
                <p>Recomendação: {recomendation}</p>
            </div>}
        </div>
    );
};

export default PredictionForm;