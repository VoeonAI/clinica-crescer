import { supabase } from '@/lib/supabaseClient';

/**
 * Esta função deve ser executada apenas uma vez para criar o primeiro usuário master.
 * Execute no console do navegador.
 */
export async function createInitialMasterUser(email: string, password: string, fullName: string) {
  try {
    // Verifica se já existe um usuário master
    const { data: existingProfiles } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'master')
      .limit(1);

    if (existingProfiles && existingProfiles.length > 0) {
      console.log('Já existe um usuário master no sistema.');
      return existingProfiles[0];
    }

    // Cria o usuário no Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'master',
        },
      },
    });

    if (authError) throw authError;

    console.log('Usuário master criado com sucesso!');
    console.log('ID:', user?.id);
    console.log('Email:', email);
    console.log('Por favor, confirme seu email antes de fazer login.');

    return user;
  } catch (error) {
    console.error('Erro ao criar usuário master:', error);
    throw error;
  }
}

/**
 * Instruções de uso:
 * 1. Importe esta função no console do navegador:
 *    import { createInitialMasterUser } from '/src/utils/initAdmin.ts';
 * 
 * 2. Execute a função com seus dados:
 *    await createInitialMasterUser('seu@email.com', 'sua-senha', 'Seu Nome Completo');
 * 
 * 3. Verifique seu email para confirmar a conta
 * 4. Faça login em /admin/login
 */