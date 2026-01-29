# Deployment Guide - CI/CD với GitHub Actions & EC2

## 📋 Prerequisites

### 1. EC2 Instance Setup

- Ubuntu 20.04 hoặc mới hơn
- Docker và Docker Compose đã cài đặt
- Port 3000 mở trong Security Group
- SSH key để truy cập

### 2. GitHub Repository

- Push code lên GitHub
- Có quyền Settings để thêm Secrets

---

## 🔧 Setup Steps

### Step 1: Cài đặt Docker trên EC2

```bash
# SSH vào EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version

# Logout and login again
exit
```

### Step 2: Tạo thư mục trên EC2

```bash
# SSH lại vào EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Tạo thư mục cho project
mkdir -p ~/coursue-frontend
cd ~/coursue-frontend

# Tạo file .env.production
nano .env.production
```

Copy nội dung từ `.env.production.example` và điền các giá trị thực:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NODE_ENV=production
PORT=3000
```

### Step 3: Cấu hình GitHub Secrets

Vào repository GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Thêm các secrets sau:

| Secret Name       | Description                    | Example            |
| ----------------- | ------------------------------ | ------------------ |
| `EC2_HOST`        | IP hoặc domain của EC2         | `54.123.45.67`     |
| `EC2_USER`        | Username SSH                   | `ubuntu`           |
| `EC2_SSH_KEY`     | Private SSH key                | Nội dung file .pem |
| `DOCKER_USERNAME` | (Optional) Docker Hub username | `yourusername`     |
| `DOCKER_PASSWORD` | (Optional) Docker Hub password | `yourtoken`        |

#### Lấy SSH Key:

```bash
# Trên máy local
cat your-key.pem
# Copy toàn bộ nội dung (bao gồm BEGIN/END)
```

### Step 4: Update Next.js Config

Cập nhật `next.config.ts` để hỗ trợ standalone build:

```typescript
const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone", // Thêm dòng này
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-5e52d815a0ea48b5aa905910e63faf7b.r2.dev",
        pathname: "/thumbnails/**",
      },
    ],
  },
};
```

### Step 5: Push code lên GitHub

```bash
# Add files
git add .

# Commit
git commit -m "feat: add CI/CD with Docker and GitHub Actions"

# Push
git push origin feat/course
```

---

## 🚀 Deployment Process

### Automatic Deployment

- Push code lên branch `main` hoặc `feat/course`
- GitHub Actions tự động:
  1. Build Docker image
  2. Copy image và files lên EC2
  3. Deploy với Docker Compose
  4. Verify deployment

### Manual Deployment

Vào GitHub → **Actions** → **Deploy to EC2** → **Run workflow**

---

## 🔍 Monitoring & Troubleshooting

### Check deployment status

```bash
# SSH vào EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Check containers
docker-compose -f ~/coursue-frontend/docker-compose.yml ps

# View logs
docker-compose -f ~/coursue-frontend/docker-compose.yml logs -f

# Check specific container
docker logs coursue-frontend

# Restart containers
docker-compose -f ~/coursue-frontend/docker-compose.yml restart
```

### Common Issues

**1. Port đã được sử dụng:**

```bash
# Check port 3000
sudo lsof -i :3000
# Kill process nếu cần
sudo kill -9 <PID>
```

**2. Docker build fails:**

- Check GitHub Actions logs
- Verify Dockerfile syntax
- Check environment variables

**3. Container không start:**

```bash
# Check logs
docker logs coursue-frontend
# Check health
docker inspect coursue-frontend
```

**4. SSH connection fails:**

- Verify EC2_HOST và EC2_USER
- Check SSH key format (phải có BEGIN/END)
- Verify Security Group cho phép SSH (port 22)

---

## 🔐 Security Best Practices

1. **Không commit .env files:**
   - Đã có trong `.gitignore`
   - Chỉ lưu trên EC2

2. **Rotate SSH keys định kỳ:**
   - Update GitHub Secrets
   - Update EC2 authorized_keys

3. **Use Docker Hub Private Registry (Optional):**
   - Push image lên Docker Hub
   - Pull từ EC2 thay vì transfer file

4. **Setup SSL/TLS:**
   - Sử dụng Nginx reverse proxy
   - Let's Encrypt cho SSL certificate

---

## 📊 Monitoring Setup (Optional)

### Setup health check endpoint

Create `src/app/api/health/route.ts`:

```typescript
export async function GET() {
  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
```

### Monitoring với Docker stats

```bash
# Real-time stats
docker stats coursue-frontend

# Setup monitoring alerts
# Có thể dùng AWS CloudWatch hoặc Prometheus
```

---

## 🔄 Rollback Strategy

```bash
# SSH vào EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# List images
docker images

# Run specific version
docker-compose down
docker tag coursue-frontend:previous coursue-frontend:latest
docker-compose up -d
```

---

## 📝 Notes

- Domain: Cấu hình A record trỏ đến EC2 IP
- HTTPS: Setup Nginx + Let's Encrypt
- Scaling: Có thể dùng AWS Load Balancer + Auto Scaling
- Database: Nếu cần, thêm service trong docker-compose.yml

---

## 🆘 Support

Nếu gặp vấn đề:

1. Check GitHub Actions logs
2. Check EC2 logs: `docker logs coursue-frontend`
3. Verify all secrets are set correctly
4. Ensure EC2 security group allows traffic on port 3000
