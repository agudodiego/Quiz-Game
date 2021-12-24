// "use strict"


const $game = document.getElementById("game");
const $loader = document.getElementById("loader");
const $contPreguntasText = document.getElementById("contPreguntas");
const $puntajeText = document.getElementById("puntaje");
const $pregunta = document.getElementById("question");
const $opcion = Array.from(document.getElementsByClassName("choice-text"));
// getElementsByClassName me devuelve un html collection con TODOS los 
// elementos que compartan la clase en cuestion.
// Para poder usar esa collection debo transformarla en un array con Array.from()
// console.log($choices) 

let preguntaEnPantalla = {}; // guarda la pregunta que se esta haciendo
let aceptoRespuesta = false; // bandera para controlar los clicks del jugador
let puntuacion = 0;
let contadorDePreguntas = 0; // controla la cantidad de preguntas que se van haciendo
let preguntasDisponibles = []; // guarda las preguntas que obtengo de la API

//********************** Parte donde hago el FETCH ************************ */
// Creo el array que va a contener las preguntas con el formato adecuado
let preguntas = [];

fetch("https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple")
    .then(resp => {return resp.json()}) //convirto la respuesta promesa
    .then(preguntasFetch => { //aca ya puedo acceder a los datos
        // console.log(preguntasFetch.results);
        // Tengo que convertir las preguntas al formato que vengo trabajando
        
        // Formato Valido
        //   {
            //     "question": "Inside which HTML element do we put the JavaScript??",
            //     "choice1": "<script>",
            //     "choice2": "<javascript>",
            //     "choice3": "<js>",
            //     "choice4": "<scripting>",
            //     "answer": 1
            //   }
            
        // para ello uso el metodo .map() para iterar sobre el array formateando luego cada pregunta
        preguntas = preguntasFetch.results.map( preguntaFetch => {
            // Creo un objeto que dentro del atributo question va a guardar la pregunta en cuestion
            const preguntaFormateada = {
                question: preguntaFetch.question
            }

            // por otro lado debo guardarme las opciones de respuesta en un array
            const opcionesRespuesta = [...preguntaFetch.incorrect_answers];

            // Ahora debo darle un numero random a la pregunta VALIDA ya que sino apareceria siempre en la misma posicion
            // y se la agrego al objeto como la propiedad "answer"
            preguntaFormateada.answer = Math.floor(Math.random()*3 + 1); //sumo 1 xq necesito del 1 al 4

            // En la siguiente linea meto la preg correcta dentro del array en una pos. aleatoria.
            // "preguntaFormateada.answer -1" si el num. aleatorio es 3 => 3-1 = 2, comienza en 2 (evitando 
            //  asi la posicion 0, -1 hace que comience dsd el final del array)
            opcionesRespuesta.splice(preguntaFormateada.answer -1, 0, preguntaFetch.correct_answer);

            // Por ultimo itero a traves de "opcionesRespuesta"
            // agregando el atributo "choice+(un numero)"
            opcionesRespuesta.forEach((opcion, index) => {
                preguntaFormateada["choice" + (index+1)] = opcion;
            })
            return preguntaFormateada
        })
        
        comenzarJuego(); // Una vez cargadas las preguntas invoco a la funcion
    }) 
    .catch(err => console.log("Hubo un error al cargar la pagina", err));

//************************************************************************* */

// CONSTANTES
const PREGUNTA_CORRECTA = 10;
const MAX_PREGUNTAS = 3;

const comenzarJuego = () => {
    contadorDePreguntas = 0;
    puntuacion = 0;
    preguntasDisponibles = [...preguntas];
    //Mientras que el operador rest genera un array a partir de una lista de valores, el operador spread genera una lista de valores a partir de un array.
    //El rest operator lo usas en la cabecera de una función, al implementarla y el spread operator lo usas en la invocación.
    // console.log(preguntasDisponibles);
    obtenerNuevaPregunta();
    $game.classList.remove("hidden"); //podria usar toggle tmb en ambos casos
    $loader.classList.add("hidden");
};

const obtenerNuevaPregunta = () => {
    
    // Valido que haya preguntas en el array y que el contador no haya llegado a la cantidad maxima
    // de lo contrario me lleva a la pagina END
    if (preguntasDisponibles.length === 0 || contadorDePreguntas >= MAX_PREGUNTAS) {
        localStorage.setItem("ultimaPuntuacion",puntuacion); 
        // El localStorage.setItem espera 2 parametros 1° el identificador, 2° el valor (siendo éste un STRING)
        return window.location.assign("/end.html")
    }

    contadorDePreguntas++;
    $contPreguntasText.innerText = `${contadorDePreguntas} / ${MAX_PREGUNTAS}`;
    const preguntaIndex = Math.floor(Math.random() * preguntasDisponibles.length);
    // Genero un indice para obtener una pregunta al azar, para eso multiplico por la cantidad 
    // de preguntas disponibles 

    preguntaEnPantalla = preguntasDisponibles[preguntaIndex];
    $pregunta.innerText = preguntaEnPantalla.question;

    $opcion.forEach(choice => {
        const num = choice.dataset["number"]; // Accedo al data-number en la etiqueta html
        choice.innerText = preguntaEnPantalla["choice" + num]; // El atributo es choice1, choice2, choice3,...etc.
    });

    preguntasDisponibles.splice(preguntaIndex, 1);
    // .splice modifica el contenido de un array agregando o quitando elementos
    // el 1° param. es el indice donde comienza y el 2° indica la cantidad de elementos a borrar
    // console.log(preguntasDisponibles);

    aceptoRespuesta = true;
};

const actualizarPuntuacion = () => {
    puntuacion += PREGUNTA_CORRECTA;
    $puntajeText.innerText = puntuacion;
};

$opcion.forEach(opcion => {
    opcion.addEventListener("click", (e) => {
        if (!aceptoRespuesta) return;

        aceptoRespuesta = false;
        // Si antes estaba en true la pongo en false para evitar la seleccion de rstas multiples
        const opcionElegida = e.target;
        const respuestaElegida = opcionElegida.dataset["number"];

        // Le aplico la clase correcta o incorrecta al elemento html
        // en funcion de que el dataset[number] coincida con la rsta correcta (preguntaEnPantalla.answer)
        let claseParaAplicar = "incorrect";
        if (respuestaElegida == preguntaEnPantalla.answer) { // Uso == porque uno es un string y el otro un number
            claseParaAplicar = "correct";
            actualizarPuntuacion();
        }
        opcionElegida.parentElement.classList.add(claseParaAplicar);

        // En el siguiente timeout lo que logro es mostrar el resultado durante 1.5seg
        // ya que de otra forma el jugador no tendria feedback
        setTimeout(() => {
            opcionElegida.parentElement.classList.remove(claseParaAplicar);
            obtenerNuevaPregunta();
        }, 1500)
    })
});




