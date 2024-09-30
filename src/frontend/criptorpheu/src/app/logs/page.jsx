import react from 'react';
import Link from 'next/link';


export default function LogsPage() {
    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
         <header>
            <nav className="flex flex-start items-center p-4 gap-4">
            <Link 
            href="/">
                Histórico de registros</Link>
                <Link 
            href="/logs">
                Logs do sistema</Link>
            </nav>
            </header>
            Logs do sistema
        </div>
    );
    }