#!/bin/bash

# ShopAura Deployment Script
# This script automates the deployment of the ShopAura application to AWS

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if required tools are installed
check_prerequisites() {
    log "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v aws &> /dev/null; then
        error "AWS CLI is not installed. Please install AWS CLI first."
        exit 1
    fi
    
    if ! command -v terraform &> /dev/null; then
        error "Terraform is not installed. Please install Terraform first."
        exit 1
    fi
    
    success "All prerequisites are installed."
}

# Build Docker images
build_images() {
    log "Building Docker images..."
    
    # Build backend image
    log "Building backend image..."
    cd sb-com
    docker build -t shopaura-backend:latest .
    cd ..
    
    # Build frontend image
    log "Building frontend image..."
    cd frontend
    docker build -t shopaura-frontend:latest .
    cd ..
    
    success "Docker images built successfully."
}

# Test the application locally
test_local() {
    log "Testing application locally..."
    
    # Start the application with docker-compose
    docker-compose up -d
    
    # Wait for services to be ready
    log "Waiting for services to be ready..."
    sleep 30
    
    # Test backend health
    if curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; then
        success "Backend is healthy."
    else
        error "Backend health check failed."
        docker-compose down
        exit 1
    fi
    
    # Test frontend
    if curl -f http://localhost > /dev/null 2>&1; then
        success "Frontend is accessible."
    else
        error "Frontend health check failed."
        docker-compose down
        exit 1
    fi
    
    # Stop local services
    docker-compose down
    success "Local testing completed successfully."
}

# Deploy infrastructure with Terraform
deploy_infrastructure() {
    log "Deploying infrastructure with Terraform..."
    
    cd infrastructure
    
    # Initialize Terraform
    log "Initializing Terraform..."
    terraform init
    
    # Plan the deployment
    log "Planning Terraform deployment..."
    terraform plan -out=tfplan
    
    # Apply the plan
    log "Applying Terraform configuration..."
    terraform apply tfplan
    
    # Get outputs
    ALB_DNS=$(terraform output -raw alb_dns_name)
    BACKEND_URL=$(terraform output -raw backend_url)
    FRONTEND_URL=$(terraform output -raw frontend_url)
    
    cd ..
    
    success "Infrastructure deployed successfully."
    log "Load Balancer DNS: $ALB_DNS"
    log "Backend URL: $BACKEND_URL"
    log "Frontend URL: $FRONTEND_URL"
}

# Push images to ECR
push_to_ecr() {
    log "Pushing images to ECR..."
    
    # Get ECR repository URLs
    AWS_REGION=$(aws configure get region)
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    
    BACKEND_REPO="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/shopaura-backend"
    FRONTEND_REPO="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/shopaura-frontend"
    
    # Login to ECR
    log "Logging in to ECR..."
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
    
    # Tag and push backend image
    log "Pushing backend image..."
    docker tag shopaura-backend:latest $BACKEND_REPO:latest
    docker push $BACKEND_REPO:latest
    
    # Tag and push frontend image
    log "Pushing frontend image..."
    docker tag shopaura-frontend:latest $FRONTEND_REPO:latest
    docker push $FRONTEND_REPO:latest
    
    success "Images pushed to ECR successfully."
}

# Update ECS services
update_ecs_services() {
    log "Updating ECS services..."
    
    # Force new deployment of backend service
    aws ecs update-service --cluster shopaura-cluster --service shopaura-backend-service --force-new-deployment
    
    # Force new deployment of frontend service
    aws ecs update-service --cluster shopaura-cluster --service shopaura-frontend-service --force-new-deployment
    
    # Wait for services to be stable
    log "Waiting for services to be stable..."
    aws ecs wait services-stable --cluster shopaura-cluster --services shopaura-backend-service shopaura-frontend-service
    
    success "ECS services updated successfully."
}

# Health check deployment
health_check() {
    log "Performing health checks..."
    
    # Get ALB DNS name
    ALB_DNS=$(aws elbv2 describe-load-balancers --names shopaura-alb --query 'LoadBalancers[0].DNSName' --output text)
    
    # Test backend
    log "Testing backend health..."
    if curl -f http://$ALB_DNS:8080/actuator/health > /dev/null 2>&1; then
        success "Backend is healthy."
    else
        error "Backend health check failed."
        return 1
    fi
    
    # Test frontend
    log "Testing frontend..."
    if curl -f http://$ALB_DNS > /dev/null 2>&1; then
        success "Frontend is accessible."
    else
        error "Frontend health check failed."
        return 1
    fi
    
    success "All health checks passed."
    log "Application is deployed and accessible at:"
    log "Frontend: http://$ALB_DNS"
    log "Backend API: http://$ALB_DNS:8080"
}

# Main deployment function
main() {
    log "Starting ShopAura deployment..."
    
    # Check prerequisites
    check_prerequisites
    
    # Build images
    build_images
    
    # Test locally (optional - can be skipped in production)
    if [[ "$1" != "--skip-local-test" ]]; then
        test_local
    else
        warning "Skipping local tests."
    fi
    
    # Deploy infrastructure
    deploy_infrastructure
    
    # Push images to ECR
    push_to_ecr
    
    # Update ECS services
    update_ecs_services
    
    # Health check
    health_check
    
    success "Deployment completed successfully!"
}

# Run main function with all arguments
main "$@"