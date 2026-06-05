# DEPRECATED: Seedlot Roaster

This repository is retired.

Do not deploy this app. It is the old mini roast profile generator and is not the production Roastery OS experience.

Production `https://roast.seedlot.io` is served by Seedlot Roastery OS:

- Local workspace: `../seedlot-roastery-os`
- GitHub repo: `Seedlot/seedlot-roastery-os`
- Product scope: roastery operator console, cupping, settings, ROEST integrations, inventory, and CMS-backed workflows

## Deployment Guard

`npm run build`, `npm run dev`, and `npm run start` intentionally fail in this repository. This prevents accidental Vercel deployments from replacing Roastery OS at `roast.seedlot.io`.

For any roast app work, use `external/seedlot-roastery-os`.

