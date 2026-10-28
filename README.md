# Sanskar Maddi — personal website

A responsive research portfolio for experimental fluid dynamics and aerospace engineering. Includes a profile, experience, contact details, a project overview, and three research project pages.

**Website:** https://sanskar-maddi.github.io/  
**Repository:** https://github.com/sanskar-maddi/sanskar-maddi.github.io

Plain HTML, CSS, and JavaScript. No framework, package installation, build service, or API keys. All fonts and illustrations are local or built into the browser.

## Publish on GitHub Pages

1. Create a GitHub repository. Use `YOUR-USERNAME.github.io` for a personal homepage, or any repository name for a project site.
2. Put **the contents of this folder** at the repository root, including `.github`, `.nojekyll`, `assets`, `projects`, and `tools`. Push to the `main` branch. Do not upload the old enclosing export folder.
3. Open **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
4. Open **Actions → Check and deploy website → Run workflow**. Later pushes to `main` deploy automatically. Pull requests run checks without publishing.
5. Find your live URL in the deployment result or **Settings → Pages**.

The workflow checks local links and page structure, stages only the public website files, then deploys that artifact. Relative links support both `https://YOUR-USERNAME.github.io/` and `https://YOUR-USERNAME.github.io/REPOSITORY/` without changing a base URL.

See [GitHub's Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

### Work locally with Git

To get a checkout connected to the published repository:

```sh
git clone https://github.com/sanskar-maddi/sanskar-maddi.github.io.git
cd sanskar-maddi.github.io
```

Edit the files, commit your changes, and push to `main`. The GitHub Actions workflow validates and publishes updates automatically.

## Preview and check

Open `index.html` directly for a quick look. For a full local preview, use Node.js 22 or newer:

```sh
node tools/preview.mjs
```

Visit <http://127.0.0.1:4173>. To test a repository subpath, visit <http://127.0.0.1:4173/repository-preview/>. Stop the server with `Ctrl+C`.

```sh
node tools/check-site.mjs
node tools/package-site.mjs
```

The second command creates an ignored `_site/` deployment folder; edit the source files, not that output.

## Update the website

| File | Purpose |
| --- | --- |
| `index.html` | Profile, experience, education, skills, contact |
| `projects.html` | Project overview |
| `projects/*.html` | Individual project descriptions |
| `assets/styles.css` | Shared design and responsive layout |
| `assets/app.js` | Mobile menu, dropdown behavior, email copy, printing |
| `assets/favicon.svg` | Initials icon |
| `404.html` | Missing-page recovery |
| `.github/workflows/pages.yml` | Validation and GitHub Pages deployment |

Institution names, research descriptions, and the contact email were retained from the supplied website. Update current affiliations and contact details in the HTML when needed. Email copying reads the displayed address automatically. A downloadable CV and social-profile links can be added when the corresponding files and URLs are available.

The research illustrations are qualitative schematics, not experimental images or measured data. The website contains no analytics or contact-form backend; the contact link opens the visitor's email app. Navigation and project pages remain usable with JavaScript disabled.

## Cleanup

The original folder contained identical copies under `github-pages/` and `outputs/sanskar-maddi-website/`, a ZIP of that export, two copies of an older single-page site, and temporary generation/transfer scripts. These were consolidated into this single maintained website. The abandoned nested Git repository contained no commits or remote.
