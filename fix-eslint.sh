#!/bin/bash
# Script pour corriger les erreurs ESLint simples

# Remplacer 'catch (error)' par 'catch' quand error n'est pas utilisé
find src -type f \( -name "*.ts" -o -name "*.astro" \) -exec sed -i '' 's/} catch (error) {/} catch {/g' {} \;

# Remplacer 'const xyz =' par '_xyz =' pour variables inutilisées
# (à faire manuellement pour éviter de casser le code)

echo "Fix basiques appliqués. Vérifiez avec 'npm run lint'"
