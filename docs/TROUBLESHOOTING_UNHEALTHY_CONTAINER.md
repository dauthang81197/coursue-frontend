# Troubleshooting Unhealthy Container

## 🔍 Current Issue
Container đang chạy nhưng status: **unhealthy**

```
ff9f46696ac2   coursue-frontend:latest   Up 3 minutes (unhealthy)   0.0.0.0:3000->3000/tcp
```

---

## 🔧 Troubleshooting Steps

### 1. Check Container Logs

```bash
# SSH vào EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Xem logs
docker logs coursue-frontend

# Xem real-time logs
docker logs -f coursue-frontend

# Xem 100 dòng cuối
docker logs --tail=100 coursue-frontend
```

**Tìm errors như:**
- `Module not found`
- `Cannot find module`
- `Port already in use`
- `Environment variable not set`

---

### 2. Check Health Check Endpoint

Health check đang gọi: `http://localhost:3000/api/health`

**Test từ bên trong container:**
```bash
# Execute command trong container
docker exec coursue-frontend wget -O- http://localhost:3000/api/health

# Hoặc
docker exec coursue-frontend curl http://localhost:3000/api/health
```

**Test từ EC2 host:**
```bash
curl http://localhost:3000/api/health
```

**Test từ bên ngoài:**
```bash
curl http://YOUR_EC2_IP:3000/api/health
```

---

### 3. Check if App is Running

```bash
# Check processes trong container
docker exec coursue-frontend ps aux

# Check port listening
docker exec coursue-frontend netstat -tlnp | grep 3000

# Hoặc
docker exec coursue-frontend ss -tlnp | grep 3000
```

---

### 4. Inspect Health Check Details

```bash
# Xem health check status chi tiết
docker inspect coursue-frontend | grep -A 20 Health
```

Output sẽ show:
- Health check command
- Exit code
- Output của health check

---

## 🐛 Common Issues & Solutions

### Issue 1: Health Check Endpoint Not Found

**Problem:** `/api/health` route chưa được tạo

**Solution:** Tạo health check endpoint

```bash
# Tạo file src/app/api/health/route.ts
mkdir -p src/app/api/health
cat > src/app/api/health/route.ts << 'EOF'
export async function GET() {
  return Response.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
EOF

# Rebuild và redeploy
git add .
git commit -m "feat: add health check endpoint"
git push origin feat/cicd
```

---

### Issue 2: App Not Starting

**Possible causes:**
- Missing environment variables
- Port conflict
- Build errors

**Check logs:**
```bash
docker logs coursue-frontend 2>&1 | grep -i error
```

**Common errors:**

**a) Missing NEXT_PUBLIC_API_URL:**
```
Error: NEXT_PUBLIC_API_URL is not defined
```

**Fix:** Add to GitHub Secrets và redeploy

**b) Port in use:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Fix:** Stop conflicting container hoặc đổi port

---

### Issue 3: Health Check Timeout

**Problem:** App khởi động lâu, health check timeout trước khi app ready

**Solution:** Tăng timeout và start_period

Update `docker-compose.yml`:
```yaml
healthcheck:
  test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/api/health"]
  interval: 30s
  timeout: 10s
  retries: 5
  start_period: 60s  # Tăng từ 40s lên 60s
```

---

### Issue 4: wget Not Found

**Problem:** Alpine image không có wget

**Solution:** Sử dụng alternative health check

**Option 1: Use node/curl**
```yaml
healthcheck:
  test: ["CMD-SHELL", "node -e \"require('http').get('http://localhost:3000/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))\""]
```

**Option 2: Install wget trong Dockerfile**
```dockerfile
FROM node:20-alpine AS runner
WORKDIR /app

# Install wget for healthcheck
RUN apk add --no-cache wget

# ... rest of Dockerfile
```

---

## ✅ Quick Fixes

### Fix 1: Disable Health Check (Temporary)

Nếu app chạy bình thường nhưng chỉ health check fail:

```yaml
# docker-compose.yml
services:
  frontend:
    # Comment out health check
    # healthcheck:
    #   test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/api/health"]
```

```bash
# Redeploy
docker compose down
docker compose up -d
```

---

### Fix 2: Simple Health Check

Sử dụng TCP check thay vì HTTP:

```yaml
healthcheck:
  test: ["CMD-SHELL", "nc -z localhost 3000 || exit 1"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

---

### Fix 3: Create Health Endpoint Now

SSH vào EC2, tạo endpoint trực tiếp:

```bash
# Stop container
docker compose down

# Sửa code trong image (hack nhanh - không khuyến khích cho production)
docker run --rm -it --entrypoint sh coursue-frontend:latest

# Hoặc rebuild với health endpoint:
# 1. Add health endpoint vào code
# 2. Rebuild image
# 3. Redeploy
```

---

## 📊 Monitoring Commands

```bash
# Watch container status
watch -n 2 'docker ps'

# Monitor logs continuously
docker logs -f coursue-frontend

# Check resource usage
docker stats coursue-frontend

# Health check history
docker inspect coursue-frontend --format='{{json .State.Health}}' | jq
```

---

## 🔄 After Fix Checklist

- [ ] Logs không còn errors
- [ ] Health check endpoint trả về 200 OK
- [ ] Container status: `Up X minutes (healthy)`
- [ ] App accessible tại http://EC2_IP:3000
- [ ] Health endpoint: http://EC2_IP:3000/api/health returns JSON

---

## 📞 Next Steps

1. **Check logs first:** `docker logs coursue-frontend`
2. **Test health endpoint:** `curl http://localhost:3000/api/health`
3. **Create health endpoint** nếu chưa có
4. **Update docker-compose.yml** nếu cần adjust health check
5. **Redeploy:** Push code hoặc manual deploy

---

## 🆘 Emergency: Get App Running Now

Nếu cần app chạy ngay, disable health check tạm thời:

```bash
# SSH vào EC2
ssh -i key.pem ubuntu@EC2_IP

cd ~/coursue-frontend

# Edit docker-compose.yml
nano docker-compose.yml
# Comment out healthcheck section

# Restart
docker compose down
docker compose up -d

# Verify
docker ps
curl http://localhost:3000
```

**⚠️ Lưu ý:** Đây chỉ là temporary fix. Nên implement proper health check endpoint.
