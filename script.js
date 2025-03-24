let docenti = []; // Array che conterrà gli oggetti con i docenti, orari e aule
let elenchiSalvati = JSON.parse(localStorage.getItem('elenchiSalvati')) || [];

// Funzione per aggiungere un docente all'elenco
document.getElementById('aggiungiDocente').addEventListener('click', function () {
    const nomeDocente = document.getElementById('nomeDocente').value.trim();
    if (nomeDocente) {
        docenti.push({ nome: nomeDocente, orari: [] });
        updateDocentiList();
        document.getElementById('nomeDocente').value = ''; // Pulisce il campo
    }
});

// Funzione per aggiornare l'elenco dei docenti
function updateDocentiList() {
    const selezionaDocente = document.getElementById('selezionaDocente');
    selezionaDocente.innerHTML = '<option value="">Seleziona un docente</option>'; // Pulisce l'elenco
    docenti.forEach((docente, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = docente.nome;
        selezionaDocente.appendChild(option);
    });
}

// Funzione per aggiungere un orario per il docente
document.getElementById('aggiungiOrario').addEventListener('click', function () {
    const docenteIndex = document.getElementById('selezionaDocente').value;
    const giorno = document.getElementById('giornoSettimana').value;
    const orarioInizio = document.getElementById('orarioInizio').value;
    const orarioFine = document.getElementById('orarioFine').value;
    const aula = document.getElementById('aula').value;

    if (docenteIndex && giorno && orarioInizio && orarioFine && aula) {
        const docente = docenti[docenteIndex];
        docente.orari.push({ giorno, orarioInizio, orarioFine, aula });
        alert('Orario aggiunto!');
    }
});

// Funzione per visualizzare l'aula in base all'orario e al giorno del dispositivo
function updateAula() {
    const selezionaDocente = document.getElementById('selezionaDocente').value;
    if (selezionaDocente !== '') {
        const docente = docenti[selezionaDocente];
        const giorno = document.getElementById('giornoSettimana').value;
        const orarioAttuale = new Date();
        const orarioInizio = orarioAttuale.getHours() + ":" + orarioAttuale.getMinutes();
        
        const orarioDocente = docente.orari.find(orario => orario.giorno === giorno && orario.orarioInizio <= orarioInizio && orario.orarioFine >= orarioInizio);

        if (orarioDocente) {
            document.getElementById('infoAula').textContent = `Il docente si trova in aula: ${orarioDocente.aula}`;
        } else {
            document.getElementById('infoAula').textContent = "Il docente non ha orario per questo giorno o ora.";
        }
    }
}

// Aggiungi evento per selezionare il docente
document.getElementById('selezionaDocente').addEventListener('change', updateAula);

// Aggiungi evento per selezionare il giorno della settimana
document.getElementById('giornoSettimana').addEventListener('change', updateAula);

// Funzione per salvare l'elenco dei docenti
document.getElementById('salvaElenco').addEventListener('click', function () {
    const elenco = { docenti: [...docenti] };
    elenchiSalvati.push(elenco);
    localStorage.setItem('elenchiSalvati', JSON.stringify(elenchiSalvati));
    alert('Elenco salvato!');
    updateElencoSalvato();
});

// Funzione per aggiornare la lista degli elenchi salvati
function updateElencoSalvato() {
    const elencoSalvato = document.getElementById('elencoSalvato');
    elencoSalvato.innerHTML = '<option value="">Seleziona un elenco</option>'; // Pulisce la lista
    elenchiSalvati.forEach((elenco, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `Elenco ${index + 1}`;
        elencoSalvato.appendChild(option);
    });
}

// Funzione per caricare un elenco salvato
document.getElementById('caricaElenco').addEventListener('click', function () {
    const elencoIndex = document.getElementById('elencoSalvato').value;
    if (elencoIndex !== '') {
        docenti = [...elenchiSalvati[elencoIndex].docenti];
        updateDocentiList();
        alert('Elenco caricato!');
    }
});

// Funzione per eliminare un elenco salvato
document.getElementById('eliminaElenco').addEventListener('click', function () {
    const elencoIndex = document.getElementById('elencoSalvato').value;
    if (elencoIndex !== '') {
        elenchiSalvati.splice(elencoIndex, 1);
        localStorage.setItem('elenchiSalvati', JSON.stringify(elenchiSalvati));
        updateElencoSalvato();
        alert('Elenco eliminato!');
    }
});

// Funzione per visualizzare il calendario del docente
document.getElementById('visualizzaCalendario').addEventListener('click', function () {
    const selezionaDocente = document.getElementById('selezionaDocente').value;
    if (selezionaDocente !== '') {
        const docente = docenti[selezionaDocente];
        let calendarioHTML = `<h3>Calendario di ${docente.nome}</h3><ul>`;
        docente.orari.forEach(orario => {
            calendarioHTML += `<li>${orario.giorno}: ${orario.orarioInizio} - ${orario.orarioFine}, Aula: ${orario.aula}</li>`;
        });
        calendarioHTML += '</ul>';
        document.getElementById('calendarioInfo').innerHTML = calendarioHTML;
        document.getElementById('calendarioDocente').style.display = 'block';
    }
});

// Funzione per nascondere il calendario
document.getElementById('nascondiCalendario').addEventListener('click', function () {
    document.getElementById('calendarioDocente').style.display = 'none';
});

// Inizializza l'elenco degli elenchi salvati all'apertura della pagina
updateElencoSalvato();
