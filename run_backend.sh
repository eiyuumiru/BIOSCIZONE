#!/usr/bin/env bash
set -e

# Di chuyen vao thu muc backend (tinh tu vi tri dat file script nay)
cd backend

# Tao moi truong ao voi Python 3.12 neu chua ton tai
if [ ! -d "venv" ]; then
    echo "Dang tao moi truong ao voi Python 3.12..."
    py -3.12 -m venv venv
fi

# Kich hoat moi truong ao
source venv/Scripts/activate

# Cai dat thu vien can thiet
echo "Dang kiem tra va cai dat cac thu vien tu requirements.txt..."
pip install -r requirements.txt

# Khoi tao database local (idempotent - an toan khi chay nhieu lan)
echo "Dang khoi tao database local..."
python -m app.init_local

# Khoi chay server Backend
echo "Dang khoi chay Backend server tai http://127.0.0.1:8000 ..."
python -m uvicorn app.main:app --reload