#!/bin/bash

# 🆓 ShopAura Free Tier Deployment Script

echo "🚀 Starting ShopAura Free Tier Deployment..."

# Check prerequisites
echo "📋 Checking prerequisites..."
command -v aws >/dev/null 2>&1 || { echo "❌ AWS CLI not found. Please install it first."; exit 1; }
command -v terraform >/dev/null 2>&1 || { echo "❌ Terraform not found. Please install it first."; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker not found. Please install it first."; exit 1; }

# Check AWS credentials
echo "🔑 Checking AWS credentials..."
aws sts get-caller-identity >/dev/null 2>&1 || { echo "❌ AWS credentials not configured. Run 'aws configure' first."; exit 1; }

# Deploy infrastructure
echo "🏗️ Deploying infrastructure..."
cd infrastructure
terraform init
terraform plan -out=tfplan
echo "Type 'yes' to continue with deployment:"
read -r response
if [ "$response" = "yes" ]; then
    terraform apply tfplan
    echo "✅ Infrastructure deployed!"
else
    echo "❌ Deployment cancelled"
    exit 1
fi
cd ..

# Build and push images
echo "🐳 Building and pushing Docker images..."
cd infrastructure
ECR_BACKEND_URL=$(terraform output -raw ecr_backend_url)
ECR_FRONTEND_URL=$(terraform output -raw ecr_frontend_url)
cd ..

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin "$ECR_BACKEND_URL"

# Build and push backend
cd sb-com
docker build -t "$ECR_BACKEND_URL:latest" .
docker push "$ECR_BACKEND_URL:latest"
cd ..

# Build and push frontend
cd frontend
docker build -t "$ECR_FRONTEND_URL:latest" .
docker push "$ECR_FRONTEND_URL:latest"
cd ..

# Deploy to ECS
echo "🚀 Deploying to ECS..."
aws ecs update-service --cluster shopaura-cluster-free --service shopaura-backend-service-free --force-new-deployment
aws ecs update-service --cluster shopaura-cluster-free --service shopaura-frontend-service-free --force-new-deployment

echo "⏳ Waiting for services to stabilize..."
aws ecs wait services-stable --cluster shopaura-cluster-free --services shopaura-backend-service-free shopaura-frontend-service-free

# Get URLs
cd infrastructure
ALB_DNS=$(terraform output -raw alb_dns_name)
cd ..

echo ""
echo "🎉 Deployment completed!"
echo "🌐 Your application URLs:"
echo "  Frontend: http://$ALB_DNS"
echo "  Backend: http://$ALB_DNS:8080"
echo ""
echo "💰 Remember to monitor your AWS Free Tier usage!" 