import java.util.*;

public class LojaJogos {

    static final int JogosMax = 50;
    static final int CarrinhoMax = 50;
    static final String DOMINIO_EMAIL = "@locadoradoze.com"; // Domínio específico

    static class Jogo {
        int codigo;
        String nome;
        String genero;
        int classificacao;
        String disponibilidade; // "aluguel" ou "venda"
        float preco;
        int quantidade;

        Jogo(int codigo, String nome, String genero, int classificacao, String disponibilidade, float preco, int quantidade) {
            this.codigo = codigo;
            this.nome = nome;
            this.genero = genero;
            this.classificacao = classificacao;
            this.disponibilidade = disponibilidade;
            this.preco = preco;
            this.quantidade = quantidade;
        }
    }

    static class Carrinho {
        Jogo produto; // Produto no carrinho
        int quantidade;

        Carrinho(Jogo produto, int quantidade) {
            this.produto = produto;
            this.quantidade = quantidade;
        }
    }

    static class HistoricoVenda {
        int codigoJogo;
        String nomeJogo;
        int quantidadeVendida;
        float valorTotal;

        HistoricoVenda(int codigoJogo, String nomeJogo, int quantidadeVendida, float valorTotal) {
            this.codigoJogo = codigoJogo;
            this.nomeJogo = nomeJogo;
            this.quantidadeVendida = quantidadeVendida;
            this.valorTotal = valorTotal;
        }
    }

    static HistoricoVenda[] historicoVendas = new HistoricoVenda[CarrinhoMax];
    static int numVendas = 0; // Número de vendas registradas

    static Carrinho[] carrinho = new Carrinho[CarrinhoMax];
    static int numCarrinho = 0;  // Quantidade de itens no carrinho
    static Jogo[] jogos = new Jogo[JogosMax]; // Array de jogos cadastrados
    static int numJogos = 0; // Número de jogos cadastrados

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int escolha;

        System.out.println("Escolha uma opção:");
        System.out.println("1. Login como funcionário");
        System.out.println("2. Entrar como cliente");
        System.out.print("Escolha: ");
        escolha = scanner.nextInt();

        if (escolha == 1) {
            Login(scanner);
        } else if (escolha == 2) {
            MenuCliente(scanner);
        } else {
            System.out.println("Opção inválida. Saindo...");
        }
    }

    public static void Login(Scanner scanner) {
        System.out.print("\nDigite seu email: ");
        String email = scanner.next();

        if (!email.endsWith(DOMINIO_EMAIL)) {
            System.out.println("\nEmail deve terminar com " + DOMINIO_EMAIL);
            return;
        }

        System.out.print("Digite sua senha: ");
        String senha = scanner.next();

        if (AutenticarFuncionario(email, senha)) {
            System.out.println("\nLogin bem-sucedido!");
            MenuFuncionario(scanner);
        } else {
            System.out.println("\nEmail ou senha incorretos.");
        }
    }

    public static boolean AutenticarFuncionario(String email, String senha) {
        final String emailValido = "samuel@locadoradoze.com";
        final String senhaValida = "123456";
        return email.equals(emailValido) && senha.equals(senhaValida);
    }

    public static void MenuFuncionario(Scanner scanner) {
        int opcao;
        do {
            System.out.println("\n\nBem-vindo, Funcionario!\n\n");
            System.out.println("Menu do Funcionario:");
            System.out.println("1. Cadastrar Jogos");
            System.out.println("2. Visualizar Catalogo");
            System.out.println("5. Ver Historico de Vendas");
            System.out.println("6. Atualizar Informacoes de Jogo");
            System.out.println("7. Excluir Jogo");
            System.out.println("9. Sair");
            System.out.print("O que deseja fazer: ");
            opcao = scanner.nextInt();

            switch (opcao) {
                case 1: CadastrarProduto(scanner); break;
                case 2: ListarProdutos(); break;
                case 5: HistoricoVendas(); break;
                case 6: AtualizarInformacoes(scanner); break;
                case 7: ExcluirJogo(scanner); break;
                case 9: System.out.println("\nObrigado por usar o sistema! Volte sempre!\n\n"); break;
                default: System.out.println("\nEssa opção não existe. Tente outra.");
            }
        } while (opcao != 9);
    }

    public static void MenuCliente(Scanner scanner) {
        int opcao;
        do {
            System.out.println("\n\nBem-vindo, Cliente!\n\n");
            System.out.println("Menu do Cliente:");
            System.out.println("1. Visualizar Catalogo");
            System.out.println("2. Comprar ou Alugar Jogos");
            System.out.println("3. Visualizar Carrinho");
            System.out.println("4. Fechar Compra");
            System.out.println("5. Sair");
            System.out.print("O que deseja fazer: ");
            opcao = scanner.nextInt();

            switch (opcao) {
                case 1: ListarProdutos(); break;
                case 2: ComprarProduto(scanner); break;
                case 3: VisualizarCarrinho(); break;
                case 4: FecharCompra(); break;
                case 5: System.out.println("\nObrigado por comprar conosco, volte sempre!\n\n"); break;
                default: System.out.println("\nEssa opção não existe. Tente outra.");
            }
        } while (opcao != 5);
    }

    public static void CadastrarProduto(Scanner scanner) {
        if (numJogos >= JogosMax) {
            System.out.println("Cadastro de jogos cheio! Não é possível adicionar mais jogos.");
            return;
        }

        scanner.nextLine(); // Limpar o buffer
        System.out.print("\nDigite o nome do jogo: ");
        String nome = scanner.nextLine();

        System.out.print("Digite o gênero do jogo: ");
        String genero = scanner.nextLine();

        System.out.print("Digite a classificação do jogo: ");
        int classificacao = scanner.nextInt();

        scanner.nextLine(); // Limpar o buffer
        System.out.print("Digite a disponibilidade do jogo (aluguel ou venda): ");
        String disponibilidade = scanner.nextLine();

        System.out.print("Digite o preço do jogo: R$");
        float preco = scanner.nextFloat();

        System.out.print("Digite a quantidade em estoque: ");
        int quantidade = scanner.nextInt();

        Jogo novoJogo = new Jogo(numJogos + 1, nome, genero, classificacao, disponibilidade, preco, quantidade);
        jogos[numJogos] = novoJogo;
        numJogos++;
        System.out.println("\nProduto cadastrado com sucesso!");
    }

    public static void ListarProdutos() {
        if (numJogos == 0) {
            System.out.println("\nNenhum jogo no catálogo.");
            return;
        }

        System.out.println("\nCatálogo de Produtos:");
        System.out.println("\nJogos para Venda:");
        for (int i = 0; i < numJogos; i++) {
            if (jogos[i].disponibilidade.equals("venda")) {
                System.out.printf("Código: %d | Jogo: %s | Gênero: %s | Classificação: %d | Preço: R$%.2f | Quantidade: %d\n",
                        jogos[i].codigo, jogos[i].nome, jogos[i].genero, jogos[i].classificacao, jogos[i].preco, jogos[i].quantidade);
            }
        }

        System.out.println("\nJogos para Aluguel:");
        for (int i = 0; i < numJogos; i++) {
            if (jogos[i].disponibilidade.equals("aluguel")) {
                System.out.printf("Código: %d | Jogo: %s | Gênero: %s | Classificação: %d | Preço: R$%.2f | Quantidade: %d\n",
                        jogos[i].codigo, jogos[i].nome, jogos[i].genero, jogos[i].classificacao, jogos[i].preco, jogos[i].quantidade);
            }
        }
    }

    public static void HistoricoVendas() {
        if (numVendas == 0) {
            System.out.println("\nNenhuma venda registrada.");
            return;
        }

        System.out.println("\nHistórico de Vendas:");
        for (int i = 0; i < numVendas; i++) {
            System.out.printf("Código: %d | Jogo: %s | Quantidade Vendida: %d | Valor Total: R$%.2f\n",
                    historicoVendas[i].codigoJogo, historicoVendas[i].nomeJogo,
                    historicoVendas[i].quantidadeVendida, historicoVendas[i].valorTotal);
        }
    }

    public static void AtualizarInformacoes(Scanner scanner) {
        System.out.print("\nDigite o código do jogo que deseja atualizar: ");
        int codigo = scanner.nextInt();

        Jogo jogo = PegarProdutoPorCodigo(codigo);
        if (jogo == null) {
            System.out.println("\nJogo não encontrado.");
            return;
        }

        System.out.println("\nEscolha o que deseja atualizar:");
        System.out.println("1. Atualizar Preço");
        System.out.println("2. Atualizar Quantidade");
        System.out.println("3. Atualizar Disponibilidade");
        System.out.print("Digite a opção: ");
        int opcao = scanner.nextInt();

        scanner.nextLine(); // Limpar o buffer

        switch (opcao) {
            case 1:
                System.out.print("\nDigite o novo preço: R$");
                jogo.preco = scanner.nextFloat();
                System.out.println("\nPreço atualizado com sucesso!");
                break;
            case 2:
                System.out.print("\nDigite a nova quantidade em estoque: ");
                jogo.quantidade = scanner.nextInt();
                System.out.println("\nQuantidade atualizada com sucesso!");
                break;
            case 3:
                System.out.print("\nDigite a nova disponibilidade (aluguel ou venda): ");
                jogo.disponibilidade = scanner.nextLine();
                System.out.println("\nDisponibilidade atualizada com sucesso!");
                break;
            default:
                System.out.println("\nOpção inválida!");
        }
    }

    public static void ExcluirJogo(Scanner scanner) {
        System.out.print("\nDigite o código do jogo que deseja excluir: ");
        int codigo = scanner.nextInt();

        for (int i = 0; i < numJogos; i++) {
            if (jogos[i].codigo == codigo) {
                for (int j = i; j < numJogos - 1; j++) {
                    jogos[j] = jogos[j + 1];
                }
                numJogos--;
                System.out.println("\nJogo excluído com sucesso!");
                return;
            }
        }
        System.out.println("\nJogo não encontrado!");
    }

    public static Jogo PegarProdutoPorCodigo(int codigo) {
        for (int i = 0; i < numJogos; i++) {
            if (jogos[i].codigo == codigo) {
                return jogos[i];
            }
        }
        return null;
    }

    public static void ComprarProduto(Scanner scanner) {
        System.out.print("\nDigite o código do jogo que deseja comprar: ");
        int codigo = scanner.nextInt();

        Jogo jogo = PegarProdutoPorCodigo(codigo);
        if (jogo != null) {
            System.out.print("Digite a quantidade que deseja comprar: ");
            int quantidade = scanner.nextInt();

            if (quantidade > jogo.quantidade) {
                System.out.println("Quantidade solicitada indisponível no estoque!");
            } else {
                System.out.printf("\nProduto adicionado ao carrinho! Jogo: %s | Quantidade: %d | Preço: R$%.2f\n",
                        jogo.nome, quantidade, jogo.preco * quantidade);

                if (TemNoCarrinho(codigo)) {
                    for (int i = 0; i < numCarrinho; i++) {
                        if (carrinho[i].produto.codigo == codigo) {
                            carrinho[i].quantidade += quantidade;
                        }
                    }
                } else {
                    carrinho[numCarrinho] = new Carrinho(jogo, quantidade);
                    numCarrinho++;
                }

                jogo.quantidade -= quantidade;
            }
        } else {
            System.out.println("\nJogo não encontrado!");
        }
    }

    public static boolean TemNoCarrinho(int codigo) {
        for (int i = 0; i < numCarrinho; i++) {
            if (carrinho[i].produto.codigo == codigo) {
                return true;
            }
        }
        return false;
    }

    public static void VisualizarCarrinho() {
        if (numCarrinho == 0) {
            System.out.println("\nCarrinho vazio.");
            return;
        }

        System.out.println("\nCarrinho de Compras:");
        for (int i = 0; i < numCarrinho; i++) {
            System.out.printf("Produto: %s | Quantidade: %d | Preço unitário: R$%.2f | Total: R$%.2f\n",
                    carrinho[i].produto.nome, carrinho[i].quantidade,
                    carrinho[i].produto.preco, carrinho[i].produto.preco * carrinho[i].quantidade);
        }
    }

    public static void FecharCompra() {
        if (numCarrinho == 0) {
            System.out.println("\nCarrinho vazio. Adicione produtos ao carrinho antes de finalizar a compra.");
            return;
        }

        float total = 0;
        System.out.println("\nFechando compra...");
        for (int i = 0; i < numCarrinho; i++) {
            total += carrinho[i].produto.preco * carrinho[i].quantidade;
        }

        System.out.printf("\nTotal da compra: R$%.2f\n", total);
        System.out.println("Compra finalizada com sucesso! Obrigado pela compra.");

        numCarrinho = 0; // Limpar o carrinho após a compra
    }
}
