#!/bin/bash
# Quick setup script for GitHub Environments

set -e

REPO_OWNER="kaospan"
REPO_NAME="data-flow-hub"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"

if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ Error: GITHUB_TOKEN environment variable is required"
  echo ""
  echo "Generate a token at: https://github.com/settings/tokens"
  echo "Required scopes: repo, admin:repo_hook"
  echo ""
  echo "Usage: GITHUB_TOKEN=ghp_xxx ./setup-environments.sh"
  exit 1
fi

echo "🚀 Setting up GitHub Environments for $REPO_OWNER/$REPO_NAME"
echo ""

# Function to create environment
create_environment() {
  local env_name=$1
  echo "📦 Creating environment: $env_name"
  
  curl -s -X PUT \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/environments/$env_name" \
    -d '{}' > /dev/null
  
  echo "✅ Environment '$env_name' created"
}

# Function to add required reviewers
add_reviewers() {
  local env_name=$1
  shift
  local reviewers=("$@")
  
  if [ ${#reviewers[@]} -eq 0 ]; then
    echo "⚠️  No reviewers specified for $env_name"
    return
  fi
  
  echo "👥 Adding required reviewers to $env_name"
  
  # Convert usernames to user IDs
  local reviewer_ids=()
  for username in "${reviewers[@]}"; do
    user_id=$(curl -s \
      -H "Authorization: Bearer $GITHUB_TOKEN" \
      -H "Accept: application/vnd.github+json" \
      "https://api.github.com/users/$username" | jq -r '.id')
    
    if [ "$user_id" != "null" ]; then
      reviewer_ids+=("$user_id")
      echo "  ✓ Added reviewer: $username (ID: $user_id)"
    else
      echo "  ✗ User not found: $username"
    fi
  done
  
  # Create reviewers JSON
  local reviewers_json=$(printf '%s\n' "${reviewer_ids[@]}" | jq -R . | jq -s -c '{reviewers: [.[] | {type: "User", id: . | tonumber}]}')
  
  # Update environment with reviewers
  curl -s -X PUT \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/environments/$env_name" \
    -d "{
      \"wait_timer\": 0,
      \"reviewers\": $(echo $reviewers_json | jq -c '.reviewers'),
      \"deployment_branch_policy\": {
        \"protected_branches\": true,
        \"custom_branch_policies\": false
      }
    }" > /dev/null
  
  echo "✅ Reviewers added to '$env_name'"
}

# Create staging environment
create_environment "staging"

# Create production environment
create_environment "production"

echo ""
echo "🔐 Environment Protection Setup"
echo ""

# Add production reviewers
# Replace with actual GitHub usernames of your team
PROD_REVIEWERS=("kaospan")  # Add more usernames as needed

echo "Setting up production approvers..."
add_reviewers "production" "${PROD_REVIEWERS[@]}"

echo ""
echo "✅ Environment setup complete!"
echo ""
echo "📋 Next steps:"
echo ""
echo "1. Go to: https://github.com/$REPO_OWNER/$REPO_NAME/settings/environments"
echo "2. Configure secrets for each environment:"
echo ""
echo "   Staging secrets:"
echo "   - S3_STAGING_BUCKET (or GCS_STAGING_BUCKET)"
echo "   - CLOUDFRONT_STAGING_ID (optional)"
echo "   - AWS_ROLE_ARN (for OIDC)"
echo ""
echo "   Production secrets:"
echo "   - S3_PRODUCTION_BUCKET (or GCS_PRODUCTION_BUCKET)"
echo "   - CLOUDFRONT_PRODUCTION_ID (optional)"
echo "   - AWS_ROLE_ARN (for OIDC)"
echo ""
echo "3. Set up OIDC provider in your cloud (AWS/GCP/Azure)"
echo "4. See docs/DEPLOYMENT.md for detailed setup instructions"
echo ""
