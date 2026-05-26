@AGENTS.md

# Instructions Narrea pour Claude Code

## Déploiement automatique
Après CHAQUE modification de fichiers validée (quand je dis "c'est bon",
"on continue", "applique", ou toute confirmation similaire) :
1. Lance git add .
2. Lance git commit -m "[description courte de ce qui a changé]"
3. Lance git push origin main
4. Confirme-moi avec "✅ Déployé sur GitHub — Vercel met à jour
   narrea.art automatiquement"

## Stack technique
- Next.js 16.2.6, TypeScript, Tailwind CSS v4, App Router
- Supabase (PostgreSQL + Storage + Auth)
- Déployé sur Vercel → narrea.art

## Style de code
- Utilise toujours les tokens de couleur définis dans globals.css
- Composants en .tsx, mobile-first, système de style en place
- Explique toujours en français simple ce que tu modifies
