# Journal de bord - Phase 3 (Mesurer avant d'optimiser)

## Objectif

Mesurer avec des chiffres reels avant et apres optimisation cache npm.

## Tableau de bord

| Run | Contexte | Cache npm | Duree totale du run (s) | Duree job test (s) | Taille image publiee | Tag image (sha) | Notes |
|---|---|---|---:|---:|---|---|---|
| 1 | Avant cache | OFF | 68 (1m08s) | 4 (3s npm ci + 1s test) | ~20 MB | b70c44dc900c7a29e577b72fafbbb9995347d6cb | digest: sha256:5df9374e066b0db0432dc53a60e817e24d5d5b8d21d79a9a781b598e7bcd04b0 |
| 2 | Apres cache | ON | 71 (1m11s) | 4 (2s npm ci + 2s test) | ~20 MB | ec1af0af68817013644062532963a454840af449 | digest: sha256:2a9915ca305cf1714fec8ab631830c6501140d32f38a5e07b2df11707652b7ab |

## Ecarts mesures (pas estimes)

- Ecart run total = Avant cache - Apres cache = -3 s (68s -> 71s)
- Ecart job test = Avant cache - Apres cache = 0 s (4s -> 4s)
- Ecart npm ci lint = 4s -> 3s = +1 s (gain)
- Ecart npm ci test = 3s -> 2s = +1 s (gain)

Interpretation:

1. Ecart positif: cache utile.
2. Ecart nul ou negatif: cache mal configure (cle, chemin, invalidation) ou inutile sur ce cas.
3. Ici, `npm ci` gagne 1s sur lint et test, mais le run total reste legerement plus long (+3s) a cause des variations hors `npm ci` (tests, reseau, build/push Docker, charge runner).
4. Pour conclure proprement, comparer encore 1 ou 2 runs "source-only" avec cache ON.

## Ou recuperer les mesures

1. Duree totale du run: onglet Actions > run > resume (ou temps global affiche en haut).
2. Duree job test: onglet Actions > job test > duree affichee a droite.
3. Taille image publiee: Docker Hub > repository > tag correspondant au sha.
4. Tag image: `${{ github.sha }}` (visible dans les logs et le summary du job build-and-push).

## Procedure recommandee

1. Avant cache (baseline)
- Sur une branche de test, desactiver temporairement `cache: "npm"` dans le workflow.
- Push sur `main` (ou fusionner via PR) pour obtenir une mesure complete jusqu'au publish.
- Reporter les valeurs de la ligne "Avant cache".

2. Apres cache
- Remettre `cache: "npm"` dans le workflow.
- Faire un commit qui ne touche pas les dependances (ex: petite modif JS/CSS).
- Push sur `main`.
- Reporter les valeurs de la ligne "Apres cache".

3. Verifier l'integrite du cache entre branches
- Creer une branche B depuis main.
- Modifier un fichier source seulement (sans toucher package.json/package-lock.json).
- Lancer la CI: le cache doit accelerer `npm ci`.
- Verifier qu'aucune dependance absente de package.json n'apparait comme installee.

4. Verifier le scenario "source only"
- Faire un commit qui touche uniquement un fichier source (ex: `src/game.js`).
- Relancer CI sur main.
- Comparer la duree `npm ci` avec un run precedent: elle doit rester basse grace au cache.

## Verifications attendues

1. L'ecart apres cache doit etre mesure et justifiable, pas estime.
2. Si l'ecart est nul/negatif, verifier la config cache (cle/dependency path).
3. Une branche ne doit jamais installer des dependances absentes de son package.json, meme avec cache.
4. Un commit sans changement de dependances doit profiter au maximum du cache.

## Verdict final Phase 3

- [x] Ligne "Avant cache" completee
- [x] Ligne "Apres cache" completee
- [x] Ecarts calcules avec valeurs numeriques
- [ ] Test branche sans changement dependances valide
- [ ] Test commit source-only valide

