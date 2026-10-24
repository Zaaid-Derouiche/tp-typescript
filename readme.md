//Cette commande crée package.json, le fichier qui décrit ton projet et ses dépendances.
npm init -y

//Installer TypeScript uniquement dans se projet.
npm install --save-dev typescript

//Verifier Version TypeScript
npx tsc -v

//Compiler le programme et execute
npx tsc main.ts
node main.js
