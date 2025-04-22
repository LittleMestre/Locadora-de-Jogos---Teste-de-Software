const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const readline = require("readline");
const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

// Conexão com o banco de dados
const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root", 
  password: "Yhr@121110",
  database: "loja_jogos", 
});

// Conectando ao MySQL
connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.stack);
    return;
  }
  console.log("Conectado ao banco de dados MySQL.");
  iniciar();
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const DOMINIO_EMAIL = "@locadoradoze.com"; 
let carrinho = [];

function iniciar() {
  rl.question(
    "Escolha uma opção:\n1. Login como funcionário\n2. Entrar como cliente\n3. Cadastrar Funcionário\n4. Sair\nEscolha: ",
    (escolha) => {
      switch (escolha) {
        case "1":
          loginFuncionario();
          break;
        case "2":
          menuCliente();
          break;
        case "3":
          cadastrarFuncionario();
          break;
        case "4":
          console.log("Saindo...");
          rl.close();
          break;
        default:
          console.log("Opção inválida. Saindo...");
          rl.close();
      }
    }
  );
}

// Função para autenticar funcionário
function autenticarFuncionario(email, senha, callback) {
  const query = "SELECT * FROM funcionarios WHERE email = ?";
  connection.query(query, [email], (err, results) => {
    if (err) {
      console.log("Erro ao autenticar funcionário:", err);
      callback(false);
      return;
    }
    if (results.length > 0) {
      bcrypt.compare(senha, results[0].senha, (err, res) => {
        if (err) {
          console.log("Erro ao comparar a senha:", err);
          callback(false);
          return;
        }
        callback(res);
      });
    } else {
      callback(false);
    }
  });
}

// Login funcionário
function loginFuncionario() {
  rl.question("\nDigite seu email: ", (email) => {
    if (!email.endsWith(DOMINIO_EMAIL)) {
      console.log("\nEmail deve terminar com " + DOMINIO_EMAIL);
      iniciar();
      return;
    }
    rl.question("Digite sua senha: ", (senha) => {
      autenticarFuncionario(email, senha, (auth) => {
        if (auth) {
          console.log("\nLogin bem-sucedido!");
          menuFuncionario();
        } else {
          console.log("\nEmail ou senha incorretos.");
          iniciar();
        }
      });
    });
  });
}

// Menu funcionário
function menuFuncionario() {
  rl.question(
    "\nMenu do Funcionário:\n1. Cadastrar Jogos\n2. Visualizar Catálogo\n3. Cadastrar Funcionário\n4. Ver Histórico de Vendas\n5. Atualizar Informações de Jogo\n6. Excluir Jogo\n7. Sair\nEscolha: ",
    (opcao) => {
      switch (opcao) {
        case "1":
          cadastrarProduto();
          break;
        case "2":
          listarProdutosFuncionario();
          break;
        case "3":
          cadastrarFuncionario();
          break;
        case "4":
          historicoVendasFunc();
          break;
        case "5":
          atualizarInformacoes();
          break;
        case "6":
          excluirJogo();
          break;
        case "7":
          console.log("\nObrigado por usar o sistema! Volte sempre!\n");
          rl.close();
          break;
        default:
          console.log("\nEssa opção não existe. Tente outra.");
          menuFuncionario();
      }
    }
  );
}

// Menu cliente
function menuCliente() {
  rl.question(
    "\nMenu do Cliente:\n1. Ver Catálogo\n2. Ver Carrinho\n3. Finalizar Compra\n4. Sair\nEscolha: ",
    (opcao) => {
      switch (opcao) {
        case "1":
          listarProdutos();
          break;
        case "2":
          verCarrinho();
          break;
        case "3":
          finalizarCompra();
          break;
        case "4":
          console.log("\nObrigado pela preferência! Volte sempre!\n");
          iniciar();
          break;
        default:
          console.log("\nOpção inválida! Tente novamente.\n");
          menuCliente();
      }
    }
  );
}

// Listar produtos para cliente
function listarProdutos() {
  const query = "SELECT * FROM jogos";
  connection.query(query, (err, results) => {
    if (err) {
      console.log("Erro ao listar jogos:", err);
      menuCliente();
      return;
    }
    if (results.length === 0) {
      console.log("\nNenhum jogo no catálogo.");
      menuCliente();
      return;
    }
    console.log("\nCatálogo de Produtos:");
    results.forEach((jogo) => {
      console.log(
        `Código: ${jogo.id} | Jogo: ${jogo.nome} | Gênero: ${
          jogo.genero
        } | Preço: R$${parseFloat(jogo.preco).toFixed(2)} | Quantidade: ${
          jogo.quantidade
        }`
      );
    });
    rl.question(
      "\nDigite o código do jogo que deseja adicionar ao carrinho (ou 0 para voltar):\n",
      (codigo) => {
        if (codigo === "0") {
          menuCliente();
          return;
        }
        const jogoEscolhido = results.find((jogo) => jogo.id == codigo);
        if (jogoEscolhido) {
          rl.question(
            "Quantos itens você deseja adicionar ao carrinho?\n",
            (quantidade) => {
              quantidade = parseInt(quantidade);
              if (quantidade > jogoEscolhido.quantidade) {
                console.log("Quantidade solicitada maior do que a disponível.");
                menuCliente();
              } else {
                carrinho.push({ produto: jogoEscolhido, quantidade });
                console.log(
                  `${quantidade} unidade(s) de "${jogoEscolhido.nome}" adicionada(s) ao carrinho.`
                );
                menuCliente();
              }
            }
          );
        } else {
          console.log("\nJogo não encontrado.");
          menuCliente();
        }
      }
    );
  });
}

// Ver carrinho
function verCarrinho() {
  if (carrinho.length === 0) {
    console.log("\nCarrinho vazio!\n");
    menuCliente();
    return;
  }
  console.log("\nItens no carrinho:");
  carrinho.forEach((item, index) => {
    console.log(
      `${index + 1}. ${item.produto.nome} - Quantidade: ${
        item.quantidade
      } | Preço: R$${(item.produto.preco * item.quantidade).toFixed(2)}`
    );
  });
  menuCliente();
}

// Finalizar compra com opções de pagamento
function finalizarCompra() {
  if (carrinho.length === 0) {
    console.log("\nCarrinho vazio! Adicione produtos antes de finalizar.");
    menuCliente();
    return;
  }
  let totalCompra = 0;
  console.log("\nItens no carrinho:");
  carrinho.forEach((item, index) => {
    console.log(
      `${index + 1}. ${item.produto.nome} - Quantidade: ${
        item.quantidade
      } | Preço: R$${(item.produto.preco * item.quantidade).toFixed(2)}`
    );
    totalCompra += item.produto.preco * item.quantidade;
  });
  console.log(`\nTotal da compra: R$${totalCompra.toFixed(2)}`);
  rl.question(
    "\nEscolha a forma de pagamento:\n1. Crédito\n2. Débito\n3. PIX\nOpção: ",
    (opcaoPagamento) => {
      switch (opcaoPagamento) {
        case "1":
          const parcelamentoMaximo = carrinho.length > 3 ? 5 : 3;
          rl.question(`\nDeseja parcelar a compra? (s/n): `, (querParcelar) => {
            if (querParcelar.toLowerCase() === "s") {
              rl.question(
                `Em quantas vezes deseja parcelar (máximo ${parcelamentoMaximo} vezes)? `,
                (parcelas) => {
                  parcelas = parseInt(parcelas);
                  if (
                    isNaN(parcelas) ||
                    parcelas < 1 ||
                    parcelas > parcelamentoMaximo
                  ) {
                    console.log("\nNúmero de parcelas inválido.");
                    menuCliente();
                    return;
                  }
                  console.log(
                    `\nCompra no crédito em ${parcelas} vezes. Processando...`
                  );
                  setTimeout(() => {
                    console.log("Pagamento realizado!");
                    carrinho = [];
                    menuCliente();
                  }, 5000);
                }
              );
            } else {
              console.log("\nCompra no crédito. Processando...");
              setTimeout(() => {
                console.log("Pagamento efetuado!");
                carrinho = [];
                menuCliente();
              }, 5000);
            }
          });
          break;
        case "2":
          console.log("\nCompra no débito. Processando...");
          setTimeout(() => {
            console.log("Pagamento efetuado!");
            carrinho = [];
            menuCliente();
          }, 5000);
          break;
        case "3":
          console.log("\nCompra via PIX. Por favor, escaneie o QR Code...");
          setTimeout(() => {
            console.log("Pagamento efetuado!");
            carrinho = [];
            menuCliente();
          }, 5000);
          break;
        default:
          console.log("\nOpção de pagamento inválida.");
          menuCliente();
      }
    }
  );
}

// Função para cadastrar um novo funcionário
function cadastrarFuncionario() {
  rl.question("\nDigite o nome do funcionário: ", (nome) => {
    rl.question("Digite o CPF do funcionário: ", (cpf) => {
      rl.question(
        "Digite a data de nascimento (AAAA-MM-DD): ",
        (data_nascimento) => {
          rl.question("Digite o email do funcionário: ", (email) => {
            if (!email.endsWith(DOMINIO_EMAIL)) {
              console.log("\nEmail deve terminar com " + DOMINIO_EMAIL);
              iniciar(); 
              return;
            }
            rl.question("Digite a senha do funcionário: ", (senha) => {
              // Criptografar a senha
              bcrypt.hash(senha, 10, (err, hashedSenha) => {
                if (err) {
                  console.log("Erro ao criptografar a senha:", err);
                  return;
                }

                // Salvar no banco de dados
                const query =
                  "INSERT INTO funcionarios (nome, cpf, data_nascimento, email, senha) VALUES (?, ?, ?, ?, ?)";
                connection.query(
                  query,
                  [nome, cpf, data_nascimento, email, hashedSenha],
                  (err, results) => {
                    if (err) {
                      console.log("Erro ao cadastrar funcionário:", err);
                      return;
                    }
                    console.log("\nFuncionário cadastrado com sucesso!");
                    iniciar(); // Volta ao menu inicial
                  }
                );
              });
            });
          });
        }
      );
    });
  });
}

// Função para autenticar o funcionário
function autenticarFuncionario(email, senha, callback) {
  const query = "SELECT * FROM funcionarios WHERE email = ?";
  connection.query(query, [email], (err, results) => {
    if (err) {
      console.log("Erro ao autenticar funcionário:", err);
      callback(false);
      return;
    }
    if (results.length > 0) {
      // Verificar a senha
      bcrypt.compare(senha, results[0].senha, (err, res) => {
        if (err) {
          console.log("Erro ao comparar a senha:", err);
          callback(false);
          return;
        }
        callback(res); // Se as senhas coincidirem, retorna true
      });
    } else {
      callback(false); // Funcionário não encontrado
    }
  });
}

// Função de login do funcionário
function loginFuncionario() {
  rl.question("\nDigite seu email: ", (email) => {
    if (!email.endsWith(DOMINIO_EMAIL)) {
      console.log("\nEmail deve terminar com " + DOMINIO_EMAIL);
      iniciar();
      return;
    }

    rl.question("Digite sua senha: ", (senha) => {
      autenticarFuncionario(email, senha, (auth) => {
        if (auth) {
          console.log("\nLogin bem-sucedido!");
          menuFuncionario();
        } else {
          console.log("\nEmail ou senha incorretos.");
          iniciar();
        }
      });
    });
  });
}

// Menu do Funcionário
function menuFuncionario() {
  rl.question(
    "\nMenu do Funcionário:\n1. Cadastrar Jogos\n2. Visualizar Catálogo\n3. Cadastrar Funcionário\n4. Ver Histórico de Vendas\n5. Atualizar Informações de Jogo\n6. Excluir Jogo\n7. Sair\nEscolha: ",
    (opcao) => {
      switch (opcao) {
        case "1":
          cadastrarProduto();
          break;
        case "2":
          listarProdutosFuncionario();
          break; 
        case "3":
          cadastrarFuncionario();
          break; 
        case "4":
          historicoVendasFunc();
          break;
        case "5":
          atualizarInformacoes();
          break;
        case "6":
          excluirJogo();
          break;
        case "7":
          console.log("\nObrigado por usar o sistema! Volte sempre!\n");
          rl.close();
          break;
        default:
          console.log("\nEssa opção não existe. Tente outra.");
          menuFuncionario();
      }
    }
  );
}

// Função para listar produtos no catálogo para Clientes
function listarProdutos() {
  const query = "SELECT * FROM jogos";
  connection.query(query, (err, results) => {
    if (err) {
      console.log("Erro ao listar jogos:", err);
      menuCliente();
      return;
    }

    if (results.length === 0) {
      console.log("\nNenhum jogo no catálogo.");
      menuCliente();
      return;
    }

    console.log("\nCatálogo de Produtos:");
    results.forEach((jogo) => {
      console.log(
        `Código: ${jogo.id} | Jogo: ${jogo.nome} | Gênero: ${
          jogo.genero
        } | Preço: R$${parseFloat(jogo.preco).toFixed(2)} | Quantidade: ${
          jogo.quantidade
        }`
      );
    });

    rl.question(
      "\nDigite o código do jogo que deseja adicionar ao carrinho (ou 0 para voltar): ",
      (codigo) => {
        if (codigo === "0") {
          menuCliente();
          return;
        }

        const jogoEscolhido = results.find((jogo) => jogo.id == codigo);

        if (jogoEscolhido) {
          rl.question(
            "Quantos itens você deseja adicionar ao carrinho? ",
            (quantidade) => {
              quantidade = parseInt(quantidade);
              if (quantidade > jogoEscolhido.quantidade) {
                console.log("Quantidade solicitada maior do que a disponível.");
                menuCliente();
              } else {
                // Adicionar ao carrinho
                carrinho.push({ produto: jogoEscolhido, quantidade });
                console.log(
                  `${quantidade} unidade(s) de "${jogoEscolhido.nome}" adicionada(s) ao carrinho.`
                );
                menuCliente();
              }
            }
          );
        } else {
          console.log("\nJogo não encontrado.");
          menuCliente();
        }
      }
    );
  });
}

// Função para listar produtos no catálogo para funcionário
function listarProdutosFuncionario() {
  const query = "SELECT * FROM jogos";
  connection.query(query, (err, results) => {
    if (err) {
      console.log("Erro ao listar jogos:", err);
      menuFuncionario();
      return;
    }

    if (results.length === 0) {
      console.log("\nNenhum jogo no catálogo.");
      menuFuncionario();
      return;
    }

    console.log("\nCatálogo de Produtos:");
    results.forEach((jogo) => {
      console.log(
        `Código: ${jogo.id} | Jogo: ${jogo.nome} | Gênero: ${
          jogo.genero
        } | Preço: R$${parseFloat(jogo.preco).toFixed(2)} | Quantidade: ${
          jogo.quantidade
        }`
      );
    });

    menuFuncionario();
  });
}

// Função para cadastrar produto
const JogosMax = 100;
function cadastrarProduto() {
  // Primeiro, contar quantos jogos já existem
  connection.query("SELECT COUNT(*) AS total FROM jogos", (err, results) => {
    if (err) {
      console.error("Erro ao contar jogos:", err);
      return menuFuncionario();
    }
    const numJogos = results[0].total;

    if (numJogos >= JogosMax) {
      console.log(`Limite máximo de jogos (${JogosMax}) atingido.`);
      return menuFuncionario();
    }

    rl.question("\nDigite o nome do jogo: ", (nome) => {
      rl.question("Digite o gênero do jogo: ", (genero) => {
        rl.question(
          "Digite a classificação do jogo (Livre, 10+, 12+, 16+, 18+): ",
          (classificacao) => {
            const classificacoesValidas = ["Livre", "10+", "12+", "16+", "18+"];
            if (!classificacoesValidas.includes(classificacao)) {
              console.log(
                "Classificação inválida! Use apenas: Livre, 10+, 12+, 16+, 18+."
              );
              menuFuncionario();
              return;
            }

            rl.question(
              "Digite a disponibilidade do jogo (aluguel ou venda): ",
              (disponibilidade) => {
                rl.question("Digite o preço do jogo: R$", (precoStr) => {
                  const preco = parseFloat(precoStr);
                  if (isNaN(preco)) {
                    console.log("Preço inválido.");
                    menuFuncionario();
                    return;
                  }

                  rl.question(
                    "Digite a quantidade em estoque: ",
                    (quantidadeStr) => {
                      const quantidade = parseInt(quantidadeStr);
                      if (isNaN(quantidade)) {
                        console.log("Quantidade inválida.");
                        menuFuncionario();
                        return;
                      }

                      // Salvar no banco de dados
                      const query =
                        "INSERT INTO jogos (nome, genero, classificacao, disponibilidade, preco, quantidade) VALUES (?, ?, ?, ?, ?, ?)";
                      connection.query(
                        query,
                        [
                          nome,
                          genero,
                          classificacao,
                          disponibilidade,
                          preco,
                          quantidade,
                        ],
                        (err, results) => {
                          if (err) {
                            console.log("Erro ao cadastrar jogo:", err);
                            return;
                          }
                          console.log("\nProduto cadastrado com sucesso!");
                          menuFuncionario();
                        }
                      );
                    }
                  );
                });
              }
            );
          }
        );
      });
    });
  });
}

function historicoVendasFunc() {
  const query = "SELECT * FROM historico_vendas";
  connection.query(query, (err, results) => {
    if (err) {
      console.log("Erro ao acessar o histórico de vendas:", err);
      menuFuncionario();
      return;
    }

    if (results.length === 0) {
      console.log("\nNenhuma venda registrada.");
      menuFuncionario();
      return;
    }

    console.log("\nHistórico de Vendas:");
    results.forEach((venda) => {
      console.log(
        `Código Jogo: ${venda.codigoJogo} | Nome Jogo: ${
          venda.nomeJogo
        } | Quantidade Vendida: ${
          venda.quantidadeVendida
        } | Valor Total: R$${venda.valorTotal.toFixed(2)}`
      );
    });
    menuFuncionario();
  });
}

function askQuestion(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function atualizarInformacoes() {
  connection.query("SELECT * FROM jogos", async (err, jogos) => {
    if (err) {
      console.log("Erro ao buscar jogos:", err);
      menuFuncionario();
      return;
    }

    if (jogos.length === 0) {
      console.log("\nNenhum jogo cadastrado.");
      menuFuncionario();
      return;
    }

    console.log("\n=== Jogos cadastrados ===");
    jogos.forEach((jogo) => {
      console.log(
        `Código: ${jogo.id} | Nome: ${jogo.nome} | Gênero: ${
          jogo.genero
        } | Preço: R$${Number(jogo.preco).toFixed(2)} | Quantidade: ${
          jogo.quantidade
        }`
      );
    });

    const codigo = await askQuestion(
      "\nDigite o código do jogo que deseja atualizar: "
    );

    const jogo = jogos.find((j) => j.id == codigo);
    if (!jogo) {
      console.log("Jogo não encontrado.");
      menuFuncionario();
      return;
    }

    console.log(`\nInformações atuais do jogo:`);
    console.log(`Nome: ${jogo.nome}`);
    console.log(`Gênero: ${jogo.genero}`);
    console.log(`Classificação: ${jogo.classificacao}`);
    console.log(`Disponibilidade: ${jogo.disponibilidade}`);
    console.log(`Preço: R$${Number(jogo.preco).toFixed(2)}`);
    console.log(`Quantidade: ${jogo.quantidade}`);

    const alterarNome = await askQuestion("Deseja alterar o nome? (s/n): ");
    if (alterarNome.toLowerCase() === "s") {
      jogo.nome = await askQuestion("Digite o novo nome: ");
    }

    const alterarGenero = await askQuestion("Deseja alterar o gênero? (s/n): ");
    if (alterarGenero.toLowerCase() === "s") {
      jogo.genero = await askQuestion("Digite o novo gênero: ");
    }

    const alterarClassificacao = await askQuestion(
      "Deseja alterar a classificação? (s/n): "
    );
    if (alterarClassificacao.toLowerCase() === "s") {
      jogo.classificacao = await askQuestion(
        "Digite a nova classificação (Livre, 10+, 12+, 16+, 18+): "
      );
    }

    const alterarDisponibilidade = await askQuestion(
      "Deseja alterar a disponibilidade? (s/n): "
    );
    if (alterarDisponibilidade.toLowerCase() === "s") {
      jogo.disponibilidade = await askQuestion(
        "Digite a nova disponibilidade (aluguel ou venda): "
      );
    }

    const alterarPreco = await askQuestion("Deseja alterar o preço? (s/n): ");
    if (alterarPreco.toLowerCase() === "s") {
      const novoPreco = await askQuestion("Digite o novo preço: R$");
      jogo.preco = parseFloat(novoPreco);
    }

    const alterarQuantidade = await askQuestion(
      "Deseja alterar a quantidade? (s/n): "
    );
    if (alterarQuantidade.toLowerCase() === "s") {
      const novaQuantidade = await askQuestion("Digite a nova quantidade: ");
      jogo.quantidade = parseInt(novaQuantidade);
    }

    const updateQuery = `
            UPDATE jogos SET nome = ?, genero = ?, classificacao = ?, disponibilidade = ?, preco = ?, quantidade = ?
            WHERE id = ?
        `;

    connection.query(
      updateQuery,
      [
        jogo.nome,
        jogo.genero,
        jogo.classificacao,
        jogo.disponibilidade,
        jogo.preco,
        jogo.quantidade,
        jogo.id,
      ],
      (err) => {
        if (err) {
          console.log("Erro ao atualizar o jogo:", err);
        } else {
          console.log("\nJogo atualizado com sucesso!");
        }
        menuFuncionario();
      }
    );
  });
}

function excluirJogo() {
  connection.query("SELECT * FROM jogos", (err, jogos) => {
    if (err) {
      console.log("Erro ao buscar jogos:", err);
      menuFuncionario();
      return;
    }

    if (jogos.length === 0) {
      console.log("\nNenhum jogo cadastrado.");
      menuFuncionario();
      return;
    }

    console.log("\n=== Jogos cadastrados ===");
    jogos.forEach((jogo) => {
      console.log(
        `Código: ${jogo.id} | Nome: ${jogo.nome} | Gênero: ${
          jogo.genero
        } | Preço: R$${Number(jogo.preco).toFixed(2)} | Quantidade: ${
          jogo.quantidade
        }`
      );
    });

    rl.question("\nDigite o código do jogo que deseja excluir: ", (codigo) => {
      const jogo = jogos.find((j) => j.id == codigo);
      if (!jogo) {
        console.log("Jogo não encontrado.");
        menuFuncionario();
        return;
      }

      rl.question(
        `Tem certeza que deseja excluir o jogo "${jogo.nome}"? (s/n): `,
        (confirma) => {
          if (confirma.toLowerCase() === "s") {
            const query = "DELETE FROM jogos WHERE id = ?";
            connection.query(query, [codigo], (err, results) => {
              if (err) {
                console.log("Erro ao excluir o jogo:", err);
              } else if (results.affectedRows > 0) {
                console.log("\nJogo excluído com sucesso!");
              } else {
                console.log("\nJogo não encontrado.");
              }
              menuFuncionario();
            });
          } else {
            console.log("Exclusão cancelada.");
            menuFuncionario();
          }
        }
      );
    });
  });
}

// Menu do Cliente
function menuCliente() {
  rl.question(
    "\nMenu do Cliente:\n1. Ver Catálogo\n2. Ver Carrinho\n3. Finalizar Compra\n4. Sair\nEscolha: ",
    (opcao) => {
      switch (opcao) {
        case "1":
          listarProdutos();
          break;
        case "2":
          verCarrinho();
          break;
        case "3":
          finalizarCompra();
          break;
        case "4":
          console.log("\nObrigado pela preferência! Volte sempre!\n");
          iniciar();
          break;
        default:
          console.log("\nOpção inválida! Tente novamente.\n");
          menuCliente();
      }
    }
  );
}

function finalizarCompra() {
  if (carrinho.length === 0) {
    console.log("\nCarrinho vazio! Adicione produtos antes de finalizar.");
    menuCliente();
    return;
  }

  let totalCompra = 0;

  console.log("\nItens no carrinho:");
  carrinho.forEach((item, index) => {
    console.log(
      `${index + 1}. ${item.produto.nome} - Quantidade: ${
        item.quantidade
      } | Preço: R$${(item.produto.preco * item.quantidade).toFixed(2)}`
    );
    totalCompra += item.produto.preco * item.quantidade;
  });

  console.log(`\nTotal da compra: R$${totalCompra.toFixed(2)}`);

  rl.question(
    "\nEscolha a forma de pagamento:\n1. Crédito\n2. Débito\n3. PIX\nOpção: ",
    (opcaoPagamento) => {
      switch (opcaoPagamento) {
        case "1":
          const parcelamentoMaximo = carrinho.length > 3 ? 5 : 3;
          rl.question(`\nDeseja parcelar a compra? (s/n): `, (querParcelar) => {
            if (querParcelar.toLowerCase() === "s") {
              rl.question(
                `Em quantas vezes deseja parcelar (máximo ${parcelamentoMaximo} vezes)? `,
                (parcelas) => {
                  parcelas = parseInt(parcelas);
                  if (
                    isNaN(parcelas) ||
                    parcelas < 1 ||
                    parcelas > parcelamentoMaximo
                  ) {
                    console.log("\nNúmero de parcelas inválido.");
                    menuCliente();
                    return;
                  }
                  console.log(
                    `\nCompra no crédito em ${parcelas} vezes. Processando...`
                  );
                  setTimeout(() => {
                    console.log("Pagamento realizado!");
                    carrinho = [];
                    menuCliente();
                  }, 5000);
                }
              );
            } else {
              console.log("\nCompra no crédito. Processando...");
              setTimeout(() => {
                console.log("Pagamento efetuado!");
                carrinho = [];
                menuCliente();
              }, 5000);
            }
          });
          break;
        case "2":
          console.log("\nCompra no débito. Processando...");
          setTimeout(() => {
            console.log("Pagamento efetuado!");
            carrinho = [];
            menuCliente();
          }, 5000);
          break;
        case "3":
          console.log("\nCompra via PIX. Por favor, escaneie o QR Code...");
          setTimeout(() => {
            console.log("Pagamento efetuado!");
            carrinho = [];
            menuCliente();
          }, 5000);
          break;
        default:
          console.log("\nOpção de pagamento inválida.");
          menuCliente();
      }
    }
  );
}

function verCarrinho() {
  if (carrinho.length === 0) {
    console.log("\nCarrinho vazio!\n");
    menuCliente();
    return;
  }

  console.log("\nItens no carrinho:");
  carrinho.forEach((item, index) => {
    console.log(
      `${index + 1}. ${item.produto.nome} - Quantidade: ${
        item.quantidade
      } | Preço: R$${(item.produto.preco * item.quantidade).toFixed(2)}`
    );
  });

  menuCliente();
}