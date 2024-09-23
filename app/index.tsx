     // app/index.tsx
     import { useEffect, useState } from 'react';
     import { fetchHello } from '../utils/api';

     export default function Home() {
       const [message, setMessage] = useState('');

       useEffect(() => {
         async function getMessage() {
           const data = await fetchHello();
           setMessage(data.message);
         }
         getMessage();
       }, []);

       return (
         <div>
           <h1>{message}</h1>
         </div>
       );
     }