# Kodflix (Netflix-style movie landing)

Netflix-inspired landing page UI built with **React + Vite** that fetches movie data from **OMDb** (the API key you provided is for OMDb).

## Setup

1. Install dependencies:

```bash
npm install
```

2. (Optional) Configure an API key via env var (defaults to the key you provided):

Create a `.env` file:

```bash
VITE_OMDB_API_KEY=e7dc754e
```

3. Run the app:

```bash
npm run dev
```

## Tests

```bash
npm run test:run
```

## Verify it’s fetching and looks like Netflix

- **Data fetch**: open DevTools → Network → filter `omdbapi` and you should see requests like `?s=...&apikey=...` and `?i=...&plot=full&apikey=...`.
- **Appearance**: you should see a sticky top bar, a large hero banner with dark vignette, and multiple horizontal carousels with hover-zoom cards.

## Notes

- The UI layout is modeled after the Netflix landing style (hero banner + horizontal rows + hover scale).
- OMDb provides search-based lists; “Trending / New” rows are implemented as curated search queries.

