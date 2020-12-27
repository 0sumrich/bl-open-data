#!/bin/bash
rm -r public/data
git add .
git commit -m "predeploy"
git push
npm run deploy