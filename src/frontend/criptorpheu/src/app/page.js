// "use client";
import PredictionForm from '../components/PredictionForm';
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto">
      <header>
         <nav className="flex flex-start items-center p-4 gap-4">
             <Link 
           href="/logs">
            Logs do sistema</Link>
          </nav>
        </header>
      <h1 className="text-center text-2xl mb-6">Previsão de Preços do Bitcoin</h1>
      <PredictionForm />
    </div>
  );
}