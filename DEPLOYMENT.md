# ShopAura Deployment Guide

This guide provides step-by-step instructions for deploying the ShopAura e-commerce application using Docker, AWS, and CI/CD.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Redis         │
│   (React)       │    │   (Spring Boot) │    │   (Cache)       │
│   Port: 80      │    │   Port: 8080    │    │   Port: 6379    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Load Balancer │
                    │   (ALB)         │
                    └─────────────────┘
```

## 📋 Prerequisites

### Required Tools
- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [AWS CLI](https://aws.amazon.com/cli/) (v2.0+)
- [Terraform](https://www.terraform.io/downloads) (v1.0+)
- [Git](https://git-scm.com/downloads)

### AWS Account Setup
1. Create an AWS account
2. Create an IAM user with appropriate permissions
3. Configure AWS CLI credentials:
   ```bash
   aws configure
   ```

### GitHub Repository Setup
1. Push your code to GitHub
2. Add the following secrets to your repository:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`

## 🚀 Deployment Options

### Option 1: Automated Deployment (Recommended)

#### Step 1: Clone and Setup
```bash
git clone <your-repo-url>
cd Ecommerce
chmod +x scripts/deploy.sh
```

#### Step 2: Run Deployment Script
```bash
# Full deployment with local testing
./scripts/deploy.sh

# Skip local testing (for production)
./scripts/deploy.sh --skip-local-test
```

### Option 2: Manual Step-by-Step Deployment

#### Step 1: Build Docker Images
```bash
# Build backend
cd sb-com
docker build -t shopaura-backend:latest .
cd ..

# Build frontend
cd frontend
docker build -t shopaura-frontend:latest .
cd ..
```

#### Step 2: Test Locally
```bash
# Start all services
docker-compose up -d

# Check services
docker-compose ps

# Test endpoints
curl http://localhost:8080/actuator/health
curl http://localhost

# Stop services
docker-compose down
```

#### Step 3: Deploy Infrastructure
```bash
cd infrastructure
terraform init
terraform plan
terraform apply
cd ..
```

#### Step 4: Push to ECR
```bash
# Get ECR login token
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Tag and push images
docker tag shopaura-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/shopaura-backend:latest
docker tag shopaura-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/shopaura-frontend:latest

docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/shopaura-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/shopaura-frontend:latest
```

#### Step 5: Update ECS Services
```bash
aws ecs update-service --cluster shopaura-cluster --service shopaura-backend-service --force-new-deployment
aws ecs update-service --cluster shopaura-cluster --service shopaura-frontend-service --force-new-deployment
```

## 🔧 Configuration

### Environment Variables

#### Backend (Spring Boot)
```bash
# Database
DATABASE_URL=jdbc:postgresql://your-db-host:5432/shopaura
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-password

# Redis
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Security
JWT_SECRET=your-jwt-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure-password

# CORS
CORS_ALLOWED_ORIGINS=http://your-frontend-domain
```

#### Frontend (React)
```bash
# API Configuration
REACT_APP_API_URL=http://your-backend-domain:8080
REACT_APP_ENVIRONMENT=production
```

### AWS Configuration

#### IAM Permissions Required
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:*",
        "ecs:*",
        "ec2:*",
        "elasticloadbalancing:*",
        "iam:*",
        "logs:*",
        "cloudwatch:*"
      ],
      "Resource": "*"
    }
  ]
}
```

## 🔍 Monitoring and Logs

### CloudWatch Logs
- Backend logs: `/ecs/shopaura-backend`
- Frontend logs: `/ecs/shopaura-frontend`

### Health Checks
- Backend: `http://your-alb:8080/actuator/health`
- Frontend: `http://your-alb/`

### Metrics
- Application metrics: CloudWatch Metrics
- Container insights: Enabled on ECS cluster

## 🛠️ Troubleshooting

### Common Issues

#### 1. ECS Service Not Starting
```bash
# Check service events
aws ecs describe-services --cluster shopaura-cluster --services shopaura-backend-service

# Check task definition
aws ecs describe-task-definition --task-definition shopaura-backend-task
```

#### 2. Load Balancer Health Check Failing
- Verify security groups allow traffic
- Check application is listening on correct port
- Verify health check path exists

#### 3. Docker Build Failures
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t shopaura-backend:latest .
```

#### 4. Terraform Errors
```bash
# Refresh Terraform state
terraform refresh

# Destroy and recreate
terraform destroy
terraform apply
```

### Debug Commands
```bash
# Check ECS tasks
aws ecs list-tasks --cluster shopaura-cluster

# View task logs
aws logs tail /ecs/shopaura-backend --follow

# Check ALB target health
aws elbv2 describe-target-health --target-group-arn <target-group-arn>
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
The CI/CD pipeline automatically:
1. Runs tests on pull requests
2. Builds Docker images on main branch
3. Pushes images to ECR
4. Deploys to ECS

### Manual Deployment
```bash
# Update ECS services
aws ecs update-service --cluster shopaura-cluster --service shopaura-backend-service --force-new-deployment
aws ecs update-service --cluster shopaura-cluster --service shopaura-frontend-service --force-new-deployment

# Wait for deployment
aws ecs wait services-stable --cluster shopaura-cluster --services shopaura-backend-service shopaura-frontend-service
```

## 📊 Cost Optimization

### Resource Sizing
- ECS Tasks: 256 CPU units, 512 MB memory (adjust based on load)
- Auto Scaling: Configure based on CPU/memory usage
- Reserved Instances: For predictable workloads

### Monitoring Costs
- Set up CloudWatch billing alarms
- Monitor ECS service metrics
- Use AWS Cost Explorer for analysis

## 🔒 Security Best Practices

### Network Security
- Use private subnets for ECS tasks
- Restrict security group rules
- Enable VPC Flow Logs

### Application Security
- Use environment variables for secrets
- Enable HTTPS with SSL certificates
- Implement proper CORS policies

### Container Security
- Scan images for vulnerabilities
- Use minimal base images
- Implement least privilege access

## 📞 Support

For deployment issues:
1. Check CloudWatch logs
2. Review ECS service events
3. Verify network connectivity
4. Test locally with docker-compose

## 📝 Additional Resources

- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Spring Boot Production Ready](https://spring.io/guides/gs/spring-boot-docker/)