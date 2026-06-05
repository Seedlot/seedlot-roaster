# Seedlot Roaster Deprecation

Status: Deprecated  
Replacement: Seedlot Roastery OS  
Replacement path: `../seedlot-roastery-os`

## Reason

`seedlot-roaster` was the original mini ROEST profile generator. The production `roast.seedlot.io` product is now Seedlot Roastery OS, which includes the operator console, cupping workflows, settings, API keys, ROEST integrations, and CMS-backed roastery operations.

Keeping this app deployable creates a direct risk: a local Vercel deploy from this folder can replace the Roastery OS production deployment because the historical Vercel project still owns the `roast.seedlot.io` alias.

## Rules

- Do not deploy from this repository.
- Do not add new product work here.
- Do not treat this repository as the source for `roast.seedlot.io`.
- Use `../seedlot-roastery-os` and `Seedlot/seedlot-roastery-os` for production Roastery OS work.

## Guardrail

The `dev`, `build`, and `start` scripts intentionally exit with a failure message. If Vercel or a human accidentally runs a production build from this repo, the deployment fails and the current Roastery OS deployment remains active.

