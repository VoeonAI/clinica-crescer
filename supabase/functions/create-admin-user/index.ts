import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verificar autenticação
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extrair token do header
    const token = authHeader.replace('Bearer ', '')

    // Criar cliente admin com service_role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Validar usuário chamador
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Buscar profile do usuário chamador
    const { data: callerProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !callerProfile) {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verificar se é master
    if (callerProfile.role !== 'master') {
      return new Response(
        JSON.stringify({ error: 'Forbidden: Only master users can create new users' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Ler dados do corpo da requisição
    const { full_name, email, password, role, sync_existing } = await req.json()

    // Validações básicas
    if (!email || !role || !full_name) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: full_name, email, role' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!['master', 'editor', 'viewer'].includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Invalid role. Must be master, editor or viewer' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Se for sincronização de usuário existente
    if (sync_existing) {
      console.log('[create-admin-user] Sync mode - searching for user in auth');
      
      // Buscar usuário por email no Auth
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
      
      if (listError) {
        console.error('[create-admin-user] Error listing users:', listError)
        return new Response(
          JSON.stringify({ error: 'Failed to list users' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const existingUser = users.find(u => u.email === email)
      
      if (!existingUser) {
        console.log('[create-admin-user] User not found in auth:', email);
        return new Response(
          JSON.stringify({ 
            error: 'USER_NOT_FOUND',
            message: 'Usuário não encontrado no Authentication.' 
          }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Criar/update profile na tabela pública
      const { error: profileUpdateError } = await supabaseAdmin
        .from('profiles')
        .upsert({
          id: existingUser.id,
          email: email,
          full_name: full_name,
          role: role
        })

      if (profileUpdateError) {
        console.error('[create-admin-user] Error creating profile:', profileUpdateError)
        return new Response(
          JSON.stringify({ error: 'Failed to create profile' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('[create-admin-user] User synced successfully:', { 
        userId: existingUser.id,
        email,
        role,
        syncedBy: user.id 
      })

      return new Response(
        JSON.stringify({
          success: true,
          message: 'User profile synced successfully',
          user: {
            id: existingUser.id,
            email,
            full_name,
            role
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validações para criação de NOVO usuário (requer senha)
    if (!password) {
      return new Response(
        JSON.stringify({ error: 'Password is required for new users' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 6 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('[create-admin-user] Creating new user in auth:', { email, full_name });

    // Criar usuário no Supabase Auth
    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name
      }
    })

    if (createError) {
      console.error('[create-admin-user] Error creating user in auth:', createError);
      
      // Verificar se é erro de email já existente
      if (createError.message.includes('already registered') || 
          createError.message.includes('already been registered') ||
          createError.message.includes('duplicate key') ||
          createError.message.includes('User already registered')) {
        console.log('[create-admin-user] Email already exists in auth:', email);
        return new Response(
          JSON.stringify({ 
            error: 'USER_ALREADY_EXISTS',
            message: 'Este e-mail já está cadastrado no Authentication.',
            details: 'Verifique a lista de usuários ou use a opção de sincronizar.'
          }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!authData.user) {
      console.error('[create-admin-user] User creation returned no user');
      return new Response(
        JSON.stringify({ error: 'Failed to create user - no user data returned' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('[create-admin-user] User created in auth successfully:', authData.user.id);

    // Criar profile na tabela pública com o MESMO ID do usuário Auth
    const { error: profileUpdateError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email,
        full_name: full_name,
        role: role
      })

    if (profileUpdateError) {
      console.error('[create-admin-user] Error creating profile:', profileUpdateError)
      // Se falhar ao criar profile, mas usuário no auth foi criado, logar o erro
      console.error('[create-admin-user] CRITICAL: Auth user created but profile creation failed:', authData.user.id);
      return new Response(
        JSON.stringify({ 
          error: 'Profile creation failed',
          message: 'Usuário criado no Auth mas falha ao criar profile. Contacte o administrador.',
          userId: authData.user.id
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('[create-admin-user] User created successfully:', { 
      userId: authData.user.id,
      email,
      role,
      createdBy: user.id 
    })

    // Retornar sucesso (sem a senha)
    return new Response(
      JSON.stringify({
        success: true,
        message: 'User created successfully',
        user: {
          id: authData.user.id,
          email,
          full_name,
          role
        }
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('[create-admin-user] Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: String(error) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})