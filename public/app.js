const botones = document.querySelector('#botones');
const nombreUsuario = document.querySelector('#nombreUsuario');
const contenidoProtegido = document.querySelector('#contenidoProtegido');
const formulario = document.querySelector('#formulario');
const inputChat = document.querySelector('#inputChat');

firebase.auth().onAuthStateChanged( user => {
    if (user) {
        console.log(user);
        botones.innerHTML = /*html*/`
        <button class="btn btn-outline-danger me-2" id="btnCerrarSesion">Cerrar Sesion</button>
        `;
        nombreUsuario.innerHTML = user.displayName;
        cerrarSesion();
        
        formulario.classList = 'input-group  py-3 fixed-bottom container';
        contenidoChat(user);
    } else {

        console.log('no existe usuario');
        botones.innerHTML = /*html*/`
        <button class="btn btn-outline-success me-2" id="btnAcceder">Acceder</button>
        `;
        iniciarSesion();
        nombreUsuario.innerHTML = 'Chat';
        contenidoProtegido.innerHTML = /*html*/`
            <p class="text-center lead mt-5">Debes iniciar secion</p>
        `;
        formulario.classList = 'input-group  py-3 fixed-bottom container d-none';
    }
});

const iniciarSesion = () =>{
    const btnAcceder = document.querySelector('#btnAcceder')
    btnAcceder.addEventListener('click', async() => {
        //console.log('me diste click en acceder')
        try {
            
            const provider = new firebase.auth.GoogleAuthProvider();
            await firebase.auth().signInWithPopup(provider)

        } catch (error) {
            console.log(error);
        }

    })
}

const cerrarSesion = () => {
    const btnCerrarSesion = document.querySelector('#btnCerrarSesion');
    btnCerrarSesion.addEventListener('click', () => {
        firebase.auth().signOut()
    })
}

const contenidoChat = user => {
    //contenidoProtegido.innerHTML = /*html*/`
    //        <p class="text-center lead mt-5">Bienvenido ${user.email}</p>
    //    ` 

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        //console.log(inputChat.value);
        
       if(!inputChat.value.trim()){
            console.log('input vacio')
            return;
        }

        firebase.firestore().collection('chat').add({
            texto: inputChat.value,
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            photo: user.photoURL,
            fecha: Date.now()
        })
            .then(res => {console.log('mensaje guardado')})
            .catch(e => console.log(e))
        inputChat.value = '';        

    })
    
    firebase.firestore().collection('chat').orderBy('fecha')
        .onSnapshot(query => {
            contenidoProtegido.innerHTML = '';
            query.forEach( doc => {
                console.log(doc.data())
                if(doc.data().uid === user.uid){
                    contenidoProtegido.innerHTML += /*html */`
                    <div class="d-flex d-flex justify-content-end">
                        <span class="badge rounded-pill bg-success">${doc.data().name} ---> </span>
                        <img class="rounded-circle" style="height: 30px" src="${doc.data().photo}">
                        <span class="badge rounded-pill bg-primary">${doc.data().texto}</span>
                    </div>`
                }else{
                    contenidoProtegido.innerHTML += /*html */`
                    <div class="d-flex d-flex justify-content-start">
                        <span class="badge rounded-pill bg-success">${doc.data().name} ---> </span>
                        <img class="rounded-circle" style="height: 30px" src="${doc.data().photo}">
                        <span class="badge rounded-pill bg-secondary">${doc.data().texto}</span>
                    </div>`
                }
                contenidoProtegido.scrollTop = contenidoProtegido.scrollHeight;
            });
        })


}