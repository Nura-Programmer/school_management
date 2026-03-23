import concurrently from 'concurrently';

concurrently([
    { 
        name: 'server', 
        cwd: 'packages/server',
        command: 'npm run dev', 
        prefixColor: 'blue' 
    },
    { 
        name: 'client', 
        cwd: 'packages/client',
        command: 'npm run dev', 
        prefixColor: 'green' 
    }
]);