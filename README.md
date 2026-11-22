# Mohiuddin Khan's portfolio

A responsive, buildless portfolio balancing software engineering work with master's study in AI, machine learning, and data science.

## Preview

Open `index.html` in a browser, or serve this directory with any static development server. No build step or runtime dependencies are required. Google Fonts is optional; the page falls back to local system fonts.

## Content

- Software engineering introduction, portrait, and separate developer résumé / academic CV downloads.
- Featured IEEE computer vision publication with reported results and research context.
- Eleven projects: all six original projects, two applied ML projects, and three additional published applications from the academic CV.
- Project filters, skills, professional experience, education, expandable coursework, leadership, and languages.
- Contact links open the visitor's email app with a relevant subject. There is no backend, message storage, or simulated form submission.

The supplied academic CV is the source for updated qualifications and additions. The bachelor's CGPA is 3.82/4.00 and diploma CGPA is 3.53/4.00. NLP metrics explicitly refer to a synthetic held-out test set; ongoing research results are marked pending. The original developer résumé PDF is retained separately.

## Files

- `index.html`: content, metadata, and accessible page structure.
- `css/styles.css`: navy, mint, and white design; responsive and reduced-motion styles.
- `js/main.js`: project filtering, mobile navigation, active-section tracking, and footer year.
- `assets/Mohiuddin-Khan-Academic-CV.pdf`: supplied academic CV.
- `assets/Mohiuddin-Khan-Resume.pdf`: existing developer résumé.
- `assets/images/profile-latest.png`: updated portrait supplied for this revision.

To add a project, duplicate a `.project-card` article and set `data-category` to `ai` or `mobile`. JavaScript updates the filter totals automatically. Update initial static counts in the HTML as well. Every project is visible without JavaScript.

For static hosting, publish this directory with the relative asset paths intact.

Academic background is followed immediately by professional experience, then research. Languages have a dedicated section. Project cards show the first four matching projects, with an accessible See more / See less control for the rest. Changing filters resets the list to four. The requested project order is preserved.
