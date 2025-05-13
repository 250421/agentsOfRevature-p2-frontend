pipeline {
    agent any
    
    environment {
        S3_BUCKET = 'agents-of-revature-frontend'
        AWS_REGION = 'us-east-1'
        CLOUDFRONT_ID = 'ECW54YRWAHCKU' // CloudFront distribution ID from Terraform output
        NODE_VERSION = '18' // Specify Node.js version
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup Node.js') {
            steps {
                sh '''
                    echo "Setting up Node.js ${NODE_VERSION}..."
                    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
                    . ~/.nvm/nvm.sh
                    nvm install ${NODE_VERSION}
                    nvm use ${NODE_VERSION}
                '''
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh '''
                    . ~/.nvm/nvm.sh
                    nvm use ${NODE_VERSION}
                    echo "Installing frontend dependencies..."
                    pnpm install
                '''
            }
        }
        
        stage('Lint') {
            steps {
                sh '''
                    . ~/.nvm/nvm.sh
                    nvm use ${NODE_VERSION}
                    echo "Running linting..."
                    pnpm lint
                '''
            }
        }
        
        stage('Test') {
            steps {
                sh '''
                    . ~/.nvm/nvm.sh
                    nvm use ${NODE_VERSION}
                    echo "Running tests..."
                    pnpm test
                '''
            }
        }
        
        stage('Build') {
            steps {
                sh '''
                    . ~/.nvm/nvm.sh
                    nvm use ${NODE_VERSION}
                    echo "Building frontend application..."
                    pnpm build
                '''
            }
        }
        
        stage('Deploy to S3') {
            steps {
                withAWS(credentials: 'AWS_CREDENTIALS', region: AWS_REGION) {
                    sh '''
                        echo "Deploying frontend to S3..."
                        # Sync the built files to S3 bucket with cache control headers
                        aws s3 sync dist/ s3://${S3_BUCKET}/ \
                            --delete \
                            --cache-control "public, max-age=31536000" \
                            --exclude "*.html" \
                            --exclude "*.json"
                        
                        # Upload HTML and JSON files with no caching
                        aws s3 sync dist/ s3://${S3_BUCKET}/ \
                            --delete \
                            --cache-control "no-cache" \
                            --include "*.html" \
                            --include "*.json"
                        
                        # Invalidate CloudFront cache if CloudFront ID is provided
                        if [ ! -z "${CLOUDFRONT_ID}" ]; then
                            echo "Invalidating CloudFront cache..."
                            aws cloudfront create-invalidation \
                                --distribution-id ${CLOUDFRONT_ID} \
                                --paths "/*"
                        else
                            echo "No CloudFront distribution ID provided, skipping cache invalidation"
                        fi
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo 'Frontend pipeline completed successfully!'
            // Add notification here if needed
        }
        failure {
            echo 'Frontend pipeline failed!'
            // Add failure notification here if needed
        }
        always {
            echo 'Cleaning up...'
            cleanWs()
        }
    }
} 