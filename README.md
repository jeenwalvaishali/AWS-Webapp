# webapp

# Cloud-Native Web Application

## Overview

This repository contains the source code and infrastructure configuration for a Cloud-Native Web Application. The project focuses on backend API development, following cloud-native principles. Below are key features, user stories, and setup instructions.

## Features

**Key Features:**

- **Token-based Authentication:**
  Secure user authentication using token-based approach with BCrypt password hashing.

- **AWS Organization Setup:**
  Efficient resource management achieved through the organization setup in AWS.

- **Infrastructure as Code (IaC):**
  Utilized AWS CloudFormation for defining and deploying infrastructure as code.

- **Custom AMIs with Packer:**
  Created custom Amazon Machine Images (AMIs) with Packer, supporting MySQL and PostgreSQL.

- **CI/CD Pipelines with GitHub Actions:**
  Implemented Continuous Integration and Continuous Deployment pipelines using GitHub Actions for automated testing and deployment.

- **Email Verification Flow:**
  Seamless email verification process integrated with DynamoDB, SNS, and Lambda for enhanced user security.

- **Auto-Scaling Policies:**
  Dynamic resource management achieved through auto-scaling policies for efficient scalability.

- **SSL Certificate Implementation:**
  Ensured secure endpoints with SSL certificate implementation for enhanced data protection.

- **RESTful API Endpoints:**
  - All API request/response payloads are in JSON format.
  - No UI is implemented for the application.
  - Proper HTTP status codes are returned for all API calls.
  - Code quality is maintained using unit and/or integration tests.

- **User Management:**
  - Token-Based authentication is implemented.
  - Basic authentication token is required for API calls to authenticated endpoints.

- **GitHub Actions:**
  - Continuous Integration with GitHub Actions is implemented.
  - Workflows ensure application unit tests are run for each pull request.
  - GitHub branch protection is in place to prevent merging PRs with failed workflows.

## User Stories

1. Users can create a new account with email, password, first name, and last name.
2. Account creation sets the `account_created` field to the current time.
3. Users cannot set values for `account_created` and `account_updated`.
4. Password is securely stored using the BCrypt password hashing scheme with salt.
5. Users can update their first name, last name, and password.
6. Users can retrieve their account information, excluding the password.
7. Duplicate email addresses result in a 400 Bad Request response during account creation.
8. Infrastructure is set up in AWS, including VPC, subnets, Internet Gateway, and Route Tables.

## AWS Organization Setup

1. AWS organization support is enabled in the root AWS account.
2. Dev and demo member accounts are created for assignment development and grading.
3. IAM users, groups, and policies are set up for teaching assistants.

## AWS IAM Setup

1. IAM users, groups, and policies are created in all AWS accounts (root, dev, prod).

## Infrastructure as Code (IaC) with CloudFormation

1. A GitHub repository named "infrastructure" is created for AWS infrastructure.
2. CloudFormation templates are added to the repository for setting up networking resources.
3. Virtual Private Cloud (VPC), subnets, Internet Gateway, and Route Tables are configured.

## Packer & AMIs

1. Custom application AMI is built using Packer.
2. The AMI includes necessary dependencies and application binaries.
3. MySQL or PostgreSQL is installed locally in the AMI.

## Continuous Integration for Web App

1. GitHub Actions workflows are implemented for unit testing, artifact building, and AMI creation.
2. Workflows are triggered on pull request merges.
3. Auto-scaling policies and configurations are set up.

## DNS Setup

1. Domain registration is done with a registrar (e.g., Namecheap).
2. Route 53 is used for DNS service in AWS.
3. Public hosted zones are created for the root, dev, and prod subdomains.

## Amazon SES Configuration

1. Amazon SES is configured for email services.
2. Domain verification, DKIM authentication, and moving out of the SES Sandbox are performed.

## IAM Users, Roles & Policies

1. IAM roles and policies needed for the assignment objectives are added to CloudFormation.

## Application Logging & Metrics

1. CloudWatch Agent is installed in AMIs to collect application logs.
2. Custom metrics for API usage are created in CloudWatch.

## Lambda Functions

1. A GitHub repository named "serverless" is created for serverless functions.
2. IAM roles and policies are added to CloudFormation for Lambda functions.

## Email Verification Flow

1. Email verification flow is implemented using DynamoDB, SNS, and Lambda.
2. Users receive an email with a verification link.
3. The link contains a one-time-use token and is valid for 5 minutes.
4. Clicking the link marks the user as verified.

## Encrypted Resources

1. EBS volumes for EC2 instances are encrypted using customer-managed keys.
2. RDS instances are encrypted with a separate customer-managed key.

## CI/CD for Lambda Functions

Continuous deployment is implemented for Lambda functions on every commit.

## CI/CD Demo Steps

1. Demo includes building CloudFormation stacks, verifying CI/CD workflows, and testing auto-scaling.
2. Secure Application Endpoints
3. Web application endpoints are secured with valid SSL certificates.
4. SSL certificates for dev environment are obtained from AWS Certificate Manager.
5. SSL certificates for prod environment are obtained from external vendors and imported into AWS Certificate Manager.

## JMeter Load Testing Script (optional)

1. JMeter tests are created to make 500 concurrent API calls to the application.

## Demo Instructions

1. Pre-build and register an AMI for the demo.
2. Build CloudFormation stacks for infrastructure.
3. Verify CI/CD workflow by making a code change.
4. Test new EC2 instances launched in the auto-scaling group.
5. Trigger auto-scaling and ensure instances have the latest application version.
6. Ensure all workflows and jobs succeed without issues.
7. Provide a seamless demo without failed workflows.

# Technology Stack
  ### Programming Language: 
   * Node Js
  
# Prerequisite for App deployment  
* NPM
* Git
  
# Build Instruction

* Clone github repo using command "git clone".
* Run "npm install" in git bash terminal under git repo.

# Deploy Instruction
 
 * Run npm start

# Unit Testing
  
  * Run npm test
