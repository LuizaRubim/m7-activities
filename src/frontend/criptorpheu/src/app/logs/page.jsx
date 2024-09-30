"use client";
import react from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useState, useEffect } from 'react';


export default function LogsPage() {
    const [data, setData] = react.useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/logs')
        .then((response) => {
            setData(response.data);
        })
        .catch((error) => {
            alert('Erro ao buscar os logs:', error);
        });
    }, []);

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
         <header>
            <nav className="flex flex-start items-center p-4 gap-4">
            <Link 
            href="/">
                Página inicial</Link>
            </nav>
            </header>
        </div>
    );
    }