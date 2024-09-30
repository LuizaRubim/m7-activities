// "use client";
// import Link from "next/link";
// import { useState, useEffect } from "react";

// export default function Home() {
//   const [data, setData] = useState(null);

// useEffect(() => {
//   fetch(`http://${window.location.hostname}/`)
//   .then(response => response.json())
//   .then(data => console.log(data));
//   setData(data);
// }
// , []);
//   return (
//     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//        <header>
//         <nav className="flex flex-start items-center p-4 gap-4">
//           <Link 
//           href="/">
//             Histórico de registros</Link>
//             <Link 
//           href="/logs">
//             Logs do sistema</Link>

//           </nav>
//         </header>
//     </div>
//   );
// }

import PredictionForm from '../components/PredictionForm';

export default function Home() {
  return (
    <div className="container mx-auto">
      <h1 className="text-center text-2xl mb-6">Previsão de Preços do Bitcoin</h1>
      <PredictionForm />
    </div>
  );
}