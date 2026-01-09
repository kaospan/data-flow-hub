# Deployment Scripts

Automation scripts for setting up GitHub Environments and deployment workflows.

## Quick Start

### Windows (PowerShell)

```powershell
# Generate a GitHub token at: https://github.com/settings/tokens
# Required scopes: repo, admin:repo_hook

.\scripts\setup-environments.ps1 -GitHubToken "ghp_your_token_here"
```

### Linux/Mac (Bash)

```bash
# Make script executable
chmod +x scripts/setup-environments.sh

# Run setup
GITHUB_TOKEN=ghp_your_token_here ./scripts/setup-environments.sh
```

## What These Scripts Do

1. **Create GitHub Environments:**
   - `staging` - Auto-deploys from main branch
   - `production` - Requires approval before deployment

2. **Configure Production Protection:**
   - Add required reviewers (default: repo owner)
   - Enable branch protection (main only)
   - Set up approval gates

3. **Provide Next Steps:**
   - Links to configure secrets
   - OIDC setup instructions
   - Cloud provider integration

## Manual Setup (No Script)

If you prefer to set up manually:

1. Go to **Settings** → **Environments** → **New environment**
2. Create `staging` and `production` environments
3. For production:
   - Add **Required reviewers**
   - Restrict to **main** branch
   - Optional: Add wait timer (5-10 minutes)

See [DEPLOYMENT.md](../docs/DEPLOYMENT.md) for complete instructions.

## Customizing Reviewers

### PowerShell
```powershell
.\setup-environments.ps1 `
  -GitHubToken "ghp_token" `
  -ProductionReviewers @("user1", "user2", "user3")
```

### Bash
Edit the script and modify:
```bash
PROD_REVIEWERS=("user1" "user2" "user3")
```

## Troubleshooting

### "Authentication failed"
- Verify token has `repo` and `admin:repo_hook` scopes
- Token must not be expired
- Check token has access to the repository

### "User not found"
- Verify GitHub username is correct (case-sensitive)
- User must have access to the repository
- User must be a collaborator or org member

### "Cannot create environment"
- Verify you have admin access to the repository
- Check repository settings allow environments
- Ensure environment names don't already exist with different casing

## Next Steps

After running the setup script:

1. **Configure Cloud Provider:** Set up OIDC in AWS/GCP/Azure
2. **Add Secrets:** Add environment-specific secrets in GitHub
3. **Test Deployment:** Push to main and verify staging deploys
4. **Approve Production:** Test the approval workflow

See the complete guide: [docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md)
