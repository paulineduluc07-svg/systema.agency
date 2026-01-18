# Systema.agency - Progress Tracker

## Session: 2026-01-17

### DONE TODAY
- pnpm installe globalement + dependances projet (874 packages)
- Fix version wouter (3.3.5 -> 3.7.1) pour compatibilite patch
- Fix Windows: ajout cross-env pour NODE_ENV dans scripts
- Creation .env minimal pour dev local
- Serveur demarre OK sur http://localhost:3000
- Audit complet du projet (structure, features, bugs)
- Creation api/index.ts pour Vercel serverless
- Creation vercel.json config
- Init git repo + premier commit

### NEXT SESSION (Start Here!)
1. Verifier deploiement Vercel (URL live?)
2. Fixer URL hardcodee dans Map.tsx:92 (forge.butterfly-effect.dev -> env var)
3. Tester app en mode offline (localStorage) - ajouter tasks/notes

### BUGS FOUND
- URL hardcodee `forge.butterfly-effect.dev` dans client/src/components/Map.tsx:92
- CSS @import order warning (cosmetic, non-bloquant)
- Analytics env vars manquantes (VITE_ANALYTICS_ENDPOINT, VITE_ANALYTICS_WEBSITE_ID)
- Peer deps warnings tldraw/tiptap (non-bloquant)

### IDEAS PARKED (Maybe Later)
- Remplacer OAuth Manus par Google/GitHub auth standard
- Ajouter health check endpoint pour monitoring
- Optimiser bundle size (Whiteboard = 1.4MB gzipped)
- Completer widgets stub (Calendar, Stats)

### NOTES
- App fonctionne 100% en mode offline (localStorage) sans auth
- OAuth actuel = Manus platform (skip pour MVP)
- Build OK: frontend Vite + backend esbuild
- 151 fichiers dans le repo

---

## PROJECT STATUS

### Core Features Status
- [x] Dashboard widgets movable (tldraw, dnd-kit, react-rnd)
- [x] Tasks system (CRUD complet, sync cloud ready)
- [x] Notes system (CRUD complet, sticky notes)
- [x] Dark/Light mode
- [x] Export PDF
- [ ] Cloud sync (need OAuth ou DB)
- [ ] Auth system (Manus OAuth configure mais pas active)

### Priority Stack (Top = Do First)
1. Deployer sur Vercel (MVP live)
2. Fixer hardcoded URLs
3. Tester features en mode offline
4. Ajouter auth simple si besoin users
5. Nettoyer widgets stub inutiles

### Known Issues
- Map.tsx URL hardcodee
- Type mismatch Note IDs (string vs number selon contexte)
- Pas de gestion d'erreur centralisee dans routes

### Tech Debt
- Tests: seulement 4 fichiers (30% coverage)
- Pas de logging centralise
- Pas de rate limiting
- Bundle Whiteboard tres lourd (tldraw)
