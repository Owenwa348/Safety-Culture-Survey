# 🔥 Development Mode - Hot Reload

## การใช้งาน

### Development Mode (แก้โค้ดแล้วอัปเดตอัตโนมัติ)
```bash
# รันด้วย dev mode
docker-compose -f docker-compose.dev.yml up

# หรือ รันเป็น background
docker-compose -f docker-compose.dev.yml up -d

# ดู logs
docker-compose -f docker-compose.dev.yml logs -f

# หยุดทำงาน
docker-compose -f docker-compose.dev.yml down
```

### Production Mode (Build แล้วรัน - ไม่มี hot reload)
```bash
# รัน production
docker-compose up -d

# Rebuild เมื่อมีการเปลี่ยนแปลง
docker-compose up -d --build
```

## ความแตกต่าง

| Feature | Development Mode | Production Mode |
|---------|------------------|-----------------|
| **Backend** | nodemon (auto-restart) | node (ต้อง restart manual) |
| **Frontend** | Vite dev (hot reload) | Static files (ต้อง rebuild) |
| **Port Frontend** | 5173 | 80 |
| **แก้โค้ด** | ✅ อัปเดตทันที | ❌ ต้อง rebuild |
| **Performance** | ช้ากว่า | เร็วกว่า |
| **Use Case** | พัฒนา/ดีบัก | Production/Demo |

## Development Mode Features

### Backend
- ✅ **Hot Reload** - แก้ `.js` แล้วรันใหม่อัตโนมัติ (nodemon)
- ✅ **Volume Mount** - โค้ดในเครื่อง sync กับ container
- ✅ **Auto Install** - `npm install` อัตโนมัติเมื่อ start

### Frontend
- ✅ **Hot Module Replacement** - แก้ `.vue` แล้วเห็นผลทันทีไม่ต้อง refresh
- ✅ **Fast Refresh** - React/Vue Fast Refresh
- ✅ **Vite Dev Server** - รัน dev mode ตรงๆ ไม่ต้อง build

## URL เข้าใช้งาน

### Development Mode
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- MySQL: localhost:3307

### Production Mode
- Frontend: http://localhost (port 80)
- Backend: http://localhost:5000
- MySQL: localhost:3307

## Tips

1. **ใช้ Dev Mode ตอนพัฒนา** - เห็นผลทันทีไม่ต้อง rebuild
2. **ใช้ Production Mode ตอน Deploy** - เร็วและเสถียรกว่า
3. **Switch ระหว่าง Mode**:
   ```bash
   # หยุด production
   docker-compose down
   
   # รัน dev mode
   docker-compose -f docker-compose.dev.yml up -d
   ```

## Troubleshooting

### ถ้า hot reload ไม่ทำงาน
```bash
# Restart containers
docker-compose -f docker-compose.dev.yml restart

# หรือ rebuild
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d
```

### ถ้ามี error dependencies
```bash
# เข้าไปใน container แล้ว install ใหม่
docker exec -it safety-survey-backend-dev npm install
docker exec -it safety-survey-frontend-dev npm install
```
