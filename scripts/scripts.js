"use strict"

const endpoint = 'https://restcountries.com/v3.1/all?fields=name,flags'
const img = document.getElementById('bandeira')
const rodadas = document.getElementById('rodadas')
const resultado = document.getElementById('resultado')
const pontuacaoEl = document.getElementById('pontuacao')
const pontuacaoFinal = document.getElementById('pontuacaoFinal')
const fimDeJogo = document.getElementById('fimDeJogo')
const jogarNovamenteBtn = document.getElementById('jogarNovamente')
const btns = [
    document.getElementById('op1'),
    document.getElementById('op2'),
    document.getElementById('op3')
]

let paises = []
let paisCorreto = null
let respostaCorretaIndex = null
let rodada = 0
let pontos = 0

async function carregarPaises() {
    const resposta = await fetch(endpoint)
    if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`)
    paises = await resposta.json()
}

function novaRodada() {
    if (rodada >= 10) {
        mostrarTelaFinal()
        return
    }

    rodada++
    resultado.textContent = ''

    const indicesUsados = new Set()
    while (indicesUsados.size < 3) {
        indicesUsados.add(Math.floor(Math.random() * paises.length))
    }

    const opcoes = Array.from(indicesUsados).map(i => paises[i])
    respostaCorretaIndex = Math.floor(Math.random() * 3)
    paisCorreto = opcoes[respostaCorretaIndex]

    img.src = paisCorreto.flags.svg
    img.alt = `Bandeira de ${paisCorreto.name.common}`

    btns.forEach((btn, i) => {
        btn.textContent = opcoes[i].name.common
        btn.disabled = false
    })

    atualizarPontuacao()
}

function verificarResposta(index) {
    if (index === respostaCorretaIndex) {
        resultado.textContent = '✅ Você acertou!'
        pontos++
    } else {
        resultado.textContent = `❌ Errou! Era: ${paisCorreto.name.common}`
    }
    btns.forEach(btn => btn.disabled = true)
    setTimeout(novaRodada, 1500)
}

function atualizarPontuacao() {
    rodadas.textContent = `Rodada ${rodada} de 10`
    pontuacaoEl.textContent = `Pontos: ${pontos}`
}

function mostrarTelaFinal() {
    document.querySelector('main').classList.add('fim')
    fimDeJogo.classList.remove('escondido')
    pontuacaoFinal.textContent = `Você fez ${pontos} ponto(s) de 10.`
    btns.forEach(btn => btn.disabled = true)
}

function reiniciarJogo() {
    rodada = 0
    pontos = 0
    fimDeJogo.classList.add('escondido')
    document.querySelector('main').classList.remove('fim')
    novaRodada()
}

btns.forEach((btn, i) => {
    btn.addEventListener('click', () => verificarResposta(i))
})

jogarNovamenteBtn.addEventListener('click', reiniciarJogo)

carregarPaises().then(novaRodada).catch(erro => {
    resultado.textContent = 'Erro ao carregar países.'
    console.error(erro)
})
