import React from 'react';
import { SEOHead } from './SEOHead';
import { BreadcrumbSchema } from './Schemas';

interface PublicPageProps {
  title: string;
  description: string;
  keywords?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
  children: React.ReactNode;
}

export const PublicPage: React.FC<PublicPageProps> = ({
  title,
  description,
  keywords,
  breadcrumbs,
  children,
}) => {
  return (
    <>
      <SEOHead title={title} description={description} keywords={keywords} />
      
      {breadcrumbs && (
        <BreadcrumbSchema items={breadcrumbs} />
      )}

      <article className="py-16">
        <div className="container mx-auto px-4">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
              {title}
            </h1>
            {description && (
              <p className="text-xl text-muted-foreground max-w-3xl">
                {description}
              </p>
            )}
          </header>

          {children}
        </div>
      </article>
    </>
  );
};