let livros = []
const endpointAPI = 'https://guilhermeonrails.github.io/casadocodigo/livros.json'
const elementoParaInserirLivros = document.querySelector('#livros')
const botoesDosFiltros = document.querySelectorAll('.btn')
const botaoOrdenarPorPreco = document.querySelector('#btnOrdenarPorPreco')
const secaoComValorTotalDeLivrosDisponivel = document.querySelector('#valor_total_livros_disponiveis')
getBuscarLivrosDaAPI()

async function getBuscarLivrosDaAPI() {
    const res = await fetch(endpointAPI)
    livros = await res.json()
    let livrosComDesconto = aplicarDesconto()
    exibirLivrosNaTela(livrosComDesconto)
}


// UTILIZANDO O METODO FOREACH
function exibirLivrosNaTela(listaDeLivros) {
    secaoComValorTotalDeLivrosDisponivel.innerHTML = ''
    listaDeLivros.forEach((livro) => {
        let disponibilidade = livro.quantidade > 0 ? 'livro__imagens': 'livro__imagens indisponivel'
        elementoParaInserirLivros.innerHTML += `
        <div class="livro">
            <img class="${disponibilidade}" src="${livro.imagem}" alt="${livro.alt}" />
            <h2 class="livro__titulo">${livro.titulo} </h2>
            <p class="livro__descricao">${livro.autor}</p>
            <p class="livro__preco" id="preco">R$${livro.preco.toFixed(2)}</p>
            <div class="tags"> 
                <span class="tag">${livro.categoria}</span> 
            </div>
        </div>
        `
    })
}

// UTILIZANDO O METODO MAP
function aplicarDesconto(){
    const desconto = 0.3
    livrosComDesconto = livros.map(livro =>{
        return{...livro, preco: livro.preco - (livro.preco * desconto)}
    })
    return livrosComDesconto
}

// UTILIZANDO O METODO FILTER
botoesDosFiltros.forEach((botao) => botao.addEventListener('click', filtrarLivros))

function filtrarLivros(){
    const botaoClicado = document.getElementById(this.id).value
    let livrosFiltrados = botaoClicado == 'disponivel' ? filtrarPorDisponibilidade() :  filtrarPorCategoria(botaoClicado)
    elementoParaInserirLivros.innerHTML=''
    exibirLivrosNaTela(livrosFiltrados)
    if (botaoClicado == 'disponivel'){
        const valorTotal = calcularValorTotalDeLivrosDisponiveis(livrosFiltrados)
        exibirOValorTotalDeLivrosDisponiveisNaTela(valorTotal)
    }
    return livrosFiltrados
}

// UTILIZANDO O METODO SORT
botaoOrdenarPorPreco.addEventListener('click', ordenarPorPreco)

function exibirOValorTotalDeLivrosDisponiveisNaTela(valorTotal) {
    secaoComValorTotalDeLivrosDisponivel.innerHTML = `
            <div class="livros__disponiveis">
            <p>Todos os livros disponíveis por R$ <span id="valor">${valorTotal.toFixed(2)}</span></p>
            </div>
        `
}

function filtrarPorCategoria(botaoClicado) {
    return livros.filter(livro => livro.categoria == botaoClicado)
}

function filtrarPorDisponibilidade() {
    return livros.filter(livro => livro.quantidade > 0)
}

function ordenarPorPreco(){
    let livrosOrdenados = livros.sort((a, b) => a.preco -b.preco)
    exibirLivrosNaTela(livrosOrdenados)
}

function calcularValorTotalDeLivrosDisponiveis(livros){
    return livros.reduce((acc, livros) => acc + livros.preco, 0)
}