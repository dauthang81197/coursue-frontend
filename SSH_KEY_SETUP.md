# SSH Key Setup Guide cho GitHub Actions

## Lỗi hiện tại:

```
ssh: handshake failed: ssh: unable to authenticate, attempted methods [none], no supported methods remain
```

Lỗi này xảy ra vì SSH key không đúng format hoặc không có quyền truy cập EC2.

---

## 🔧 Cách fix:

### Bước 1: Kiểm tra SSH key trên máy local

```bash
# Xem private key hiện tại
cat ~/.ssh/your-ec2-key.pem

# Hoặc nếu bạn dùng file .pem từ AWS
cat /path/to/your-key.pem
```

**Format đúng của private key:**

```
-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
(nhiều dòng base64)
...
-----END RSA PRIVATE KEY-----
```

Hoặc format mới hơn:

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAA...
(nhiều dòng base64)
...
-----END OPENSSH PRIVATE KEY-----
```

### Bước 2: Test SSH connection từ local

```bash
# Test kết nối SSH với key
ssh -i ~/.ssh/your-ec2-key.pem ubuntu@YOUR_EC2_IP

# Nếu được hỏi "Are you sure you want to continue connecting?", gõ yes
# Nếu kết nối thành công, thoát ra bằng exit
```

**Nếu gặp lỗi "Permissions are too open":**

```bash
chmod 600 ~/.ssh/your-ec2-key.pem
```

**Nếu gặp lỗi "Permission denied (publickey)":**

- Check username đúng chưa (thường là `ubuntu`, `ec2-user`, hoặc `admin`)
- Check Security Group của EC2 có allow SSH (port 22) không

### Bước 3: Copy ĐÚNG private key vào GitHub Secrets

#### Cách 1: Copy toàn bộ nội dung file

```bash
# macOS
cat ~/.ssh/your-ec2-key.pem | pbcopy

# Linux
cat ~/.ssh/your-ec2-key.pem | xclip -selection clipboard

# Manual
cat ~/.ssh/your-ec2-key.pem
# Rồi copy tay (bao gồm cả BEGIN và END)
```

#### Cách 2: Convert key nếu cần

Nếu key không đúng format, convert sang OpenSSH format:

```bash
ssh-keygen -p -f ~/.ssh/your-ec2-key.pem -m pem -P "" -N ""
```

### Bước 4: Cập nhật GitHub Secrets

1. Vào repository GitHub: `https://github.com/dauthang81197/coursue-frontend`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Tìm secret `EC2_SSH_KEY`:
   - Nếu chưa có: Click **New repository secret**
   - Nếu đã có: Click vào secret → **Update**

4. **QUAN TRỌNG:** Paste toàn bộ nội dung private key, bao gồm:

   ```
   -----BEGIN RSA PRIVATE KEY-----
   MIIEpAIBAAKCAQEA...
   (TẤT CẢ các dòng)
   ...
   -----END RSA PRIVATE KEY-----
   ```

5. Click **Add secret** hoặc **Update secret**

### Bước 5: Verify các secrets khác

Kiểm tra các secrets sau đã được set chưa:

| Secret Name   | Example Value                          | Description                                    |
| ------------- | -------------------------------------- | ---------------------------------------------- |
| `EC2_HOST`    | `54.123.45.67` hoặc `ec2.example.com`  | IP hoặc domain của EC2                         |
| `EC2_USER`    | `ubuntu`                               | Username SSH (thường là ubuntu cho Ubuntu AMI) |
| `EC2_SSH_KEY` | `-----BEGIN RSA PRIVATE KEY-----\n...` | Private key **FULL** content                   |

### Bước 6: Test lại workflow

1. Commit và push code:

```bash
git add .
git commit -m "fix: update SSH key setup"
git push origin feat/cicd
```

2. Vào GitHub → **Actions** → Xem workflow run
3. Check logs của step "Copy files to EC2"

---

## 🔍 Troubleshooting

### Lỗi: "ssh: no key found"

**Nguyên nhân:** Key không đúng format hoặc bị mất ký tự BEGIN/END

**Giải pháp:**

- Đảm bảo copy TOÀN BỘ nội dung từ `-----BEGIN` đến `-----END`
- Không có thêm space hoặc newline ở đầu/cuối
- Key phải có format đúng (RSA hoặc OpenSSH)

### Lỗi: "Permission denied (publickey)"

**Nguyên nhân:**

- Username sai
- Key không match với EC2
- Security Group chặn SSH

**Giải pháp:**

1. Check username đúng:

```bash
# Ubuntu AMI
EC2_USER=ubuntu

# Amazon Linux
EC2_USER=ec2-user

# Debian
EC2_USER=admin
```

2. Check Security Group:
   - Vào AWS Console → EC2 → Security Groups
   - Đảm bảo có rule: **Type: SSH, Port: 22, Source: 0.0.0.0/0** (hoặc IP của GitHub Actions)

3. Check key pair:
   - Đảm bảo EC2 instance được launch với key pair tương ứng
   - Vào EC2 instance → Description → Key pair name

### Lỗi: "Host key verification failed"

**Nguyên nhân:** EC2 host chưa được thêm vào known_hosts

**Giải pháp:** Workflow đã được update với step "Prepare SSH key" để tự động thêm host vào known_hosts

---

## ✅ Checklist

- [ ] Test SSH từ local thành công: `ssh -i key.pem ubuntu@EC2_IP`
- [ ] Copy đúng FULL private key (bao gồm BEGIN/END)
- [ ] Paste vào GitHub Secret `EC2_SSH_KEY`
- [ ] Set đúng `EC2_HOST` (IP hoặc domain)
- [ ] Set đúng `EC2_USER` (ubuntu/ec2-user/admin)
- [ ] EC2 Security Group allow SSH port 22
- [ ] Push code và check GitHub Actions logs

---

## 📞 Alternative: Sử dụng password thay vì key

Nếu vẫn không work, có thể dùng password authentication:

1. SSH vào EC2 và enable password auth:

```bash
sudo nano /etc/ssh/sshd_config

# Thay đổi:
PasswordAuthentication yes

# Restart SSH
sudo systemctl restart sshd
```

2. Set password cho user:

```bash
sudo passwd ubuntu
```

3. Update workflow để dùng password thay vì key:

```yaml
- name: Copy files to EC2
  uses: appleboy/scp-action@v0.1.7
  with:
    host: ${{ env.EC2_HOST }}
    username: ${{ env.EC2_USER }}
    password: ${{ secrets.EC2_PASSWORD }} # Thay vì key
    source: "..."
    target: "..."
```

**⚠️ Lưu ý:** Password authentication kém bảo mật hơn SSH key. Chỉ dùng cho testing.

---

## 🎯 Best Practice

1. **Dùng ED25519 key** (mạnh hơn RSA):

```bash
ssh-keygen -t ed25519 -C "github-actions@deploy"
# Copy public key lên EC2
ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@EC2_IP
# Dùng private key (~/.ssh/id_ed25519) làm GitHub Secret
```

2. **Giới hạn IP** trong Security Group:
   - Chỉ allow SSH từ GitHub Actions IP ranges
   - Xem list: https://api.github.com/meta → "actions" IPs

3. **Dùng Bastion Host** nếu EC2 trong private subnet

4. **Rotate keys** định kỳ 3-6 tháng
