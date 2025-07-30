# Client-Side Data Fetching Guide

This guide explains how to securely fetch data from the client while maintaining the same security level as server-side fetching.

## Overview

To fetch data from the client, you must create secure API endpoints in the `/api` directory that act as authenticated proxies to your backend services.

## 1. Create API Endpoints

Create endpoints in `/api` that validate sessions and proxy requests:

```ts
// app/api/hotspots/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session/session";
import { verifyToken } from "@/app/api/auth/callback/_services/token-service";
import { env } from "@/lib/infra/env";

export async function GET(request: NextRequest) {
  // Validate session
  const session = await getSession();
  if (!session.isLoggedIn || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify token
  await verifyToken(session.accessToken);

  // Make backend request with API key (stays secure on server)
  const response = await fetch(`${env.BACKEND_URL}/api/nfnode/miners-by-address/${session.wallet}`, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": env.BACKEND_KEY,
    },
  });

  return NextResponse.json(await response.json());
}
```

## 2. Session Cookie Authentication

The same session cookie used for server-side authentication automatically authenticates these API calls. No additional setup required - just ensure `credentials: 'include'` in your fetch calls.

## 3. Use SWR for Data Fetching

SWR by Vercel is highly recommended for its excellent caching, revalidation, and error handling:

```ts
// lib/hooks/use-hotspots.ts
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url, { credentials: 'include' }).then(res => res.json());

export function useHotspots() {
  const { data, error, isLoading, mutate } = useSWR('/api/hotspots', fetcher);
  
  return {
    hotspots: data?.data || [],
    loading: isLoading,
    error,
    refetch: mutate,
  };
}
```

## 4. Client Components Placement

Make components client-side (`'use client'`) as far down the component tree as possible. Keep page-level components as Server Components when possible:

```tsx
// app/dashboard/page.tsx (Server Component)
export default function DashboardPage() {
  return (
    <div>
      <Header />
      <HotspotsList /> {/* This becomes client component */}
    </div>
  );
}

// components/HotspotsList.tsx (Client Component)
'use client';
export function HotspotsList() {
  const { hotspots, loading } = useHotspots();
  // ...
}
```

## 5. Initial Data Strategy

**Recommendation**: Always fetch initial data server-side, then use client-side fetching for subsequent updates.

**Why?**
- **Faster initial paint**: Data loads with the page, no loading states
- **Better SEO**: Content is rendered server-side
- **More secure**: Initial sensitive operations happen server-side

```tsx
// Server Component fetches initial data
export default async function HotspotsPage() {
  const initialHotspots = await getHotspots(1, 10);
  
  return <HotspotsList initialData={initialHotspots} />;
}

// Client Component uses initial data and SWR for updates
'use client';
export function HotspotsList({ initialData }) {
  const { data } = useSWR('/api/hotspots', fetcher, { fallbackData: initialData });
  // ...
}
```

## Security Benefits

This approach maintains security by:

- **API Key Protection**: Backend API keys never reach the client
- **Session Validation**: Every request validates the user session server-side  
- **Token Verification**: Access tokens are verified using existing Keycloak logic
- **Controlled Access**: Only authenticated users can access the proxy endpoints

The client never directly communicates with your backend services or handles sensitive credentials.