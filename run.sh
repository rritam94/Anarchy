#!/bin/bash

source venv/bin/activate

pip install -r requirements.txt

python app.py &

cd chat_ui

npm install

npm start