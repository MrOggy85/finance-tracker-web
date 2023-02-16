#!/bin/bash
set -e
echo ""
echo "deploy finance-tracker..."

echo "build..."
yarn build

echo "remove build folder in server..."
ssh -T $SSH_HOST -p $SSH_PORT 'rm -rfv ${SERVER_FOLDER}/build'
echo ""

echo "upload local build folder..."
scp -P $SSH_PORT -r $(pwd)/build $SSH_HOST:${SERVER_FOLDER}

echo "DONE"
