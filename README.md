# Mohiuddin Khan's portfolio

A responsive, buildless portfolio balancing software engineering work with master's study in AI, machine learning, and data science.

## Preview

Open `index.html` in a browser, or serve this directory with any static development server. No build step or runtime dependencies are required. Google Fonts is optional; the page falls back to local system fonts.

## Content

- Software engineering introduction, portrait, and separate developer résumé / academic CV downloads.
- Featured IEEE computer vision publication with reported results and research context.
- Eleven projects: all six original projects, two applied ML projects, and three additional published applications from the academic CV.
- Project filters, skills, professional experience, education, expandable coursework, leadership, and languages.
- Primary email links open Gmail compose in a new tab with the recipient and subject prefilled. An alternative mailto link supports other email apps. Visitors review and send their own drafts; there is no backend or automatic sending.

The supplied academic CV is the source for updated qualifications and additions. The bachelor's CGPA is 3.82/4.00 and diploma CGPA is 3.53/4.00. NLP metrics explicitly refer to a synthetic held-out test set; ongoing research results are marked pending. The developer resume is the latest supplied `resume.pdf`, stored separately from the academic CV.

## Files

- `index.html`: content, metadata, and accessible page structure.
- `css/styles.css`: navy, mint, and white design; responsive and reduced-motion styles.
- `js/main.js`: project filtering, mobile navigation, active-section tracking, and footer year.
- `assets/Mohiuddin-Khan-Academic-CV.pdf`: supplied academic CV.
- `assets/Mohiuddin-Khan-Resume.pdf`: developer resume, replaced with the supplied `resume.pdf`.
- `assets/images/profile-navy.png`: portrait with a navy background, used in the hero.
- `assets/images/profile-latest.png`: preserved original portrait.
- `assets/images/portrait-edit-prompt.txt`: image-edit prompt and target background color.

To add a project, duplicate a `.project-card` article and set `data-category` to `ai` or `mobile`. JavaScript updates the filter totals automatically. Update initial static counts in the HTML as well. Every project is visible without JavaScript.

For static hosting, publish this directory with the relative asset paths intact.

About follows the hero, followed by academic background, research, and professional experience. Languages have a dedicated section. Project cards show the first four matching projects, with an accessible See more / See less control for the rest. Changing filters resets the list to four. The requested project order is preserved.

The color system uses a continuous navy canvas (#101E2B), dark raised surfaces, mint accents, and consistent light text across every section.

Resume and academic CV links open a responsive in-page PDF dialog. The viewer includes Download PDF, Escape/backdrop/close-button dismissal, and focus restoration. PDF rendering uses the browser's built-in viewer; browsers without embedded PDF support can use the download link.
