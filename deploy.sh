#!/bin/bash

cd backend/blockchain/contract/ || exit 1

output=$(npx hardhat run scripts/deploy.js --network fuji)

contract_address=$(echo "$output" | grep -oE '0x[a-fA-F0-9]{40}')

if [ -z "$contract_address" ]; then
  echo "❌ Impossible de trouver l'adresse du contrat dans la sortie."
  exit 1
fi

cd ../../../ || exit 1
echo "✅ Adresse du contrat trouvée : $contract_address"

env_file=".env"
tmp_file=".env.tmp"

awk -v new_address="$contract_address" 'NR == 7 {$0="CONTRACT_ADDRESS=" new_address} {print}' "$env_file" > "$tmp_file" && mv "$tmp_file" "$env_file"

echo "✅ Fichier .env mis à jour avec succès."
