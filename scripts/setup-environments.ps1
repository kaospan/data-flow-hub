# GitHub Environments Setup (PowerShell)
# Quick setup script for Windows users

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubToken,
    
    [string]$RepoOwner = "kaospan",
    [string]$RepoName = "data-flow-hub",
    
    [string[]]$ProductionReviewers = @("kaospan")
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Setting up GitHub Environments for $RepoOwner/$RepoName" -ForegroundColor Cyan
Write-Host ""

$headers = @{
    "Authorization" = "Bearer $GitHubToken"
    "Accept" = "application/vnd.github+json"
}

function Create-Environment {
    param([string]$EnvName)
    
    Write-Host "📦 Creating environment: $EnvName" -ForegroundColor Yellow
    
    $uri = "https://api.github.com/repos/$RepoOwner/$RepoName/environments/$EnvName"
    
    try {
        Invoke-RestMethod -Uri $uri -Method Put -Headers $headers -Body "{}" | Out-Null
        Write-Host "✅ Environment '$EnvName' created" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to create environment: $_" -ForegroundColor Red
    }
}

function Add-Reviewers {
    param(
        [string]$EnvName,
        [string[]]$Reviewers
    )
    
    if ($Reviewers.Count -eq 0) {
        Write-Host "⚠️  No reviewers specified for $EnvName" -ForegroundColor Yellow
        return
    }
    
    Write-Host "👥 Adding required reviewers to $EnvName" -ForegroundColor Yellow
    
    $reviewerIds = @()
    
    foreach ($username in $Reviewers) {
        try {
            $userUri = "https://api.github.com/users/$username"
            $user = Invoke-RestMethod -Uri $userUri -Headers $headers
            
            if ($user.id) {
                $reviewerIds += @{
                    type = "User"
                    id = $user.id
                }
                Write-Host "  ✓ Added reviewer: $username (ID: $($user.id))" -ForegroundColor Green
            }
        }
        catch {
            Write-Host "  ✗ User not found: $username" -ForegroundColor Red
        }
    }
    
    if ($reviewerIds.Count -gt 0) {
        $body = @{
            wait_timer = 0
            reviewers = $reviewerIds
            deployment_branch_policy = @{
                protected_branches = $true
                custom_branch_policies = $false
            }
        } | ConvertTo-Json -Depth 10
        
        $uri = "https://api.github.com/repos/$RepoOwner/$RepoName/environments/$EnvName"
        
        try {
            Invoke-RestMethod -Uri $uri -Method Put -Headers $headers -Body $body -ContentType "application/json" | Out-Null
            Write-Host "✅ Reviewers added to '$EnvName'" -ForegroundColor Green
        }
        catch {
            Write-Host "❌ Failed to add reviewers: $_" -ForegroundColor Red
        }
    }
}

# Create environments
Create-Environment -EnvName "staging"
Create-Environment -EnvName "production"

Write-Host ""
Write-Host "🔐 Environment Protection Setup" -ForegroundColor Cyan
Write-Host ""

# Add production reviewers
Write-Host "Setting up production approvers..." -ForegroundColor Yellow
Add-Reviewers -EnvName "production" -Reviewers $ProductionReviewers

Write-Host ""
Write-Host "✅ Environment setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to: https://github.com/$RepoOwner/$RepoName/settings/environments"
Write-Host "2. Configure secrets for each environment:"
Write-Host ""
Write-Host "   Staging secrets:" -ForegroundColor Yellow
Write-Host "   - S3_STAGING_BUCKET (or GCS_STAGING_BUCKET)"
Write-Host "   - CLOUDFRONT_STAGING_ID (optional)"
Write-Host "   - AWS_ROLE_ARN (for OIDC)"
Write-Host ""
Write-Host "   Production secrets:" -ForegroundColor Yellow
Write-Host "   - S3_PRODUCTION_BUCKET (or GCS_PRODUCTION_BUCKET)"
Write-Host "   - CLOUDFRONT_PRODUCTION_ID (optional)"
Write-Host "   - AWS_ROLE_ARN (for OIDC)"
Write-Host ""
Write-Host "3. Set up OIDC provider in your cloud (AWS/GCP/Azure)"
Write-Host "4. See docs/DEPLOYMENT.md for detailed setup instructions"
Write-Host ""
