# Journal de bord - Phase 10 (Incident drill et retablissement)

## Objectif

Simuler un incident CI volontaire, observer son impact sur la chaine de livraison, puis retablir la pipeline et mesurer le temps de reprise (MTTR).

## Contexte

- Branche d'exercice: `phase10-incident-drill`
- Workflows actifs:
  - `verify.yml` (pull_request)
  - `release.yml` (push main)

## Incident provoque

1. Un test a ete volontairement casse dans `tests/game.test.js`.
2. Assertion modifiee pour provoquer un echec (`Expected: "2" / Received: "1"`).
3. Commit pousse sur la branche d'exercice et PR ouverte vers `main`.

## Effets observes

1. La PR passe au rouge sur `verify.yml` (echec tests).
2. La PR fautive a pu etre fusionnee (cas de figure d'incident reel).
3. Le workflow `release.yml` sur `main` est passe au rouge a son tour.

## Correctif applique

1. Restauration de l'assertion correcte dans `tests/game.test.js`.
2. Validation locale:

```bash
npm test
```

Resultat: 4/4 suites vertes, 17/17 tests verts.

3. Push du correctif et rerun CI.

## Retablissement

1. `verify.yml` redevient vert apres correctif.
2. `release.yml` redevient vert sur `main` apres merge du hotfix.
3. La chaine de livraison est restauree.

## Timeline (a completer)

- T0 (incident introduit): commit intentionnel `phase10: intentionally break test for incident drill` (PR #4)
- T1 (PR rouge detectee): run Verify CI #2 en echec (actions/runs/30983855943)
- T2 (merge fautif vers main): merge PR #4 (commit `c8674f19558445ebcd0ae9dcd5e8891882548ee9`)
- T3 (release rouge sur main): run Release CI #3 en echec (actions/runs/30983996703)
- T4 (commit correctif): `phase10: fix broken test and restore pipeline` (PR #5, run Verify CI #3)
- T5 (pipeline redevenue verte): merge PR #5 (commit `6bad817a89dbea5c60aed204a243e1f2c57947d9`, run Release CI #4 vert)

## MTTR

- Definition: temps entre l'introduction de l'incident et le retour a l'etat vert.
- Formule: `MTTR = T5 - T0`
- MTTR mesure: environ 7 minutes (de Verify CI #2 rouge a Release CI #4 vert, d'apres les horodatages des runs).

## Cause racine

- Erreur volontaire d'assertion de test (incident drill pedagogique).

## Actions preventives

1. Activer des protections de branche sur `main`:
   - Required status checks before merge
   - Blocage de merge quand `verify.yml` est rouge
2. Garder des commits petits et scopes.
3. Conserver la separation `verify` / `release` pour diagnostiquer plus vite.

## Lecons apprises

1. Une pipeline rouge sur `main` bloque la livraison.
2. La detection en PR doit idealement empecher toute fusion fautive.
3. Le hotfix rapide + verification automatisee reduit fortement l'impact.

## Liens de preuve (a completer)

1. PR incidente: https://github.com/thivananhnguyen/ClickFast/pull/4
2. Run `verify.yml` rouge: https://github.com/thivananhnguyen/ClickFast/actions/runs/30983855943
3. Run `release.yml` rouge sur main: https://github.com/thivananhnguyen/ClickFast/actions/runs/30983996703
4. Commit de correction: https://github.com/thivananhnguyen/ClickFast/commit/6bad817a89dbea5c60aed204a243e1f2c57947d9
5. Run redevenu vert: https://github.com/thivananhnguyen/ClickFast/actions/runs/30984315631
