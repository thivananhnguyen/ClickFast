# ClickFast - README de rendu (Partie 2 CI/CD + bonus)

[![Verify CI](https://github.com/thivananhnguyen/ClickFast/actions/workflows/verify.yml/badge.svg)](https://github.com/thivananhnguyen/ClickFast/actions/workflows/verify.yml)
[![Release CI](https://github.com/thivananhnguyen/ClickFast/actions/workflows/release.yml/badge.svg)](https://github.com/thivananhnguyen/ClickFast/actions/workflows/release.yml)

## 1. Nom et but du projet

**ClickFast** est un mini-jeu web (HTML/CSS/JS): cliquer pendant 5 secondes, puis partager le score via API.

Ce rendu couvre:

1. conteneurisation Docker
2. CI/CD GitHub Actions
3. scans securite (dependances, secrets, image)
4. SBOM
5. validation humaine avant publication production

## 2. Lancer le projet

### Local

```bash
npm install
npm run lint
npm test
npx serve .
```

### Docker

```bash
docker build -t clickfast:local .
docker run --rm -p 8080:80 clickfast:local
```

## 3. Setup CI/CD (obligatoire)

### Secrets GitHub Actions

Dans `Settings > Secrets and variables > Actions`:

1. `DOCKERHUB_USERNAME`
2. `DOCKERHUB_TOKEN`

### Workflows

1. `verify.yml`: verification sur pull request (`lint`, `test`, `security-deps`)
2. `release.yml`: release sur push `main` (`build-and-push`, `security-image`, `sbom-image`, `security-summary`)

## 4. Parcours par phases (resume)

1. **Phase 1**: fail-fast lint -> test
2. **Phase 2**: build/push image Docker taggee SHA
3. **Phase 3**: mesure avant/apres cache npm
4. **Phase 4**: `npm audit` + `gitleaks`
5. **Phase 5**: scan image Trivy (HIGH/CRITICAL)
6. **Phase 6**: SBOM Syft (CycloneDX) + artifact
7. **Phase 7**: resume securite global en fin de run
8. **Phase 8**: environment `production` avec approbation reviewer
9. **Phase 9**: separation verify/release
10. **Phase 10**: simulation incident et retablissement

## 5. Validation attendue (Phase 9)

1. PR vers `main` -> **seul `verify.yml`** tourne
2. Push direct sur `main` -> **seul `release.yml`** tourne

## 6. Politique de securite appliquee

1. aucun secret en clair dans le code
2. image taggee avec `${{ github.sha }}`
3. pipeline bloquee si gate securite depassee
4. approbation manuelle requise pour production

## 7. Fichiers de reference

1. `DEVOPS_CICD_PLAYBOOK.md` (guide complet reutilisable)
2. `journal_de_bord_phase3.md` (mesures cache)
3. `journal_de_bord_phase5.md` (resultats security-image)
4. `journal_de_bord_phase10.md` (incident drill, timeline, MTTR, retablissement)

## 8. Resultat attendu en fin de parcours

1. verification PR et release main separes (`verify.yml` / `release.yml`)
2. publication Docker avec tag SHA traceable
3. gates securite actifs (deps, secrets, image, SBOM)
4. approbation humaine obligatoire avant publication production
5. journal d'incident Phase 10 complete avec MTTR et actions preventives

---
