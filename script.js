const TOTAL_PREGUNTAS = 10;
const TIEMPO_DEL_JUEGO = 300;
const bd_juego = [
    {
        id:'A',
        pregunta:"¿Cómo se llama el sentimiento que tienes cuando algo te asusta y tu corazón late rápido, como cuando ves una película de monstruos?",
        respuesta:"miedo"
    },
    {
        id:'B',
        pregunta:"¿Cuál es el nombre de la emoción que sientes cuando alguien te hace reír mucho y te sientes muy feliz?",
        respuesta:"felicidad"
    },
    {
        id:'C',
        pregunta:"¿Cómo se llama la emoción que experimentas cuando has hecho algo bueno y te sientes orgulloso de ti mismo?",
        respuesta:"orgullo"
    },
    {
        id:'D',
        pregunta:"Cuando haces algo mal y te sientes mal por ello, ¿qué emoción estás experimentando?",
        respuesta:"culpa"
    },
    {
        id:'E',
        pregunta:"¿Cuál es el nombre de la emoción que sientes cuando alguien te ha hecho daño o te han molestado?",
        respuesta:"enojo"
    },
    {
        id:'F',
        pregunta:"Cuando alguien te trata amablemente y te sientes agradecido, ¿qué emoción estás experimentando?",
        respuesta:"agradecimiento"
    },
    {
        id:'G',
        pregunta:"Si algo te preocupa mucho y no puedes dejar de pensar en ello, ¿qué emoción estás sintiendo?",
        respuesta:"preocupacion"
    },
    {
        id:'H',
        pregunta:"¿Cuál es el sentimiento que enfrentas a algo nuevo y emocionante que nunca has experimentado antes?",
        respuesta:"emocion"
    },
    {
        id:'I',
        pregunta:"¿Cuál es el nombre de la emoción que sientes cuando algo te impresiona?",
        respuesta:"sorpresa"
    },
    {
        id:'J',
        pregunta:"Cuando te sientes avergonzado o humillado por algo que has hecho, ¿qué emoción estás experimentando?",
        respuesta:"verguenza"
    },
];

// Variables globales
var estadoPreguntas = Array(TOTAL_PREGUNTAS).fill(0);
var cantidadAcertadas = 0;
var numPreguntaActual = -1;
let tiempoInicio;  // Variable para capturar el tiempo de inicio

const timer = document.getElementById("tiempo");
let timeLeft = TIEMPO_DEL_JUEGO;
var countdown;

var comenzar = document.getElementById("comenzar");
comenzar.addEventListener("click", function(event) {
    var nombreJugador = document.getElementById("nombre").value.trim();

    if (nombreJugador) {
        tiempoInicio = Date.now(); // Capturar el tiempo de inicio del juego
        document.getElementById("pantalla-inicial").style.display = "none";
        document.getElementById("pantalla-juego").style.display = "block";
        largarTiempo();
        cargarPregunta();
    } else {
        alert("Por favor, ingresa tu nombre antes de comenzar el juego.");
    }
});

const container = document.querySelector(".container");
for (let i = 0; i < TOTAL_PREGUNTAS; i++) {
    const circle = document.createElement("div");
    circle.classList.add("circle");
    circle.textContent = String.fromCharCode(i + 65); // Letras de A a J
    circle.id = String.fromCharCode(i + 65);
    container.appendChild(circle);

    const angle = ((i) / TOTAL_PREGUNTAS) * Math.PI * 2 - (Math.PI / 2);
    const x = Math.round(95 + 120 * Math.cos(angle));
    const y = Math.round(95 + 120 * Math.sin(angle));
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
}

function cargarPregunta() {
    numPreguntaActual++;

    if (numPreguntaActual >= TOTAL_PREGUNTAS) {
        numPreguntaActual = 0;
    }

    if (estadoPreguntas.indexOf(0) >= 0) {
        while (estadoPreguntas[numPreguntaActual] === 1) {
            numPreguntaActual++;
            if (numPreguntaActual >= TOTAL_PREGUNTAS) {
                numPreguntaActual = 0;
            }
        }

        document.getElementById("letra-pregunta").textContent = bd_juego[numPreguntaActual].id;
        document.getElementById("pregunta").textContent = bd_juego[numPreguntaActual].pregunta;
        var letra = bd_juego[numPreguntaActual].id;
        document.getElementById(letra).classList.add("pregunta-actual");
    } else {
        clearInterval(countdown);
        mostrarPantallaFinal();
    }
}

var respuesta = document.getElementById("respuesta");
respuesta.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        if (respuesta.value === "") {
            alert("Debe ingresar un valor!!");
            return;
        }

        var txtRespuesta = respuesta.value;
        controlarRespuesta(txtRespuesta.toLowerCase());
    }
});

function controlarRespuesta(txtRespuesta) {
    if (txtRespuesta === bd_juego[numPreguntaActual].respuesta) {
        cantidadAcertadas++;

        estadoPreguntas[numPreguntaActual] = 1;
        var letra = bd_juego[numPreguntaActual].id;
        document.getElementById(letra).classList.remove("pregunta-actual");
        document.getElementById(letra).classList.add("bien-respondida");
    } else {
        estadoPreguntas[numPreguntaActual] = 1;
        var letra = bd_juego[numPreguntaActual].id;
        document.getElementById(letra).classList.remove("pregunta-actual");
        document.getElementById(letra).classList.add("mal-respondida");
    }
    respuesta.value = "";
    cargarPregunta();
}

var pasar = document.getElementById("pasar");
pasar.addEventListener("click", function(event) {
    var letra = bd_juego[numPreguntaActual].id;
    document.getElementById(letra).classList.remove("pregunta-actual");

    cargarPregunta();
});

function largarTiempo() {
    countdown = setInterval(() => {
        timeLeft--;

        timer.innerText = timeLeft;

        if (timeLeft < 0) {
            clearInterval(countdown);
            mostrarPantallaFinal();
        }
    }, 1000);
}

function mostrarPantallaFinal() {
    let tiempoFin = Date.now();  // Capturar el tiempo de finalización
    let duracionJuego = Math.floor((tiempoFin - tiempoInicio) / 1000);  // Calcular la duración del juego en segundos

    document.getElementById("acertadas").textContent = cantidadAcertadas;
    document.getElementById("score").textContent = (cantidadAcertadas * 100) / TOTAL_PREGUNTAS + "% de acierto";
    document.getElementById("pantalla-juego").style.display = "none";
    document.getElementById("pantalla-final").style.display = "block";

    // Llamada al servidor para guardar los datos en la base de datos
    var nombreJugador = document.getElementById("nombre").value.trim();
    guardarResultados(nombreJugador, cantidadAcertadas, duracionJuego, 1); // Pasar la duración y el ID del usuario
}

function guardarResultados(nombreJugador, cantidadAcertadas, duracionJuego, usuarioId) {
    if (typeof cantidadAcertadas !== "number" || isNaN(cantidadAcertadas)) {
        console.error("El número de aciertos debe ser un valor numérico.");
        return;
    }

    const resultadoJuego = cantidadAcertadas >= 3 ? "Gané" : "Perdí";

    fetch('https://localhost:7120/api/juego/guardarResultado', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Nombre: nombreJugador,
            Duracion: duracionJuego,  // Duración capturada dinámicamente del juego
            Resultado: resultadoJuego,
            UsuarioId: usuarioId
        })
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then(errorData => {
                    throw new Error(`Error al guardar los resultados: ${errorData.errors.Resultado}`);
                });
            }
        })
        .then(data => {
            console.log("Resultado guardado exitosamente:", data);
        })
        .catch(error => {
            console.error("Error:", error.message);
        });
}

// Reiniciar el juego
var recomenzar = document.getElementById("recomenzar");
recomenzar.addEventListener("click", function(event) {
    location.reload(); // Recargar la página para reiniciar el juego
});
