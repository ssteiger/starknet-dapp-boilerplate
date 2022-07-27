#!/bin/bash

echo 'create and enter the virtual environment'
python3 -m venv ~/cairo_venv
source ~/cairo_venv/bin/activate
echo 'create and enter the virtual environment: OK'

echo 'install requirements'
pip install -r requirements.txt
echo 'install requirements: OK'

echo 'starting chain'
starknet-devnet
