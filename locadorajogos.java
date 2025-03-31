import java.util.ArrayList;
import java.util.Scanner;

class Jogo {
    int codigo;
    String nome;
    String genero;
    int classificacao;
    String disponibilidade;
    float preco;
    int quantidade;
}

class Carrinho {
    Jogo produto;
    int quantidade;
}

public class Locadora {
    private static final int CarrinhoMax = 50;
    private static ArrayList<Carrinho> carrinho = new ArrayList<>();
    private static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        menu();
    }

    public static void menu() {
        int opcao;
        do {
            System.out.println("\n\nBem vindo à Locadora\n\n");
            System.out.println("Menu:");
            System.out.println("1. Cadastrar Jogos");
            System.out.println("2. Visualizar Catálogo");
            System.out.println("3. Ver Carrinho");
            System.out.println("4. Fechar Pedido");
            System.out.println("5. Sair\n");
            System.out.print("O que deseja fazer: ");
            opcao = scanner.nextInt();

            switch (opcao) {
                case 1:
                    cadastrarProduto();
                    break;
                case 2:
                    listarProdutos();
                    break;
                case 3:
                    visualizarCarrinho();
                    break;
                case 4:
                    fecharPedido();
                    break;
                case 5:
                    System.out.println("\nObrigado por comprar conosco, volte sempre!\n");
                    break;
                default:
                    System.out.println("\nEssa opção não existe. Tente outra.");
            }
        } while (opcao != 5);
    }

    public static void cadastrarProduto() {
        if (carrinho.size() >= CarrinhoMax) {
            System.out.println("Carrinho cheio! Não é possível adicionar mais jogos.");
            return;
        }

        Jogo novoJogo = new Jogo();
        System.out.print("\nDigite o código do jogo: ");
        novoJogo.codigo = scanner.nextInt();
        scanner.nextLine(); // Limpa buffer
        System.out.print("Digite o nome do jogo: ");
        novoJogo.nome = scanner.nextLine();
        System.out.print("Digite o preço do jogo: R$");
        novoJogo.preco = scanner.nextFloat();
        System.out.print("Digite a quantidade em estoque: ");
        novoJogo.quantidade = scanner.nextInt();

        Carrinho item = new Carrinho();
        item.produto = novoJogo;
        item.quantidade = 1; // Inicializa com 1 unidade
        carrinho.add(item);

        System.out.println("Produto cadastrado com sucesso!");
    }

    public static void listarProdutos() {
        if (carrinho.isEmpty()) {
            System.out.println("\nNenhum jogo no catálogo.");
            return;
        }

        System.out.println("\nCatálogo de Produtos:");
        for (Carrinho item : carrinho) {
            System.out.printf("Código: %d | Jogo: %s | Preço: R$%.2f | Quantidade: %d\n",
                    item.produto.codigo, item.produto.nome, item.produto.preco, item.produto.quantidade);
        }
    }

    public static void visualizarCarrinho() {
        if (carrinho.isEmpty()) {
            System.out.println("\nCarrinho vazio.");
            return;
        }

        float total = 0;
        System.out.println("\n=== Seu Carrinho ===\n");
        for (Carrinho item : carrinho) {
            float subtotal = item.produto.preco * item.quantidade;
            System.out.printf("Produto: %s | Quantidade: %d | Subtotal: R$%.2f\n",
                    item.produto.nome, item.quantidade, subtotal);
            total += subtotal;
        }
        System.out.printf("\nTotal do carrinho: R$%.2f\n", total);
    }

    public static void fecharPedido() {
        if (carrinho.isEmpty()) {
            System.out.println("\nCarrinho vazio, impossível fechar o pedido.");
            return;
        }

        float total = 0;
        System.out.println("\n=== Fatura ===\n");
        for (Carrinho item : carrinho) {
            float subtotal = item.produto.preco * item.quantidade;
            System.out.printf("Produto: %s | Quantidade: %d | Subtotal: R$%.2f\n",
                    item.produto.nome, item.quantidade, subtotal);
            total += subtotal;
        }

        System.out.printf("\nTotal da compra: R$%.2f\n", total);
        System.out.println("\nPedido fechado com sucesso!");
        carrinho.clear(); // Limpa o carrinho após fechar o pedido
    }
}
