
// ===================================
// 1. RECUPERAR OS ELEMENTOS DO HTML
// ===================================

// Recupera o formulário.

const formulario = document.getElementById("formFilme");

// Recupera os campos do formulário.

const nome = document.getElementById("nome");

const tipo = document.getElementById("tipo");

const status = document.getElementById("status");

const descricao = document.getElementById("descricao");

// Recupera a área onde os filmes serão exibidos.

const listaFilmes = document.getElementById("listaFilmes");

// Recupera os campos de pesquisa e filtro.

const pesquisa = document.getElementById("pesquisa");

const filtroStatus = document.getElementById("filtroStatus");


// ===================================
// 2. CARREGAR OS DADOS DO LOCALSTORAGE
// ===================================

// Recupera os filmes que já foram salvos.

// Se não existir nenhum dado, começa com um array vazio.

let filmes = JSON.parse(
    localStorage.getItem("meu_cine_filmes")
) || [];


// ===================================
// 3. FUNÇÃO PARA SALVAR OS DADOS
// ===================================

function salvarFilmes() {

    // Transforma o array em texto JSON
    // e salva no LocalStorage.

    localStorage.setItem(
        "meu_cine_filmes",
        JSON.stringify(filmes)
    );

}


// ===================================
// 4. CADASTRAR UM NOVO FILME OU SÉRIE
// ===================================

// Escuta o envio do formulário.

formulario.addEventListener("submit", function(event) {

    // Impede que a página seja recarregada.

    event.preventDefault();


    // Cria um objeto com os dados do formulário.

    const novoFilme = {

        id: Date.now(),

        nome: nome.value.trim(),

        tipo: tipo.value,

        status: status.value,

        descricao: descricao.value.trim()

    };


    // Adiciona o novo objeto ao array.

    filmes.push(novoFilme);


    // Salva os dados no LocalStorage.

    salvarFilmes();


    // Atualiza a lista e o resumo.

    mostrarFilmes();

    atualizarResumo();


    // Limpa os campos do formulário.

    formulario.reset();


    // Abre a aba Minha Lista.

    mostrarAba(
        "lista",
        document.querySelectorAll(".botao-aba")[1]
    );

});


// ===================================
// 5. MOSTRAR OS FILMES NA TELA
// ===================================

function mostrarFilmes() {

    // Limpa o conteúdo anterior da lista.

    listaFilmes.innerHTML = "";


    // Recupera o texto digitado na pesquisa.

    const textoPesquisa = pesquisa.value.toLowerCase();


    // Recupera o status selecionado.

    const statusSelecionado = filtroStatus.value;


    // Filtra os filmes de acordo com a pesquisa e o status.

    const filmesFiltrados = filmes.filter(function(filme) {

        // Verifica se o título contém o texto pesquisado.

        const correspondePesquisa = filme.nome
            .toLowerCase()
            .includes(textoPesquisa);


        // Verifica se o status corresponde ao filtro.

        const correspondeStatus =
            statusSelecionado === "todos" ||
            filme.status === statusSelecionado;


        // Retorna somente os filmes que atendem
        // às duas condições.

        return correspondePesquisa && correspondeStatus;

    });


    // Verifica se não existe nenhum resultado.

    if (filmesFiltrados.length === 0) {

        // Cria um parágrafo para mostrar a mensagem.

        const mensagem = document.createElement("p");

        mensagem.classList.add("mensagem-vazia");

        mensagem.textContent = "Nenhum título encontrado.";

        // Adiciona a mensagem dentro da lista.

        listaFilmes.appendChild(mensagem);

        return;

    }


    // Percorre cada filme encontrado.

    filmesFiltrados.forEach(function(filme) {


        // -------------------------------
        // CRIAR O CARD
        // -------------------------------

        const card = document.createElement("div");

        card.classList.add("card-filme");


        // -------------------------------
        // CRIAR O TÍTULO
        // -------------------------------

        const titulo = document.createElement("h3");

        titulo.textContent = filme.nome;


        // -------------------------------
        // CRIAR O TIPO
        // -------------------------------

        const tipoFilme = document.createElement("p");

        tipoFilme.textContent = "Tipo: " + filme.tipo;


        // -------------------------------
        // CRIAR A DESCRIÇÃO
        // -------------------------------

        const descricaoFilme = document.createElement("p");

        descricaoFilme.textContent =
            "Descrição: " + (filme.descricao || "Não informada");


        // -------------------------------
        // CRIAR O STATUS
        // -------------------------------

        const textoStatus = document.createElement("span");

        textoStatus.classList.add("status-filme");

        textoStatus.textContent = filme.status;


        // -------------------------------
        // CRIAR O SELETOR DE STATUS
        // -------------------------------

        const seletorStatus = document.createElement("select");

        // Adiciona uma classe para estilizar
        // especificamente esse seletor.

        seletorStatus.classList.add("seletor-status");


        // Lista de opções disponíveis.

        const opcoesStatus = [
            "Quero assistir",
            "Assistindo",
            "Concluído"
        ];


        // Percorre as opções para criar os elementos option.

        opcoesStatus.forEach(function(opcao) {

            const item = document.createElement("option");

            item.value = opcao;

            item.textContent = opcao;

            seletorStatus.appendChild(item);

        });


        // Define o status atual como selecionado.

        seletorStatus.value = filme.status;


        // Quando o status mudar, atualiza o objeto.

        seletorStatus.addEventListener("change", function() {

            filme.status = seletorStatus.value;

            salvarFilmes();

            mostrarFilmes();

            atualizarResumo();

        });


        // -------------------------------
        // CRIAR O BOTÃO DE EXCLUIR
        // -------------------------------

        const botaoExcluir = document.createElement("button");

        botaoExcluir.textContent = "Excluir";

        botaoExcluir.classList.add("botao-excluir");


        // Quando clicar, exclui o filme selecionado.

        botaoExcluir.addEventListener("click", function() {

            // Cria um novo array sem o filme selecionado.

            filmes = filmes.filter(function(item) {

                return item.id !== filme.id;

            });


            // Salva e atualiza as informações.

            salvarFilmes();

            mostrarFilmes();

            atualizarResumo();

        });


        // -------------------------------
        // ADICIONAR OS ELEMENTOS AO CARD
        // -------------------------------

        card.appendChild(titulo);

        card.appendChild(tipoFilme);

        card.appendChild(descricaoFilme);

        card.appendChild(textoStatus);

        card.appendChild(seletorStatus);

        card.appendChild(botaoExcluir);


        // Adiciona o card à lista de filmes.

        listaFilmes.appendChild(card);

    });

}


// ===================================
// 6. ATUALIZAR OS NÚMEROS DO RESUMO
// ===================================

function atualizarResumo() {

    // Mostra a quantidade total de títulos.

    document.getElementById("totalFilmes").textContent =
        filmes.length;


    // Conta os títulos que estão sendo assistidos.

    const assistindo = filmes.filter(function(filme) {

        return filme.status === "Assistindo";

    });


    // Conta os títulos concluídos.

    const concluidos = filmes.filter(function(filme) {

        return filme.status === "Concluído";

    });


    // Atualiza os números na tela.

    document.getElementById("totalAssistindo").textContent =
        assistindo.length;


    document.getElementById("totalConcluidos").textContent =
        concluidos.length;

}


// ===================================
// 7. PESQUISAR E FILTRAR OS TÍTULOS
// ===================================

// Quando o usuário digitar na pesquisa,
// a lista será atualizada.

pesquisa.addEventListener("input", function() {

    mostrarFilmes();

});


// Quando o usuário mudar o filtro de status,
// a lista será atualizada.

filtroStatus.addEventListener("change", function() {

    mostrarFilmes();

});


// ===================================
// 8. FUNÇÃO PARA TROCAR AS ABAS
// ===================================

function mostrarAba(abaEscolhida, botaoClicado) {

    // Seleciona todas as seções.

    const abas = document.querySelectorAll(".aba");


    // Esconde todas as abas.

    abas.forEach(function(aba) {

        aba.style.display = "none";

    });


    // Mostra somente a aba escolhida.

    document.getElementById(abaEscolhida).style.display = "block";


    // Seleciona todos os botões do menu.

    const botoes = document.querySelectorAll(".botao-aba");


    // Remove a classe ativo de todos os botões.

    botoes.forEach(function(botao) {

        botao.classList.remove("ativo");

    });


    // Adiciona a classe ativo ao botão selecionado.

    botaoClicado.classList.add("ativo");

}


// ===================================
// 9. INICIALIZAR O APLICATIVO
// ===================================

// Mostra os filmes que já estão salvos.

mostrarFilmes();


// Atualiza os números do resumo.

atualizarResumo();


// Abre a aba Resumo ao iniciar o aplicativo.

mostrarAba(
    "resumo",
    document.querySelectorAll(".botao-aba")[0]
);

// Registar o Service Worker para suporte PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => { 
        console.log('Service Worker Registado com Sucesso!');
    })
    .catch((erro) => {
        console.error('Erro no Service Worker:', erro);
    });
}