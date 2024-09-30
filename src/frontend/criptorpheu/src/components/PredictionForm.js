"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PredictionForm = () => {
    const [trainingPeriod, setTrainingPeriod] = useState('1y');
    const [predictionDays, setPredictionDays] = useState(30);
    const [loading, setLoading] = useState(false); // Estado de carregamento
    const [graph, setGraph] = useState(null);
    const [mse, setMse] = useState(null);
    const [mae, setMae] = useState(null);
    const [rmse, setRmse] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Ativa o estado de carregamento

        try {
            const response = await axios.post('http://localhost:8000/predict', {
                training_period: trainingPeriod,
                prediction_days: predictionDays,
                mse: mse,
                mae: mae,
                rmse: rmse,
            });
            console.log(response.data);
            setGraph(response.data.graph);
            setMse(response.data.mse);
            setMae(response.data.mae);
            setRmse(response.data.rmse);
        } catch (error) {
            console.error('Erro ao fazer a previsão:', error);
        } finally {
            setLoading(false); // Desativa o estado de carregamento
        }
    };

    useEffect(() => {
    try {
        const response = axios.get('http://localhost:8000/');
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
                    </select>
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
            { mse && mae && rmse &&
            <div>
                <p>MAE: {mae}</p>
                <p>MSE: {mse}</p>
                <p>RMSE: {rmse}</p>
            </div>}
        </div>
    );
};

export default PredictionForm;