#!/usr/bin/env node

console.error(`
seedlot-roaster is deprecated and must not be built or deployed.

Production roast.seedlot.io is Seedlot Roastery OS.

Use:
  local:  ../seedlot-roastery-os
  repo:   Seedlot/seedlot-roastery-os

This guard intentionally exits with a failure code so an accidental Vercel
deployment from the old mini app cannot replace Roastery OS.
`)

process.exit(1)

