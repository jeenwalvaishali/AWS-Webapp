# Cloud-Native Web Application

A cloud-native backend application built using **Node.js and AWS**, focusing on secure REST API development, automated deployments, and scalable cloud infrastructure.

## Key Features

- **RESTful API Development:** Developed backend APIs for user account creation, authentication, account management, and profile updates.
- **Authentication & Security:** Implemented token-based authentication and secure password hashing using BCrypt.
- **AWS Cloud Infrastructure:** Configured and managed AWS resources to support application deployment, scalability, and security.
- **Infrastructure as Code:** Used AWS CloudFormation to provision and manage cloud infrastructure.
- **Automated CI/CD:** Implemented GitHub Actions workflows for automated testing, build processes, and deployment.
- **Serverless Integration:** Integrated AWS Lambda, DynamoDB, and SNS to support email verification workflows.
- **Application Monitoring:** Configured AWS CloudWatch for application logging and monitoring.
- **Scalability & Reliability:** Implemented EC2 auto-scaling, custom AMIs using Packer, and secure application endpoints with SSL certificates.

## Technology Stack

| Category | Technologies |
|---|---|
| Backend | Node.js, Express.js, REST APIs |
| Cloud | AWS EC2, Lambda, DynamoDB, SNS, S3, RDS |
| Infrastructure | AWS CloudFormation, Packer |
| CI/CD | GitHub Actions |
| Security | JWT, BCrypt, IAM, SSL/TLS |
| Monitoring | AWS CloudWatch |
| Database | MySQL, PostgreSQL |

## Running Locally

```bash
# Clone the repository
git clone https://github.com/jeenwalvaishali/AWS-Webapp.git

# Install dependencies
npm install

# Start the application
npm start

# Run tests
npm test
```
