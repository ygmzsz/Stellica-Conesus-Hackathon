// app/logout/route.ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
  const cookieStore = await cookies();
  (await cookieStore).set({
    name: 'sb-zvecpbopzlvvrweipheh-auth-token',
    value: '',
    path: '/',
    expires: new Date(0),
  });
  // Redirect user to login page after logout
  redirect('/login');
}
