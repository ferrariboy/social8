# BC Grade 8 Social Studies Discovery Portal (Mobile-First SPA)

An interactive, responsive single-page web application designed for Ryo, a Grade 8 student in British Columbia (c. 13–14 years old), aligned with the official **BC Ministry of Education Social Studies 8 Curriculum (600 CE – 1750 CE)**.

---

## 🌟 Key Features

* **Complete 24-Unit Curriculum (8 Modules x 3 Units)**:
  * **Module 1**: The Foundations of Feudal Worlds (Western Europe & Post-Roman Order)
  * **Module 2**: The Islamic Golden Age & Regional Networks (Abbasid Caliphate, Al-Andalus)
  * **Module 3**: East Asian Dynasties & Medieval Japan (Tang/Song, Samurai, Ming Treasure Fleets)
  * **Module 4**: The Mongol Empire & Trans-Eurasian Exchange (Genghis Khan, Pax Mongolica, Four Khanates)
  * **Module 5**: Civilizations of Africa & The Americas (Mali Empire, Aztecs at Tenochtitlan, Inka Tawantinsuyu)
  * **Module 6**: Crisis, Conflict, and Transformation in Europe (Crusades, Black Death, Hundred Years' War)
  * **Module 7**: The European Renaissance, Reformation, and Worldviews (Humanism, Gutenberg Press, Martin Luther)
  * **Module 8**: The Age of Exploration & Global Interconnection to 1750 (Caravels, Columbian Exchange, Transatlantic Silver)

* **4 Structured Content Blocks Per Unit**:
  1. 🏛️ **Historical Background**: Thorough, engaging narrative of cause-and-effect.
  2. 📜 **Primary Source Deep Dive**: Authentic contemporary quotes and historical critical-thinking context.
  3. ⚙️ **Technical & Cultural Focus**: Deep dive into innovations, administrative mechanisms, or military breakthroughs.
  4. 🗺️ **Imagery & Geographic Index**: Vivid cartographic and visual blueprint breakdowns.

* **Interactive Practice Quizzes**:
  * Formative multiple-choice questions with 4 distinct options.
  * Instant feedback with highlighted correct/incorrect states and in-depth explanations.
  * Web Audio sound effects and celebratory particle confetti upon achieving 100%.

* **Persistent Client-Side State**:
  * Saves completed units and high scores in browser `localStorage`.
  * "Quick Resume" jump card on the dashboard directly returns to the student's active unit.
  * Real-time mastery progress bar and fractional completion tracker (`X / 24 Units Done`).

* **Mobile-First UX / UI**:
  * Baseline body copy formatted for effortless reading on smartphones (`text-lg`).
  * Strict touch targets ($\ge 48\text{px}$) with comfortable padding and tactile active-press feedback.
  * Real-time search filter for instantly locating historical concepts, civilizations, and topics.

---

## 🚀 Deployment to GitHub Pages

This app is built with pure Vanilla HTML5, Tailwind CSS (via CDN), and modern ES6+ JavaScript. It requires zero compilation steps, zero bundlers, and zero Node dependencies.

1. Create a repository on GitHub (e.g. `ryo-grade8-socials`).
2. Push `index.html`, `app.js`, `curriculum-data.js`, and `README.md` to the `main` branch:
   ```bash
   git init
   git add .
   git commit -m "Initial release of Ryo Grade 8 Social Studies Discovery Portal"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
3. In GitHub, navigate to **Settings** → **Pages**.
4. Under **Build and deployment**, set **Source** to `Deploy from a branch` and choose `/ (root)` of `main`.
5. Your app will be live at `https://<your-username>.github.io/<your-repo-name>/`.

---

## 💻 Running Locally

Simply double-click `index.html` in your file explorer to open it in any web browser, or run a local static server:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .
```
Then visit `http://localhost:8000` in your browser.
