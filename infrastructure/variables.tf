variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "shopaura"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "backend_cpu" {
  description = "CPU units for backend ECS task"
  type        = number
  default     = 256
}

variable "backend_memory" {
  description = "Memory for backend ECS task"
  type        = number
  default     = 512
}

variable "frontend_cpu" {
  description = "CPU units for frontend ECS task"
  type        = number
  default     = 256
}

variable "frontend_memory" {
  description = "Memory for frontend ECS task"
  type        = number
  default     = 512
}

variable "desired_count" {
  description = "Desired number of tasks for ECS services"
  type        = number
  default     = 2
}