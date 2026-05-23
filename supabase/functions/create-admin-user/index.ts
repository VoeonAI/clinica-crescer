import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // 1. Verificar autenticação do chamador
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const token = authHeader.replace('Bearer ', '')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // 2. Validar token e buscar profile do chamador
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const { data: callerProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !callerProfile) {
      return new Response(JSON.stringify({ error: 'Caller profile not found' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // 3. Verificar se é master
    if (callerProfile.role !== 'master') {
      return new Response(JSON.stringify({ error: 'Forbidden: Only master users can create users' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // 4. Ler dados da requisição
    const { full_name, email, password, role, sync_existing } = await req.json()

    // Validações básicas
    if (!email || !role || !full_name) {
      return new Response(JSON.stringify({ error: 'Missing required fields: full_name, email, role' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (!['master', 'editor', 'viewer'].includes(role)) {
      return new Response(JSON.stringify({ error: 'Invalid role' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // 5. Modo Sincronização (apenas profile)
    if (sync_existing) {
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
      if (listError) throw listError

      const existingUser = users.find(u => u.email === email)
      if (!existingUser) {
        return new Response(JSON.stringify({ error: 'USER_NOT_FOUND', message: 'Usuário não encontrado no Authentication.' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }

      const { error: upsertError } = await supabaseAdmin.from('profiles').upsert({
        id: existingUser.id,
        email, full_name, role
      })

      if (upsertError) throw upsertError

      return new Response(JSON.stringify({ success: true, user: { id: existingUser.id, email, full_name, role } }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // 6. Criação de Novo Usuário (Auth + Profile)
    if (!password) {
      return new Response(JSON.stringify({ error: 'Password required for new users' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Criar usuário no Auth
    console.log('[create-admin-user] Creating user:', { email, role }); // NÃO LOGA SENHA
    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name }
    })

    if (createError) {
      if (createError.message.includes('already registered') || createError.message.includes('duplicate key')) {
        return new Response(JSON.stringify({ error: 'USER_ALREADY_EXISTS', message: 'E-mail já cadastrado.' }), { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
      console.error('[create-admin-user] Auth creation error:', createError);
      return new Response(JSON.stringify({ error: createError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (!authData.user) {
      return new Response(JSON.stringify({ error: 'User creation failed' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Criar profile na tabela pública
    const { error: profileErrorInsert } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email, full_name, role
      })

    if (profileErrorInsert) {
      console.error('[create-admin-user] Profile creation error:', profileErrorInsert);
      // Auth user criado mas profile falhou - logger crítico mas não retorna senha nem dados sensíveis
      return new Response(JSON.stringify({ error: 'Profile creation failed' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Retornar sucesso (sem senha)
    return new Response(
      JSON.stringify({
        success: true,
        user: { id: authData.user.id, email, full_name, role }
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[create-admin-user] Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})