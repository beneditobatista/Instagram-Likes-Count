const request = require('request-promise');

let dados = [];

const start = async (ultimo, depois, cont) => {
    
    let idInsta = "21898675918";
    let after = depois == "" ? '' : `,"after":"${depois}"`;

    const BASE_URL = `https://www.instagram.com/graphql/query/?query_hash=f045d723b6f7f8cc299d62b57abd500a&variables={"id":"${idInsta}","first":${ultimo}${after}}`;
 
    let response = await request(
        BASE_URL,
        {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
            'cache-control': 'max-age=0',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
        }
    );
    
    let data = JSON.parse(response);
    let posts = data.data.user.edge_owner_to_timeline_media;
    let hasNextPage = posts.page_info.has_next_page;
    let end_cursor = posts.page_info.end_cursor;
   
    posts.edges.forEach(post => {
        if(post.node.edge_media_to_caption.edges[0].node.text.length<30){
         dados[cont] = {"id":cont+1, "nome":post.node.edge_media_to_caption.edges[0].node.text , "likes":post.node.edge_media_preview_like.count }
         cont++;
        }
    });

    if(hasNextPage){
        start('120',end_cursor, cont);
    }else{
        dados.sort(function (a, b) {
            return (a.likes >b.likes) ? -1 : 1;
          });        
          let posicao = 1;
          dados.forEach(dado => { 
            console.log(`${posicao>9?posicao:'0'+posicao} - ${dado.nome} - ${dado.likes} likes`);
            if(posicao==5) console.log('---------------------------------------------');
            posicao++;
          });
    }
}
start('120',"", 0);




