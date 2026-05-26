#!/bin/bash
echo "🚀 Déploiement Narrea en cours..."
git add .
git commit -m "${1:-mise à jour}"
git push origin main
echo "✅ Poussé sur GitHub ! Vercel déploie automatiquement."
