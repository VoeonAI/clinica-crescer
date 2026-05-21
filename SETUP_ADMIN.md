# Configuração do Primeiro Usuário Admin

Para acessar o painel administrativo pela primeira vez, você precisa criar um usuário com permissão de `master`.

## Método 1: Via Console do Navegador

1. Acesse o site e abra o console do navegador (F12)
2. Importe e execute a função de criação:

```javascript
import { createInitialMasterUser } from '/src/utils/initAdmin.ts';
await createInitialMasterUser('admin@clinicacrescer.com', 'senha-segura-123', 'Administrador');
```

3. Verifique seu email para confirmar a conta
4. Faça login em `/admin/login`

## Método 2: Via Supabase Dashboard

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em Authentication → Users
3. Clique em "Add user"
4. Preencha:
   - Email: admin@clinicacrescer.com
   - Password: sua senha
   - Auto Confirm User: ✓ (marcado)
5. Após criar, vá em SQL Editor
6. Execute:

```sql
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  id, 
  email, 
  'Administrador' as full_name,
  'master' as role
FROM auth.users 
WHERE email = 'admin@clinicacrescer.com';
```

## Após Criar o Usuário

1. Faça login em `/admin/login`
2. Você terá acesso completo ao CMS
3. Pode criar outros usuários via `/admin/usuarios`

## Perfis de Usuário

- **master**: Acesso total (criar/editar usuários, blog, equipe)
- **editor**: Acesso parcial (blog e equipe, mas não usuários)
- **viewer**: Acesso visual apenas