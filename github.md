# Trabajo Diario 
git checkout main  // cambio a main rama 
git add .
git commit -m ""
git push origin main


# Upload to staging when changes are working
git checkout staging
git merge main
git push origin staging
git checkout main # Vuelve a main a seguir trabajando

# upload to develop the one connected to railway
git checkout develop
git merge staging
git push origin develop
git checkout main # Vuelve a main


# Postgres
brew services start postgresql@18  

brew services stop postgresql@18