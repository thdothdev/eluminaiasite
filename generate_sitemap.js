const fs = require('fs');
const path = require('path');

const baseUrl = 'https://eluminaia.com';
const postsPath = path.join(__dirname, 'data', 'editorial-posts.json');
const sitemapPath = path.join(__dirname, 'sitemap.xml');

// Static pages
const staticPages = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/index.html', changefreq: 'daily', priority: '1.0' },
    { url: '/blog.html', changefreq: 'daily', priority: '0.8' },
];

function generateSitemap() {
    console.log('Reading blog posts...');

    let posts = [];
    try {
        const data = fs.readFileSync(postsPath, 'utf8');
        posts = JSON.parse(data);
    } catch (err) {
        console.error('Error reading editorial-posts.json:', err);
        return;
    }

    console.log(`Found ${posts.length} posts.`);

    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add static pages
    staticPages.forEach(page => {
        sitemapContent += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    });

    // Add blog posts
    posts.forEach(post => {
        const postUrl = `${baseUrl}/blog-post.html?slug=${post.slug}`;
        const lastMod = post.date || new Date().toISOString().split('T')[0];

        sitemapContent += `  <url>
    <loc>${postUrl}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });

    sitemapContent += `</urlset>`;

    try {
        fs.writeFileSync(sitemapPath, sitemapContent);
        console.log(`Sitemap generated successfully at ${sitemapPath}`);
    } catch (err) {
        console.error('Error writing sitemap.xml:', err);
    }
}

generateSitemap();
