function exportar(){
    console.log('baixar')    
    let linksUrl = JSON.stringify(links)
    
    const conteudoArquivo = linksUrl; // Conteúdo do arquivo
    
    const blob = new Blob([conteudoArquivo], {type: "text/plain"}); // Cria um objeto Blob com o conteúdo e o tipo do arquivo
    
    const urlArquivo = URL.createObjectURL(blob); // Cria uma URL para o objeto Blob
    
    const linkDownload = document.createElement("a"); // Cria um link para download
    
    linkDownload.href = urlArquivo; // Define a URL de download no link
    
    linkDownload.download = "links.txt"; // Define o nome do arquivo para download
    
    document.body.appendChild(linkDownload); // Adiciona o link ao corpo do documento
    
    linkDownload.click(); // Simula o clique no link para iniciar o download
    
    URL.revokeObjectURL(urlArquivo); // Remove a URL criada para o objeto Blob

}
    
