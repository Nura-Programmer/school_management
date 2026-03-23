import { useEffect, useState } from 'react';
import { Button } from './components/ui/button';
import './App.css';

function App() {
   const [message, setMessage] = useState('');

   useEffect(() => {
      fetch('/api')
         .then((response) => response.text())
         .then((data) => setMessage(data))
         .catch((error) => setMessage('Error fetching API: ' + error.message));
   }, []);

   return (
      <div className="flex flex-col items-center space-y-4 p-4">
         <p className="font-bold text-center">{message}</p>
         <Button className="p-2">Click me</Button>
      </div>
   );
}

export default App;
