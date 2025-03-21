const marioyoshi = document.querySelector('.marioyoshi');
const cano = document.querySelector('.cano');
const montanha = document.querySelector('.montanha');
const montanha2 = document.querySelector('.montanha2');
const nuvem = document.querySelector('.nuvem');
const jumpCountDisplay = document.getElementById('jump-count'); // Seleciona o elemento de contagem de pulos
let gameOver = false;
let jumpCount = 0; // Variável para contar os pulos
let canoPassed = false; // Variável para rastrear se o cano foi ultrapassado
let gamePaused = false; // Variável para rastrear se o jogo está pausado

// Adiciona o áudio
const audio = new Audio('./midia/Super Mario Bros. Theme Song - 128.mp3');
audio.playing = false; // Propriedade personalizada para rastrear se a música está tocando

// Adiciona um evento para reiniciar a música quando ela termina
audio.addEventListener('ended', () => {
    if (!gameOver && !gamePaused) {
        audio.currentTime = 0;
        audio.play();
    }
});

const jump = () => {
    if (gamePaused) return; // Não permite pular se o jogo estiver pausado

    // Toca a música quando o MarioYoshi começa a pular
    if (!audio.playing) {
        audio.play();
        audio.playing = true;
    }

    marioyoshi.classList.add('jump');

    marioyoshi.addEventListener('animationend', () => {
        marioyoshi.classList.remove('jump');
    }, { once: true });
}

const updateHighScores = (name, score) => {
    let highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push({ name, score });
    highScores.sort((a, b) => b.score - a.score);
    highScores = highScores.slice(0, 10);
    localStorage.setItem('highScores', JSON.stringify(highScores));
    return highScores;
}

const displayHighScores = (highScores) => {
    const highScoresDisplay = document.getElementById('high-scores');
    highScoresDisplay.innerHTML = '<h2>Top 10 Recordes</h2>';
    highScores.forEach((record, index) => {
        highScoresDisplay.innerHTML += `<p>${index + 1}. ${record.name}: ${record.score}</p>`;
    });
}

const saveScore = () => {
    const playerName = document.getElementById('player-name').value;
    const highScores = updateHighScores(playerName, jumpCount);
    displayHighScores(highScores);
    document.getElementById('game-over-form').style.display = 'none';
    playGame(); // Retoma o jogo após salvar o recorde
}

const loop = setInterval(() => {
    if (gameOver || gamePaused) return; // Sai do loop se o jogo já terminou ou está pausado

    const canoPosition = cano.offsetLeft; // Posição do cano
    const marioyoshiBottom = parseInt(window.getComputedStyle(marioyoshi).bottom); // Posição do Mario

    // Detecção de colisão (ajustado para a altura do pulo)
    if (canoPosition < 120 && canoPosition > 0 && marioyoshiBottom < 40) {
        gameOver = true; // Define o jogo como terminado

        // Para as animações e reposiciona os elementos
        cano.style.animation = 'none';
        cano.style.left = `${canoPosition}px`;

        marioyoshi.style.animation = 'none';
        marioyoshi.style.bottom = `${marioyoshiBottom}px`;

        marioyoshi.src = './images/mariomorre.gif'; // Imagem de Game Over
        marioyoshi.style.marginLeft = '50px';

        clearInterval(loop); // Para o loop

        // Para a música quando o jogo termina
        if (audio.playing) {
            audio.pause();
            audio.currentTime = 0;
            audio.playing = false; // Atualiza a propriedade personalizada
        }

        // Exibe o formulário para salvar o recorde
        document.getElementById('game-over-form').style.display = 'block';
    } else if (canoPosition < 0 && !canoPassed && marioyoshiBottom >= 40) {
        // Incrementa a contagem de pulos se o MarioYoshi pular sobre o cano
        jumpCount++;
        jumpCountDisplay.textContent = `Pulos sobre o cano: ${jumpCount}`; // Atualiza a exibição da contagem de pulos
        console.log(`Pulos sobre o cano: ${jumpCount}`);
        canoPassed = true; // Marca que o cano foi ultrapassado
    } else if (canoPosition >= 0) {
        canoPassed = false; // Reseta a marcação quando o cano está à frente
    }
}, 10);

const pauseGame = () => {
    gamePaused = true;
    document.getElementById('pause-button').style.display = 'none';
    document.getElementById('play-button').style.display = 'block';
    audio.pause();
    // Pausa as animações
    cano.style.animationPlayState = 'paused';
    montanha.style.animationPlayState = 'paused';
    montanha2.style.animationPlayState = 'paused';
    nuvem.style.animationPlayState = 'paused';
}

const playGame = () => {
    gamePaused = false;
    document.getElementById('pause-button').style.display = 'block';
    document.getElementById('play-button').style.display = 'none';
    if (!gameOver) {
        audio.play();
    }
    // Retoma as animações
    cano.style.animationPlayState = 'running';
    montanha.style.animationPlayState = 'running';
    montanha2.style.animationPlayState = 'running';
    nuvem.style.animationPlayState = 'running';
}

document.addEventListener('keydown', jump); // Evento de pulo