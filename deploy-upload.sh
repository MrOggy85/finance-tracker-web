#!/bin/bash
set -e
echo "deploy finance-tracker..."

echo "remove build folder in server..."
ssh -T $SSH_HOST -p $SSH_PORT 'rm -rf ${SERVER_FOLDER}/build'

echo "upload local build folder..."
scp -P $SSH_PORT -r $(pwd)/build $SSH_HOST:${SERVER_FOLDER}

echo "DONE"
