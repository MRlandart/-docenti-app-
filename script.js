// Ripristino della home page con la struttura desiderata e implementazione delle funzionalità richieste

document.addEventListener("DOMContentLoaded", function () {
    let docenti = JSON.parse(localStorage.getItem("docenti")) || [];
    let elenchiSalvati = JSON.parse(localStorage.getItem("elenchiSalvati")) || {};
    
    const docenteInput = document.getElementById("docenteInput");
    const addDocenteBtn = document.getElementById("addDocenteBtn");
    const docenteSelect = document.getElementById("docenteSelect");
    const giornoSelect = document.getElementById("giornoSelect");
    const orarioInizio = document.getElementById("orarioInizio");
    const orarioFine = document.getElementById("orarioFine");
    const aulaInput = document.getElementById("aulaInput");
    const addOrarioBtn = document.getElementById("addOrarioBtn");
    const aulaDisplay = document.getElementById("aulaDisplay");
    const saveElencoBtn = document.getElementById("saveElencoBtn");
    const elencoSelect = document.getElementById("elencoSelect");
    const loadElencoBtn = document.getElementById("loadElencoBtn");
    const deleteElencoBtn = document.getElementById("deleteElencoBtn");
    const viewCalendarioBtn = document.getElementById("viewCalendarioBtn");

    function updateDocenteList() {
        docenteSelect.innerHTML = "";
        docenti.forEach((docente) => {
            let option = document.createElement("option");
            option.value = docente.nome;
            option.textContent = docente.nome;
            docenteSelect.appendChild(option);
        });
    }
    
    function updateElencoList() {
        elencoSelect.innerHTML = "";
        Object.keys(elenchiSalvati).forEach((elenco) => {
            let option = document.createElement("option");
            option.value = elenco;
            option.textContent = elenco;
            elencoSelect.appendChild(option);
        });
    }

    addDocenteBtn.addEventListener("click", function () {
        let nome = docenteInput.value.trim();
        if (nome && !docenti.some(d => d.nome === nome)) {
            docenti.push({ nome, calendario: {} });
            localStorage.setItem("docenti", JSON.stringify(docenti));
            updateDocenteList();
            docenteInput.value = "";
        }
    });

    addOrarioBtn.addEventListener("click", function () {
        let docenteNome = docenteSelect.value;
        let giorno = giornoSelect.value;
        let inizio = orarioInizio.value;
        let fine = orarioFine.value;
        let aula = aulaInput.value.trim();

        if (docenteNome && giorno && inizio && fine && aula) {
            let docente = docenti.find(d => d.nome === docenteNome);
            if (!docente.calendario[giorno]) {
                docente.calendario[giorno] = [];
            }
            docente.calendario[giorno].push({ inizio, fine, aula });
            localStorage.setItem("docenti", JSON.stringify(docenti));
        }
    });

    function getCurrentAula() {
        let now = new Date();
        let currentGiorno = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"][now.getDay()];
        let currentTime = now.toTimeString().substring(0, 5);
        
        let docenteNome = docenteSelect.value;
        let docente = docenti.find(d => d.nome === docenteNome);
        
        if (docente && docente.calendario[currentGiorno]) {
            let lezioni = docente.calendario[currentGiorno];
            let aulaTrovata = "Non disponibile";
            lezioni.forEach(lezione => {
                if (currentTime >= lezione.inizio && currentTime <= lezione.fine) {
                    aulaTrovata = lezione.aula;
                }
            });
            aulaDisplay.textContent = `Il docente ${docenteNome} si trova in: ${aulaTrovata}`;
        }
    }
    
    saveElencoBtn.addEventListener("click", function () {
        let elencoNome = prompt("Inserisci il nome dell'elenco da salvare:");
        if (elencoNome) {
            elenchiSalvati[elencoNome] = JSON.parse(JSON.stringify(docenti));
            localStorage.setItem("elenchiSalvati", JSON.stringify(elenchiSalvati));
            updateElencoList();
        }
    });

    loadElencoBtn.addEventListener("click", function () {
        let elencoNome = elencoSelect.value;
        if (elenchiSalvati[elencoNome]) {
            docenti = JSON.parse(JSON.stringify(elenchiSalvati[elencoNome]));
            localStorage.setItem("docenti", JSON.stringify(docenti));
            updateDocenteList();
        }
    });

    deleteElencoBtn.addEventListener("click", function () {
        let elencoNome = elencoSelect.value;
        if (elenchiSalvati[elencoNome] && confirm("Vuoi eliminare questo elenco?")) {
            delete elenchiSalvati[elencoNome];
            localStorage.setItem("elenchiSalvati", JSON.stringify(elenchiSalvati));
            updateElencoList();
        }
    });

    viewCalendarioBtn.addEventListener("click", function () {
        let docenteNome = docenteSelect.value;
        if (docenteNome) {
            let newWin = window.open("", "Calendario", "width=600,height=400");
            let docente = docenti.find(d => d.nome === docenteNome);
            let calendarioHtml = `<h2>Calendario di ${docenteNome}</h2><button onclick='window.close()'>Torna alla Home</button>`;
            Object.keys(docente.calendario).forEach(giorno => {
                calendarioHtml += `<h3>${giorno}</h3>`;
                docente.calendario[giorno].forEach(lezione => {
                    calendarioHtml += `<p>${lezione.inizio} - ${lezione.fine}: ${lezione.aula}</p>`;
                });
            });
            newWin.document.write(calendarioHtml);
        }
    });

    updateDocenteList();
    updateElencoList();
    setInterval(getCurrentAula, 60000);
});
