$baseUrl = "https://eluminaia.com"
$postsPath = Join-Path $PSScriptRoot "data\blog-posts.json"
$sitemapPath = Join-Path $PSScriptRoot "sitemap.xml"

# Function to escape XML special characters
function Escape-Xml($text) {
    if ([string]::IsNullOrEmpty($text)) { return "" }
    return $text.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;").Replace("`"", "&quot;").Replace("'", "&apos;")
}

Write-Host "Reading blog posts..."

if (-not (Test-Path $postsPath)) {
    Write-Error "File not found: $postsPath"
    exit
}

$jsonContent = Get-Content -Path $postsPath -Raw -Encoding UTF8
$posts = $jsonContent | ConvertFrom-Json

Write-Host "Found $($posts.Count) posts."

$sitemapContent = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
"@

# Static pages
$staticPages = @(
    @{ url = "/"; changefreq = "daily"; priority = "1.0" },
    @{ url = "/index.html"; changefreq = "daily"; priority = "1.0" },
    @{ url = "/blog.html"; changefreq = "daily"; priority = "0.8" }
)

$today = (Get-Date).ToString("yyyy-MM-dd")

foreach ($page in $staticPages) {
    $sitemapContent += @"
  <url>
    <loc>$($baseUrl)$($page.url)</loc>
    <lastmod>$today</lastmod>
    <changefreq>$($page.changefreq)</changefreq>
    <priority>$($page.priority)</priority>
  </url>
"@
}

# Blog posts
foreach ($post in $posts) {
    $slug = $post.slug
    $date = if ($post.date) { $post.date } else { $today }
    $url = "$baseUrl/blog-post.html?slug=$slug"
    
    $sitemapContent += @"
  <url>
    <loc>$($url)</loc>
    <lastmod>$($date)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
"@
}

$sitemapContent += "</urlset>"

$sitemapContent | Set-Content -Path $sitemapPath -Encoding UTF8
Write-Host "Sitemap generated successfully at $sitemapPath"
