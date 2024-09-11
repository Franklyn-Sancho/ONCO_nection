import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    scenarios: {
        short_test: {
            executor: 'constant-arrival-rate',
            rate: 100,         
            timeUnit: '1s',    
            duration: '1m',     
            preAllocatedVUs: 100, 
            maxVUs: 200,        
        },
    },
};

export default function () {
    const url = 'http://localhost:3333/user/register'; 
    const payload = JSON.stringify({
        name: 'Usuário Teste',
        email: `test${Math.random().toString(36).substring(7)}@email.com`,
        password: '123456',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'registro criado com sucesso': (r) => r.status === 201,
    });

    sleep(1); // Pausa para evitar sobrecarregar o servidor
}

