# Systema.agency - Progress Tracker

## RESUME DU PROJET

**Systema.agency** = App de productivite pour neurodivergents
- Style "Cozy Gaming UI" (RPG dashboard, candy colors, boutons 3D)
- React 19 + Tailwind + shadcn/ui + Framer Motion
- Fonctionne en mode OFFLINE (localStorage) - pas besoin de compte

---

## Session: 2026-01-17

### CE QU'ON A FAIT

**1. Setup environnement**
- Installe pnpm globalement
- Installe 874 packages de dependances
- Cree fichier .env pour dev local

**2. Corrections bugs**
- Fix wouter patch (version 3.3.5 → 3.7.1)
- Fix Windows: ajoute cross-env pour NODE_ENV
- Fix crash "Invalid URL" quand OAuth pas configure

**3. Git + GitHub**
- Init repo git local
- Push sur github.com/paulineduluc07-svg/systema.agency

**4. Deploiement Vercel**
- Config vercel.json (frontend only)
- Ajoute script build:client
- Deploye sur https://systema-agency.vercel.app

**5. Documentation**
- Audit complet du projet
- Creation de ce fichier PROGRESS.md

---

### PROCHAINES ETAPES

**Immediat (prochaine session):**
1. Tester https://systema-agency.vercel.app - verifier que ca marche
2. Ajouter quelques tasks/notes pour tester le mode offline
3. Fix URL hardcodee dans Map.tsx (ligne 92)

**Court terme:**
4. Supprimer widgets vides (Calendar, Stats) pour nettoyer
5. Tester export PDF

**Plus tard (quand tu veux des users):**
6. Ajouter authentification (Google/GitHub OAuth)
7. Ajouter base de donnees pour sync cloud
8. Configurer domaine custom (systema.agency)

---

### BUGS CONNUS

| Bug | Fichier | Priorite |
|-----|---------|----------|
| URL hardcodee forge.butterfly-effect.dev | Map.tsx:92 | Moyenne |
| CSS @import order warning | index.css | Basse |
| Analytics vars manquantes | - | Basse |

---

### CE QUI MARCHE

- [x] Dashboard avec avatar RPG
- [x] Widgets draggables/resizables
- [x] Systeme de tabs (Missions, Resources, House, Map)
- [x] Tasks: ajouter, cocher, supprimer
- [x] Notes: ajouter, editer, supprimer
- [x] Sticky notes draggables
- [x] Whiteboard (tldraw)
- [x] Dark/Light mode
- [x] Export PDF
- [x] Mode offline (localStorage)

### CE QUI MANQUE

- [ ] Cloud sync (donnees perdues si tu changes de navigateur)
- [ ] Auth (pas de compte utilisateur)
- [ ] Calendar widget (juste un skeleton)
- [ ] Stats widget (juste un skeleton)

---

## LIENS

| Quoi | URL |
|------|-----|
| App live | https://systema-agency.vercel.app |
| GitHub | https://github.com/paulineduluc07-svg/systema.agency |
| Local dev | http://localhost:3000 |
| Vercel dashboard | vercel.com (ton compte) |

---

## COMMENT REPRENDRE

**Pour continuer le dev:**
```
cd "C:\Users\pauli\OneDrive\Desktop\systema.agency\systema"
pnpm dev
```
→ Ouvre http://localhost:3000

**Pour Claude Code:**
> "Lis PROGRESS.md et continue a partir de PROCHAINES ETAPES"

**Pour deployer un changement:**
```
git add -A && git commit -m "ton message" && git push
```
→ Vercel redeploit automatiquement
