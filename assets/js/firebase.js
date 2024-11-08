const firebaseConfig = {
    apiKey: "AIzaSyB22HTT47-nr0zq-oSAdvzpoEklHHiyfSI",
    authDomain: "base-d60db.firebaseapp.com",
    projectId: "base-d60db",
    storageBucket: "base-d60db.appspot.com",
    messagingSenderId: "669011923416",
    appId: "1:669011923416:web:f3a5981a354d99e80a62ad",
    measurementId: "G-T5XYFJTTF3"
}

const spanInfo = document.querySelector('.spanInfo')
let db

try {
    ///// Initialize Firebase
    firebase.initializeApp(firebaseConfig)
    db = firebase.firestore()
} catch (error) {
    console.log(error)
}


////---- Limpa o campo de spanInfo
function hidenSpanInfo(){
    setTimeout(()=>{
        spanInfo.innerText=''
    },3000)
}

////---- Envia o Array para o Firestore
function nuvem() {

    let linksUrl = JSON.stringify(getLocalStorage())
    
    if (linksUrl) {

        try {
            // Referência ao documento de contagem de refreshes
            const linksRef = db.collection('pagina_links').doc('links')

            // Incrementar contador de refreshes
            linksRef.get().then(doc => {
                if (doc.exists) {
                    linksRef.update({ links: linksUrl }).then(
                        spanInfo.innerText = 'Salvo',
                        hidenSpanInfo()
                    )
                } else {
                    linksRef.set({ links: linksUrl })
                    spanInfo.innerText = 'Salvo'
                }
            }).catch(error => {
                console.log("Erro ao acessar o Firestore:", error)
                spanInfo.innerText = 'Erro ao acessar'
                hidenSpanInfo()
            })
        } catch (error) {
            console.log(error)
            spanInfo.innerText = 'Error'
            hidenSpanInfo()
        }
    }
}

////---- baixa o array do firestore 
function buscarFirebase() {
    let carregando = document.querySelector('.carregando')
    let resposta = document.querySelector('.resposta')
    //let incorporar = document.querySelector('.incorporar')

    carregando.style.display = 'block'
    resposta.style.display = 'none'
    //incorporar.style.display = 'none'

    try {
        // Referência ao documento específico que você deseja ler (substitua 'suaColecao' pelo nome da sua coleção e 'seuDocumento' pelo ID do documento)
        const documentRef = db.collection('pagina_links').doc('links')

        // Ler o documento
        documentRef.get()
            .then((docSnapshot) => {
                if (docSnapshot.exists) {
                    // O documento existe
                    carregando.style.display = 'none'
                    resposta.innerText = docSnapshot.data().links
                    resposta.style.display = 'flex'
                    links = docSnapshot.data().links
                    //incorporar.style.display = 'flex'
                } else {
                    // O documento não existe
                    carregando.style.display = 'none'
                    resposta.innerText = 'O documento não foi encontrado'
                    resposta.style.display = 'flex'
                    console.log("O documento não foi encontrado.")
                }
            })
            .catch((error) => {
                carregando.style.display = 'none'
                resposta.innerText = error
                resposta.style.display = 'flex'
                console.error("Erro ao ler documento:", error)
            })
    } catch (error) {
        console.log(error)
        carregando.style.display = 'none'
        resposta.innerText = error
        resposta.style.display = 'flex'
    }
}

////---- Setar na LocalStorage
function incorporar() {
    //localStorage.setItem('urls', links)
    window.location.href = "index.html";
}