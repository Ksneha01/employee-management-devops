
pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo 'GitHub source code checked out'
            }
        }

        stage('Prepare Environment') {
            steps {
                sh '''
                    mkdir -p backend

                    cat > backend/.env <<'EOF'
PORT=5000
MONGO_URI=mongodb://mongo:27017/employee_management
EOF
                '''
            }
        }

        stage('Validate Project') {
            steps {
                sh '''
                    test -f backend/Dockerfile
                    test -f frontend/Dockerfile
                    test -f docker-compose.yml
                    test -f Jenkinsfile

                    echo "Project validation successful"
                '''
            }
        }

        stage('Validate Docker Compose') {
            steps {
                sh 'docker compose config -q'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy Application') {
            steps {
                sh 'docker compose up -d'
            }
        }

        stage('Smoke Test') {
            steps {
                sh '''
                    echo "Checking backend health..."

                    for i in $(seq 1 12); do
                        if curl -fsS http://localhost:5000/health; then
                            echo "Backend health check passed"
                            break
                        fi

                        if [ "$i" -eq 12 ]; then
                            echo "Backend health check failed"
                            exit 1
                        fi

                        sleep 5
                    done

                    echo "Checking frontend..."
                    curl -fsS http://localhost:5173/ > /dev/null

                    echo "Frontend check passed"

                    echo "Checking employee API..."
                    curl -fsS http://localhost:5000/api/employees

                    echo "Employee API check passed"
                '''
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check Console Output.'
        }

        always {
            echo 'Pipeline execution finished.'
        }
    }
}
