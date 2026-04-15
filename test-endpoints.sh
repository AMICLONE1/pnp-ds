#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3004"
FAILED=0
PASSED=0

# Helper function to test endpoints
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local expected_status=$4

    echo -e "${YELLOW}Testing: $description${NC}"
    echo "  $method $endpoint"

    response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)

    if [ "$http_code" = "$expected_status" ]; then
        echo -e "  ${GREEN}✓ Status: $http_code (expected $expected_status)${NC}"
        ((PASSED++))
    else
        echo -e "  ${RED}✗ Status: $http_code (expected $expected_status)${NC}"
        echo "  Response: $body"
        ((FAILED++))
    fi
    echo ""
}

echo "========================================="
echo "   API ENDPOINT TESTS"
echo "========================================="
echo ""

# Test 1: Admin Projects - Not authenticated (should return 401)
test_endpoint "GET" "/api/admin/projects?page=1&limit=20" \
    "Admin Projects - No Auth" "401"

# Test 2: Admin Stats - Not authenticated (should return 401)
test_endpoint "GET" "/api/admin/stats" \
    "Admin Stats - No Auth" "401"

# Test 3: Admin Credits - Not authenticated (should return 401)
test_endpoint "GET" "/api/admin/credits?page=1&limit=20" \
    "Admin Credits - No Auth" "401"

# Test 4: Admin Users - Not authenticated (should return 401)
test_endpoint "GET" "/api/admin/users?page=1&limit=20" \
    "Admin Users - No Auth" "401"

# Test 5: Admin Payments - Not authenticated (should return 401)
test_endpoint "GET" "/api/admin/payments?page=1&limit=20" \
    "Admin Payments - No Auth" "401"

# Test 6: Admin Generations - Not authenticated (should return 401)
test_endpoint "GET" "/api/admin/generations?page=1&limit=20" \
    "Admin Generations - No Auth" "401"

# Test 7: Admin Waitlist - Not authenticated (should return 401)
test_endpoint "GET" "/api/admin/waitlist?page=1&limit=20" \
    "Admin Waitlist - No Auth" "401"

# Test 8: Get Projects (Public - should work)
test_endpoint "GET" "/api/projects" \
    "Get Projects (Public)" "200"

# Test 9: Payments Create Order - No Auth (should return 401)
test_endpoint "POST" "/api/payments/create-order" \
    "Payments Create Order - No Auth" "401"

# Test 10: Host Dashboard - No Auth (should return 401)
test_endpoint "GET" "/api/host/dashboard" \
    "Host Dashboard - No Auth" "401"

# Test 11: Host PPA URL - No Auth (should return 401)
test_endpoint "GET" "/api/host/ppa-url" \
    "Host PPA URL - No Auth" "401"

echo "========================================="
echo -e "   RESULTS: ${GREEN}$PASSED Passed${NC}, ${RED}$FAILED Failed${NC}"
echo "========================================="

exit $FAILED
