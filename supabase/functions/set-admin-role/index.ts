// supabase/functions/set-admin-role/index.ts
import { serve } from 'std/server'

serve(async (req) => {
  // Parse the request body
  const { user_id, role } = await req.json();

  // Only allow setting admin role
  if (role !== 'admin') {
    return new Response(JSON.stringify({ error: 'Only admin role can be set.' }), { status: 400 });
  }

  // Set the custom claim
  const res = await fetch(`${Deno.env.get('SUPABASE_URL')}/auth/v1/admin/users/${user_id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      app_metadata: { role }
    }),
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'Failed to set custom claim.' }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});