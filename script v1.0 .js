const candidatos = {
    "14": {
        nome: "Chris",
        inicias: "CS",
        partido: "Brooklin",
        vice: "Greg"
    },

    "27": {
        nome: "Rochelle",
        inicias: "RC",
        partido: "Marido 2 Empregos",
        vice: "Drew",
    },

    "73": {
        nome: "Julius",
        partido: "Escala 7X0",
        inicias: "JS",
        vice: "Tonya"
    }
};

const candidatoSecreto = {
    nome: "Super Xandão",
    partido: "PRONA",
    inicias: "SX",
    vice: "Enéas Carneiro",
    photo: "foto/super-xandao.jpg"
};

const somUrna = document.getElementById("som-urna");

function playsomUrna() {
    somUrna.currentTime = 0;
    somUrna.play();
}

const somSurpresa = document.getElementById("som-surpresa");

function playSomSurpresa() {
    somSurpresa.currentTime = 0;
    somSurpresa.play();
}


let votos = {
    "14": 0,
    "27": 0,
    "73": 0,
    "2030": 0,
    branco: 0,
    nulo: 0
};

let numInserido = "";
let finalizar = false;

const screenContent = document.getElementById("tela-content");

const candidatoNome = document.getElementById("candidato-nome");
const candidatoParty = document.getElementById("candidato-party");
const candidatoAvatar = document.getElementById("candidato-avatar");
const candidatoVice = document.getElementById("candidato-vice");

const notifica = document.getElementById("notifica");
const totalVotos = document.getElementById("total-votos");
const resultList = document.getElementById("listaresultado");

const dialog = document.getElementById("resultado-dialogo");


function showNotice(message) {
    notifica.querySelector("p").textContent = message;
}


function renderizarTela() {
    if (finalizar) {
        screenContent.innerHTML = `
            <p class="tela-instruction">VOTAÇÃO</p>
            <h3>FIM</h3>
            <p class="tela-help">
                Obrigado por participar!
            </p>
        `;
        

        candidatoNome.textContent = "Voto finalizado";
        

        candidatoParty.textContent =
            "Sua escolha foi registrada nesta simulação.";

        candidatoAvatar.textContent = "✓";
        candidatoVice.textContent = "";

        return;
    }

    const candidato = candidatos[numInserido];

    const secreto = numInserido === "2030";

    let sub = "Digite o número do candidato";

    candidatoVice.textContent = "";

    if (numInserido === "") {
        candidatoNome.textContent = "Aguardando número";
        candidatoParty.textContent = "Digite 2 números no teclado";
        candidatoAvatar.textContent = "?";
    } else if (numInserido.length === 1) {
        candidatoNome.textContent = "Continue digitando";
        candidatoParty.textContent = "Insira o segundo dígito";
        candidatoAvatar.textContent = numInserido;

    } else if (secreto) {
        candidatoNome.textContent = "Nome: " + candidatoSecreto.nome;
        candidatoParty.textContent = "Partido: " + candidatoSecreto.partido;
        candidatoVice.textContent = "Vice: " + candidatoSecreto.vice;
        candidatoAvatar.textContent = candidatoSecreto.inicias;

        sub = "Confira os dados e confirme seu voto";
    } else if (candidato) {
        candidatoNome.textContent = "Nome: " + candidato.nome;
        candidatoParty.textContent = "Partido: " + candidatos[numInserido].partido;
        candidatoVice.textContent = "Vice: " + candidato.vice;
        candidatoAvatar.textContent = candidato.inicias;

        sub = "Confira os dados e confirme seu voto";
    } else {
        candidatoNome.textContent = "Candidato não encontrado";
        candidatoParty.textContent = "Número inexistente";
        candidatoAvatar.textContent = "!";

        sub = "Número inexistente: voto será nulo";
    }

    const digitos = (numInserido + "    ").slice(
        0,
        numInserido.length >= 3 ? 4 : 2
    );

    const digitosExtras = numInserido.length >= 3 ? `
    <span class="digit">${digitos[2] || ""}</span>
    <span class="digit">${digitos[3] || ""}</span>
    ` : "";

    screenContent.innerHTML = `
        <p class="tela-instruction">SEU VOTO PARA</p>

        <h3>Presidente</h3>

        <div class="number-entry">
            <span class="number-label">Número:</span>
            <span class="digit">
                ${digitos[0] === " " ? "" : digitos[0]}
            </span>

            <span class="digit">
                ${digitos[1] === " " ? "" : digitos[1]}
            </span>
            ${digitosExtras}
        </div>

        <p class="tela-help">${sub}</p>
    `;
}


function addDigito(digit) {
    if (finalizar) {
        return;
    }

    if (numInserido.length >= 2 && !("2030".startsWith(numInserido))) {
        showNotice("Pressione CORRIGE para digitar outro número.");
        return;
    }

    numInserido += digit;

    renderizarTela();
}


function resetVote() {
    numInserido = "";
    finalizar = false;

    renderizarTela();
}


function correctVote() {
    if (finalizar) {
        return;
    }

    numInserido = "";

    renderizarTela();

    showNotice("Número apagado. Digite novamente sua escolha.");
}


function confirmVote() {
    if (finalizar) {
        return;
    }

    if (numInserido.length < 2) {
        showNotice(
            "Digite os dois números antes de confirmar, ou escolha BRANCO."
        );

        return;
    }

    if (numInserido === "2030") {
    votos["2030"]++;
    showNotice("Voto confirmado para Super Xandão!");

    } else if (candidatos[numInserido]) {
        votos[numInserido]++;

        showNotice(
            `Voto simulado para ${candidatos[numInserido].nome} registrado com sucesso.`
        );
    } else {
        votos.nulo++;

        showNotice("Voto nulo registrado nesta simulação.");
    }

    finalizar = true;

    if (numInserido === "2030") {
        playSomSurpresa();
    } else {
        playsomUrna();
    }

    setTimeout(resetVote, 2500);

    renderizarTela();
    renderResults();
}


function brancovoto() {
    if (finalizar) {
        return;
    }

    votos.branco++;

    finalizar = true;

    playsomUrna();

    setTimeout(resetVote, 2500);

    renderizarTela();
    renderResults();

    showNotice("Voto em branco registrado nesta simulação.");
}


function renderResults() {
    const total = Object.values(votos).reduce(
        (sum, count) => sum + count,
        0
    );

    totalVotos.textContent = total;

    const labels = [
        ...Object.entries(candidatos).map(([number, candidato]) => ({
            number,
            nome: candidato.nome,
            count: votos[number]
        })),

        {
            number: "2030",
            nome: candidatoSecreto.nome,
            count: votos["2030"]
        },

        {
            number: "BRANCO",
            nome: "Votos em branco",
            count: votos.branco
        },

        {
            number: "NULO",
            nome: "Votos nulos",
            count: votos.nulo
        }
    ];

    if (total === 0) {
        resultList.innerHTML = `
            <p class="empty-results">
                Os votos aparecerão aqui após a confirmação.
            </p>
        `;

        return;
    }

    resultList.innerHTML = labels
        .filter(item => item.count > 0)
        .map(item => {
            const percentage = Math.round(
                (item.count / total) * 100
            );

            return `
                <div class="result-row">

                    <span class="result-nome">
                        ${item.nome}
                    </span>

                    <span class="result-number">
                        ${item.count} (${percentage}%)
                    </span>

                    <div class="result-bar">
                        <span style="width: ${percentage}%"></span>
                    </div>

                </div>
            `;
        })
        .join("");
}


document.querySelectorAll("[data-digit]").forEach(button => {
    button.addEventListener("click", () => {
        addDigito(button.dataset.digit);
    });
});

document
    .getElementById("corrige-btn")
    .addEventListener("click", correctVote);

document
    .getElementById("confirma-btn")
    .addEventListener("click", confirmVote);

document
    .getElementById("branco-btn")
    .addEventListener("click", brancovoto);


document
    .getElementById("botaodemostrarresultados")
    .addEventListener("click", () => {

        const total = Object.values(votos).reduce(
            (sum, count) => sum + count,
            0
        );

        const items = [
            ...Object.entries(candidatos).map(([number, candidato]) => ({
                nome: `${candidato.nome} (${number})`,
                count: votos[number]
            })),

            {
                nome: `${candidatoSecreto.nome} (2030)`,
                count: votos["2030"]
            },


            {
                nome: "Votos em branco",
                count: votos.branco
            },

            {
                nome: "Votos nulos",
                count: votos.nulo
            }
        ];

        document.getElementById("dialogo").innerHTML = `
            <div class="dialog-result">
                <strong>Total de votos</strong>
                <strong>${total}</strong>
            </div>

            ${items.map(item => `
                <div class="dialog-result">
                    <span>${item.nome}</span>
                    <strong>${item.count}</strong>
                </div>
            `).join("")}
        `;

        dialog.showModal();
    });


document
    .getElementById("fechar-dialogo")
    .addEventListener("click", () => {
        dialog.close();
    });


document.addEventListener("keydown", event => {
    if (dialog.open) {
        return;
    }

    if (/^[0-9]$/.test(event.key)) {
        addDigito(event.key);
    }

    if (event.key === "Backspace") {
        event.preventDefault();
        correctVote();
    }

    if (event.key === "Enter") {
        event.preventDefault();
        confirmVote();
    }
});


renderizarTela();
renderResults();
