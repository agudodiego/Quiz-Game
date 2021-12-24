const $btnGuardar = document.getElementById("btnGuardar");
const $username = document.getElementById("username");
const $puntajeFinal = document.getElementById("puntajeFinal");
const ultimaPuntuacion = localStorage.getItem("ultimaPuntuacion");
// Recupero el valor guardado previamente en el localStorage
const puntuacionesMasAltas = JSON.parse(localStorage.getItem("puntuacionesMasAltas")) || [];
// Si es la primera vez que jugamos no va a devolver ningun array entonces lo creamos

const MAX_CANT_PUNTAJES = 5;

$puntajeFinal.innerText = ultimaPuntuacion;
$btnGuardar.addEventListener("click",(e)=>{

    if($username.value === ""){
        alert("Debes ingresar un nombre para guardad el PUNTAJE");
    }else{
        // Creo el objeto puntaje que voy a ir metiendo en el array de puntuacionesMasAltas
        const Puntaje = {
            puntaje: ultimaPuntuacion,
            usuario: $username.value
        };

        puntuacionesMasAltas.push(Puntaje);
        // Meto el objeto dentro del array puntuacionesMasAltas

        puntuacionesMasAltas.sort((p1,p2) => {
            return p1.puntaje - p2.puntaje;
        })
        // con sort() ordeno el arreglo, devolviendo num negativo (<), cero (=) o num positivo (>)
        // usando una funcion de comparacion
        
        puntuacionesMasAltas.splice(MAX_CANT_PUNTAJES);
        // Corta el array desde la posicion maxima de puntajes a mostrar
        
        localStorage.setItem("puntuacionesMasAltas", JSON.stringify(puntuacionesMasAltas));
        // Meto el array cargado y ordenado en el localStorage

        $username.value = "";
        window.location.assign("/");
    }
    e.preventDefault(); 
    // esto hace q la pagina no se recargue automaticamente (por accion del submit)

    
})