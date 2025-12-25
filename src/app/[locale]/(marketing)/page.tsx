import {
  ArrowRight,
  CheckCircle,
  Database,
  Globe,
  Layout,
  Lock,
  Monitor,
  Palette,
  Shield,
  Zap
} from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader } from '@/components/Card';
import { Container } from '@/components/layout/Container';

type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: IIndexProps) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default async function Index(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations('HomePage');

  const features = [
    {
      icon: Lock,
      title: t('features.auth.title'),
      description: t('features.auth.description'),
    },
    {
      icon: Database,
      title: t('features.database.title'),
      description: t('features.database.description'),
    },
    {
      icon: Palette,
      title: t('features.ui.title'),
      description: t('features.ui.description'),
    },
    {
      icon: Globe,
      title: t('features.i18n.title'),
      description: t('features.i18n.description'),
    },
    {
      icon: Monitor,
      title: t('features.monitoring.title'),
      description: t('features.monitoring.description'),
    },
    {
      icon: Shield,
      title: t('features.security.title'),
      description: t('features.security.description'),
    },
  ];

  const techStack = [
    { name: 'Next.js 15', description: t('tech.nextjs') },
    { name: 'TypeScript', description: t('tech.typescript') },
    { name: 'Tailwind CSS v4', description: t('tech.tailwind') },
    { name: 'Supabase', description: t('tech.supabase') },
    { name: 'DrizzleORM', description: t('tech.drizzle') },
    { name: 'shadcn/ui', description: t('tech.shadcn') },
  ];

  const included = [
    t('included.auth'),
    t('included.dashboard'),
    t('included.profile'),
    t('included.i18n'),
    t('included.seo'),
    t('included.forms'),
    t('included.validation'),
    t('included.dark_mode'),
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-24 lg:py-32">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2" />
              {t('hero_badge')}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-main mb-6 font-serif">
              {t('hero_title')}
            </h1>

            <p className="text-lg md:text-xl text-text-faded mb-10 max-w-2xl mx-auto">
              {t('hero_description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/sign-up`}>
                <Button
                  variant="default"
                  size="lg"
                  className="bg-primary hover:bg-primary/90 transition-colors"
                >
                  {t('get_started')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="https://github.com/lovstudio/lovweb" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  size="lg"
                >
                  {t('view_github')}
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Tech Stack Section */}
      <section className="w-full py-16 border-y border-border/50">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {techStack.map((tech) => (
              <div key={tech.name} className="text-center">
                <div className="text-lg font-semibold text-text-main mb-1">
                  {tech.name}
                </div>
                <div className="text-sm text-text-faded">
                  {tech.description}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="w-full py-24 lg:py-32">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4 font-serif">
              {t('features_title')}
            </h2>
            <p className="text-lg text-text-faded max-w-2xl mx-auto">
              {t('features_description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="border border-border/50 bg-background hover:border-primary/30 transition-colors">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-main">
                    {feature.title}
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-text-faded leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* What's Included Section */}
      <section className="w-full py-24 lg:py-32 bg-muted/30">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4 font-serif">
                {t('included_title')}
              </h2>
              <p className="text-lg text-text-faded">
                {t('included_description')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {included.map((item) => (
                <div key={item} className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border/50">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-text-main">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Demo Section */}
      <section className="w-full py-24 lg:py-32">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Layout className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4 font-serif">
              {t('demo_title')}
            </h2>
            <p className="text-lg text-text-faded mb-8 max-w-2xl mx-auto">
              {t('demo_description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/sign-up`}>
                <Button variant="default" size="lg">
                  {t('demo_signup')}
                </Button>
              </Link>
              <Link href={`/${locale}/pricing`}>
                <Button variant="outline" size="lg">
                  {t('demo_pricing')}
                </Button>
              </Link>
              <Link href={`/${locale}/counter`}>
                <Button variant="outline" size="lg">
                  {t('demo_counter')}
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 lg:py-32 bg-primary/5">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-6 font-serif">
              {t('cta_title')}
            </h2>

            <p className="text-lg text-text-faded mb-10 max-w-2xl mx-auto">
              {t('cta_description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="https://github.com/lovstudio/lovweb" target="_blank" rel="noopener noreferrer">
                <Button
                  variant="default"
                  size="lg"
                  className="bg-text-main hover:bg-text-main/90 text-white transition-colors"
                >
                  {t('cta_clone')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href={`/${locale}/sign-up`}>
                <Button
                  variant="outline"
                  size="lg"
                >
                  {t('cta_try_demo')}
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
