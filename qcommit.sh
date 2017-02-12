#!/bin/bash

current_branch=$(git branch | grep \* | tr -d ' *')

if [$current_branch != 'master']; then
    echo 'You are not in master'
fi

git pull
git add .
git commit -m "$1"
git push origin $current_branch
