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
    const { full_name, email, password, role } = await req.json()

    // Validações
    if (!email || !password || !role || !full_name) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: full_name, email, password, role' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 8 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!['master', 'editor', 'viewer'].includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Invalid role. Must be master, editor or viewer' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

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
      // Verificar se é erro de email já existente
      if (createError.message.includes('already registered') || 
          createError.message.includes('already been registered') ||
          createError.message.includes('duplicate key') ||
          createError.message.includes('User already registered')) {
        console.log('[create-admin-user] Email already exists:', email);
        return new Response(
          JSON.stringify({ 
            error: 'USER_ALREADY_EXISTS',
            message: 'Este e-mail já está cadastrado no sistema.',
            details: 'Verifique a lista de usuários ou atualize a função do usuário existente.'
          }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      console.error('[create-admin-user] Error creating user:', createError)
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Criar/update profile na tabela pública
    const { error: profileUpdateError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email: email,
        full_name: full_name,
        role: role
      })

    if (profileUpdateError) {
      console.error('[create-admin-user] Error creating profile:', profileUpdateError)
      return new Response(
        JSON.stringify({ error: 'User created but profile update failed' }),
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
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})