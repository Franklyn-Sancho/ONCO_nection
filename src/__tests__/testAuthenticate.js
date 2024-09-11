import http from 'k6/http';
import { check, sleep, group } from 'k6';

// Variáveis de ambiente para URLs e credenciais
const API_BASE_URL = 'http://localhost:3333'; // Altere para o URL da sua API
const REGISTRATION_ENDPOINT = '/user/register';
const LOGIN_ENDPOINT = '/user/login';

// Função para registrar um novo usuário
function registerUser() {
    const payload = JSON.stringify({
        name: `Test User ${__VU}-${__ITER}`,
        email: `testuser${__VU}-${__ITER}@example.com`,
        password: 'password123',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const response = http.post(`${API_BASE_URL}${REGISTRATION_ENDPOINT}`, payload, params);

    check(response, {
        'registration status is 201': (r) => r.status === 201,
    });

    return response.json().token; // Assumindo que o token de autenticação é retornado no registro
}

// Função para autenticar o usuário
function authenticateUser() {
    const payload = JSON.stringify({
        email: `testuser${__VU}-${__ITER}@example.com`,
        password: 'password123',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const response = http.post(`${API_BASE_URL}${LOGIN_ENDPOINT}`, payload, params);

    check(response, {
        'authentication status is 200': (r) => r.status === 200,
    });
}

// Função principal do teste
export default function () {
    group('User Registration and Authentication', function () {
        // Realiza o registro e armazena o token retornado
        const token = registerUser();


        sleep(1);


        authenticateUser();


        sleep(2);
    });
}

// Configura a carga do teste
export let options = {
    stages: [
        { duration: '30s', target: 50 }, // Aumenta para 50 usuários em 30 segundos
        { duration: '1m', target: 50 },  // Mantém 50 usuários por 1 minuto
        { duration: '30s', target: 0 },  // Reduz para 0 usuários em 30 segundos
    ],
};
