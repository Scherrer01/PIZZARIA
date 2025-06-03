// Banco de dados das pizzas
let cardapio = [
    { id: 1, nome: "Margherita", ingredientes: "Molho de tomate, mussarela, manjericão", preco: 45.90 },
    { id: 2, nome: "Calabresa", ingredientes: "Molho de tomate, mussarela, calabresa, cebola", preco: 49.90 },
    { id: 3, nome: "Portuguesa", ingredientes: "Molho de tomate, mussarela, presunto, ovo, cebola, azeitona", preco: 55.90 }
];

// Pedidos em andamento
let pedidoAtual = {
    cliente: "",
    itens: [],
    data: null
};

// Histórico de pedidos finalizados
let historicoPedidos = [];

// Variáveis para controle do modal
let currentAction = null;
let currentPizzaId = null;

// Mostrar seção selecionada
function mostrarsecao(secao) {
    document.querySelectorAll('.container > div[id]').forEach(div => {
        div.classList.add('hidden');
    });
    
    if (secao) {
        document.getElementById(secao).classList.remove('hidden');
    }
    
    // Limpa mensagens ao trocar de seção
    clearMessages();
    
    // Atualiza as listas quando a seção é aberta
    if (secao === 'cardapio') {
        atualizarCardapio();
    } else if (secao === 'pedidos') {
        atualizarSelectPizzas();
    } else if (secao === 'alterar') {
        atualizarSelectAlterarPizzas();
    } else if (secao === 'relatorio') {
        gerarRelatorio();
    }
}

// Limpa todas as mensagens de erro/sucesso
function clearMessages() {
    document.querySelectorAll('.error-message, .success-message').forEach(el => {
        el.textContent = '';
    });
    document.getElementById('global-message').textContent = '';
    document.getElementById('global-message').classList.add('hidden');
}

// Mostra mensagem global
function showGlobalMessage(message, isError = false) {
    const messageElement = document.getElementById('global-message');
    messageElement.textContent = message;
    messageElement.className = isError ? 'message-container error-message' : 'message-container success-message';
    messageElement.classList.remove('hidden');
}

// Mostra modal de confirmação
function showConfirmModal(message, action, pizzaId = null) {
    document.getElementById('confirm-message').textContent = message;
    currentAction = action;
    currentPizzaId = pizzaId;
    document.getElementById('confirm-modal').classList.remove('hidden');
}

// Confirma ação no modal
function confirmAction() {
    if (currentAction === 'excluir') {
        excluirPizzaConfirmado();
    }
    document.getElementById('confirm-modal').classList.add('hidden');
}

// Cancela ação no modal
function cancelAction() {
    document.getElementById('confirm-modal').classList.add('hidden');
}

// Atualiza a lista de pizzas no cardápio
function atualizarCardapio() {
    const lista = document.getElementById('lista-pizzas');
    lista.innerHTML = '';
    
    cardapio.forEach(pizza => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pizza.nome}</td>
            <td>${pizza.ingredientes}</td>
            <td>R$ ${pizza.preco.toFixed(2)}</td>
        `;
        lista.appendChild(row);
    });
}

// Busca pizzas no cardápio
function buscarPizza() {
    const termo = document.getElementById('busca-pizza').value.toLowerCase();
    const lista = document.getElementById('lista-pizzas');
    lista.innerHTML = '';
    
    const resultados = cardapio.filter(pizza => 
        pizza.nome.toLowerCase().includes(termo) || 
        pizza.ingredientes.toLowerCase().includes(termo)
    );
    
    resultados.forEach(pizza => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pizza.nome}</td>
            <td>${pizza.ingredientes}</td>
            <td>R$ ${pizza.preco.toFixed(2)}</td>
        `;
        lista.appendChild(row);
    });
}

// Atualiza o select de pizzas no pedido
function atualizarSelectPizzas() {
    const select = document.getElementById('pizza-pedido');
    select.innerHTML = '';
    
    cardapio.forEach(pizza => {
        const option = document.createElement('option');
        option.value = pizza.id;
        option.textContent = `${pizza.nome} - R$ ${pizza.preco.toFixed(2)}`;
        select.appendChild(option);
    });
}

// Atualiza o select de pizzas para alteração
function atualizarSelectAlterarPizzas() {
    const select = document.getElementById('pizza-alterar');
    select.innerHTML = '<option value="">Selecione uma pizza</option>';
    
    cardapio.forEach(pizza => {
        const option = document.createElement('option');
        option.value = pizza.id;
        option.textContent = `${pizza.nome} - R$ ${pizza.preco.toFixed(2)}`;
        select.appendChild(option);
    });
}

// Carrega os dados da pizza selecionada para alteração
function carregarDadosPizza() {
    const pizzaId = parseInt(document.getElementById('pizza-alterar').value);
    if (!pizzaId) return;
    
    const pizza = cardapio.find(p => p.id === pizzaId);
    if (pizza) {
        document.getElementById('novo-nome').value = pizza.nome;
        document.getElementById('novos-ingredientes').value = pizza.ingredientes;
        document.getElementById('novo-preco').value = pizza.preco;
    }
}

// Altera os dados da pizza
function alterarPizza() {
    clearMessages();
    const pizzaId = parseInt(document.getElementById('pizza-alterar').value);
    const novoNome = document.getElementById('novo-nome').value;
    const novosIngredientes = document.getElementById('novos-ingredientes').value;
    const novoPreco = parseFloat(document.getElementById('novo-preco').value);
    
    // Validação
    if (!pizzaId) {
        document.getElementById('alterar-selecao-error').textContent = 'Selecione uma pizza para alterar!';
        return;
    }
    if (!novoNome) {
        document.getElementById('alterar-nome-error').textContent = 'Informe o nome da pizza!';
        return;
    }
    if (!novosIngredientes) {
        document.getElementById('alterar-ingredientes-error').textContent = 'Informe os ingredientes!';
        return;
    }
    if (!novoPreco || novoPreco <= 0) {
        document.getElementById('alterar-preco-error').textContent = 'Informe um preço válido!';
        return;
    }
    
    const pizzaIndex = cardapio.findIndex(p => p.id === pizzaId);
    if (pizzaIndex !== -1) {
        cardapio[pizzaIndex] = {
            id: pizzaId,
            nome: novoNome,
            ingredientes: novosIngredientes,
            preco: novoPreco
        };
        
        document.getElementById('alterar-success').textContent = 'Pizza alterada com sucesso!';
        atualizarCardapio();
        atualizarSelectPizzas();
        atualizarSelectAlterarPizzas();
        
        // Limpa os campos
        document.getElementById('novo-nome').value = '';
        document.getElementById('novos-ingredientes').value = '';
        document.getElementById('novo-preco').value = '';
        document.getElementById('pizza-alterar').value = '';
    }
}

// Exclui uma pizza do cardápio (chama o modal)
function excluirPizza() {
    const pizzaId = parseInt(document.getElementById('pizza-alterar').value);
    if (!pizzaId) {
        document.getElementById('alterar-selecao-error').textContent = 'Selecione uma pizza para excluir!';
        return;
    }
    
    const pizza = cardapio.find(p => p.id === pizzaId);
    showConfirmModal(`Tem certeza que deseja excluir a pizza "${pizza.nome}"?`, 'excluir', pizzaId);
}

// Confirma exclusão da pizza
function excluirPizzaConfirmado() {
    if (!currentPizzaId) return;
    
    cardapio = cardapio.filter(p => p.id !== currentPizzaId);
    
    document.getElementById('alterar-success').textContent = 'Pizza excluída com sucesso!';
    atualizarCardapio();
    atualizarSelectPizzas();
    atualizarSelectAlterarPizzas();
    
    // Limpa os campos
    document.getElementById('novo-nome').value = '';
    document.getElementById('novos-ingredientes').value = '';
    document.getElementById('novo-preco').value = '';
    document.getElementById('pizza-alterar').value = '';
}

// Adiciona item ao pedido
function fazerPedido() {
    clearMessages();
    const cliente = document.getElementById('cliente').value;
    const pizzaId = parseInt(document.getElementById('pizza-pedido').value);
    const quantidade = parseInt(document.getElementById('quantidade').value);
    
    if (!cliente) {
        document.getElementById('cliente-error').textContent = 'Por favor, informe o nome do cliente!';
        return;
    }
    
    const pizzaSelecionada = cardapio.find(p => p.id === pizzaId);
    
    pedidoAtual.cliente = cliente;
    pedidoAtual.itens.push({
        pizza: pizzaSelecionada.nome,
        quantidade,
        precoUnitario: pizzaSelecionada.preco,
        total: quantidade * pizzaSelecionada.preco
    });
    
    atualizarListaPedidos();
}

// Atualiza a lista de itens do pedido
function atualizarListaPedidos() {
    const lista = document.getElementById('lista-pedidos');
    lista.innerHTML = '';
    
    pedidoAtual.itens.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.quantidade}x ${item.pizza} - R$ ${item.total.toFixed(2)}
            <button onclick="removerItem(${index})" class="remover">
                <i class="fas fa-trash"></i>
            </button>
        `;
        lista.appendChild(li);
    });
}

// Remove item do pedido
function removerItem(index) {
    pedidoAtual.itens.splice(index, 1);
    atualizarListaPedidos();
}

// Finaliza o pedido
function finalizarPedido() {
    clearMessages();
    
    if (pedidoAtual.itens.length === 0) {
        document.getElementById('pedido-error').textContent = 'Adicione itens ao pedido antes de finalizar!';
        return;
    }
    
    pedidoAtual.data = new Date();
    historicoPedidos.push({...pedidoAtual});
    
    const totalPedido = pedidoAtual.itens.reduce((sum, item) => sum + item.total, 0).toFixed(2);
    document.getElementById('pedido-success').innerHTML = `
        <p><strong>Pedido finalizado com sucesso!</strong></p>
        <p>Cliente: ${pedidoAtual.cliente}</p>
        <p>Total: R$ ${totalPedido}</p>
    `;
    
    // Limpa o pedido atual
    pedidoAtual = {
        cliente: "",
        itens: [],
        data: null
    };
    
    document.getElementById('cliente').value = "";
    document.getElementById('quantidade').value = "1";
    document.getElementById('lista-pedidos').innerHTML = "";
}

// Cadastra nova pizza
function cadastrarPizza() {
    clearMessages();
    const nome = document.getElementById('nome-pizza').value;
    const ingredientes = document.getElementById('ingredientes').value;
    const preco = parseFloat(document.getElementById('preco').value);
    
    // Validação
    if (!nome) {
        document.getElementById('cadastro-nome-error').textContent = 'Informe o nome da pizza!';
        return;
    }
    if (!ingredientes) {
        document.getElementById('cadastro-ingredientes-error').textContent = 'Informe os ingredientes!';
        return;
    }
    if (!preco || preco <= 0) {
        document.getElementById('cadastro-preco-error').textContent = 'Informe um preço válido!';
        return;
    }
    
    const novaPizza = {
        id: cardapio.length + 1,
        nome,
        ingredientes,
        preco
    };
    
    cardapio.push(novaPizza);
    
    document.getElementById('nome-pizza').value = "";
    document.getElementById('ingredientes').value = "";
    document.getElementById('preco').value = "";
    
    document.getElementById('cadastro-success').textContent = 'Pizza cadastrada com sucesso!';
    atualizarCardapio();
    atualizarSelectPizzas();
    atualizarSelectAlterarPizzas();
}

// Gera relatório de vendas
function gerarRelatorio() {
    const tabela = document.getElementById('tabela-relatorio');
    tabela.innerHTML = '';
    
    let totalVendas = 0;
    
    historicoPedidos.forEach(pedido => {
        const dataFormatada = pedido.data.toLocaleDateString('pt-BR');
        const itensFormatados = pedido.itens.map(i => `${i.quantidade}x ${i.pizza}`).join(', ');
        const totalPedido = pedido.itens.reduce((sum, item) => sum + item.total, 0);
        
        totalVendas += totalPedido;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${dataFormatada}</td>
            <td>${pedido.cliente}</td>
            <td>${itensFormatados}</td>
            <td>R$ ${totalPedido.toFixed(2)}</td>
        `;
        tabela.appendChild(row);
    });
    
    document.getElementById('valor-total').textContent = totalVendas.toFixed(2);
}

// Função para logout
function logout() {
    // Remove o usuário da sessionStorage
    sessionStorage.removeItem('currentUser');
    
    // Redireciona para a página de login
    window.location.href = 'login.html';
}

// Verifica se o usuário está logado e é admin
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser || !currentUser.isAdmin) {
        const container = document.querySelector('.container');
        container.innerHTML = `
            <div class="access-denied">
                <h2>Acesso negado!</h2>
                <p>Você precisa ser um administrador para acessar esta página.</p>
                <button onclick="window.location.href='login.html'" class="finalizar">
                    <i class="fas fa-sign-in-alt"></i> Ir para Login
                </button>
            </div>
        `;
        return;
    }
    
    mostrarsecao('cardapio');
    atualizarCardapio();
    atualizarSelectPizzas();
    atualizarSelectAlterarPizzas();
});