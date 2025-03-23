document.addEventListener("DOMContentLoaded", () => {
    const nomeDocenteInput = document.getElementById("nomeDocente");
    const addDocenteBtn = document.getElementById("addDocente");
    const elencoDocentiSelect = document.getElementById("elencoDocenti");
    const giornoSettimanaSelect = document.getElementById("giornoSettimana");
    const orarioDocenteInput = document.getElementById("orarioDocente");
    const aulaDocenteInput = document.getElementById("aulaDocente");
    const addOrarioBtn = document.getElementById("addOrario");
    const aulaInfo = document.getElementById("aulaInfo");
    const salvaElencoBtn = document.getElementById("salvaElenco");
    const elencoSalvataggiSelect = document.getElementById("elencoSalvataggi");
    const caricaElencoBtn = document.getElementById("caricaDaMenu");
    const eliminaElencoBtn = document.getElementById("eliminaElenco");
    const visualizzaCalendarioBtn = document.getElementById("visualizzaCalendario");

    let docenti = {};

    // Aggiunta di un docente
    addDocenteBtn.addEventListener("click", () => {
        const nome = nomeDocenteInput.value.trim();
        if (nome && !docenti[nome]) {
            docenti[nome] = [];
            const option = new Option(nome, nome);
            elencoDocentiSelect.add(option);
            nomeDocenteInput.value = "";
        }
    });

    // Aggiunta orario e aula al docente selezionato
    addOrarioBtn.addEventListener("click", () => {
        const docenteSelezionato = elencoDocentiSelect.value;
        const giorno = giornoSettimanaSelect.value;
        const orario = orarioDocenteInput.value.trim();
        const aula = aulaDocenteInput.value.trim();

        if (docenteSelezionato && orario && aula) {
            docenti[docenteSelezionato].push({ giorno, orario, aula });
            orarioDocenteInput.value = "";
            aulaDocenteInput.value = "";
        }
    });

    // Controlla dove si trova il docente in base all'orario attuale
    elencoDocentiSelect.addEventListener("change", () => {
        const docenteSelezionato = elencoDocentiSelect.value;
        if (!docenteSelezionato) return;

        const oggi = new Date();
        const giornoAttuale = [
            "Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"
        ][oggi.getDay()];
        const orarioAttuale = oggi.getHours().toString().padStart(2, "0") + ":" + 
                              oggi.getMinutes().toString().padStart(2, "0");

        const lezioni = docenti[docenteSelezionato];
        let aulaTrovata = "non disponibile";

        if (lezioni) {
            lezioni.forEach(({ giorno, orario, aula }) => {
                const [start, end] = orario.split("-").map(o => o.trim());
                if (giorno === giornoAttuale && orarioAttuale >= start && orarioAttuale <= end) {
                    aulaTrovata = aula;
                }
            });
        }

        aulaInfo.textContent = `Il docente ${docenteSelezionato} si trova in: ${aulaTrovata}`;
    });

    // Salvataggio dell'elenco dei docenti nel LocalStorage
    salvaElencoBtn.addEventListener("click", () => {
        const nomeElenco = prompt("Inserisci il nome dell'elenco (es. Anno scolastico 2024/2025):");
        if (nomeElenco) {
            localStorage.setItem(`docenti_${nomeElenco}`, JSON.stringify(docenti));
            aggiornaElencoSalvataggi();
        }
    });

    // Caricamento dell'elenco salvato
    caricaElencoBtn.addEventListener("click", () => {
        const elencoSelezionato = elencoSalvataggiSelect.value;
        if (elencoSelezionato) {
            const datiSalvati = localStorage.getItem(`docenti_${elencoSelezionato}`);
            if (datiSalvati) {
                docenti = JSON.parse(datiSalvati);
                aggiornaElencoDocenti();
            }
        }
    });

    // Eliminazione di un elenco salvato
    eliminaElencoBtn.addEventListener("click", () => {
        const elencoSelezionato = elencoSalvataggiSelect.value;
        if (elencoSelezionato) {
            localStorage.removeItem(`docenti_${elencoSelezionato}`);
            aggiornaElencoSalvataggi();
        }
    });

    // Visualizzazione del calendario settimanale
    visualizzaCalendarioBtn.addEventListener("click", () => {
        const docenteSelezionato = elencoDocentiSelect.value;
        if (!docenteSelezionato) return;

        let calendarioHTML = `<h2>Calendario di ${docenteSelezionato}</h2><ul>`;
        docenti[docenteSelezionato].forEach(({ giorno, orario, aula }) => {
            calendarioHTML += `<li><strong>${giorno}</strong>: ${orario} - Aula ${aula}</li>`;
        });
        calendarioHTML += "</ul>";

        const nuovaFinestra = window.open("", "Calendario", "width=400,height=500");
        nuovaFinestra.document.write(`<html><head><title>Calendario</title></head><body>${calendarioHTML}</body></html>`);
    });

    // Aggiorna l'elenco dei docenti nella select
    function aggiornaElencoDocenti() {
        elencoDocentiSelect.innerHTML = '<option value="" disabled selected>Seleziona un docente</option>';
        Object.keys(docenti).forEach(nome => {
            elencoDocentiSelect.add(new Option(nome, nome));
        });
    }

    // Aggiorna l'elenco degli elenchi salvati nella select
    function aggiornaElencoSalvataggi() {
        elencoSalvataggiSelect.innerHTML = '<option value="" disabled selected>Nessun elenco salvato</option>';
        Object.keys(localStorage).forEach(chiave => {
            if (chiave.startsWith("docenti_")) {
                elencoSalvataggiSelect.add(new Option(chiave.replace("docenti_", ""), chiave.replace("docenti_", "")));
            }
        });
    }

    // Inizializza gli elenchi salvati al caricamento della pagina
    aggiornaElencoSalvataggi();
});
