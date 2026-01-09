# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Quick Deploy
Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

### Production Deployment with CI/CD

This project includes GitHub Actions workflows for secure, gated deployments:

- **Staging**: Auto-deploys on every push to `main`
- **Production**: Requires approval from designated reviewers
- **OIDC Support**: Secure cloud deployments without long-lived credentials

**Setup Steps:**

1. **Quick Setup (Automated):**
   ```powershell
   # Windows
   .\scripts\setup-environments.ps1 -GitHubToken "ghp_your_token"
   ```
   ```bash
   # Linux/Mac
   GITHUB_TOKEN=ghp_your_token ./scripts/setup-environments.sh
   ```

2. **Configure Cloud Provider:**
   - Set up OIDC in AWS/GCP/Azure
   - Add environment secrets in GitHub

3. **Deploy:**
   - Push to `main` → Staging deploys automatically
   - Approve in GitHub Actions → Production deploys

📚 **Complete Guide:** [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

🔧 **Script Documentation:** [scripts/README.md](scripts/README.md)

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

### Custom Domain for Self-Hosted Deployments

If you're using the CI/CD workflow to deploy to your own infrastructure:
- Update `STAGING_URL` and `PRODUCTION_URL` in environment variables
- Configure DNS to point to your hosting provider
- Set up SSL/TLS certificates (CloudFront, CloudFlare, etc.)
