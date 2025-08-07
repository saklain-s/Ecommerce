# 🆓 Free AWS Deployment Guide for ShopAura

This guide shows you how to deploy ShopAura **completely FREE** using AWS Free Tier and alternative platforms.

## 🎯 **Free Deployment Options**

### **Option 1: AWS Free Tier (12 Months)**
- ✅ **100% Free** for 12 months
- ✅ **Production-ready** infrastructure
- ✅ **Auto-scaling** capabilities
- ✅ **Professional** monitoring

### **Option 2: Alternative Free Platforms**
- ✅ **Railway** - Free tier with $5 credit
- ✅ **Render** - Free tier available
- ✅ **Vercel** - Free tier for frontend
- ✅ **Netlify** - Free tier for frontend
- ✅ **Heroku** - Free tier (limited)

## 🚀 **AWS Free Tier Deployment (Recommended)**

### **Step 1: Create AWS Account**
1. Go to [AWS Console](https://aws.amazon.com/)
2. Click **"Create an AWS Account"**
3. **Important**: Use a valid email and credit card (won't be charged during free tier)
4. **Set up billing alerts**:
   - Go to **Billing Dashboard**
   - Set up **Billing Alerts** at $1, $5, $10
   - This prevents unexpected charges

### **Step 2: Create IAM User (Free)**
```bash
# In AWS Console → IAM → Users → Create User
Name: shopaura-deploy-user

# Attach these policies (all free):
- AmazonEC2ContainerRegistryFullAccess
- AmazonECS-FullAccess  
- AmazonEC2FullAccess
- IAMFullAccess
- CloudWatchLogsFullAccess
```

### **Step 3: Generate Access Keys (Free)**
1. Select the IAM user → **Security credentials**
2. **Create access key** → **Application running outside AWS**
3. **Save these** (you'll need them):
   ```
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=...
   ```

### **Step 4: Install Tools (Free)**
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Install Terraform
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install terraform
```

### **Step 5: Configure AWS CLI (Free)**
```bash
aws configure
# Enter your AWS_ACCESS_KEY_ID
# Enter your AWS_SECRET_ACCESS_KEY  
# Enter region: us-east-1
# Enter output format: json
```

### **Step 6: Deploy Infrastructure (Free)**
```bash
cd infrastructure
terraform init
terraform plan
terraform apply -var-file="free-tier.tfvars"
```

### **Step 7: Add GitHub Secrets (Free)**
1. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. **Add these repository secrets**:
   ```
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   ```

### **Step 8: Deploy Application (Free)**
```bash
git add .
git commit -m "Free tier deployment setup"
git push origin main
```

## 💰 **AWS Free Tier Limits (12 Months)**

| Service | Free Limit | Our Usage |
|---------|------------|-----------|
| **ECR** | 500MB storage | ✅ Within limit |
| **ECS Fargate** | 2 tasks | ✅ Using 2 tasks |
| **ALB** | 15GB data | ✅ Within limit |
| **CloudWatch** | 5GB logs | ✅ Within limit |
| **Data Transfer** | 15GB out | ✅ Within limit |
| **VPC** | Always free | ✅ Free forever |

## 🆓 **Alternative Free Platforms**

### **Option A: Railway (Recommended Alternative)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy backend
cd sb-com
railway init
railway up

# Deploy frontend  
cd ../frontend
railway init
railway up
```

**Railway Benefits:**
- ✅ **$5 free credit** monthly
- ✅ **Auto-deployment** from GitHub
- ✅ **Custom domains** included
- ✅ **Database** included
- ✅ **SSL certificates** free

### **Option B: Render**
```bash
# Create render.yaml
services:
  - type: web
    name: shopaura-backend
    env: java
    buildCommand: mvn clean package
    startCommand: java -jar target/*.jar

  - type: web  
    name: shopaura-frontend
    env: static
    buildCommand: npm run build
    staticPublishPath: ./dist
```

**Render Benefits:**
- ✅ **Free tier** available
- ✅ **Auto-deployment** from GitHub
- ✅ **Custom domains** included
- ✅ **SSL certificates** free

### **Option C: Vercel + Railway**
```bash
# Frontend on Vercel (Free)
cd frontend
npm install -g vercel
vercel

# Backend on Railway (Free)
cd ../sb-com
railway up
```

**Vercel Benefits:**
- ✅ **Unlimited** free tier
- ✅ **Global CDN** included
- ✅ **Auto-deployment** from GitHub
- ✅ **Custom domains** included

## 🔧 **Cost Optimization Strategies**

### **1. Use Free Tier Resources**
```terraform
# In free-tier.tf
cpu    = 256   # Minimum for free tier
memory = 512   # Minimum for free tier
```

### **2. Disable Expensive Features**
```terraform
# Disable Container Insights (saves money)
setting {
  name  = "containerInsights"
  value = "disabled"
}
```

### **3. Short Log Retention**
```terraform
# Keep logs for 7 days only
retention_in_days = 7
```

### **4. Single Subnet**
```terraform
# Use only one subnet to save costs
resource "aws_subnet" "public" {
  # Only one subnet instead of multiple
}
```

## 🚨 **Free Tier Monitoring**

### **Set Up Billing Alerts**
```bash
# In AWS Console → Billing → Billing Preferences
# Set up alerts at:
- $1.00
- $5.00  
- $10.00
```

### **Monitor Usage**
```bash
# Check ECS usage
aws ecs describe-services --cluster shopaura-cluster-free

# Check ECR storage
aws ecr describe-repositories

# Check CloudWatch logs
aws logs describe-log-groups
```

## 📊 **Expected Monthly Costs**

### **AWS Free Tier (12 Months)**
| Service | Cost |
|---------|------|
| **ECR** | $0 |
| **ECS** | $0 |
| **ALB** | $0 |
| **CloudWatch** | $0 |
| **Data Transfer** | $0 |
| **Total** | **$0/month** |

### **After 12 Months**
| Service | Estimated Cost |
|---------|----------------|
| **ECR** | $5-10 |
| **ECS** | $15-30 |
| **ALB** | $20-30 |
| **Total** | **$40-70/month** |

## 🎯 **Quick Start Commands**

### **Option 1: AWS Free Tier**
```bash
# 1. Clone repository
git clone <your-repo>
cd Ecommerce

# 2. Deploy infrastructure
cd infrastructure
terraform init
terraform apply -var-file="free-tier.tfvars"

# 3. Add GitHub secrets
# Go to GitHub → Settings → Secrets → Add AWS credentials

# 4. Deploy application
git push origin main
```

### **Option 2: Railway (Alternative)**
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Deploy backend
cd sb-com
railway login
railway up

# 3. Deploy frontend
cd ../frontend
railway up

# 4. Get URLs
railway status
```

## 🔍 **Troubleshooting Free Deployment**

### **Common Issues & Solutions**

**Issue: "Insufficient permissions"**
```bash
# Solution: Add more IAM policies
- AmazonEC2ContainerRegistryFullAccess
- AmazonECS-FullAccess
```

**Issue: "Free tier limit exceeded"**
```bash
# Solution: Check usage
aws ecs describe-services --cluster shopaura-cluster-free
aws ecr describe-repositories
```

**Issue: "Billing alert triggered"**
```bash
# Solution: Check what's using resources
aws ce get-cost-and-usage --time-period Start=2024-01-01,End=2024-01-31 --granularity MONTHLY --metrics BlendedCost
```

## 🎉 **Success Checklist**

- ✅ **AWS account** created
- ✅ **IAM user** with proper permissions
- ✅ **Access keys** generated and saved
- ✅ **Terraform** infrastructure deployed
- ✅ **GitHub secrets** added
- ✅ **Application** deployed successfully
- ✅ **Billing alerts** configured
- ✅ **Application** accessible via URL

## 📞 **Support**

If you encounter issues:

1. **Check AWS Free Tier limits** in AWS Console
2. **Review CloudWatch logs** for application errors
3. **Monitor billing** to ensure you're within free limits
4. **Use alternative platforms** if AWS free tier is exhausted

## 🚀 **Next Steps After Free Deployment**

1. **Monitor performance** using CloudWatch
2. **Set up custom domain** (optional)
3. **Configure SSL certificates** (automatic with ALB)
4. **Set up monitoring alerts**
5. **Plan for scaling** when free tier expires

---

**Remember**: AWS Free Tier is valid for **12 months** from account creation. After that, you can either:
- **Upgrade to paid** AWS services
- **Migrate to alternative** free platforms
- **Use hybrid approach** (frontend on Vercel, backend on Railway) 