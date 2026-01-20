# Config & Constants - Model Layer
# Configuration and constants

# CLI variables from environment
# CLI_NAME được export từ file cli, không cần set default
# CLI variables được load từ file cli (không set default)
# Nếu CLI_NAME không được export từ cli, giá trị mặc định đã được set trong cli

# Colors
readonly COLOR_RED='\033[0;31m'
readonly COLOR_GREEN='\033[0;32m'
readonly COLOR_YELLOW='\033[1;33m'
readonly COLOR_BLUE='\033[0;34m'
readonly COLOR_NC='\033[0m'

# URLs
readonly URL_FRONTEND="http://localhost/"
readonly URL_BACKEND="http://localhost/backend/"
readonly URL_DOCS="http://localhost/backend/docs"
readonly URL_PHPMYADMIN="http://localhost/phpmyadmin/"
readonly URL_INSTALL="http://localhost/install"

# Services
readonly SERVICES="backend frontend db redis"

# Validate .env exists
validate_env_file() {
    if [ ! -f ".env" ]; then
        return 1
    fi
    return 0
}
