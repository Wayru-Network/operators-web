# Operators Web

A comprehensive Next.js web application for managing WiFi hotspots, captive portals, and network infrastructure. This platform provides operators with tools to configure, monitor, and manage their fleet of WiFi routers, create customizable captive portals, and handle billing and subscriptions.

## Features

🔐 **Authentication & Security**: Keycloak-based authentication with JWT token management

📊 **Dashboard Analytics**: Real-time analytics for hotspots, data traffic, and connections

📡 **Hotspot Management**: Complete lifecycle management of WiFi hotspots with network configuration

🌐 **Captive Portal Builder**: Create and customize captive portals with branding, ads, and access flows

💳 **Billing & Subscriptions**: Stripe integration for subscription management and payment processing

🎨 **Customizable Branding**: Full control over portal appearance, colors, logos, and banners

📱 **Multi-language Support**: Built-in support for English, Spanish, and Portuguese

🌓 **Dark Mode**: Full dark mode support with theme switching

☁️ **Cloud Storage**: Azure Blob Storage integration for asset management

🔄 **Real-time Updates**: SWR for efficient data fetching and real-time updates

🐳 **Docker Support**: Containerized deployment with Docker

☸️ **Kubernetes Ready**: Kubernetes Helm charts included for production deployment

## Tech Stack

**Runtime**: Node.js 20+

**Framework**: Next.js 15.3.8

**Language**: TypeScript 5+

**Database**: PostgreSQL (Prisma ORM)

**Authentication**: Keycloak

**Payment Processing**: Stripe

**Storage**: Azure Blob Storage

**UI Components**: HeroUI (NextUI)

**Styling**: Tailwind CSS 4

**State Management**: React Context API, SWR

**Package Manager**: pnpm

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 20+ and pnpm
- PostgreSQL database
- Keycloak instance (for authentication)
- Azure Storage Account (for asset storage)
- Stripe account (for payment processing)
- Docker (optional, for containerized deployment)
- Kubernetes cluster (optional, for Kubernetes deployment)

## Installation

### Clone the repository

```bash
git clone <repository-url>
cd operators-web
```

### Install dependencies

```bash
pnpm install
```

### Set up environment variables

Create a `.env` file in the root directory with the following variables:

```env
# Application Configuration
NODE_ENV=development
APP_URL=http://localhost:3000
SESSION_KEY=your_session_secret_key

# Keycloak Authentication
KEYCLOAK_BASE=https://your-keycloak-instance.com
KEYCLOAK_REALM=your_realm
KEYCLOAK_CLIENT_ID=operators-web

# Azure Storage
AZURE_STORAGE_ACCOUNT_NAME=your_storage_account_name
AZURE_STORAGE_ACCOUNT_KEY=your_storage_account_key
AZURE_CONTAINER_NAME=your_container_name

# Backend API
BACKEND_URL=https://your-backend-api.com
BACKEND_KEY=your_backend_api_key

# WiFi API
WIFI_API_URL=https://your-wifi-api.com
WIFI_API_KEY=your_wifi_api_key

# Devices API
DEVICES_API_URL=https://your-devices-api.com
DEVICES_API_KEY=your_devices_api_key

# Operators API Key
OPERATORS_API_KEY=your_operators_api_key

# NAS API
NAS_API_URL=https://your-nas-api.com
NAS_API_KEY=your_nas_api_key

# FAS API (Captive Portal)
FAS_URL=https://your-fas-api.com
FAS_API_KEY=your_fas_api_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Network Configuration
DEFAULT_PRIVATE_SSID_PW=your_default_password

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/operators_web
```

### Set up the database

```bash
# Generate Prisma Client
pnpm generate

# Run database migrations
npx prisma migrate deploy
```

### Build the project

```bash
pnpm build
```

### Start the server

```bash
pnpm start
```

For development with auto-reload:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configuration

### Environment Variables

| Variable                             | Description                          | Default                 |
| ------------------------------------ | ------------------------------------ | ----------------------- |
| `NODE_ENV`                           | Environment (development/production) | `development`           |
| `APP_URL`                            | Application base URL                 | `http://localhost:3000` |
| `SESSION_KEY`                        | Secret key for session encryption    | -                       |
| `KEYCLOAK_BASE`                      | Keycloak instance URL                | -                       |
| `KEYCLOAK_REALM`                     | Keycloak realm name                  | -                       |
| `KEYCLOAK_CLIENT_ID`                 | Keycloak client ID                   | `operators-web`         |
| `DATABASE_URL`                       | PostgreSQL connection string         | -                       |
| `AZURE_STORAGE_ACCOUNT_NAME`         | Azure Storage account name           | -                       |
| `AZURE_STORAGE_ACCOUNT_KEY`          | Azure Storage account key            | -                       |
| `AZURE_CONTAINER_NAME`               | Azure Storage container name         | -                       |
| `STRIPE_SECRET_KEY`                  | Stripe secret key                    | -                       |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key               | -                       |
| `STRIPE_WEBHOOK_SECRET`              | Stripe webhook secret                | -                       |

## API Endpoints

All endpoints are prefixed with `/api`.

### Authentication

- `POST /api/auth/callback` - Keycloak authentication callback

### Hotspots

- `GET /api/hotspots` - Get list of hotspots (supports pagination and search)
- `POST /api/hotspots/subscription` - Assign subscription to hotspot

### Captive Portals

- `GET /api/captive-portals` - Get list of captive portals
- `GET /api/portal` - Get portal configuration (requires `OPERATORS_API_KEY`)

### Subscriptions

- `GET /api/subscriptions` - Get subscription information
- `POST /api/subscriptions` - Create or update subscription

### Webhooks

- `POST /api/webhooks/stripe` - Stripe webhook handler

### Health Check

- `GET /health` - Health check endpoint

## Project Structure

```
operators-web/
├── app/
│   ├── [lang]/              # Internationalized routes
│   │   ├── (auth)/          # Authentication pages
│   │   ├── (operator)/      # Operator dashboard pages
│   │   │   ├── dashboard/   # Dashboard with analytics
│   │   │   ├── hotspots/    # Hotspot management
│   │   │   ├── captive-portal/  # Captive portal builder
│   │   │   └── settings/    # Account and billing settings
│   │   └── route.ts         # Language routing
│   └── api/                 # API routes
│       ├── auth/            # Authentication endpoints
│       ├── hotspots/        # Hotspot endpoints
│       ├── captive-portals/ # Portal endpoints
│       ├── subscriptions/   # Subscription endpoints
│       └── webhooks/        # Webhook handlers
├── lib/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React contexts
│   ├── dal/                # Data access layer
│   ├── helpers/            # Utility functions
│   ├── hooks/              # Custom React hooks
│   ├── infra/              # Infrastructure config
│   ├── services/           # Business logic services
│   └── ui/                 # UI utilities
├── prisma/
│   ├── migrations/         # Database migrations
│   └── schema.prisma       # Database schema
├── public/                 # Static assets
├── dictionaries/           # i18n translation files
├── deploy/                 # Deployment configurations
│   ├── chart/              # Kubernetes Helm charts
│   └── azure-pipelines-*.yaml  # CI/CD pipelines
├── Dockerfile              # Docker configuration
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **hotspots**: WiFi hotspot devices
- **portal_config**: Captive portal configurations
- **network_config**: Network configuration settings
- **customers**: Customer accounts
- **companies**: Company information
- **subscriptions**: Subscription plans and billing
- **ads**: Advertisement configurations
- **asset**: Media assets (logos, banners, ads)

See `prisma/schema.prisma` for complete schema definitions.

## Development

### Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm generate` - Generate Prisma Client
- `pnpm lint` - Run ESLint

### Code Style

The project uses TypeScript with strict mode enabled. Follow these guidelines:

- Use TypeScript for all new code
- Follow the existing code structure and patterns
- Add proper type definitions for all functions and variables
- Use async/await for asynchronous operations
- Handle errors appropriately
- Use Server Components by default, Client Components only when needed
- Follow Next.js 15 App Router conventions

### Client-Side Data Fetching

For secure client-side data fetching, create authenticated API endpoints in `/app/api` that validate sessions and proxy requests to backend services. See `docs/how-to-fetch-from-the-client.md` for detailed guidelines.

## Docker Deployment

### Build Docker Image

```bash
docker build -t operators-web .
```

### Run Container

```bash
docker run -p 3000:3000 --env-file .env operators-web
```

### Docker Compose (Example)

```yaml
version: "3.8"
services:
  operators-web:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: operators_web
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Kubernetes Deployment

Kubernetes configuration files are available in the `deploy/chart/` directory. Update the configuration files with your specific values before deploying.

### Deploy with Helm

```bash
helm install operators-web ./deploy/chart -f ./deploy/chart/values-prod.yaml
```

## Security Considerations

- **Session Management**: Use strong, randomly generated secrets for session keys
- **API Keys**: Never commit API keys to the repository. Use environment variables or secret management systems
- **Database**: Use SSL connections in production
- **Authentication**: Ensure Keycloak is properly configured with secure settings
- **CORS**: Configure CORS origins appropriately for production
- **Environment Variables**: Use secret management systems (Azure Key Vault, Kubernetes Secrets, etc.) in production

## Internationalization

The application supports multiple languages:

- English (`en`)
- Spanish (`es`)
- Portuguese (`pt`)

Translation files are located in the `dictionaries/` directory. The application automatically detects the user's language preference and routes accordingly.

## Testing

Before deploying to production, ensure you:

- Test all authentication flows
- Verify database migrations run successfully
- Test Stripe webhook integration
- Verify Azure Blob Storage uploads/downloads
- Test captive portal creation and customization
- Verify hotspot management operations
- Test subscription and billing flows

## Contributing

This project is now open source. Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

**Important**: This project is now open source and maintained by the community. WAYRU no longer exists and will not provide support for this repository. For issues, questions, or contributions, please use the GitHub Issues section.

## Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs/styling-with-utility-classes)
- [HeroUI Documentation](https://www.heroui.com/docs/guide/introduction)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Stripe Documentation](https://stripe.com/docs)

## 💙 Farewell Message

With gratitude and love, we say goodbye.

WAYRU is closing its doors, but we are leaving these repositories open and free for the community.

May they continue to inspire builders, dreamers, and innovators.

With love, WAYRU

---

**Note**: This project is **open source**. Wayru, Inc and The Wayru Foundation are no longer operating entities, and will not provide any kind of support. The community is welcome to use, modify, and improve this codebase.
