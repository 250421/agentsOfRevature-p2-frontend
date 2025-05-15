pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'agents-of-revature'
        DOCKER_TAG = "${BUILD_NUMBER}"
        DB_NAME = 'jenkinsdb'
        DB_USER = 'jenkins_admin'
        DB_PASSWORD = 'your_secure_password_here'
        NETWORK_NAME = 'app-network'
        NODE_VERSION = '18'
        FRONTEND_PORT = '8082'
        BACKEND_PORT = '8081'
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
        
        stage('Build Frontend') {
            steps {
                sh '''
                    . ~/.nvm/nvm.sh
                    nvm use ${NODE_VERSION}
                    echo "Installing frontend dependencies..."
                    pnpm install
                    echo "Building frontend application..."
                    # Set the backend URL to localhost since they're on the same machine
                    echo "VITE_API_URL=http://localhost:${BACKEND_PORT}" > .env.production
                    pnpm build
                '''
            }
        }
        
        stage('Build Backend') {
            steps {
                sh 'echo "Building the backend application..."'
                sh './mvnw clean package -DskipTests'
            }
        }
        
        stage('Build Docker Images') {
            steps {
                sh '''
                    echo "Building Docker images..."
                    # Build backend image
                    docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} -f Dockerfile .
                    
                    # Build frontend nginx image
                    cat > Dockerfile.frontend << 'EOF'
                    FROM nginx:alpine
                    COPY dist/ /usr/share/nginx/html
                    COPY nginx.conf /etc/nginx/conf.d/default.conf
                    EOF
                    
                    # Create nginx configuration
                    cat > nginx.conf << 'EOF'
                    server {
                        listen 80;
                        server_name localhost;
                        
                        location / {
                            root /usr/share/nginx/html;
                            try_files $uri $uri/ /index.html;
                            add_header Cache-Control "no-cache, no-store, must-revalidate";
                        }
                        
                        # Proxy API requests to backend
                        location /api/ {
                            proxy_pass http://app:8080/;
                            proxy_http_version 1.1;
                            proxy_set_header Upgrade $http_upgrade;
                            proxy_set_header Connection 'upgrade';
                            proxy_set_header Host $host;
                            proxy_cache_bypass $http_upgrade;
                        }
                    }
                    EOF
                    
                    docker build -t frontend-nginx:${DOCKER_TAG} -f Dockerfile.frontend .
                '''
            }
        }
        
        stage('Deploy') {
            steps {
                sh '''
                    echo "Deploying the application..."
                    # Create network if it doesn't exist
                    docker network create ${NETWORK_NAME} || true

                    # Run PostgreSQL container
                    docker run -d \
                        --name postgres \
                        --network ${NETWORK_NAME} \
                        -e POSTGRES_DB=${DB_NAME} \
                        -e POSTGRES_USER=${DB_USER} \
                        -e POSTGRES_PASSWORD=${DB_PASSWORD} \
                        -p 5432:5432 \
                        postgres:14.18

                    # Wait for PostgreSQL to be ready
                    sleep 10

                    # Run the backend container
                    docker run -d \
                        --name app \
                        --network ${NETWORK_NAME} \
                        -p ${BACKEND_PORT}:8080 \
                        -e SPRING_PROFILES_ACTIVE=prod \
                        -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/${DB_NAME} \
                        -e SPRING_DATASOURCE_USERNAME=${DB_USER} \
                        -e SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD} \
                        ${DOCKER_IMAGE}:${DOCKER_TAG}

                    # Run the frontend container
                    docker run -d \
                        --name frontend \
                        --network ${NETWORK_NAME} \
                        -p ${FRONTEND_PORT}:80 \
                        frontend-nginx:${DOCKER_TAG}
                '''
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
        always {
            echo 'Cleaning up...'
            sh '''
                docker stop app postgres frontend || true
                docker rm app postgres frontend || true
                docker network rm ${NETWORK_NAME} || true
                docker system prune -f
            '''
        }
    }
} 