// Usuários pré-definidos
const usuarios = {
    "Bruno": { password: "cliente.1", isAdmin: false },
    "Diogo": { password: "admin.1", isAdmin: true }
};

// Limpa mensagens de erro
function clearErrorMessages() {
    document.getElementById('login-error').textContent = '';
}

// Login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    clearErrorMessages();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');
    
    if (usuarios[username] && usuarios[username].password === password) {
        // Armazena o usuário na sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify({
            username: username,
            isAdmin: usuarios[username].isAdmin
        }));
        
        // Redireciona para a página correta baseada no tipo de usuário
        if (usuarios[username].isAdmin) {
            window.location.href = 'adm.html';
        } else {
            window.location.href = 'cliente.html';
        }
    } else {
        errorElement.textContent = 'Usuário ou senha incorretos!';
    }
});

// Função para alternar visibilidade da senha
document.querySelectorAll('.toggle-password').forEach(button => {
    const input = button.previousElementSibling;
    const icon = button.querySelector('i');
    
    // Inicia com senha visível e ícone de olho fechado
    input.type = 'text';
    icon.classList.replace('fa-eye', 'fa-eye-slash');
    
    button.addEventListener('click', function() {
        if (input.type === 'text') {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        } else {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        }
    });
});

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Limpa qualquer usuário logado ao carregar a página
    sessionStorage.removeItem('currentUser');
});