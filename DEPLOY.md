# Deployment Guide: brandirininger.com on Cloudflare Pages

## Why Cloudflare Pages
- Free tier (unlimited bandwidth, 500 builds/month)
- Global CDN (300+ edge locations = fast LCP everywhere)
- Automatic HTTPS (free SSL, no config needed)
- Custom headers and redirects via _headers and _redirects files (already created)
- Perfect for static HTML/CSS/JS sites

---

## Step 1: Push the site to GitHub

1. Create a new GitHub repo: `brandi-rininger-website` (private is fine)
2. From the `website/` folder on your machine:

```bash
cd ~/Projects/Brandi/website
git init
git add .
git commit -m "Initial site build"
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/brandi-rininger-website.git
git push -u origin main
```

---

## Step 2: Connect to Cloudflare Pages

1. Go to https://dash.cloudflare.com
2. Sign up or log in (free account works)
3. In the sidebar, click **Workers & Pages**
4. Click **Create** > **Pages** > **Connect to Git**
5. Authorize GitHub and select the `brandi-rininger-website` repo
6. Configure build settings:
   - **Project name:** `brandirininger`
   - **Production branch:** `main`
   - **Build command:** (leave blank — no build step needed for static HTML)
   - **Build output directory:** `/` (the root of the repo IS the site)
7. Click **Save and Deploy**

Cloudflare will deploy and give you a URL like `brandirininger.pages.dev` — test this to verify everything works.

---

## Step 3: Add brandirininger.com as Custom Domain

### In Cloudflare Pages:
1. Go to your Pages project > **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `brandirininger.com`
4. Cloudflare will ask you to add the domain to your Cloudflare account (free plan)
5. It will provide two Cloudflare nameservers (e.g., `ada.ns.cloudflare.com` and `bob.ns.cloudflare.com`)

### In Namecheap:
1. Log into Namecheap > **Domain List** > click **Manage** next to brandirininger.com
2. Under **Nameservers**, select **Custom DNS**
3. Enter the two Cloudflare nameservers from above
4. Save

### Back in Cloudflare:
1. Wait for nameserver propagation (usually 5-30 minutes, can take up to 24 hours)
2. Cloudflare will auto-verify and issue an SSL certificate
3. Also add `www.brandirininger.com` as a custom domain — Cloudflare will auto-redirect www to non-www

---

## Step 4: Set Up brandiwnc.com Redirect

### Option A: Cloudflare Redirect Rules (Recommended)
1. In Cloudflare, add `brandiwnc.com` to your account (free plan)
2. In Namecheap, update brandiwnc.com nameservers to the same Cloudflare nameservers
3. In Cloudflare dashboard for brandiwnc.com:
   - Go to **Rules** > **Redirect Rules**
   - Create a rule:
     - **When:** Hostname equals `brandiwnc.com` OR `www.brandiwnc.com`
     - **Then:** Dynamic redirect to `https://brandirininger.com/${http.request.uri.path}`
     - **Status code:** 301 (permanent)
4. Also set up DNS:
   - Add an **A record** for `@` pointing to `192.0.2.1` (dummy IP, Cloudflare proxied)
   - Add a **CNAME** for `www` pointing to `brandiwnc.com` (Cloudflare proxied)

### Option B: Namecheap URL Redirect (Simpler but slower)
1. In Namecheap, go to brandiwnc.com > **Manage** > **Advanced DNS**
2. Add a **URL Redirect Record**:
   - Host: `@`
   - Type: Permanent (301)
   - Value: `https://brandirininger.com`
3. Add another for `www` subdomain

---

## Step 5: Verify Everything

After DNS propagates, verify:

- [ ] https://brandirininger.com loads the site
- [ ] https://www.brandirininger.com redirects to https://brandirininger.com
- [ ] http://brandirininger.com redirects to https://brandirininger.com
- [ ] https://brandiwnc.com redirects to https://brandirininger.com
- [ ] https://www.brandiwnc.com redirects to https://brandirininger.com
- [ ] SSL certificate is valid (green padlock)
- [ ] All pages load correctly (click through every nav link)

---

## Step 6: Google Search Console & GA4

### Google Search Console:
1. Go to https://search.google.com/search-console
2. Click **Add Property** > **Domain** > enter `brandirininger.com`
3. Verify via DNS TXT record (add in Cloudflare DNS settings)
4. Once verified, submit the sitemap: `https://brandirininger.com/sitemap.xml`

### Google Analytics 4:
1. Go to https://analytics.google.com
2. Create a new GA4 property for brandirininger.com
3. Get the Measurement ID (starts with G-)
4. Add the GA4 snippet to every page's <head> (I can do this once you have the ID)

---

## Step 7: Future Deploys

Any time you push to the `main` branch on GitHub, Cloudflare Pages automatically rebuilds and deploys within ~30 seconds. No manual steps needed.

```bash
git add .
git commit -m "Update content"
git push
```

That's it — live in 30 seconds.

---

## Files I've Already Created for Deployment

- `_headers` — Security headers + cache rules for CSS/JS/images
- `_redirects` — Clean URL rewrites
- `robots.txt` — Search engine crawl permissions
- `sitemap.xml` — All 19 URLs for Google Search Console
