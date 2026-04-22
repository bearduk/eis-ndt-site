# EIS NDT Static Site

Simple brochure-style website for Engineering Inspection Services, built with plain HTML, CSS, and JavaScript so it is easy to maintain locally and deploy to Netlify.

## Project structure

- `index.html` - homepage
- `services.html` - services overview
- `about.html` - company overview, approach, and standards
- `contact.html` - contact page with Netlify-ready form
- `thank-you.html` - post-form confirmation page
- `assets/css/style.css` - site styles
- `assets/js/site.js` - small interactive behavior
- `robots.txt` - blocks crawlers during development
- `ASSET-CREDITS.md` - source and copyright notes for local media
- `CONTENT-PLAN.md` - sitemap, UX structure, and copy notes
- `netlify.toml` - basic Netlify headers

## Preview locally

Run a simple local server from the project root:

```bash
python3 -m http.server 8000
```

Then open `http://127.0.0.1:8000`.

## Deploy notes

- The contact form is set up with Netlify form attributes.
- `robots.txt` currently blocks all crawlers.
- Each page also includes `noindex, nofollow` meta tags for safety while the project is in draft.
- Before launch, remove the crawler blocks and replace any placeholder wording you do not want on the live site.

## Maintenance workflow

1. Edit the HTML, CSS, or JS files locally.
2. Preview the site in a browser.
3. Commit changes to Git.
4. Push to GitHub when you are ready.
5. Let Netlify deploy from the repo.
