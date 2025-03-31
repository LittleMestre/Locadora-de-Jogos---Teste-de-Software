#include <stdio.h>
#include <string.h>

// Definições de constantes para o número máximo de produtos e itens no carrinho
#define JogosMax 50
#define CarrinhoMax 50
//novo comentario
// Estrutura para representar um produto
typedef struct { 
    int codigo;
    char nome[30];
    char genero;
    int classificacao;
    char disponibilidade;
    float preco;
    int Quantidade;
} Jogo;

// Estrutura para representar um item no carrinho de compras
typedef struct { 
    Jogo jogo;
    int quantidade;
} Carrinho;

// Arrays globais para armazenar produtos e itens no carrinho

Jogo jogo[JogosMax];     // Array para armazenar produtos cadastrados
Carrinho carrinho[CarrinhoMax];     // Array para armazenar itens no carrinho

// Contadores globais para o total de produtos e itens no carrinho
int JogosCadastrados = 0;              // Contador de produtos cadastrados
int TotalCarrinho = 0;              // Contador de itens no carrinho

// Prototipagem das funções
void Menu();
void CadastrarProduto();
void ListarProdutos();
void ComprarProduto();
void VisualizarCarrinho();
void FecharPedido();
int TemNoCarrinho(int codigo); 
Jogo* PegarProdutoPorCodigo(int codigo);
void InfoJogos(Jogo jog);

int main() {
    Menu();                 // Chama a função Menu para iniciar o programa
    return 0;
}

void Menu() {
    int opcao;             // Variável para armazenar a opção escolhida pelo usuário
    do {
        //Interface do Funcionário
        printf("\n\nBem vindo a Locadora\n\n");
        printf("Menu:\n");
        printf("1. Cadastrar Jogos\n");
        printf("2. Vizualizar Catálogo\n");
        printf("3. Ver Histórico de Vendas\n");
        printf("4. Atualizar Informações\n");
        printf("5. Excluir jogos\n");
        printf("6. Sair\n\n");
        printf("O que deseja fazer: ");
        scanf("%d", &opcao);   // Lê a opção escolhida pelo usuário

        switch(opcao) {       // Verifica a opção escolhida
            case 1: CadastrarJogos(); break;   // Chama função de cadastro de produto
            case 2: VisualizarCatalogo(); break;     // Chama função para listar produtos
            case 3: HistoricoDeVendas(); break;      // Chama função para comprar produtos
            case 4: AtualizarInformacoes(); break;  // Chama função para visualizar o carrinho
            case 5: ExcluirJogos(); break;        // Chama função para fechar o pedido
            case 6: printf("\nObrigado por comprar conosco, volte sempre!\n\n"); break; // Mensagem de despedida ao sair
            default: printf("\nEssa opicao nao existe. Tente outra.\n"); // Mensagem de erro se a opção não for válida
        }
    } while (opcao != 6);   // Continua até que o usuário escolha sair (opção 6)



        //Interface do Usuário
        printf("\n\n Bem vindo a Locadora\n\n");
        printf("Menu:\n");
        printf("1. Vizualizar Catálogo\n");
        printf("2. Comprar ou Alugar Jogos\n");
        printf("3. Visualizar Carrinho\n");
        printf("4. Fechar Compra\n");
        printf("5. Sair\n\n");
        printf("O que deseja fazer: ");
        scanf("%d", &opcao);

        switch(opcao) {       // Verifica a opção escolhida
            case 1: VisualizarCatalogo(); break;   // Chama função de cadastro de produto
            case 2: ComprarAlugarJogo(); break;     // Chama função para listar produtos
            case 3: VisualizarCarrinho(); break;  // Chama função para visualizar o carrinho
            case 4: FecharPedido(); break;        // Chama função para fechar o pedido
            case 5: printf("\nObrigado por comprar conosco, volte sempre!\n\n"); break; // Mensagem de despedida ao sair
            default: printf("\nEssa opicao nao existe. Tente outra.\n"); // Mensagem de erro se a opção não for válida
        }
    } while (opcao != 6);   // Continua até que o usuário escolha sair (opção 6)
}

void CadastrarProduto() {
    if (TotalJogos >= JogosMax) {   // Verifica se o limite de produtos foi atingido
        printf("Limite de produtos cadastrados atingido!\n");
        return;
    }
    
    Jogo novoJogo;   // Cria uma nova variável do tipo Jogo
    
    novoJogo.codigo = TotalJogos + 1;   // Atribui um código único ao novo produto
    
    getchar();   // Limpa o buffer do teclado (para evitar problemas com fgets)
    
    printf("\nDigite o nome do jogo: ");
    fgets(novojogo.nome, sizeof(novojogo.nome), stdin);   // Lê o nome do produto

    printf("\nGênero: ");
    fgets(novoJogo.genero, sizeof(novoJogo.genero), stdin);   // Lê o nome do produto
    
    printf("\n Classificação: ");
    fgets(novoJogo.classificacao, sizeof(novoJogo.classificacao), stdin);   // Lê o nome do produto

    printf("\n Diaponibilidade: ");
    fgets(novoJogo.disponibilidade, sizeof(novoJogo.disponibilidade), stdin);   // Lê o nome do produto

    novoJogo.nome[strcspn(novoJogo.nome, "\n")] = '\0';   // Remove a nova linha do final da string
    
    printf("\nDigite o preco do jogo: R$");
    scanf("%f", &novoJogo.preco);   // Lê o preço do produto
    
    printf("\nDigite a quantidade em estoque: ");
    scanf("%d", &novoJogo.QuantidadeEstoque);   // Lê a quantidade em estoque
    
    jogo[TotalJogos++] = novoJogo;   // Adiciona o novo produto ao array e incrementa o contador
    
    printf("\n O jogo" "cadastrado com sucesso! Codigo do produto: %d\n", novoJogo.codigo);
}

void ListarProdutos() {
    if (TotalJogos == 0) {   // Verifica se não há produtos cadastrados
        printf("\nNenhum produto cadastrado.\n");
        return;
    }

    printf("\n\n--- PRODUTOS CADASTRADOS ---\n\n");
    
    for (int i = 0; i < TotalJogos; i++) {   // Percorre todos os produtos cadastrados
        InfoJogo(jogo[i]);   // Chama a função InfoProduto para exibir as informações do produto
    }
}

void Infojogos(Jogo jog) {
    printf("\nCodigo: %d | Nome: %s | Genero: %s | Classificacao: %s | Disponibilidade: %s | Preco: R$ %.2f", 
           jog.codigo, jog.nome, jog.preco, jog.QuantidadeEstoque);
}

void ComprarProduto() {
    ListarProdutos();   // Exibe os produtos disponíveis para compra

    int codigo;
    printf("\nDigite o codigo do produto que deseja comprar: ");
    scanf("%d", &codigo);   // Lê o código do produto desejado

    // Busca o produto pelo código fornecido pelo usuário.
    Produto* produto = PegarProdutoPorCodigo(codigo);

    if (produto == NULL) {   // Verifica se o produto foi encontrado
        printf("\nProduto nao encontrado! Selecione outro produto da lista ou cadastre esse produto, no menu 1.\n");
        return;
    }
    
    int quantidadeDesejada;
    printf("\nA quantidade disponivel em estoque: %d\n", produto->QuantidadeEstoque);
    
    printf("\nQuantos desse produto voce deseja comprar? \n");
    scanf("%d", &quantidadeDesejada);   // Lê a quantidade desejada pelo usuário
    
    if (quantidadeDesejada > produto->QuantidadeEstoque) {   // Verifica se a quantidade desejada é maior que a disponível
        printf("Quantidade desejada maior que o estoque disponivel!\n");
        return;
    }

    int x = TemNoCarrinho(codigo);   // Verifica se o produto já está no carrinho
        
    if (x != -1) {   // Se já estiver no carrinho, apenas atualiza a quantidade
        carrinho[x].quantidade += quantidadeDesejada;
        printf("\nA quantidade do produto %s aumentou para %d.\n", produto->nome, carrinho[x].quantidade);
        produto->QuantidadeEstoque -= quantidadeDesejada;   // Atualiza o estoque após a compra
        
    } else {   // Se não estiver no carrinho, adiciona um novo item ao carrinho
        if (TotalCarrinho >= CarrinhoMax) {   // Verifica se o limite de itens no carrinho foi atingido
            printf("\nLimite de produtos no carrinho atingido!\n");
            return;
        }
        
        carrinho[TotalCarrinho].produto = *produto;   // Adiciona o produto ao carrinho
        carrinho[TotalCarrinho].quantidade = quantidadeDesejada;   // Define a quantidade comprada
        
        TotalCarrinho++;   // Incrementa o total de itens no carrinho
        
        produto->QuantidadeEstoque -= quantidadeDesejada;   // Atualiza o estoque após a compra
        
        printf("\nO produto %s foi adicionado ao carrinho.\n", produto->nome);
    }
}

void VisualizarCarrinho() {
    if (TotalCarrinho == 0) {   // Verifica se o carrinho está vazio
        printf("\nO carrinho esta vazio. Escolha um produto e adicione ele ao seu carrinho.\n");
        return;
    }

    printf("\n\n==== SEU CARRINHO DE COMPRAS ====\n\n");
    
    for (int i = 0; i < TotalCarrinho; i++) {   // Percorre todos os itens no carrinho
        InfoProduto(carrinho[i].produto);   // Exibe as informações dos produtos no carrinho
        printf("Quantidade comprada: %d\n", carrinho[i].quantidade);
    }
}

void FecharPedido() {
    int FormaDePagamento;     // Variável para armazenar a forma de pagamento escolhida pelo usuário
    int Resposta;             // Variável para armazenar resposta sobre parcelamento
    int Parcelas;             // Variável para armazenar número de parcelas

    if (TotalCarrinho == 0) {   // Verifica se há itens no carrinho antes de fechar pedido
        printf("\nO carrinho esta sem nenhum item! Nao e possivel fechar o pedido.\n");
        return;
    }

    float total = 0.0f;

    printf("\n\n--- CUPOM DA COMPRA ---\n\n");

    for(int i = 0; i < TotalCarrinho; i++) {  
        float subtotal = carrinho[i].produto.preco * carrinho[i].quantidade;  
        total += subtotal;

        printf("\n %s | Preco: R$ %.2f | Quantidade: %d | Subtotal: R$ %.2f\n", 
               carrinho[i].produto.nome, 
               carrinho[i].produto.preco, 
               carrinho[i].quantidade, 
               subtotal);
    }

    printf("\nGostaria de aplicar um cupom de desconto? (1 - Sim / 2 - Nao)\n");
    int CupomDeDesconto;
    scanf("%d", &CupomDeDesconto);  

    float desconto = 0.0f;

    if(CupomDeDesconto == 1) {
        char cupom[30];  
        getchar();  
        int cupomValido = 0;

        while (!cupomValido) {
            printf("\nO cupom que voce ira colocar sera 'WELDES20'.\n\n");
            printf("Digite o cupom de desconto que lhe passamos acima: \n");
            fgets(cupom, sizeof(cupom), stdin);  
            cupom[strcspn(cupom, "\n")] = '\0';  

            if(strcmp(cupom, "WELDES20") == 0) {  
                desconto = total * 0.20;  
                printf("Cupom aplicado! Voce recebeu um desconto de R$ %.2f\n\n", desconto);
                total -= desconto;  
                cupomValido = 1;
            } else {
                printf("Cupom invalido! Tente novamente ou digite 'sair' para cancelar\n");
                char opcao[10];
                printf("Deseja tentar novamente? (Sim / Nao): ");
                fgets(opcao, sizeof(opcao), stdin);
                opcao[strcspn(opcao, "\n")] = '\0';
                if (strcmp(opcao, "N") == 0 || strcmp(opcao, "nao") == 0) {
                    printf("Operação cancelada.\n");
                    return; 
                }
            }
        }
    }

    printf("O valor total da compra apos o desconto: R$ %.2f\n", total);

    printf("\nQual sera a forma de pagamento:\n\n 1-Debito\n 2-Credito\n 3-PIX\n\n");
    scanf("%d", &FormaDePagamento);

    if(FormaDePagamento == 1) {
        printf("Opcao escolhida foi o debito. So aproximar ou inserir o cartao.");
        TotalCarrinho = 0;  
    } else if(FormaDePagamento == 3) {
        printf("\nO PIX para pagamento é o numero (61) 971654518.");
        TotalCarrinho = 0;  
    }
    
    if (FormaDePagamento == 2) {
        printf("\nGostaria de dividir esse valor? (1 - Sim / 2 - Nao)\n\n");
        scanf("%d", &Resposta);

        if (Resposta == 1) {
            printf("\nConseguimos dividir em ate 5 vezes, deseja dividir em quantas vezes?\n\n");
            scanf("%d", &Parcelas);

            switch (Parcelas) {
                case 1:
                    printf("\nDividindo em 1 vez, o valor de cada parcela ficou R$%.2f\n", total/1); break;
                case 2:
                    printf("\nDividindo em 2 vezes, o valor de cada parcela ficou R$%.2f\n", total/2); break;
                case 3:
                    printf("\nDividindo em 3 vezes, o valor de cada parcela ficou R$%.2f\n", total/3); break;
                case 4:
                    printf("\nDividindo em 4 vezes, o valor de cada parcela ficou R$%.2f\n", total/4); break;
                case 5:
                    printf("\nDividindo em 5 vezes, o valor de cada parcela ficou R$%.2f\n", total/5); break;
                default:
                    printf("\nEscolha uma opcao de parcelamento correta.\n"); break;
            }
        }
        
        printf("\nValor total da compra: R$ %.2f\n", total);
        TotalCarrinho = 0;  
    }
}

int TemNoCarrinho(int codigo) {
    for(int i = 0; i < TotalCarrinho; i++) {  
        if(carrinho[i].produto.codigo == codigo) {  
            return i;   // Retorna índice se já estiver no carrinho
        }
    }
    return -1;     // Retorna -1 se não estiver no carrinho
}

Jogo* PegarJogooPorCodigo(int codigo) {
    for(int i = 0; i < Totaljogos; i++) {  
        if(jogo[i].codigo == codigo) {  
            return &jogo[i];     // Retorna ponteiro para o produto se encontrado
        }
    }
    return NULL;     // Retorna NULL se não encontrado
}

//**********************************   Funcionario       *****************************************************************************************

void CadastrarJogo() {
    if (TotalJogos >= JogosMax) {   // Verifica se o limite de produtos foi atingido
        printf("Limite de produtos cadastrados atingido!\n");
        return;
    }
    
    Jogo novoJogo;   // Cria uma nova variável do tipo Jogo
    
    novoJogo.codigo = TotalJogos + 1;   // Atribui um código único ao novo produto
    
    getchar();   // Limpa o buffer do teclado (para evitar problemas com fgets)
    
    printf("\nDigite o nome do jogo: ");
    fgets(novojogo.nome, sizeof(novojogo.nome), stdin);   // Lê o nome do produto

    printf("\nGênero: ");
    fgets(novoJogo.genero, sizeof(novoJogo.genero), stdin);   // Lê o nome do produto
    
    printf("\n Classificação: ");
    fgets(novoJogo.classificacao, sizeof(novoJogo.classificacao), stdin);   // Lê o nome do produto

    printf("\n Diaponibilidade: ");
    fgets(novoJogo.disponibilidade, sizeof(novoJogo.disponibilidade), stdin);   // Lê o nome do produto

    novoJogo.nome[strcspn(novoJogo.nome, "\n")] = '\0';   // Remove a nova linha do final da string
    
    printf("\nDigite o preco do jogo: R$");
    scanf("%f", &novoJogo.preco);   // Lê o preço do produto
    
    printf("\nDigite a quantidade em estoque: ");
    scanf("%d", &novoJogo.QuantidadeEstoque);   // Lê a quantidade em estoque
    
    jogo[TotalJogos++] = novoJogo;   // Adiciona o novo produto ao array e incrementa o contador
    
    printf("\n O jogo" "cadastrado com sucesso! Codigo do produto: %d\n", novoJogo.codigo);
}

void VizualizarCatalogo{
    if (JogosCadastrados == 0) {   // Verifica se não há produtos cadastrados
        printf("\nNenhum jogo cadastrado.\n");
        return;
    }

    printf("\n\n--- JOGOS DISPONÍVEIS ---\n\n");
    
    for (int i = 0; i < JogosCadastrados; i++) {   // Percorre todos os produtos cadastrados
        InfoJogos(jogos[i]);   // Chama a função InfoProduto para exibir as informações do produto
    }
}

void VerHistoricoVendas{

}

void AtualizarInfo{
    if (TotalProdutos >= ProdutosMax) {   // Verifica se o limite de produtos foi atingido
        printf("Limite de produtos cadastrados atingido!\n");
        return;
    }
    
    Jogo novoJogo;   // Cria uma nova variável do tipo Produto
    
    novoJogo.codigo = Total + 1;   // Atribui um código único ao novo produto
    
    getchar();   // Limpa o buffer do teclado (para evitar problemas com fgets)

    printf("\n Diaponibilidade: ");
    fgets(novoJogo.nome, sizeof(novoJogo.nome), stdin);   // Lê o nome do produto

    novoJogo.nome[strcspn(novoJogo.nome, "\n")] = '\0';   // Remove a nova linha do final da string
    
    printf("\nDigite o preco do jogo: R$");
    scanf("%f", &novoJogo.preco);   // Lê o preço do produto
    
    printf("\nDigite a quantidade em estoque: ");
    scanf("%d", &novoJogo.QuantidadeEstoque);   // Lê a quantidade em estoque
    
    jogo[TotalJogo++] = novoJogo;   // Adiciona o novo produto ao array e incrementa o contador
    
    printf("\n O jogo" "cadastrado com sucesso! Codigo do produto: %d\n", novoJogo.codigo);
}
}

void ExcluirJogo{

}


//*******************************************  Usuário  **********************************************************************

void VisualizarCatalogo{
    if (JogosCadastratos == 0) {   // Verifica se não há produtos cadastrados
        printf("\nNenhum jogo cadastrado.\n");
        return;
    }

    printf("\n\n--- JOGOS DISPONIVEIS ---\n\n");
    
    for (int i = 0; i < JogosCadastrados; i++) {   // Percorre todos os produtos cadastrados
        InfoJogos(jogos[i]);   // Chama a função InfoProduto para exibir as informações do produto
    }
}

void CompraAluguel{
    ComprarAlugarJogo();   // Exibe os produtos disponíveis para compra

    int codigo;
    printf("\nDigite o codigo do jogo que deseja: ");
    scanf("%d", &codigo);   // Lê o código do produto desejado

    // Busca o produto pelo código fornecido pelo usuário.
    Jogo* jogo = PegarProdutoPorCodigo(codigo);

    if (jogo == NULL) {   // Verifica se o produto foi encontrado
        printf("\nJogo nao encontrado! Selecione um jogo disponivel.\n");
        return;
    }

    int x = TemNoCarrinho(codigo);   // Verifica se o produto já está no carrinho
        
    // Se não estiver no carrinho, adiciona um novo item ao carrinho
    if (TotalCarrinho >= CarrinhoMax) {   // Verifica se o limite de itens no carrinho foi atingido
        printf("\nLimite de jogos no carrinho atingido!\n");
        return;
    }
        
    carrinho[TotalCarrinho].jogo = *jogo;   // Adiciona o produto ao carrinho
    TotalCarrinho++;   // Incrementa o total de itens no carrinho
        
    printf("\nO jogo %s foi adicionado ao carrinho.\n", jogo->nome);
}

void VizualizarCarrinho{
    if (TotalCarrinho == 0) {   // Verifica se o carrinho está vazio
        printf("\nO carrinho esta vazio. Escolha um jogo e adicione ele ao seu carrinho.\n");
        return;
    }

    printf("\n\n==== SEU CARRINHO ====\n\n");
    
    for (int i = 0; i < TotalCarrinho; i++) {   // Percorre todos os itens no carrinho
        InfoJogos(carrinho[i].jogo);   // Exibe as informações dos produtos no carrinho
    }
}

void FecharPedido{
    int FormaDePagamento;     // Variável para armazenar a forma de pagamento escolhida pelo usuário
    int Resposta;             // Variável para armazenar resposta sobre parcelamento
    int Parcelas;             // Variável para armazenar número de parcelas

    if (TotalCarrinho == 0) {   // Verifica se há itens no carrinho antes de fechar pedido
        printf("\nO carrinho esta sem nenhum item! Nao e possivel fechar o pedido.\n");
        return;
    }

    float total = 0.0f;

    printf("\n\n--- CUPOM DA COMPRA ---\n\n");

    for(int i = 0; i < TotalCarrinho; i++) {  
        float subtotal = carrinho[i].jogo.preco * carrinho[i].quantidade;  
        total += subtotal;

        printf("\n %s | Preco: R$ %.2f | Subtotal: R$ %.2f\n", 
               carrinho[i].jogo.nome, 
               carrinho[i].jogo.preco, 
               subtotal);
    }

    printf("\nQual sera a forma de pagamento:\n\n 1-Debito\n 2-Credito\n 3-PIX\n\n");
    scanf("%d", &FormaDePagamento);

    if(FormaDePagamento == 1) {
        printf("Opcao escolhida foi o debito. So aproximar ou inserir o cartao.");
        TotalCarrinho = 0;
        printf("Processando pagamento...")sleep(5);  
        printf("Pagamento realizado com sucesso!");
    } else if(FormaDePagamento == 3) {//testmais
        printf("\nO PIX para pagamento é o numero (61) 971654518.");
        printf("Processando pagamento...")sleep(5);  
        printf("Pagamento realizado com sucesso!");
        TotalCarrinho = 0;  
    }
    
    if (FormaDePagamento == 2) {
        printf("\nGostaria de dividir esse valor? (1 - Sim / 2 - Nao)\n\n");
        scanf("%d", &Resposta);

        if (Resposta == 1) {
            printf("\nConseguimos dividir em ate 5 vezes, deseja dividir em quantas vezes?\n\n");
            scanf("%d", &Parcelas);

            switch (Parcelas) {
                case 1:
                    printf("\nDividindo em 1 vez, o valor de cada parcela ficou R$%.2f\n", total/1); break;
                case 2:
                    printf("\nDividindo em 2 vezes, o valor de cada parcela ficou R$%.2f\n", total/2); break;
                case 3:
                    printf("\nDividindo em 3 vezes, o valor de cada parcela ficou R$%.2f\n", total/3); break;
                case 4:
                    printf("\nDividindo em 4 vezes, o valor de cada parcela ficou R$%.2f\n", total/4); break;
                case 5:
                    printf("\nDividindo em 5 vezes, o valor de cada parcela ficou R$%.2f\n", total/5); break;
                default:
                    printf("\nEscolha uma opcao de parcelamento correta.\n"); break;
            }
        }
        
        printf("\nValor total da compra: R$ %.2f\n", total);
        printf("Processando pagamento...")sleep(5);  
        printf("Pagamento realizado com sucesso!");
        TotalCarrinho = 0;
    }
}
