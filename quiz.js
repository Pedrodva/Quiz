const parametros = new URLSearchParams(window.location.search);
const categoria = parametros.get("categoria");

const titulo = document.getElementById("titulo-categoria");
const preguntaEl = document.getElementById("pregunta");
const respuestasEl = document.getElementById("respuestas");
const confirmarBtn = document.getElementById("confirmar");
const contadorEl = document.getElementById("contador");
const juegoEl = document.getElementById("juego");
const finalEl = document.getElementById("final");
const puntuacionFinalEl = document.getElementById("puntuacion-final");

titulo.textContent = categoria || "Sin categoría";

let preguntas = [];
let indice = 0;
let elegida = null;
let puntos = 0;
let confirmado = false;

function barajar(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function elegirPreguntas(lista, cantidad) {
    return barajar(lista).slice(0, cantidad);
}

async function cargarBateria(categoria) {
    const respuesta = await fetch(`${categoria}.json`);
    const bateria = await respuesta.json();
    console.log("Batería cargada:", bateria.titulo, "con", bateria.preguntas.length, "preguntas");
    return bateria;
}

function mostrarPregunta() {
    const actual = preguntas[indice];
    preguntaEl.textContent = actual.pregunta;
    respuestasEl.innerHTML = "";
    elegida = null;
    confirmado = false;
    confirmarBtn.disabled = true;
    confirmarBtn.textContent = "Confirmar";

    actual.respuestas.forEach((texto, i) => {
        const boton = document.createElement("button");
        boton.textContent = texto;
        boton.classList.add("respuesta");
        boton.addEventListener("click", () => seleccionar(i, boton));
        respuestasEl.appendChild(boton);
    });

    actualizarContador();
}

function seleccionar(i, boton) {
    elegida = i;
    document.querySelectorAll(".respuesta").forEach((b) => b.classList.remove("seleccionada"));
    boton.classList.add("seleccionada");
    confirmarBtn.disabled = false;
}

function actualizarContador() {
    contadorEl.textContent = `Pregunta ${indice + 1} de ${preguntas.length} · Puntos: ${puntos}`;
}

function confirmar() {
    if (elegida === null) return;

    const actual = preguntas[indice];
    const botones = document.querySelectorAll(".respuesta");

    botones.forEach((b, i) => {
        b.disabled = true;
        if (i === actual.correcta) {
            b.classList.add("correcta");
        }
    });

    if (elegida === actual.correcta) {
        puntos++;
    } else {
        botones[elegida].classList.add("incorrecta");
    }

    confirmado = true;
    confirmarBtn.textContent = "Siguiente pregunta";
    actualizarContador();
}

function siguientePregunta() {
    indice++;
    if (indice < preguntas.length) {
        mostrarPregunta();
    } else {
        mostrarFinal();
    }
}

function mostrarFinal() {
    juegoEl.hidden = true;
    finalEl.hidden = false;
    puntuacionFinalEl.textContent = `Has acertado ${puntos} de ${preguntas.length}`;
}

if (categoria) {
    cargarBateria(categoria)
        .then((bateria) => {
            titulo.textContent = bateria.titulo;
            preguntas = elegirPreguntas(bateria.preguntas, 10);
            mostrarPregunta();
        })
        .catch(() => {
            preguntaEl.textContent = "No se pudo cargar la batería. ¿Estás usando un servidor local?";
        });
}

confirmarBtn.addEventListener("click", () => {
    if (!confirmado) {
        confirmar();
    } else {
        siguientePregunta();
    }
});
