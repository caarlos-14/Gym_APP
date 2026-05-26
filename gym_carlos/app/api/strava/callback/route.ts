// app/api/strava/callback/route.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) return NextResponse.redirect(new URL('/error', req.url));

  // 1. Intercambiar code por tokens de Strava
  const tokenRes = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    }),
  });

  const { access_token, refresh_token, expires_at, athlete } = await tokenRes.json();

  // 2. Obtener usuario de Supabase
  const cookieStore = await cookies(); // <-- await aquí
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL('/', req.url));

  // 3. Guardar tokens en Supabase
  await supabase.from('strava_tokens').upsert({
    user_id: user.id,
    access_token,
    refresh_token,
    expires_at,
    athlete_id: athlete.id,
  });

  return NextResponse.redirect(new URL('/', req.url));
}