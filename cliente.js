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

// Mostrar seção selecionada
function mostrarsecao(secao) {
    // Esconde todas as seções
    document.querySelectorAll('.container > div[id]').forEach(div => {
        div.classList.add('hidden');
    });
    
    // Remove a classe 'active' de todos os botões do menu
    document.querySelectorAll('.menu button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostra a seção selecionada e marca o botão como ativo
    if (secao) {
        const secaoElemento = document.getElementById(secao);
        if (secaoElemento) {
            secaoElemento.classList.remove('hidden');
        }
        
        const botaoAtivo = document.querySelector(`.menu button[onclick*="${secao}"]`);
        if (botaoAtivo) {
            botaoAtivo.classList.add('active');
        }
    }
    
    // Atualiza as listas conforme necessário
    if (secao === 'cardapio') {
        atualizarCardapio();
    } else if (secao === 'pedidos') {
        atualizarSelectPizzas();
    }
}

// Limpar mensagens de erro/sucesso
function limparMensagens() {
    document.querySelectorAll('.error-message, .success-message').forEach(el => {
        el.textContent = '';
    });
    const globalMsg = document.getElementById('global-message');
    if (globalMsg) globalMsg.classList.add('hidden');
}

// Mostrar mensagem global
function mostrarMensagem(texto, tipo) {
    const container = document.getElementById('global-message');
    if (!container) return;
    container.textContent = texto;
    container.className = `message-container ${tipo}`;
    container.classList.remove('hidden');
    setTimeout(() => {
        container.classList.add('hidden');
    }, 5000);
}

// Mostrar confirmação no modal
function mostrarConfirmacao(texto, callbackConfirmar) {
    const modal = document.getElementById('confirm-modal');
    const mensagem = document.getElementById('confirm-message');
    const btnConfirmar = document.getElementById('modal-confirmar');
    const btnCancelar = document.getElementById('modal-cancelar');
    
    mensagem.textContent = texto;
    modal.classList.remove('hidden');
    
    // Remove eventos anteriores para evitar múltiplas chamadas
    const novoBtnConfirmar = btnConfirmar.cloneNode(true);
    const novoBtnCancelar = btnCancelar.cloneNode(true);
    
    btnConfirmar.parentNode.replaceChild(novoBtnConfirmar, btnConfirmar);
    btnCancelar.parentNode.replaceChild(novoBtnCancelar, btnCancelar);
    
    novoBtnConfirmar.onclick = () => {
        modal.classList.add('hidden');
        callbackConfirmar();
    };
    
    novoBtnCancelar.onclick = () => {
        modal.classList.add('hidden');
    };
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

    if (resultados.length === 0) {
        lista.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #95a5a6; font-style: italic;">Nenhuma pizza encontrada</td></tr>';
        return;
    }

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

// Adiciona item ao pedido
function fazerPedido() {
    limparMensagens();
    const cliente = document.getElementById('cliente').value.trim();
    const pizzaId = parseInt(document.getElementById('pizza-pedido').value);
    const quantidade = parseInt(document.getElementById('quantidade').value) || 1;

    if (!cliente) {
        document.getElementById('cliente-error').textContent = 'Por favor, informe o nome do cliente!';
        return;
    }

    if (quantidade < 1) {
        mostrarMensagem('A quantidade deve ser pelo menos 1!', 'error-message');
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

    mostrarMensagem(`${quantidade}x ${pizzaSelecionada.nome} adicionada ao pedido!`, 'success-message');
    atualizarListaPedidos();
}

// Atualiza a lista de itens do pedido
function atualizarListaPedidos() {
    const lista = document.getElementById('lista-pedidos');
    lista.innerHTML = '';

    if (pedidoAtual.itens.length === 0) {
        lista.innerHTML = '<li class="vazio">Nenhum item adicionado</li>';
        return;
    }

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
    const itemRemovido = pedidoAtual.itens[index];
    pedidoAtual.itens.splice(index, 1);
    mostrarMensagem(`${itemRemovido.quantidade}x ${itemRemovido.pizza} removida do pedido!`, 'success-message');
    atualizarListaPedidos();
}

// Finaliza o pedido
function finalizarPedido() {
    limparMensagens();

    if (pedidoAtual.itens.length === 0) {
        document.getElementById('pedido-error').textContent = 'Adicione itens ao pedido antes de finalizar!';
        return;
    }

    mostrarConfirmacao(
        `Confirmar finalização do pedido para ${pedidoAtual.cliente}? Total: R$ ${pedidoAtual.itens.reduce((sum, item) => sum + item.total, 0).toFixed(2)}`,
        () => {
            pedidoAtual.data = new Date();
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
            document.getElementById('lista-pedidos').innerHTML = '<li class="vazio">Nenhum item adicionado</li>';
        }
    );
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    mostrarsecao('cardapio');
    atualizarCardapio();
    atualizarSelectPizzas();
});

function atualizarListaPedidos() {
    const lista = document.getElementById('lista-pedidos');
    lista.innerHTML = '';

    if (pedidoAtual.itens.length === 0) {
        lista.innerHTML = '<li class="vazio">Nenhum item adicionado</li>';
        return;
    }

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

document.addEventListener('DOMContentLoaded', function() {
    mostrarsecao('cardapio');
    atualizarCardapio();
    atualizarSelectPizzas();

    // Botão de logout redireciona para login.html
    const btnLogout = document.getElementById('logout-btn');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
});
