# Project concept art

`art.html` is the source for the **illustrative** project images in
`img/projects/<id>/concept.webp`. These are used for projects that have no
public screenshots. Each `<section class="art" id="art-<id>">` is one
1600 × 1000 (16:10) scene, built with HTML and CSS in the showcase's visual
style.

These images are concepts, not product screenshots, and they must stay
labelled:

- every scene has a baked-in "Illustrative concept · not a product
  screenshot" mark, and
- the catalog entry sets `illustrative: true` on its `thumbnail`, so the
  showcase adds a readable "Illustrative concept" pill on cards and featured
  blocks, plus a caption on the case-study page.

Never swap a real screenshot for a concept. Never put real people's names,
customer data or employer internals in a scene.

## Re-render

1. Serve the repo: `python -m http.server 5173`
2. Open `http://localhost:5173/tools/project-art/art.html` in a browser with
   a viewport of at least 1600 px, and wait for the web fonts to load.
3. Screenshot each `#art-<id>` element at CSS scale (1600 × 1000). Playwright:
   `page.locator('#art-<id>').screenshot({ path, scale: 'css' })`.
4. Encode to WebP at 1280 × 800, quality about 80 (e.g. sharp:
   `sharp(png).resize(1280, 800).webp({ quality: 80, effort: 6 })`), and save
   to `img/projects/<id>/concept.webp`.

The two real captures, `img/projects/portfolio-site/screen.webp` and
`img/projects/portfolio-guide/screen.webp`, are screenshots of the live
portfolio at 1440 × 900 with the scrollbar cropped off. They are not
generated from this file.
