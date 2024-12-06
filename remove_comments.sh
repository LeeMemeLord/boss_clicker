#!/bin/bash

# Vérifie que le fichier d'entrée est fourni en argument
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <fichier_input>"
    exit 1
fi

input_file="$1"
output_file="output.txt"

# Vérifie que le fichier d'entrée existe
if [ ! -f "$input_file" ]; then
    echo "Erreur : le fichier $input_file n'existe pas."
    exit 1
fi

# Supprime les commentaires et écrit le résultat dans un nouveau fichier
sed 's|//.*||g' "$input_file" | sed '/^\s*$/d' > "$output_file"

echo "Les commentaires ont été supprimés. Résultat enregistré dans : $output_file"

