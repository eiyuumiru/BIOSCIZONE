#!/usr/bin/env bash
set -e

# Di chuyen vao thu muc frontend (tinh tu vi tri dat file script nay)
cd frontend

# Cai dat thu vien npm neu chua co thu muc node_modules
if [ ! -d "node_modules" ]; then
    echo "Dang cai dat cac goi thu vien Frontend (npm install)..."
    npm install
fi

# Khoi chay server Frontend
echo "Dang khoi chay Frontend server..."
npm run dev