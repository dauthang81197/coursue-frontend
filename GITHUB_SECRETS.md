# GitHub Secrets Setup Guide

## 📋 Required Secrets

Vào repository: `https://github.com/dauthang81197/coursue-frontend/settings/secrets/actions`

Click **New repository secret** và thêm từng secret sau:

### 1. EC2_HOST

- **Name:** `EC2_HOST`
- **Value:** IP public hoặc domain của EC2 instance
- **Example:** `54.123.45.67` hoặc `ec2-54-123-45-67.compute-1.amazonaws.com`

**Cách lấy:**

```bash
# Vào AWS Console → EC2 → Instances
# Copy "Public IPv4 address" hoặc "Public IPv4 DNS"
```

---

### 2. EC2_USER

- **Name:** `EC2_USER`
- **Value:** Username để SSH vào EC2
- **Example:** `ubuntu` (cho Ubuntu AMI), `ec2-user` (cho Amazon Linux)

**Cách xác định:**

- Ubuntu AMI: `ubuntu`
- Amazon Linux: `ec2-user`
- Debian: `admin`
- RHEL: `ec2-user`

---

### 3. EC2_SSH_KEY

- **Name:** `EC2_SSH_KEY`
- **Value:** Toàn bộ nội dung private key file (.pem)

**Cách lấy:**

```bash
# macOS - Copy to clipboard
cat ~/.ssh/your-ec2-key.pem | pbcopy

# Linux - Copy to clipboard
cat ~/.ssh/your-ec2-key.pem | xclip -selection clipboard

# Manual - Print and copy
cat ~/.ssh/your-ec2-key.pem
# Copy toàn bộ output, bao gồm:
# -----BEGIN RSA PRIVATE KEY-----
# (tất cả các dòng)
# -----END RSA PRIVATE KEY-----
```

**⚠️ QUAN TRỌNG:**

- Phải copy TOÀN BỘ từ `-----BEGIN` đến `-----END`
- Không thêm space hoặc newline ở đầu/cuối
- Kiểm tra key hoạt động bằng cách test SSH từ local:
  ```bash
  ssh -i ~/.ssh/your-ec2-key.pem ubuntu@YOUR_EC2_IP
  ```

---

### 4. NEXT_PUBLIC_API_URL

- **Name:** `NEXT_PUBLIC_API_URL`
- **Value:** URL của backend API
- **Example:** `https://api.yourdomain.com` hoặc `http://YOUR_BACKEND_IP:8080`

**Lưu ý:**

- Phải là URL đầy đủ (bao gồm protocol: http/https)
- Không có trailing slash ở cuối
- Frontend sẽ gọi API đến URL này

**Example values:**

```
# Production với domain
https://api.example.com

# Production với IP
http://54.123.45.67:8080

# Development/Staging
http://dev-api.example.com
```

---

## 🔒 Optional Secrets (cho Docker Hub)

Nếu muốn push Docker image lên Docker Hub để reuse:

### 5. DOCKER_USERNAME (Optional)

- **Name:** `DOCKER_USERNAME`
- **Value:** Docker Hub username
- **Example:** `yourusername`

### 6. DOCKER_PASSWORD (Optional)

- **Name:** `DOCKER_PASSWORD`
- **Value:** Docker Hub Personal Access Token
- **Example:** `dckr_pat_xxxxxxxxxxxx`

**Cách tạo Docker Hub token:**

1. Đăng nhập Docker Hub: https://hub.docker.com
2. Account Settings → Security → New Access Token
3. Đặt tên và tạo token
4. Copy token (chỉ hiện 1 lần)

---

## ✅ Verification Checklist

Sau khi thêm tất cả secrets, verify:

- [ ] `EC2_HOST`: Đúng IP/domain của EC2
- [ ] `EC2_USER`: Đúng username (thường là `ubuntu`)
- [ ] `EC2_SSH_KEY`: Full private key từ BEGIN đến END
- [ ] `NEXT_PUBLIC_API_URL`: URL backend đầy đủ với http/https
- [ ] Test SSH từ local: `ssh -i key.pem ubuntu@EC2_IP` thành công
- [ ] EC2 Security Group cho phép SSH (port 22) và HTTP (port 3000)

---

## 🔍 How to Verify Secrets

Không thể view secret value sau khi lưu, nhưng có thể verify bằng cách:

### 1. Check secret exists

Vào Settings → Secrets → Actions → Xem list secrets

### 2. Test deployment

Push code và xem GitHub Actions logs:

- Nếu fail → Check logs để xem secret nào thiếu/sai
- Nếu success → Secrets đúng ✅

### 3. SSH vào EC2 check

```bash
ssh -i your-key.pem ubuntu@EC2_IP

# Check environment trong container
docker exec coursue-frontend env | grep NEXT_PUBLIC

# Xem logs
docker logs coursue-frontend
```

---

## 🐛 Troubleshooting

### Secret không work?

**EC2_HOST issues:**

```bash
# Test ping
ping YOUR_EC2_IP

# Test port 22 open
telnet YOUR_EC2_IP 22
# Hoặc
nc -zv YOUR_EC2_IP 22
```

**EC2_SSH_KEY issues:**

- Lỗi "ssh: no key found" → Key không đúng format
- Lỗi "Permission denied" → Key không match với EC2 hoặc username sai
- Xem chi tiết: [SSH_KEY_SETUP.md](./SSH_KEY_SETUP.md)

**NEXT_PUBLIC_API_URL issues:**

```bash
# SSH vào EC2, check container logs
docker logs coursue-frontend

# Check environment variable
docker exec coursue-frontend printenv NEXT_PUBLIC_API_URL

# Test API từ container
docker exec coursue-frontend wget -O- http://your-api-url/health
```

### Update Secret

Để cập nhật secret:

1. Vào Settings → Secrets → Actions
2. Click vào secret name
3. Click **Update**
4. Paste new value
5. Click **Update secret**

---

## 📝 Summary

**Minimum required secrets:**

```yaml
EC2_HOST=54.123.45.67
EC2_USER=ubuntu
EC2_SSH_KEY=-----BEGIN RSA PRIVATE KEY-----...
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

**After setup:**

1. Commit & push code
2. GitHub Actions will automatically deploy
3. Check deployment at: http://YOUR_EC2_IP:3000

**Need help?**

- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment guide
- Check [SSH_KEY_SETUP.md](./SSH_KEY_SETUP.md) for SSH troubleshooting
