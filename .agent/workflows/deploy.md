---
name: Deploy Workflow
description: Deployment workflow
---

# Deployment Workflow

## Purpose

Automate the deployment process.

## Steps

1. Run tests
2. Build the application
3. Deploy to staging
4. Run smoke tests
5. Deploy to production

## How to Run

```bash
pnpm test
pnpm build
pnpm deploy
```
