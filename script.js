// Funzione per aggiungere un docente
let docenti = [];

document.getElementById("aggiungiDocente").addEventListener("click", function() {
    const docenteNome = document.getElementById("docenteInput").value;
    if (docenteNome) {
        // Aggiungi il docente all'elenco
        docenti.push({ nome: docenteNome, orari: [] });
        aggiornaElencoDocenti();
        document.getElementById("docenteInput").value = ""; // Pulisci l'input
    }
});

// Funzione per aggiornare l'elenco dei docenti
function aggiornaElencoDocenti() {
    const elencoDocenti = document.getElementById("elencoDocenti");
    elencoDocenti.innerHTML = "";
    docenti.forEach((docente, index) => {
        const docenteItem = document.createElement("li");
        docenteItem.textContent = docente.nome;
        docenteItem.addEventListener("click", function() {
            visualizzaCalendario(docente, index);
        });
        elencoDocenti.appendChild(docenteItem);
    });
}

// Funzione per visualizzare il calendario del docente
function visualizzaCalendario(docente, index) {
    document.getElementById("homeSection").style.display = "none";
    document.getElementById("calendarSection").style.display = "block";
    
    const calendarContent = document.getElementById("calendarContent");
    calendarContent.innerHTML = `<h3>Calendario di ${docente.nome}</h3>`;
    
    docente.orari.forEach(orario => {
        const divOrario = document.createElement("div");
        divOrario.textContent = `${orario.range}: ${orario.aula}`;
        calendarContent.appendChild(divOrario);
    });
    
    // Aggiungi una sezione per aggiungere orari
    const inputRange = document.createElement("input");
    inputRange.placeholder = "Inserisci range orario (es. 10:00-11:00)";
    const inputAula = document.createElement("input");
    inputAula.placeholder = "Inserisci aula";
    const buttonAggiungiOrario = document.createElement("button");
    buttonAggiungiOrario.textContent = "Aggiungi Orario";

    buttonAggiungiOrario.addEventListener("click", function() {
        const range = inputRange.value;
        const aula = inputAula.value;
        if (range && aula) {
            docente.orari.push({ range: range, aula: aula });
            visualizzaCalendario(docente, index); // Rende il calendario aggiornato
        }
    });

    calendarContent.appendChild(inputRange);
    calendarContent.appendChild(inputAula);
    calendarContent.appendChild(buttonAggiungiOrario);
}

// Funzione per tornare alla home
document.getElementById("backToHome").addEventListener("click", function() {
    document.getElementById("homeSection").style.display = "block";
    document.getElementById("calendarSection").style.display = "none";
});
