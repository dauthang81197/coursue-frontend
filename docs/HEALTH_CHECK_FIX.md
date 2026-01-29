# 🔧 Quick Fix: Container Unhealthy

## ✅ What Was Fixed

### 1. **Missing Health Check Endpoint**

Created `/api/health` endpoint:

- **File:** `src/app/api/health/route.ts`
- **Returns:** JSON with status, timestamp, uptime
- **URL:** `http://localhost:3000/api/health`

### 2. **Missing wget in Alpine Docker Image**

Updated Dockerfile to install wget:

```dockerfile
RUN apk add --no-cache wget
```

---

## 🚀 Deploy the Fix

### Option 1: Via GitHub Actions (Recommended)

```bash
git add .
git commit -m "fix: add health check endpoint and wget for docker health checks"
git push origin feat/cicd
```

GitHub Actions sẽ tự động:

1. Build new Docker image với wget
2. Deploy lên EC2
3. Container sẽ healthy sau 40-60 giây

---

### Option 2: Manual Deploy on EC2

```bash
# SSH vào EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Pull latest code
cd ~/coursue-frontend
git pull origin feat/cicd

# Rebuild image
docker build -t coursue-frontend:latest .

# Redeploy
export NEXT_PUBLIC_API_URL="YOUR_API_URL"
docker compose down
docker compose up -d

# Verify
docker ps
docker logs -f coursue-frontend
```

---

## ✅ Verification Steps

### 1. Wait for Container to Start

```bash
# Container cần 40-60 giây để ready
watch -n 2 'docker ps'
```

**Expected output:**

```
STATUS: Up X minutes (healthy)  ✅
```

### 2. Test Health Endpoint

**From EC2:**

```bash
curl http://localhost:3000/api/health
```

**Expected response:**

```json
{
  "status": "ok",
  "timestamp": "2026-01-29T10:00:00.000Z",
  "uptime": 45.123,
  "env": {
    "nodeEnv": "production",
    "hasApiUrl": true
  }
}
```

**From browser:**

```
http://YOUR_EC2_IP:3000/api/health
```

### 3. Check Application

**Main app:**

```
http://YOUR_EC2_IP:3000
```

Should see the frontend running! 🎉

---

## 📊 Monitoring

### Watch container status:

```bash
watch -n 2 'docker ps'
```

### Follow logs:

```bash
docker logs -f coursue-frontend
```

### Check health history:

```bash
docker inspect coursue-frontend --format='{{json .State.Health}}' | jq
```

---

## 🐛 If Still Unhealthy

### Check logs for errors:

```bash
docker logs coursue-frontend | grep -i error
```

### Common issues:

1. **API URL not set:**

```bash
# Verify environment variable
docker exec coursue-frontend printenv NEXT_PUBLIC_API_URL
```

2. **Port conflict:**

```bash
# Check if port 3000 is available
netstat -tlnp | grep 3000
```

3. **App not starting:**

```bash
# Check if node process is running
docker exec coursue-frontend ps aux
```

---

## 📝 What Changed

### Files Modified:

1. ✅ `src/app/api/health/route.ts` - Created health endpoint
2. ✅ `Dockerfile` - Added wget installation
3. ✅ `docs/TROUBLESHOOTING_UNHEALTHY_CONTAINER.md` - Troubleshooting guide

### Docker Compose (no changes needed):

- Health check already configured correctly
- Will work once wget is available in image

---

## 🎯 Expected Timeline

After deployment:

- **0-10s:** Container starts
- **10-40s:** Next.js app initializing
- **40s:** First health check attempt
- **40-60s:** Container status → `healthy` ✅

---

## ✅ Success Indicators

- [ ] Container status: `Up X minutes (healthy)`
- [ ] Health endpoint returns 200 OK
- [ ] No errors in logs
- [ ] Main app accessible at http://EC2_IP:3000
- [ ] Docker compose ps shows no issues

---

## 📞 Need More Help?

See full troubleshooting guide:

- [TROUBLESHOOTING_UNHEALTHY_CONTAINER.md](./TROUBLESHOOTING_UNHEALTHY_CONTAINER.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)
