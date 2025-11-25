# Pokedex – Pokémon Browser

Simple single-page Pokédex built with vanilla JavaScript, HTML and CSS. The app displays Pokémon data in a card/detail view and is one of my first pure JavaScript projects without a framework.

- Live app: https://www.pokedex.jennifer-thomas.de/index.html
- Repository: https://github.com/TerrorDackel/Pokedex

## Features
- Single-page application with a Pokédex-style layout
- Displays Pokémon information (e.g. name and image)
- Detail view for a selected Pokémon in an overlay/modal
- Navigation between entries (e.g. next/previous Pokémon)
- Basic loading behaviour and simple error handling
- Responsive layout for desktop and smaller screens

## Tech stack
- **Languages:** JavaScript, HTML5, CSS3
- **Architecture:** Simple SPA without a framework
- **Tooling:** Git & GitHub, optional local static server for development

## What I focused on
- Building an interactive app using only vanilla JavaScript and the DOM API
- Separating structure (HTML), styling (CSS) and logic (JavaScript)
- Working with functions and event handlers to keep logic reusable
- Creating a simple but readable file structure for scripts, styles and images
- Practising responsive layout with CSS (flexbox etc.)

## Project structure (high level)
- `index.html` – main HTML file and entry point
- `styles.css` – base styles (importing additional styles from `styles/` if used)
- `script.js` – main JavaScript file (importing additional scripts from `scripts/` if used)
- `imgs/` – Pokémon images and other assets
- `styles/` – additional CSS files
- `scripts/` – additional JavaScript modules/helper functions

## Getting started

### Prerequisites
No build step or Node.js required.  
You only need a modern browser. For API calls or local testing a simple static server is recommended.

### Run locally
- git clone https://github.com/TerrorDackel/Pokedex.git
- cd Pokedex
- Open `index.html` directly in your browser  
  or serve the folder with a simple static server (for example VS Code Live Server).

The app will be available in your browser and you can navigate through the Pokémon entries.

## Kurzbeschreibung (Deutsch)
Dieses Pokedex-Projekt habe ich alleine umgesetzt. Ziel war es, mit reinem JavaScript eine kleine Single-Page-Anwendung zu bauen, die Pokémon-Daten in einem Pokédex-Layout darstellt. Dabei habe ich DOM-Manipulation, Event-Handling, Strukturierung von JavaScript- und CSS-Dateien sowie responsive Layouts ohne Framework geübt.
