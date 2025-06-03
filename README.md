# Pizzaria Delícia - Sistema de Pedidos


Um sistema completo para gerenciamento de pedidos de uma pizzaria, com interfaces para clientes e administradores.

## Funcionalidades

### Para Clientes
- Visualização do cardápio completo
- Busca de pizzas por nome ou ingredientes
- Realização de pedidos
- Adição/remoção de itens do pedido
- Finalização do pedido com confirmação

### Para Administradores
- Todas as funcionalidades do cliente
- Cadastro de novas pizzas
- Alteração de pizzas existentes
- Exclusão de pizzas
- Relatório de vendas com histórico e totalização
- Visualização de pedidos finalizados

## Tecnologias Utilizadas
- HTML5
- CSS3 (com variáveis e animações)
- JavaScript (ES6)
- Font Awesome (ícones)
- Google Fonts (Poppins)

## Estrutura de Arquivos
```
pizzaria-delicia/
├── cliente.html       # Interface do cliente
├── cliente.css        # Estilos do cliente
├── cliente.js         # Lógica do cliente
├── adm.html           # Interface do administrador
├── adm.css            # Estilos do administrador
├── adm.js             # Lógica do administrador
├── login.html         # Página de login
├── login.css          # Estilos do login
├── login.js           # Lógica de autenticação
└── README.md          # Este arquivo
```

## Como Usar

1. Acesse a página de login (`login.html`)
2. Utilize uma das credenciais pré-cadastradas:
   - **Admin**: Diogo / admin.1
   - **Cliente**: Bruno / cliente.1
3. Após login, você será redirecionado para a interface adequada (cliente ou admin)

## Recursos Avançados
- Design responsivo (funciona em dispositivos móveis)
- Animações e transições suaves
- Validação de formulários
- Modal de confirmação para ações importantes
- Persistência de dados durante a sessão
- Proteção de rotas (só admin acessa a área administrativa)

## Personalização

Você pode facilmente personalizar:
- Cores (edite as variáveis CSS em `:root`)
- Cardápio (modifique o array `cardapio` nos arquivos JS)
- Usuários (edite o objeto `usuarios` em `login.js`)

## Melhorias Futuras
- [ ] Adicionar banco de dados real (Firebase ou similar)
- [ ] Implementar sistema de cadastro de novos usuários
- [ ] Adicionar opções de tamanho para as pizzas
- [ ] Incluir sistema de avaliação de pedidos


---

Desenvolvido com ❤️ por [Scherrer]  
https://github.com/Scherrer01
