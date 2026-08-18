// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        const isClosed = mobileMenu.classList.contains('opacity-0') || mobileMenu.classList.contains('hidden');
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.toggle('opacity-0', !isClosed);
        mobileMenu.classList.toggle('-translate-y-4', !isClosed);
        mobileMenu.classList.toggle('pointer-events-none', !isClosed);
        mobileMenuBtn.setAttribute('aria-expanded', String(isClosed));
        mobileMenuBtn.setAttribute('aria-label', isClosed ? 'Fechar menu' : 'Abrir menu');
        mobileMenuBtn.innerHTML = `<i data-lucide="${isClosed ? 'x' : 'menu'}" class="w-7 h-7"></i>`;
        lucide.createIcons();
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Abrir menu');
        mobileMenuBtn.innerHTML = '<i data-lucide="menu" class="w-7 h-7"></i>';
        lucide.createIcons();
    });
});

// ── Fundo do hero: shader "Silk" ─────────────────────────────────────────
// Guardado em window para dar para inspecionar o desenho pelo console.
(() => {
    if (typeof iniciarHeroSilk !== 'function') return;
    window.heroSilk = iniciarHeroSilk('.hero-premium');
})();

// Pill navbar: permanece disponível em toda a home e fica mais compacta depois
// da hero. Assim o visitante mantém acesso às seções e ao contato sem perder
// espaço útil durante a leitura da página.
const navPillWrap = document.querySelector('.nav-pill-wrap');
const navPillHero = document.querySelector('.hero-premium');
if (navPillWrap && navPillHero) {
    const syncPill = () => {
        const compactAfter = Math.max(80, navPillHero.offsetHeight - 100);
        navPillWrap.classList.toggle('nav-pill-compact', window.scrollY > compactAfter);
    };
    syncPill();
    window.addEventListener('scroll', syncPill, { passive: true });
    window.addEventListener('resize', syncPill, { passive: true });
}

// Hero: efeito de rotação na palavra de destaque ("avançar." → "evoluir." → "decolar.").
const heroRotate = document.querySelector('.hero-rotate');
if (heroRotate) {
    const rotateWords = [...heroRotate.querySelectorAll('.hero-rotate-word')];
    let rotateIndex = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (rotateWords.length > 1 && !reduceMotion) {
        setInterval(() => {
            rotateWords[rotateIndex].classList.remove('is-active');
            rotateIndex = (rotateIndex + 1) % rotateWords.length;
            rotateWords[rotateIndex].classList.add('is-active');
        }, 2600);
    }
}

// Modal Logic
let activeModal = null;
let modalReturnFocus = null;

function getModalFocusable(modal) {
    return [...modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter(element => !element.hasAttribute('hidden'));
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modalReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        activeModal = modal;
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.setAttribute('aria-hidden', 'false');
        const child = modal.firstElementChild;
        child.classList.remove('scale-95');
        child.classList.add('scale-100');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
            const [firstFocusable] = getModalFocusable(modal);
            (firstFocusable || modal).focus();
        });
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('opacity-0', 'pointer-events-none');
        modal.setAttribute('aria-hidden', 'true');
        const child = modal.firstElementChild;
        child.classList.remove('scale-100');
        child.classList.add('scale-95');
        document.body.style.overflow = '';
        if (activeModal === modal) {
            activeModal = null;
            const returnFocus = modalReturnFocus;
            modalReturnFocus = null;
            requestAnimationFrame(() => returnFocus?.focus());
        }
    }
}

window.onclick = function (event) {
    if (event.target.id && event.target.id.startsWith('modal-')) {
        closeModal(event.target.id);
    }
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && activeModal) {
        closeModal(activeModal.id);
        return;
    }

    if (event.key === 'Tab' && activeModal) {
        const focusable = getModalFocusable(activeModal);
        if (!focusable.length) {
            event.preventDefault();
            activeModal.focus();
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }
});

// --- BLOG SYSTEM LOGIC ---

// Fallback data in case fetch fails (common in local environments/CORS)
const LEGACY_FALLBACK_POSTS = [
    {
        "id": 4,
        "title": "Elumina Clínicas: IA em Diagnósticos e Busca de CIDs",
        "slug": "ia-medicina-diagnostico-cid-2026",
        "date": "2026-01-06",
        "image": "assets/LOGOTIPO.jpg",
        "icon": "stethoscope",
        "summary": "Saiba como o Elumina Clínicas usa IA para reduzir faltas, automatizar a busca de CIDs e auxiliar no suporte ao diagnóstico médico.",
        "content": "<p>Em 2026, a Inteligência Artificial deixou de ser uma promessa para se tornar o braço direito dos profissionais de saúde de elite. O <strong>Elumina Clínicas</strong> surge como a solução definitiva para escalar resultados com precisão.</p><h3>Apoio ao Diagnóstico e Precisão Clínica</h3><p>Nossas soluções atuam como um copiloto para o médico. A IA analisa padrões em exames e históricos, auxiliando na detecção de sutilezas que poderiam passar despercebidas em rotinas exaustivas.</p><h3>Agilidade na Busca de CIDs</h3><p>Sabemos que o tempo gasto procurando códigos de doenças é um gargalo. Com nossa busca semântica, o médico descreve o quadro e a IA sugere instantaneamente o <strong>CID</strong> mais preciso, devolvendo tempo para o que realmente importa: o paciente.</p><h3>Resultados na Gestão</h3><p>Além do suporte clínico, mantemos a eficiência da agenda com confirmações inteligentes que reduzem o absenteísmo em até 40%.</p>"
    },
    {
        "id": 1,
        "title": "Redução de tarefas manuais",
        "slug": "reducao-de-tarefas-manuais",
        "date": "2026-01-05",
        "image": "assets/blog-1.jpg",
        "icon": "bar-chart-3",
        "summary": "Descubra como a automação pode liberar sua equipe para focar no que realmente importa.",
        "content": "<p>Em um cenário empresarial cada vez mais competitivo, a eficiência operacional não é apenas um diferencial, mas uma necessidade de sobrevivência...</p>"
    },
    {
        "id": 2,
        "title": "Automação no WhatsApp",
        "slug": "automacao-no-whatsapp",
        "date": "2026-01-03",
        "image": "assets/blog-2.jpg",
        "icon": "message-square",
        "summary": "Transforme o WhatsApp em uma máquina de vendas e atendimento eficiente.",
        "content": "<p>O WhatsApp é a ferramenta de comunicação mais utilizada no Brasil, mas gerenciar centenas de conversas manualmente é impossível...</p>"
    },
    {
        "id": 3,
        "title": "Case MedX: Redução de faltas",
        "slug": "case-medx-reducao-de-faltas",
        "date": "2025-12-28",
        "image": "assets/blog-3.jpg",
        "icon": "file-check",
        "summary": "Como a clínica MedX reduziu em 40% o número de faltas com lembretes inteligentes.",
        "content": "<p>O absenteísmo é um dos maiores gargalos de faturamento para clínicas e consultórios...</p>"
    }
];

const FALLBACK_POSTS = [
    {
        id: 206,
        title: "Antes da IA: como mapear um processo que realmente merece automação",
        slug: "mapear-processo-antes-da-ia",
        date: "2026-07-30",
        icon: "scan-line",
        summary: "Um roteiro prático para separar gargalo, exceção e regra de negócio antes de escolher qualquer tecnologia.",
        content: "<p>Automação começa com observação. Antes de escolher uma ferramenta, é preciso entender o que dispara o processo, quem decide, quais informações circulam e onde surgem as exceções.</p><h2>Comece pelo evento</h2><p>Todo fluxo tem um ponto de partida: uma mensagem, uma solicitação, uma mudança de status ou uma tarefa recorrente.</p><h2>Desenhe decisões e exceções</h2><p>Liste o que acontece quando faltam dados, quando uma regra não é atendida ou quando a decisão precisa continuar com uma pessoa.</p>"
    },
    {
        id: 205,
        title: "Agente, automação ou sistema sob medida: o que cada problema pede",
        slug: "agente-automacao-ou-sistema",
        date: "2026-07-24",
        icon: "git-branch",
        summary: "Três caminhos diferentes — e os sinais que ajudam a escolher a arquitetura adequada para cada operação.",
        content: "<p>Agentes de IA, automações e software sob medida resolvem tipos diferentes de problema. A escolha depende do grau de interpretação, da previsibilidade das regras e da interface necessária para a equipe.</p>"
    },
    {
        id: 204,
        title: "O que torna uma automação observável",
        slug: "automacao-observavel",
        date: "2026-07-17",
        icon: "radar",
        summary: "Fluxo, exceções e evolução: os elementos que permitem acompanhar um sistema depois que ele entra em operação.",
        content: "<p>Colocar um fluxo em produção não encerra o trabalho. Uma automação precisa mostrar o que aconteceu, onde parou e quando uma pessoa deve assumir.</p>"
    }
];

// Helper: Fetch posts with fallback
async function getBlogPosts() {
    try {
        // Add timestamp to force fresh fetch
        const response = await fetch(`./data/editorial-posts.json?v=${new Date().getTime()}`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn("Fetch failed (likely CORS or file://), using fallback data.", error);
        return FALLBACK_POSTS;
    }
}

// Helper: Format Date
function formatDate(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

// Helper: Render Blog Grid
function renderBlogGrid(containerIdOrElement, posts) {
    const container = typeof containerIdOrElement === 'string'
        ? document.getElementById(containerIdOrElement)
        : containerIdOrElement;

    if (!container) return;

    if (!posts || posts.length === 0) {
        container.innerHTML = `<div class="blog-empty">
            <i data-lucide="alert-circle"></i>
            <p>Não foi possível carregar os artigos no momento.</p>
        </div>`;
        lucide.createIcons();
        return;
    }

    container.classList.add('reveal-group');
    const phases = ['sinal', 'contexto', 'decisão', 'ação'];
    container.innerHTML = posts.map((post, index) => `
        <article class="insight-card insight-${phases[index % phases.length].normalize('NFD').replace(/[\u0300-\u036f]/g, '')} reveal">
            <div class="insight-meta">
                <span>${String(index + 1).padStart(2, '0')} / ${phases[index % phases.length]} · ${formatDate(post.date)}</span>
                <i data-lucide="${post.icon || 'binary'}"></i>
            </div>
            <h3>${post.title}</h3>
            <p>${post.summary}</p>
            <a href="blog-post.html?id=${post.id}">
                Ler análise <i data-lucide="arrow-up-right"></i>
            </a>
        </article>
    `).join('');

    // Check if lucide is available and re-render icons for injected HTML
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    observeReveals(container);
}

// 1. Initial Render for Blog Systems
async function initBlogSystem() {
    const homeGrid = document.getElementById('home-blog-grid'); // On index.html
    const allBlogGrid = document.querySelector('#all-blog-grid .grid'); // On blog.html (nested in section) or by ID if added

    // If neither exists, we are on a page without a blog list
    if (!homeGrid && !allBlogGrid) return;

    const posts = await getBlogPosts();
    // Sort posts by ID descending (newest first)
    posts.sort((a, b) => b.id - a.id);

    // Scenario 1: Home Page (Teaser - Limit 3)
    if (homeGrid) {
        renderBlogGrid(homeGrid, posts.slice(0, 3));
    }

    // Scenario 2: Blog Page (Full List)
    if (allBlogGrid) {
        renderBlogGrid(allBlogGrid, posts);
    }
}

// Helper: Write per-article SEO/OG/Twitter meta tags into <head>
function updateMetaTags(post) {
    const pageTitle = `${post.title} | Elumina IA`;
    const url = `https://eluminaia.com/blog-post.html?slug=${post.slug}`;

    document.title = pageTitle;
    document.getElementById('meta-description')?.setAttribute('content', post.summary);
    document.getElementById('meta-canonical')?.setAttribute('href', url);

    document.getElementById('meta-og-url')?.setAttribute('content', url);
    document.getElementById('meta-og-title')?.setAttribute('content', pageTitle);
    document.getElementById('meta-og-description')?.setAttribute('content', post.summary);

    document.getElementById('meta-twitter-url')?.setAttribute('content', url);
    document.getElementById('meta-twitter-title')?.setAttribute('content', pageTitle);
    document.getElementById('meta-twitter-description')?.setAttribute('content', post.summary);

    const jsonLd = document.getElementById('meta-jsonld');
    if (jsonLd) {
        jsonLd.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.summary,
            datePublished: post.date,
            url: url,
            mainEntityOfPage: url,
            author: { '@type': 'Organization', name: 'Elumina IA' },
            publisher: {
                '@type': 'Organization',
                name: 'Elumina IA',
                logo: { '@type': 'ImageObject', url: 'https://eluminaia.com/assets/logo-marca.png' }
            }
        });
    }
}

// 2. Render logic for Blog Post Page
async function initBlogPost() {
    const articleContainer = document.getElementById('article-container');
    const loadingSpinner = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');

    if (!articleContainer) return; // Not on blog post page

    // Get ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    const postSlug = urlParams.get('slug');

    if (!postId && !postSlug) {
        showError("Artigo não especificado.");
        return;
    }

    const posts = await getBlogPosts();
    const post = posts.find(p => p.id == postId || p.slug === postSlug);

    if (post) {
        // Populate Data
        updateMetaTags(post);
        document.getElementById('post-title').innerText = post.title;
        document.getElementById('post-date').innerText = formatDate(post.date);
        document.getElementById('post-content').innerHTML = post.content;

        // Show Content
        loadingSpinner.classList.add('hidden');
        articleContainer.classList.remove('hidden');

        // Refresh icons
        lucide.createIcons();
    } else {
        showError();
    }

    function showError() {
        loadingSpinner.classList.add('hidden');
        errorMessage.classList.remove('hidden');
    }
}

// FAQ Accordion
document.addEventListener('DOMContentLoaded', () => {
    const faqButtons = document.querySelectorAll('.faq-button');

    faqButtons.forEach((button, index) => {
        const answer = button.nextElementSibling;
        const answerId = answer.id || `faq-answer-${index + 1}`;
        answer.id = answerId;
        button.setAttribute('aria-controls', answerId);
        button.setAttribute('aria-expanded', 'false');

        button.addEventListener('click', () => {
            const icon = button.querySelector('.faq-icon');
            const isCurrentlyOpen = button.getAttribute('aria-expanded') === 'true';

            faqButtons.forEach(otherButton => {
                if (otherButton !== button) {
                    const otherAnswer = otherButton.nextElementSibling;
                    const otherIcon = otherButton.querySelector('.faq-icon');
                    otherAnswer.classList.add('hidden');
                    otherButton.setAttribute('aria-expanded', 'false');
                    otherIcon.classList.remove('rotate-45');
                }
            });

            answer.classList.toggle('hidden', isCurrentlyOpen);
            button.setAttribute('aria-expanded', String(!isCurrentlyOpen));
            icon.classList.toggle('rotate-45', !isCurrentlyOpen);
        });
    });
});

// Cookie Consent Logic
const ANALYTICS_ID = 'G-8MKC9WE26W';

function loadAnalytics() {
    if (document.querySelector('script[data-elumina-analytics]')) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
        window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', ANALYTICS_ID, { anonymize_ip: true });

    const analyticsScript = document.createElement('script');
    analyticsScript.async = true;
    analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
    analyticsScript.dataset.eluminaAnalytics = 'true';
    document.head.appendChild(analyticsScript);
}

function dismissCookieBanner(cookieBanner) {
    cookieBanner.classList.add('cookie-banner-hidden');
    setTimeout(() => cookieBanner.remove(), 500);
}

function showCookieBanner() {
    if (document.querySelector('.cookie-banner')) return;

    const cookieBanner = document.createElement('div');
    cookieBanner.className = 'cookie-banner cookie-banner-hidden';
    cookieBanner.setAttribute('role', 'region');
    cookieBanner.setAttribute('aria-label', 'Preferências de cookies');
    cookieBanner.innerHTML = `
        <div class="cookie-copy">
            Usamos cookies de análise somente com sua autorização para entender como o site é utilizado. Você pode aceitar ou recusar sem impedir a navegação.
        </div>
        <div class="cookie-actions">
            <button id="cookie-reject-btn" class="cookie-reject">Recusar análise</button>
            <button id="cookie-accept-btn" class="cookie-accept">Aceitar análise</button>
        </div>
    `;

    document.body.appendChild(cookieBanner);
    setTimeout(() => cookieBanner.classList.remove('cookie-banner-hidden'), 100);

    cookieBanner.querySelector('#cookie-reject-btn')?.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'rejected');
        dismissCookieBanner(cookieBanner);
    });

    cookieBanner.querySelector('#cookie-accept-btn')?.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        loadAnalytics();
        dismissCookieBanner(cookieBanner);
    });
}

function initCookieConsent() {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'accepted' || consent === 'true') {
        loadAnalytics();
        return;
    }
    if (consent === 'rejected') return;
    showCookieBanner();
}

function openCookiePreferences() {
    localStorage.removeItem('cookieConsent');
    showCookieBanner();
}

// Scroll Reveal (fade + slide-up as elements enter the viewport)
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserver = reduceMotion ? null : new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

function observeReveals(root = document) {
    root.querySelectorAll('.reveal:not([data-reveal-bound])').forEach(el => {
        el.setAttribute('data-reveal-bound', 'true');
        if (reduceMotion) {
            el.classList.add('is-visible');
            return;
        }
        revealObserver.observe(el);
    });

    root.querySelectorAll('.reveal-group').forEach(group => {
        const items = group.querySelectorAll(':scope > .reveal');
        items.forEach((item, i) => {
            // 'important' vence o `transition: ... !important` de cards como o
            // .light-card e garante a cascata em todos os elementos do grupo.
            item.style.setProperty('transition-delay', `${i * 90}ms`, 'important');
        });
    });
}

function initScrollStory() {
    const story = document.querySelector('[data-scroll-story]');
    if (!story) return;

    const panels = [...story.querySelectorAll('[data-scroll-story-panel]')];
    const counter = story.querySelector('[data-scroll-story-count]');
    if (!panels.length) return;

    if (reduceMotion) {
        panels.forEach(panel => panel.classList.add('is-active'));
        return;
    }

    let ticking = false;

    const setActivePanel = () => {
        const maxScroll = Math.max(1, story.offsetHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, -story.getBoundingClientRect().top / maxScroll));
        const index = Math.min(panels.length - 1, Math.floor(progress * panels.length));

        story.style.setProperty('--story-progress', progress.toFixed(4));
        panels.forEach((panel, panelIndex) => {
            panel.classList.toggle('is-active', panelIndex === index);
        });

        if (counter) {
            counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(panels.length).padStart(2, '0')}`;
        }

        ticking = false;
    };

    const requestUpdate = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(setActivePanel);
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    setActivePanel();
}

// Traço do método: desenha o circuito entre os 4 passos conforme a seção sobe na tela.
// Sem pin — o efeito acontece na passagem normal, sem segurar o visitante.
// Silencioso por natureza: se o GSAP não carregar, a seção fica como sempre foi.
function initMethodTrace() {
    const secao = document.querySelector('.diagnostic-section');
    if (!secao) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const traco = secao.querySelector('.method-trace');
    const nos = [...secao.querySelectorAll('[data-step]')];
    const cards = [...secao.querySelectorAll('.diagnostic-grid article')];
    if (!traco) return;

    gsap.registerPlugin(ScrollTrigger);

    // A seção só fica presa a partir do tablet (ver o @media no style.css). No celular
    // o percurso é a própria altura da seção passando pela tela.
    const presa = window.matchMedia('(min-width: 768px)').matches;

    const linha = gsap.timeline({
        scrollTrigger: {
            trigger: secao,
            start: presa ? 'top top' : 'top 72%',
            end: presa ? 'bottom bottom' : 'bottom 88%',
            scrub: 0.6
        }
    });

    // Cada passo ocupa uma fatia igual do percurso; a última sobra deixa o visitante ver
    // o quadro completo antes da seção liberar a página.
    const passo = 1;
    const totalPassos = cards.length;

    // O traço se desenha porque o stroke-dashoffset acompanha a rolagem, terminando
    // junto com a revelação do último card.
    const comprimento = traco.getTotalLength();
    gsap.set(traco, { strokeDasharray: comprimento, strokeDashoffset: comprimento });
    linha.to(traco, {
        strokeDashoffset: 0,
        duration: totalPassos * passo,
        ease: 'none'
    }, 0);

    cards.forEach((card, i) => {
        const quando = i * passo;

        // O card entra...
        linha.fromTo(card,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: passo * 0.7, ease: 'none' },
            quando
        );

        // ...com o nó do circuito acima dele...
        if (nos[i]) {
            linha.fromTo(nos[i],
                { opacity: 0, scale: 0.3, transformOrigin: 'center' },
                { opacity: 1, scale: 1, duration: passo * 0.5, ease: 'none' },
                quando + passo * 0.45
            );
        }

        // ...e o ícone acendendo. Anima-se a variável do card, não o <svg>: o Lucide
        // recria os ícones quando o blog injeta os posts, e uma referência ao elemento
        // viraria um órfão animado fora do documento.
        linha.fromTo(card,
            { '--node': 0 },
            { '--node': 1, duration: passo * 0.5, ease: 'none' },
            quando + passo * 0.45
        );
    });

    // Uma folga final: os quatro passos ficam visíveis juntos antes de soltar a seção.
    linha.to({}, { duration: passo * 0.6 });

    // A página só atinge a altura final depois que os ícones do Lucide e as fontes
    // carregam — sem recalcular, o ScrollTrigger guarda as posições medidas cedo demais
    // e o traço aparece já completo, fora de sincronia com a rolagem.
    window.addEventListener('load', () => ScrollTrigger.refresh());
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
}

// Trilho estático das soluções: linha completa e pontos acesos desde a abertura.
function initTrilhaSolucoes() {
    const pilha = document.querySelector('.solutions-stack');
    if (!pilha) return;

    const linhas = [...pilha.querySelectorAll('.solution-row')];
    if (!linhas.length) return;

    pilha.style.setProperty('--trilha-altura', '100%');
    pilha.style.setProperty('--trilha-opacidade', '1');
    linhas.forEach(linha => linha.classList.add('is-lit'));
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initMethodTrace();
    initTrilhaSolucoes();
    initScrollStory();
    initBlogSystem();
    initBlogPost();
    initCookieConsent();
    observeReveals();

    const requestedModal = new URLSearchParams(window.location.search).get('modal');
    if (requestedModal === 'privacy' || requestedModal === 'terms') {
        openModal(`modal-${requestedModal}`);
    }
});
