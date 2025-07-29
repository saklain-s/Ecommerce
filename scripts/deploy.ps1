# ShopAura Deployment Script for Windows
# This script automates the deployment of the ShopAura application to AWS

param(
    [switch]$SkipLocalTest
)

# Error handling
$ErrorActionPreference = "Stop"

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

# Logging function
function Write-Log {
    param([string]$Message, [string]$Color = "White")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
}

function Write-Error {
    param([string]$Message)
    Write-Log "ERROR: $Message" $Red
}

function Write-Success {
    param([string]$Message)
    Write-Log "SUCCESS: $Message" $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Log "WARNING: $Message" $Yellow
}

# Check if required tools are installed
function Test-Prerequisites {
    Write-Log "Checking prerequisites..." $Blue
    
    # Check Docker
    try {
        docker --version | Out-Null
        Write-Success "Docker is installed"
    }
    catch {
        Write-Error "Docker is not installed. Please install Docker Desktop first."
        exit 1
    }
    
    # Check AWS CLI
    try {
        aws --version | Out-Null
        Write-Success "AWS CLI is installed"
    }
    catch {
        Write-Error "AWS CLI is not installed. Please install AWS CLI first."
        exit 1
    }
    
    # Check Terraform
    try {
        terraform --version | Out-Null
        Write-Success "Terraform is installed"
    }
    catch {
        Write-Error "Terraform is not installed. Please install Terraform first."
        exit 1
    }
    
    Write-Success "All prerequisites are installed."
}

# Build Docker images
function Build-Images {
    Write-Log "Building Docker images..." $Blue
    
    # Build backend image
    Write-Log "Building backend image..." $Blue
    Set-Location sb-com
    docker build -t shopaura-backend:latest .
    Set-Location ..
    
    # Build frontend image
    Write-Log "Building frontend image..." $Blue
    Set-Location frontend
    docker build -t shopaura-frontend:latest .
    Set-Location ..
    
    Write-Success "Docker images built successfully."
}

# Test the application locally
function Test-Local {
    Write-Log "Testing application locally..." $Blue
    
    # Start the application with docker-compose
    docker-compose up -d
    
    # Wait for services to be ready
    Write-Log "Waiting for services to be ready..." $Blue
    Start-Sleep -Seconds 30
    
    # Test backend health
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Success "Backend is healthy."
        } else {
            throw "Backend health check failed"
        }
    }
    catch {
        Write-Error "Backend health check failed."
        docker-compose down
        exit 1
    }
    
    # Test frontend
    try {
        $response = Invoke-WebRequest -Uri "http://localhost" -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Success "Frontend is accessible."
        } else {
            throw "Frontend health check failed"
        }
    }
    catch {
        Write-Error "Frontend health check failed."
        docker-compose down
        exit 1
    }
    
    # Stop local services
    docker-compose down
    Write-Success "Local testing completed successfully."
}

# Deploy infrastructure with Terraform
function Deploy-Infrastructure {
    Write-Log "Deploying infrastructure with Terraform..." $Blue
    
    Set-Location infrastructure
    
    # Initialize Terraform
    Write-Log "Initializing Terraform..." $Blue
    terraform init
    
    # Plan the deployment
    Write-Log "Planning Terraform deployment..." $Blue
    terraform plan -out=tfplan
    
    # Apply the plan
    Write-Log "Applying Terraform configuration..." $Blue
    terraform apply tfplan
    
    # Get outputs
    $ALB_DNS = terraform output -raw alb_dns_name
    $BACKEND_URL = terraform output -raw backend_url
    $FRONTEND_URL = terraform output -raw frontend_url
    
    Set-Location ..
    
    Write-Success "Infrastructure deployed successfully."
    Write-Log "Load Balancer DNS: $ALB_DNS" $Blue
    Write-Log "Backend URL: $BACKEND_URL" $Blue
    Write-Log "Frontend URL: $FRONTEND_URL" $Blue
}

# Push images to ECR
function Push-ToECR {
    Write-Log "Pushing images to ECR..." $Blue
    
    # Get ECR repository URLs
    $AWS_REGION = aws configure get region
    $AWS_ACCOUNT_ID = aws sts get-caller-identity --query Account --output text
    
    $BACKEND_REPO = "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/shopaura-backend"
    $FRONTEND_REPO = "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/shopaura-frontend"
    
    # Login to ECR
    Write-Log "Logging in to ECR..." $Blue
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
    
    # Tag and push backend image
    Write-Log "Pushing backend image..." $Blue
    docker tag shopaura-backend:latest $BACKEND_REPO`:latest
    docker push $BACKEND_REPO`:latest
    
    # Tag and push frontend image
    Write-Log "Pushing frontend image..." $Blue
    docker tag shopaura-frontend:latest $FRONTEND_REPO`:latest
    docker push $FRONTEND_REPO`:latest
    
    Write-Success "Images pushed to ECR successfully."
}

# Update ECS services
function Update-ECSServices {
    Write-Log "Updating ECS services..." $Blue
    
    # Force new deployment of backend service
    aws ecs update-service --cluster shopaura-cluster --service shopaura-backend-service --force-new-deployment
    
    # Force new deployment of frontend service
    aws ecs update-service --cluster shopaura-cluster --service shopaura-frontend-service --force-new-deployment
    
    # Wait for services to be stable
    Write-Log "Waiting for services to be stable..." $Blue
    aws ecs wait services-stable --cluster shopaura-cluster --services shopaura-backend-service shopaura-frontend-service
    
    Write-Success "ECS services updated successfully."
}

# Health check deployment
function Test-HealthCheck {
    Write-Log "Performing health checks..." $Blue
    
    # Get ALB DNS name
    $ALB_DNS = aws elbv2 describe-load-balancers --names shopaura-alb --query 'LoadBalancers[0].DNSName' --output text
    
    # Test backend
    Write-Log "Testing backend health..." $Blue
    try {
        $response = Invoke-WebRequest -Uri "http://$ALB_DNS`:8080/actuator/health" -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Success "Backend is healthy."
        } else {
            throw "Backend health check failed"
        }
    }
    catch {
        Write-Error "Backend health check failed."
        return 1
    }
    
    # Test frontend
    Write-Log "Testing frontend..." $Blue
    try {
        $response = Invoke-WebRequest -Uri "http://$ALB_DNS" -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Success "Frontend is accessible."
        } else {
            throw "Frontend health check failed"
        }
    }
    catch {
        Write-Error "Frontend health check failed."
        return 1
    }
    
    Write-Success "All health checks passed."
    Write-Log "Application is deployed and accessible at:" $Blue
    Write-Log "Frontend: http://$ALB_DNS" $Blue
    Write-Log "Backend API: http://$ALB_DNS`:8080" $Blue
}

# Main deployment function
function Start-Deployment {
    Write-Log "Starting ShopAura deployment..." $Blue
    
    # Check prerequisites
    Test-Prerequisites
    
    # Build images
    Build-Images
    
    # Test locally (optional - can be skipped in production)
    if (-not $SkipLocalTest) {
        Test-Local
    } else {
        Write-Warning "Skipping local tests."
    }
    
    # Deploy infrastructure
    Deploy-Infrastructure
    
    # Push images to ECR
    Push-ToECR
    
    # Update ECS services
    Update-ECSServices
    
    # Health check
    Test-HealthCheck
    
    Write-Success "Deployment completed successfully!"
}

# Run main deployment function
Start-Deployment