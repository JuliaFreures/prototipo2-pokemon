
const saida = document.getElementById("saida");

function escrever(mensagem) {
  saida.textContent += mensagem + "\n";
}

function mostrarDeck(deck, jogador) {
  escrever(`\n🔹 Pokémons do Jogador ${jogador}:`);
  deck.forEach((p, i) => {
    const barra = "█".repeat(p.vida / 10) + "-".repeat(10 - p.vida / 10);
    escrever(`${i + 1}. ${p.nome} (Vida: ${p.vida} [${barra}], ATK: ${p.attack}, DEF: ${p.def})`);
  });
}

function escolherPokemon(deck) {
  return deck.find(p => p.vida > 0);
}

function realizarAtaque(atacante, defensor, historico) {
  const dano = Math.max(atacante.attack - defensor.def, 0) + 10;
  defensor.vida = Math.max(defensor.vida - dano, 0);
  historico.push(`${atacante.nome} atacou ${defensor.nome} causando ${dano} de dano.`);
  escrever(`⚔️ ${atacante.nome} atacou ${defensor.nome} causando ${dano} de dano!`);
  if (defensor.vida === 0) {
    escrever(`💀 ${defensor.nome} desmaiou!`);
    historico.push(`${defensor.nome} desmaiou!`);
  }
}

function executarRodada(p1, p2, historico) {
  escrever(`\n🆚 ${p1.nome} (Jogador 1) vs ${p2.nome} (Jogador 2)`);
  if (Math.random() < 0.5) {
    escrever("🎲 Jogador 1 começa a rodada!");
    realizarAtaque(p1, p2, historico);
    if (p2.vida > 0) {
      realizarAtaque(p2, p1, historico);
    }
  } else {
    escrever("🎲 Jogador 2 começa a rodada!");
    realizarAtaque(p2, p1, historico);
    if (p1.vida > 0) {
      realizarAtaque(p1, p2, historico);
    }
  }
}

function exibirResultado(deck1, deck2, historico) {
  escrever("\n🏁 Fim da batalha!\n");
  historico.forEach(evento => escrever(evento));
  const vivos1 = deck1.filter(p => p.vida > 0).length;
  const vivos2 = deck2.filter(p => p.vida > 0).length;
  if (vivos1 > vivos2) {
    escrever("🏆 Jogador 1 venceu!");
  } else if (vivos2 > vivos1) {
    escrever("🏆 Jogador 2 venceu!");
  } else {
    escrever("🤝 Empate!");
  }
}

function batalhar(deck1, deck2) {
  escrever("\n⚔️ Iniciando a batalha!");
  const historico = [];

  deck1 = deck1.map(p => ({ ...p }));
  deck2 = deck2.map(p => ({ ...p }));

  mostrarDeck(deck1, 1);
  mostrarDeck(deck2, 2);

  while (deck1.some(p => p.vida > 0) && deck2.some(p => p.vida > 0)) {
    escrever("\n========== NOVA RODADA ==========");
    const p1 = escolherPokemon(deck1);
    const p2 = escolherPokemon(deck2);
    executarRodada(p1, p2, historico);
  }

  exibirResultado(deck1, deck2, historico);
}

document.addEventListener("DOMContentLoaded", () => {
  const deck1 = JSON.parse(localStorage.getItem("jogador1"));
  const deck2 = JSON.parse(localStorage.getItem("jogador2"));
  if (!deck1 || !deck2) {
    alert("Decks não encontrados. Volte para a tela de escolha.");
    window.location.href = "escolha.html";
    return;
  }
  batalhar(deck1, deck2);
});
