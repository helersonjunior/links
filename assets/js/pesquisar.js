///////////////////////////
//////// Google ///////////
///////////////////////////

const formGoogle = document.getElementById('search-form-google')
const inputGoogle = document.getElementById('search-input-google')

function buscarNoGoogle(){
    if(inputGoogle.value.length > 0){
        const query = inputGoogle.value;
        const url = `https://www.google.com/search?q=${query}`;
    
        // Redirecione o usuário para a página de resultados do Google
        //window.location.href = url;

        // abre a url em uma nova aba 
        window.open(url, '_blank')
    }
}

formGoogle.addEventListener('submit', (e) => {
    e.preventDefault()
    buscarNoGoogle()
})

///////////////////////////
//////// Youtube //////////
///////////////////////////

const formYoutube = document.getElementById('search-form-youtube');
const inputYoutube = document.getElementById('search-input-youtube');

function buscarNoYoutube(){
    if(inputYoutube.value.length > 0){
        const query = inputYoutube.value;
    const url = `https://www.youtube.com/results?search_query=${query}`;

    // Redirecione o usuário para a página de resultados do YouTube
    //window.location.href = url;
    
    window.open(url, '_blank')
    }
}

formYoutube.addEventListener('submit', (e) => {
    e.preventDefault();
    buscarNoYoutube()
});


////---- função de evento 
document.querySelectorAll('.label').forEach(l => {
    l.addEventListener('click', (e)=>{
        if(e.target.htmlFor == 'search-input-google'){
            buscarNoGoogle()
        }
        if(e.target.htmlFor == 'search-input-youtube'){
            buscarNoYoutube()
        }
    })
})

