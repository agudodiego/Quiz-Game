const $listadoPuntajes = document.getElementById("listadoPuntajes");
const $btnReiniciar = document.getElementById("btnReiniciar");
const fragment = document.createDocumentFragment();
// creo un fragment para cargar todo el contenido de una sola vez
const dataBase = JSON.parse(localStorage.getItem("puntuacionesMasAltas")) || [];
// me traigo lo que esta en el localStorage y lo convierto a un array JSON.parse

dataBase.reverse();
// invierto el array para que queden los scores mas altos arriba

dataBase.forEach(jugador => {
    const $li = document.createElement("li");
    const $divNombre = document.createElement("div");
    const $divPuntos = document.createElement("div");
    $divNombre.innerText = jugador.usuario;
    $divPuntos.innerText = jugador.puntaje;
    $li.appendChild($divNombre);
    $li.appendChild($divPuntos);
    fragment.appendChild($li);    
});

$listadoPuntajes.appendChild(fragment);

$btnReiniciar.addEventListener("click", () => {
    localStorage.clear();
    // Limpia todo el local storage
    window.location.reload();
})
