#!/bin/bash

for file in *.png; do
  if [ -f "$file" ]; then
    first_letter="${file:0:1}"
    if [ "$first_letter" != "i" ]; then
      new_name="${file:1}"
      mv "$file" "$new_name"
    fi
  fi
done
