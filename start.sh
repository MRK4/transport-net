#!/bin/bash

# Script de démarrage rapide pour Transport-Net

echo "🚇 Transport-Net - Démarrage..."

# Vérifier si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    npm run install:all
fi

# Vérifier si Prisma est configuré
if [ ! -d "backend/node_modules/.prisma" ]; then
    echo "🗄️ Configuration de la base de données..."
    cd backend
    npm run prisma:generate
    npm run prisma:migrate
    cd ..
fi

echo "🚀 Lancement du projet..."
echo ""
echo "Backend : http://localhost:3000"
echo "Frontend : http://localhost:3001"
echo ""
echo "Pour arrêter le serveur, appuyez sur Ctrl+C"
echo ""

npm run dev

