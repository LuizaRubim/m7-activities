"use client";
import react from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"


export default function LogsPage() {
    const [data, setData] = react.useState([]);

    useEffect(() => {
        axios.get(`http://${window.location.hostname}:3000/logs`)
        .then((response) => {
            setData(response.data);
            console.log(response.data);
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
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead className="w-[100px]">Data</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Resultado</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            {data.map((log) => (
                        <TableRow key={log.id}>
                            <TableCell>{new Date(log.datetime).toLocaleString()}</TableCell>
                            <TableCell>{log.acao}</TableCell>
                            <TableCell>{JSON.stringify(log.resultado)}</TableCell>
                        </TableRow>
                    ))}
            </TableBody>
            </Table>
        </div>
    );
    }