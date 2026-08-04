# Journal de bord - Phase 5 (Security image avec Trivy)

## Objectif

Verifier la securite de l'image Docker publiee et bloquer la pipeline si des vulnerabilites HIGH ou CRITICAL sont detectees.

## Configuration appliquee

Workflow: .github/workflows/node.js.yml

Job: security-image

Principes:
- Le scan image tourne apres build-and-push.
- Le scan cible l'image publiee avec le tag SHA du commit.
- Le seuil de blocage est HIGH,CRITICAL.
- En cas de detection au-dessus du seuil, le job echoue (exit code 1).

## Tableau de suivi des runs

| Run | Commit SHA | Image scannee | Resultat job security-image | HIGH | CRITICAL | Decision pipeline | Notes |
|---|---|---|---|---:|---:|---|---|
| 1 | 441f59bf764fe2d4560811268bd9f64e0e274989 | nguyen.../clickfast:441f59bf764fe2d4560811268bd9f64e0e274989 | FAIL | 33 | 2 | BLOQUEE | Trivy detecte 35 vulnerabilites au total |

## Resume du run 1

- Job: security-image
- Duree approx: 5s
- Scanner: Trivy
- OS detecte dans l'image: alpine 3.21.3
- Total vulnerabilites: 35 (HIGH: 33, CRITICAL: 2)
- Conclusion: Echec attendu du job selon la politique de securite definie.

## Interpretation pedagogique (Phase 5)

1. Le workflow fonctionne correctement: le blocage est voulu et prouve que la gate securite est active.
2. L'echec ne vient pas du YAML mais de vulnerabilites reelles dans l'image.
3. Le scan image complete le scan dependances (npm audit) en couvrant les paquets OS/base image.

## Plan de remediation

1. Mettre a jour regulierement la base image nginx/alpine vers une version plus recente.
2. Rebuilder et republier avec un nouveau tag SHA.
3. Relancer Trivy et comparer le nombre de HIGH/CRITICAL.
4. Conserver la regle de blocage HIGH/CRITICAL pour rester conforme a la politique.

## Scenarios de validation Phase 5

- Cas nominal securite:
  - Si aucune vuln HIGH/CRITICAL n'est detectee, security-image passe.
- Cas de blocage securite:
  - Si des HIGH/CRITICAL sont detectees, security-image echoue et la publication n'est pas validee.
- Cas d'ordre d'execution:
  - security-image doit scanner le tag SHA genere par build-and-push, jamais une image locale non publiee.

## Evidence minimale a conserver

1. URL du run Actions contenant le job security-image.
2. Resume Trivy (totaux HIGH/CRITICAL).
3. Commit SHA et tag image scanne.
4. Decision finale de pipeline (bloquee ou autorisee).
