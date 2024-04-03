let formLink = document.getElementById('search-form-link')
let inputLink = document.getElementById('search-input-link')
let select = document.getElementById('chave')
let endereco = document.getElementById('endereco')
let section = document.getElementById('section')
let links

///////////////////////////////////
////////// local storage //////////
///////////////////////////////////

async function getLocalStorage() {    
    try {
        const documentRef = await db.collection('pagina_links').doc('links')
        // Ler o documento
        documentRef.get()
            .then((docSnapshot) => {
                if (docSnapshot.exists) {
                    // O documento existe
                    //console.log(docSnapshot.data().links)
                    links = JSON.parse(docSnapshot.data().links)
                    load()
                } else {
                    console.log("O documento não foi encontrado.")
                }
            })
            .catch((error) => {
                console.log("Erro ao ler documento:", error)
            })
    } catch (error) {
        console.log(error)
    }
}

async function salvarLocalStorare() {

    if (links) {

        try {
            // Referência ao documento de contagem de refreshes
            const linksRef = await db.collection('pagina_links').doc('links')

            // Incrementar contador de refreshes
            linksRef.get().then(doc => {
                if (doc.exists) {
                    linksRef.update({ links: JSON.stringify(links)}).then(
                        spanInfo.innerText = 'Salvo',
                        hidenSpanInfo(),
                        getLocalStorage()
                    )
                } else {
                    linksRef.set({ links: JSON.stringify(links) })
                    spanInfo.innerText = 'Salvo'
                }
            }).catch(error => {
                console.log("Erro ao acessar o Firestore:", error)
                spanInfo.innerText = 'Erro ao acessar'
            })
        } catch (error) {
            console.log(error)
            spanInfo.innerText = 'Error'
            hidenSpanInfo()
        }
    }
}

///////////////////////////////////
////// Load Add Criar Deletar /////
///////////////////////////////////

////---- função inicial que adiciona os dados na tela
async function load() {
    console.log("inicio")
    section.innerHTML = ""
    select.innerHTML = ""
    links.forEach((item, index) => {
        section.innerHTML += `
        <div id="${index}" class="card">
          <h3>${item.name} <span onclick="mudarIndex(${index})">&#8657;</span></h3>
         
          <ul class="ul" id="${index}">
          </ul>
        </div>
        `
        select.innerHTML += `<option value="${index}">${item.name}</option>`
    })

    let uls = document.querySelectorAll('.ul')
    uls.forEach(ul => {

        links[ul.id].urls.forEach((url, index) => {

            ul.innerHTML +=
                `<li class='li'><a href="http://${url}" target="blank">${url}</a><button class='btn' onClick="openModal([${ul.id},${index}])">x</button> </li>`
        })
    })
    atribuirEventosDeClique()
}

////---- função que cria um novo objeto com propriedades name e urls
function criar() {
    let novoBloco = document.getElementById('novoBloco')
    let novaUrl = document.getElementById('novaUrl')

    if (novoBloco.value.trim() != "" && novaUrl.value.trim() != '') {

        links.push(
            {
                name: novoBloco.value,
                urls: [novaUrl.value]
            })
        novoBloco.value = ''
        novaUrl.value = ''
        salvarLocalStorare()
    }
}

////---- função que adiciona uma url no objeto selecionado na propriedade urls
function add() {
    if (endereco.value.trim() != '' && select.value.trim() != "") {
        links[select.value].urls.push(endereco.value)
        console.log('adicionado', endereco.value)
        endereco.value = ''
        salvarLocalStorare()
    }
}

////---- função que deleta uma url
function deletar() {
    let valor = document.querySelector('.modal2')

    let n1 = valor.id[0]
    let n2 = valor.id[2]

    // console
    console.log('excluido', links[n1].urls[n2])

    // exclui uma url
    links[n1].urls.splice(n2, 1)

    // exclui a propriedade urls 
    if (links[n1].urls.length == 0) {
        links.splice(n1, 1)
    }

    document.querySelector('.containerModal-2').style.display = 'none'
    salvarLocalStorare()
}

///////////////////////////////////
////////////// Menu ///////////////
///////////////////////////////////

////---- função menu toggle mostra e esconde o menu
function menu() {

    let back = document.querySelector('.dropdown-menu li a')
    back.classList.toggle('back')

    if (back.innerHTML == 'X') {
        back.innerHTML = '&#9776;'
        back.style.fontSize = '18px'
    } else {
        back.innerHTML = 'X'
        back.style.fontSize = '14px'
    }

    let mostar = document.querySelector('.dropdown-submenu')
    mostar.classList.toggle("hide")
}

///////////////////////////////////
////////// Modal de Excluir ///////
///////////////////////////////////

////---- função para abrir modal - adcionar id no modal2
function openModal(valor) {
    document.querySelector('.containerModal-2').style.display = 'flex'
    document.querySelector('.modal2').id = valor
    document.querySelector('.modal2 button').focus()
}

////---- função para fechar modal - remover id
function fechar() {
    document.querySelector('.containerModal-2').style.display = 'none'
    document.getElementById('select').style.backgroundColor = ''
    document.getElementById('select').removeAttribute('id')
}

////---- função de evento para fechar o modal de exclusão
document.querySelector('.containerModal-2').addEventListener('click', (e) => {
    if (e.target.classList.contains("containerModal-2")) {
        e.target.style.display = 'none'
        document.getElementById('select').style.backgroundColor = ''
        document.getElementById('select').removeAttribute('id')
    }
})

///////////////////////////////////
////// Modal de importar txt///////
///////////////////////////////////

const modal = document.querySelector('.containerModal-1')

////---- função para abrir o modal
function importar(){
    modal.style.display = 'flex'
}
 
////---- função para ler o arquivo txt
function lerArquivo() {
    var input = document.getElementById("input-file");
    var file = input.files[0];
    console.log("name", file)
    if(file.name == "links.txt"){
    console.log("Importado com sucesso")
         var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function() {
          var conteudo = reader.result;
          links = JSON.parse(conteudo)
        } 
        salvarLocalStorare()
        modal.style.display = 'none'
    }else{
        alert('arquivo invalido')
    }
   
}

////---- função de evento para esconder modal
modal.addEventListener('click', (e)=> {
    if(e.target.classList.contains("containerModal-1")){
        modal.style.display = 'none'
    }
})

///////////////////////////////////
////// Pesquisar - Filtar//////////
///////////////////////////////////

////---- função para Filtrar links 
function pesquisarUrl(search) {
    console.log(search.toLowerCase())
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {

        let lis = card.querySelectorAll('li')
        lis.forEach((li) => {
            const liTitle = li.innerText.toLowerCase();

            li.style.display = 'flex'

            if (!liTitle.includes(search.toLowerCase())) {
                li.style.display = "none";
            }

            let s = window.getComputedStyle(li)
            let numChildren = s.flex.split(' ').length
        })
    })
    quadro()
}

////---- função que adiciona Display flex ou None ao fazer pesquisa 
function quadro() {
    //---- Seleciona a ul
    const uls = document.querySelectorAll('.ul');

    uls.forEach((ul) => {
        //---- Seleciona todos os elementos li dentro da ul
        const liList = ul.querySelectorAll('li');

        let count = 0

        // Percorre a lista de elementos li e verifica se o display é flex
        for (let i = 0; i < liList.length; i++) {
            if (window.getComputedStyle(liList[i]).display === 'flex') {
                count++;
            }
        }

        if (count > 0) {
            ul.parentNode.style.display = 'block'
        }
        if (count < 1) {
            ul.parentNode.style.display = 'none'
        }
        //console.log("contagem", count); // exibe a quantidade de elementos li com display flex
    })
}


////---- função de evento para filtrar urls
inputLink.addEventListener('input', () => { pesquisarUrl(inputLink.value) })


///////////////////////////////////
////////// Seleciona Li ///////////
///////////////////////////////////

////---- função que Seleciona a Li
function selecionado(e) {
    e.target.parentNode.id = 'select'
    e.target.parentNode.style.backgroundColor = 'rgb(238, 88, 88)'
}

////---- função que remove e adiciona evento
function atribuirEventosDeClique() {
    let btns = document.querySelectorAll('.btn')
    btns.forEach(btn => {
        btn.removeEventListener('click', selecionado); // Remove o evento de clique, se existir
        btn.addEventListener('click', selecionado); // Adiciona o evento de clique novamente
    });
}

function mudarIndex(index){
    console.log('Index', index)
    if(index > 0){ 
    let primeiro = links[index -1]
    let selecionado = links[index]

    links[index - 1] = selecionado
    links[index] = primeiro

    console.log(links)

    salvarLocalStorare()
    }
}

getLocalStorage()


