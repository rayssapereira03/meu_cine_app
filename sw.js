const NOME_CACHE = 'meu-cine-cache-v1';

// 1. Liste aqui todos os arquivos principais que o seu site precisa para funcionar offline
const urlsParaCachear = [
  './index16.html',
  './style16.css', // Substitua pelo nome do seu arquivo CSS, se tiver
  './app16.js', // Substitua pelo nome do seu arquivo JS, se tiver
  './imagens/icon-192x192.png',
  './imagens/icon-512x512.png'
];

// 2. Evento de Instalação: salva os arquivos no cache do navegador

self.addEventListener('install', (evento) => {
  // Diz ao navegador para esperar a promessa interna ser concluída antes de finalizar a instalação
  evento.waitUntil(
    // Abre o cache com o nome especificado (ou cria um novo se não existir)
    caches.open(NOME_CACHE).then((cache) => {
      // Mostra uma mensagem de sucesso no console quando o cache é aberto
      console.log('Arquivos em cache com sucesso');
      // Busca todos os arquivos da lista e guarda no cache, retornando essa promessa
      return cache.addAll(urlsParaCachear);
    })
  );
});

// 3. Evento de Interceptação: responde com os arquivos em cache quando estiver offline

self.addEventListener('fetch', (evento) => {
  // Define de forma personalizada qual resposta será entregue ao navegador para a requisição
  evento.respondWith(
    // Procura no cache se já existe uma resposta guardada para esta requisição específica
    caches.match(evento.request).then((respostaCache) => {
      // Retorna do cache se encontrar (respostaCache), senão busca na rede (fetch)
      return respostaCache || fetch(evento.request);
    })
  );
});