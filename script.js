// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        const isClosed = mobileMenu.classList.contains('opacity-0');
        if (isClosed) {
            // Open
            mobileMenu.classList.remove('opacity-0', '-translate-y-4', 'pointer-events-none');
            mobileMenuBtn.querySelector('i').setAttribute('data-lucide', 'x');
        } else {
            // Close
            mobileMenu.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
            mobileMenuBtn.querySelector('i').setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
    });
}

// Close mobile menu when clicking a link
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
        mobileMenuBtn.querySelector('i').setAttribute('data-lucide', 'menu');
        lucide.createIcons();
    });
});

// Modal Logic
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
        const child = modal.firstElementChild;
        child.classList.remove('scale-95');
        child.classList.add('scale-100');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('opacity-0', 'pointer-events-none');
        const child = modal.firstElementChild;
        child.classList.remove('scale-100');
        child.classList.add('scale-95');
        document.body.style.overflow = '';
    }
}

window.onclick = function (event) {
    if (event.target.id && event.target.id.startsWith('modal-')) {
        closeModal(event.target.id);
    }
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        document.querySelectorAll('[id^="modal-"]').forEach(modal => {
            if (!modal.classList.contains('opacity-0')) {
                closeModal(modal.id);
            }
        });
    }
});

// --- BLOG SYSTEM LOGIC ---

// Fallback data in case fetch fails (common in local environments/CORS)
const FALLBACK_POSTS = [
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

// Helper: Fetch posts with fallback
async function getBlogPosts() {
    try {
        // Add timestamp to force fresh fetch
        const response = await fetch(`./data/blog-posts.json?v=${new Date().getTime()}`);
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
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

// Helper: Render Blog Grid
function renderBlogGrid(containerIdOrElement, posts) {
    const container = typeof containerIdOrElement === 'string'
        ? document.getElementById(containerIdOrElement)
        : containerIdOrElement;

    if (!container) return;

    if (!posts || posts.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-20">
            <i data-lucide="alert-circle" class="w-12 h-12 text-gray-600 mx-auto mb-4"></i>
            <p class="text-gray-400 text-lg">Não foi possível carregar os artigos no momento.</p>
        </div>`;
        lucide.createIcons();
        return;
    }

    container.innerHTML = posts.map(post => `
        <article class="glass-card rounded-2xl flex flex-col items-start hover:bg-white/5 transition-colors border border-white/5 h-full group overflow-hidden">
            <div class="w-full h-48 relative overflow-hidden bg-gray-800">
                <img src="${post.image || 'assets/logo.png'}" alt="${post.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div class="p-8 flex flex-col flex-grow w-full">
                <div class="text-sm text-gray-500 mb-3 flex items-center gap-2">
                    <i data-lucide="calendar" class="w-4 h-4"></i>
                    ${formatDate(post.date)}
                </div>
                <h3 class="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">${post.title}</h3>
                <p class="text-gray-400 mb-6 line-clamp-3 flex-grow">${post.summary}</p>
                <a href="blog-post.html?id=${post.id}" class="inline-flex items-center gap-2 text-primary font-semibold hover:text-white transition-colors mt-auto">
                    Ler artigo <i data-lucide="arrow-right" class="w-4 h-4"></i>
                </a>
            </div>
        </article>
    `).join('');

    // Check if lucide is available and re-render icons for injected HTML
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
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

    console.log("Searching for post:", { postId, postSlug });
    console.log("Found post:", post);

    if (post) {
        // Populate Data
        document.title = `${post.title} | Elumina IA`;
        document.getElementById('post-title').innerText = post.title;
        document.getElementById('post-date').innerText = formatDate(post.date);
        document.getElementById('post-content').innerHTML = post.content;

        // Update Image
        const imageEl = document.getElementById('post-image');
        if (imageEl && post.image) {
            imageEl.src = post.image;
            imageEl.alt = post.title;
            imageEl.classList.remove('hidden');
        }

        // Update Icon (Fallback/Optional)
        const iconEl = document.getElementById('post-icon');
        if (iconEl) {
            // If we have an image, maybe hide the icon or keep it as overlay? 
            // User requested "Correção das Imagens", so image takes precedence.
            // Let's assume the icon container might be separate or we reuse the space.
            // For now, let's just set the icon too if it exists.
            iconEl.setAttribute('data-lucide', post.icon || 'file-text');
        }

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

// FAQ Accordion - Simple and Robust
document.addEventListener('DOMContentLoaded', () => {
    const faqButtons = document.querySelectorAll('.faq-button');

    faqButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Get the answer element (next sibling after the button)
            const answer = button.nextElementSibling;
            const icon = button.querySelector('.faq-icon');
            const isCurrentlyOpen = !answer.classList.contains('hidden');

            // Close all other FAQ items
            faqButtons.forEach(otherButton => {
                if (otherButton !== button) {
                    const otherAnswer = otherButton.nextElementSibling;
                    const otherIcon = otherButton.querySelector('.faq-icon');

                    // Close the answer
                    otherAnswer.classList.add('hidden');
                    // Reset icon rotation
                    otherIcon.classList.remove('rotate-45');
                }
            });

            // Toggle current item
            if (isCurrentlyOpen) {
                answer.classList.add('hidden');
                icon.classList.remove('rotate-45');
            } else {
                answer.classList.remove('hidden');
                icon.classList.add('rotate-45');
            }
        });
    });
});

// Cookie Consent Logic
function initCookieConsent() {
    if (localStorage.getItem('cookieConsent') === 'true') return;

    const cookieBanner = document.createElement('div');
    cookieBanner.className = 'fixed bottom-0 left-0 w-full bg-[#111] text-white p-4 shadow-2xl z-50 transform translate-y-full transition-transform duration-500 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10';
    cookieBanner.innerHTML = `
        <div class="text-sm md:text-base text-gray-300 max-w-4xl">
            Utilizamos cookies para melhorar sua experiência e analisar o tráfego conforme a LGPD. Ao continuar navegando, você concorda com nossa Política de Privacidade.
        </div>
        <button id="cookie-accept-btn" class="px-6 py-2 bg-primary hover:bg-opacity-90 text-white font-semibold rounded-full transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,82,255,0.3)] whitespace-nowrap">
            Aceitar
        </button>
    `;

    document.body.appendChild(cookieBanner);

    // Trigger animation after small delay
    setTimeout(() => {
        cookieBanner.classList.remove('translate-y-full');
    }, 100);

    const acceptBtn = document.getElementById('cookie-accept-btn');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.add('translate-y-full');
            setTimeout(() => {
                cookieBanner.remove();
            }, 500);
        });
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initBlogSystem();
    initBlogPost();
    initCookieConsent();
});
