/* Servidor do sistema de carrosséis.
 *
 * Faz duas coisas:
 *   1. serve a pasta do carrossel (para não precisar de outro servidor);
 *   2. recebe um tema pela página e dispara o Claude Code em modo não
 *      interativo (`claude -p`) para escrever o deck dentro do index.html.
 *
 * É isto que torna o botão "Gerar agora" possível: a página sozinha não
 * alcança o Claude, mas este processo alcança.
 *
 * Rodar:  node servidor.js      → http://127.0.0.1:4319
 *
 * Sem dependências de propósito: o projeto não tem node_modules e não vale
 * criar um por causa disto.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORTA = 4319;
const RAIZ = __dirname;
const ARQUIVO = path.join(RAIZ, 'index.html');

const TIPOS = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.json': 'application/json; charset=utf-8'
};

/* uma geração por vez: duas edições simultâneas no mesmo arquivo se atropelam */
let emAndamento = null;

function montarPrompt({ tema, slides, obs }) {
    return `Você vai acrescentar um carrossel ao gerador da Elumina IA.

ARQUIVO: index.html (nesta pasta). Toda a estrutura e as convenções estão
documentadas nos comentários dele — leia antes de escrever.

TAREFA: acrescente uma nova entrada ao objeto DECKS com ${slides} slides sobre:
"${tema}"${obs ? `\n\nOBSERVAÇÕES DO AUTOR: ${obs}` : ''}

REGRAS (todas obrigatórias):
- A Elumina IA atende EXCLUSIVAMENTE corretoras de seguros. Todo o conteúdo
  fala com o dono ou a operação de uma corretora.
- NUNCA cite nome de ferramenta ou integração (nem CRM, multicálculo ou
  seguradora específicos). Fale do que é feito, não de com o quê.
- NUNCA invente estatística, percentual ou pesquisa. Quando precisar de
  comparação, use escala qualitativa (o bloco "barras" aceita rótulos em
  texto) em vez de número inventado.
- O último slide fecha por AUTORIDADE: assenta a ideia, não pede comentário,
  DM nem clique.
- Varie a sequência de blocos em relação aos decks que já existem no arquivo.
  Não repita o mesmo encadeamento de um deck existente.
- Use os blocos e os símbolos que já existem no arquivo. Não invente bloco
  novo nem componente de CSS.
- NÃO altere os decks existentes, o objeto VISUAL, o valor de ATIVO, o CSS
  nem qualquer outra parte do arquivo. Sua única mudança é acrescentar a nova
  entrada dentro de DECKS.
- Português do Brasil, tom sóbrio e concreto. Nada de linguagem de propaganda.

Ao terminar, responda apenas com a chave que você deu ao deck.`;
}

function gerar(pedido) {
    const id = Date.now().toString(36);
    const tarefa = { id, estado: 'gerando', tema: pedido.tema, saida: '', erro: '' };
    emAndamento = tarefa;

    /* argumentos em array e shell:false — o tema vem da página e nunca pode
       ser interpretado como comando */
    const proc = spawn('claude', [
        '-p', montarPrompt(pedido),
        '--permission-mode', 'acceptEdits',
        '--allowedTools', 'Read', 'Edit'
    ], { cwd: RAIZ, shell: false });

    proc.stdout.on('data', d => { tarefa.saida += d; });
    proc.stderr.on('data', d => { tarefa.erro += d; });

    proc.on('error', e => {
        tarefa.estado = 'falhou';
        tarefa.erro = 'não consegui iniciar o claude: ' + e.message;
        emAndamento = null;
    });

    proc.on('close', codigo => {
        tarefa.estado = codigo === 0 ? 'pronto' : 'falhou';
        if (codigo !== 0 && !tarefa.erro) tarefa.erro = 'claude saiu com código ' + codigo;
        emAndamento = null;
    });

    return tarefa;
}

function json(res, status, corpo) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(corpo));
}

const servidor = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/api/gerar' && req.method === 'POST') {
        let corpo = '';
        req.on('data', c => {
            corpo += c;
            if (corpo.length > 8000) req.destroy();       // nada aqui é grande
        });
        req.on('end', () => {
            if (emAndamento) return json(res, 409, { erro: 'já tem uma geração rodando', tarefa: emAndamento });
            let p;
            try { p = JSON.parse(corpo); } catch (e) { return json(res, 400, { erro: 'json inválido' }); }
            const tema = String(p.tema || '').trim().slice(0, 300);
            if (!tema) return json(res, 400, { erro: 'tema vazio' });
            const slides = Math.min(20, Math.max(4, Number(p.slides) || 8));
            const tarefa = gerar({ tema, slides, obs: String(p.obs || '').slice(0, 600) });
            return json(res, 202, { id: tarefa.id, estado: tarefa.estado });
        });
        return;
    }

    if (url.pathname === '/api/status') {
        return json(res, 200, emAndamento
            ? { estado: emAndamento.estado, tema: emAndamento.tema }
            : { estado: 'livre' });
    }

    /* estático, preso à pasta do carrossel */
    let alvo = decodeURIComponent(url.pathname);
    if (alvo === '/' || alvo === '') alvo = '/index.html';
    const caminho = path.join(RAIZ, alvo);
    if (!caminho.startsWith(RAIZ)) { res.writeHead(403); return res.end('fora da pasta'); }

    fs.readFile(caminho, (err, dados) => {
        if (err) { res.writeHead(404); return res.end('não encontrado'); }
        res.writeHead(200, {
            'Content-Type': TIPOS[path.extname(caminho).toLowerCase()] || 'application/octet-stream',
            'Cache-Control': 'no-store'
        });
        res.end(dados);
    });
});

servidor.listen(PORTA, '127.0.0.1', () => {
    console.log(`\n  Sistema de carrosséis  →  http://127.0.0.1:${PORTA}\n`);
    console.log(`  arquivo: ${ARQUIVO}`);
    console.log('  Ctrl+C para parar\n');
});
