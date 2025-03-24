document.addEventListener('DOMContentLoaded', function() {
    // Variabili
    const nomeDocenteInput = document.getElementById('nomeDocente');
    const aggiungiDocenteBtn = document.getElementById('aggiungiDocente');
    const selezionaDocenteSelect = document.getElementById('selezionaDocente');
    const giornoSettimanaSelect = document.getElementById('giornoSettimana');
    const orarioInizioInput = document.getElementById('orarioInizio');
    const orarioFineInput = document.getElementById('orarioFine');
    const aulaInput = document.getElementById('aula');
    const aggiungiOrarioBtn = document.getElementById('aggiungiOrario');
    const infoAula = document.getElementById('infoAula');
    const salvaElencoBtn = document.getElementById('salvaElenco');
    const elencoSalvatoSelect = document.getElementById('elencoSalvato');
    const caricaElencoBtn = document.getElementById('caricaElenco');
    const eliminaElencoBtn = document.getElementById('eliminaElenco');
    const visualizzaCalendarioBtn = document.getElementById('visualizzaCalendario');
    const calendarioDocenteDiv = document.getElementById('calendarioDocente');
    const tornaHomeBtn = document.getElementById('tornaHome');
    const calendarioInfo = document.getElementById('calendarioInfo');

    let docenti = [];

    // Funzione per aggiornare l'elenco dei docenti
    function aggiornaDocenti() {
        selezionaDocenteSelect.innerHTML = '';
        docenti.forEach((docente, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = docente.nome;
            selezionaDocenteSelect.appendChild(option);
        });
    }

    // Aggiungi docente
    aggiungiDocenteBtn.addEventListener('click', function() {
        const nomeDocente = nomeDocenteInput.value.trim();
        if (nomeDocente) {
            docenti.push({
                nome: nomeDocente,
                orari: []
            });
            nomeDocenteInput.value = ''; // Reset
            aggiornaDocenti();
        }
    });

    // Aggiungi orario
    aggiungiOrarioBtn.addEventListener('click', function() {
        const selectedDocenteIndex = selezionaDocenteSelect.value;
        const giorno = giornoSettimanaSelect.value;
        const orarioInizio = orarioInizioInput.value;
        const orarioFine = orarioFineInput.value;
        const aula = aulaInput.value;

        if (selectedDocenteIndex && orarioInizio && orarioFine && aula) {
            docenti[selectedDocenteIndex].orari.push({
                giorno,
                orarioInizio,
                orarioFine,
                aula
            });
            orarioInizioInput.value = '';
            orarioFineInput.value = '';
            aulaInput.value = '';
            console.log(`Orario aggiunto per ${docenti[selectedDocenteIndex].nome}`);
        }
    });

    // Seleziona docente per vedere aula
    selezionaDocenteSelect.addEventListener('change', function() {
        const selectedDocenteIndex = selezionaDocenteSelect.value;
        const docente = docenti[selectedDocenteIndex];

        if (docente) {
            const currentDay = new Date().toLocaleString('it-IT', { weekday: 'long' }).toLowerCase();
            const currentTime = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

            const orarioDocente = docente.orari.find(orario => orario.giorno.toLowerCase() === currentDay && currentTime >= orario.orarioInizio && currentTime <= orario.orarioFine);

            if (orarioDocente) {
                infoAula.textContent = `Il docente ${docente.nome} si trova in: ${orarioDocente.aula}`;
            } else {
                infoAula.textContent = `Il docente ${docente.nome} non è disponibile in questo momento`;
            }
        }
    });

    // Visualizza calendario
    visualizzaCalendarioBtn.addEventListener('click', function() {
        const selectedDocenteIndex = selezionaDocenteSelect.value;
        const docente = docenti[selectedDocenteIndex];

        if (docente) {
            calendarioInfo.innerHTML = `<strong>Calendario per ${docente.nome}:</strong><br>`;
            docente.orari.forEach(orario => {
                calendarioInfo.innerHTML += `Giorno: ${orario.giorno}, Orario: ${orario.orarioInizio} - ${orario.orarioFine}, Aula: ${orario.aula}<br>`;
            });
            calendarioDocenteDiv.style.display = 'block';
        }
    });

    // Torna alla home dalla pagina calendario
    tornaHomeBtn.addEventListener('click', function() {
        calendarioDocenteDiv.style.display = 'none';
    });

    // Salva elenco (salvataggio in locale o altro)
    salvaElencoBtn.addEventListener('click', function() {
        const nomeElenco = prompt('Inserisci il nome dell\'elenco');
        if (nomeElenco) {
            localStorage.setItem(nomeElenco, JSON.stringify(docenti));
            alert('Elenco salvato!');
        }
    });

    // Carica elenco
    caricaElencoBtn.addEventListener('click', function() {
        const nomeElenco = elencoSalvatoSelect.value;
        if (nomeElenco) {
            const elencoCaricato = JSON.parse(localStorage.getItem(nomeElenco));
            if (elencoCaricato) {
                docenti = elencoCaricato;
                aggiornaDocenti();
                alert('Elenco caricato!');
            }
        }
    });

    // Elimina elenco
    eliminaElencoBtn.addEventListener('click', function() {
        const nomeElenco = elencoSalvatoSelect.value;
        if (nomeElenco) {
            localStorage.removeItem(nomeElenco);
            alert('Elenco eliminato!');
            aggiornaDocenti();
        }
    });
});
