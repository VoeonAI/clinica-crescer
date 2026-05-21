# Clínica Crescer - Site Institucional com CMS

Site institucional da Clínica Crescer com CMS integrado para gestão de conteúdo, equipe e blog.

## Stack Tecnológica

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Autenticação + Database)
- **Deploy**: Vercel

## Funcionalidades

### Público
- Página inicial com informações sobre a clínica
- Páginas informativas sobre serviços (Avaliação Neuropsicológica, Terapia ABA, etc.)
- Blog com artigos publicados
- Seção "Precisa de Ajuda?" com sinais de alerta
- SEO otimizado com schema.org (FAQ, Article, Breadcrumb, MedicalClinic)

### Admin (CMS)
- Dashboard com estatísticas
- Gerenciamento de blog (posts e categorias)
- Gerenciamento de equipe
- Gestão de usuários e permissões
- Editor de conteúdo com suporte a HTML

## Estrutura do Projeto

```
src/
├── components/
│   ├── PublicLayout.tsx      # Layout para páginas públicas
│   ├── AdminLayout.tsx       # Layout para páginas admin
│   ├── PublicPage.tsx        # Componente base para páginas públicas
│   ├── SEOHead.tsx           # Componente para SEO
│   ├── Schemas.tsx           # Schema.org (FAQ, Article, Breadcrumb)
│   ├── RouteGuard.tsx        # Proteção de rotas
│   ├── PermissionGate.tsx    # Controle de permissões granular
│   └── ui/                   # Componentes shadcn/ui
├── contexts/
│   └── AuthContext.tsx       # Contexto de autenticação
├── pages/
│   ├── Index.tsx             # Página inicial
│   ├── public/               # Páginas públicas
│   │   ├── Sobre.tsx
│   │   ├── Blog.tsx
│   │   ├── BlogPost.tsx
│   │   └── ...
│   └── admin/                # Páginas admin
│       ├── AdminLogin.tsx
│       ├── AdminDashboard.tsx
│       ├── AdminBlog.tsx
│       ├── AdminEquipe.tsx
│       └── AdminUsuarios.tsx
├── services/
│   ├── blogService.ts        # Serviços do blog
│   ├── staffService.ts       # Serviços da equipe
│   └── authService.ts        # Serviços de autenticação
└── integrations/
    └── supabase/
        └── client.ts         # Cliente Supabase
```

## Configuração Inicial

1. **Variáveis de ambiente** (já configuradas automaticamente):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. **Criar o primeiro usuário admin**:
   - Siga as instruções em [SETUP_ADMIN.md](./SETUP_ADMIN.md)

3. **Acessar o admin**:
   - URL: `/admin/login`
   - Credenciais: criadas na etapa anterior

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## Deploy

O projeto está configurado para deploy automático no Vercel através do arquivo `vercel.json`.

## SEO e Performance

- Metatags otimizadas para cada página
- Schema.org implementado (FAQPage, Article, BreadcrumbList, MedicalClinic)
- Sitemap e robots.txt (próxima etapa)
- Imagens otimizadas com lazy loading
- Code splitting automático via React Router

## Próximas Etapas

- [ ] Implementar sitemap.xml
- [ ] Implementar robots.txt
- [ ] Criar llms.txt para SEO de LLMs
- [ ] Adicionar upload de imagens no blog
- [ ] Implementar sistema de comentários no blog
- [ ] Adicionar analytics

## Licença

Todos os direitos reservados © Clínica Crescer