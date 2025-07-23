import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardIcon } from '@/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

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
      icon: '🚀',
      title: t('features.nextjs.title'),
      description: t('features.nextjs.description'),
    },
    {
      icon: '🎨',
      title: t('features.design.title'),
      description: t('features.design.description'),
    },
    {
      icon: '🔒',
      title: t('features.security.title'),
      description: t('features.security.description'),
    },
    {
      icon: '⚡',
      title: t('features.performance.title'),
      description: t('features.performance.description'),
    },
    {
      icon: '🌐',
      title: t('features.i18n.title'),
      description: t('features.i18n.description'),
    },
    {
      icon: '🧪',
      title: t('features.testing.title'),
      description: t('features.testing.description'),
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-16 lg:py-24">
        <Container>
          <div className="u-grid-desktop gap-8 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <h1 className="u-display-xl mb-6">
                {t('hero_title')}
              </h1>
              <p className="u-paragraph-l mb-8 text-text-faded">
                {t('hero_description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="default" size="lg">
                  {t('get_started')}
                </Button>
                <Button variant="secondary" size="lg">
                  {t('view_docs')}
                </Button>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-swatch-fig to-swatch-sky rounded-2xl p-8 text-white">
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">⚡</div>
                      <p className="text-xl font-medium">{t('hero_card_title')}</p>
                      <p className="text-sm mt-2 opacity-90">{t('hero_card_subtitle')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 lg:py-24 u-bg-ivory-medium">
        <Container>
          <div className="text-center mb-16">
            <h2 className="u-display-m mb-4">{t('features_title')}</h2>
            <p className="u-paragraph-l text-text-faded max-w-3xl mx-auto">
              {t('features_description')}
            </p>
          </div>

          <div className="u-grid-desktop gap-8">
            {features.map(feature => (
              <div key={feature.title} className="lg:col-span-4">
                <Card>
                  <CardIcon>
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      {feature.icon}
                    </div>
                  </CardIcon>
                  <CardContent>
                    <CardHeader>
                      <h3 className="u-display-s mb-2">{feature.title}</h3>
                    </CardHeader>
                    <p className="u-paragraph-m text-text-faded">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Use Cases Section */}
      <section className="w-full py-16 lg:py-24">
        <Container>
          <div className="text-center mb-12">
            <h2 className="u-display-m mb-4">{t('use_cases_title')}</h2>
            <p className="u-paragraph-l text-text-faded">
              {t('use_cases_description')}
            </p>
          </div>

          <Tabs defaultValue="individual" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="individual">{t('tabs.individual.label')}</TabsTrigger>
              <TabsTrigger value="team">{t('tabs.team.label')}</TabsTrigger>
              <TabsTrigger value="enterprise">{t('tabs.enterprise.label')}</TabsTrigger>
              <TabsTrigger value="education">{t('tabs.education.label')}</TabsTrigger>
            </TabsList>

            <TabsContent value="individual" className="mt-8">
              <div className="text-center space-y-4">
                <h3 className="u-display-s">{t('tabs.individual.title')}</h3>
                <p className="u-paragraph-m text-text-faded">
                  {t('tabs.individual.description')}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="team" className="mt-8">
              <div className="text-center space-y-4">
                <h3 className="u-display-s">{t('tabs.team.title')}</h3>
                <p className="u-paragraph-m text-text-faded">
                  {t('tabs.team.description')}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="enterprise" className="mt-8">
              <div className="text-center space-y-4">
                <h3 className="u-display-s">{t('tabs.enterprise.title')}</h3>
                <p className="u-paragraph-m text-text-faded">
                  {t('tabs.enterprise.description')}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="education" className="mt-8">
              <div className="text-center space-y-4">
                <h3 className="u-display-s">{t('tabs.education.title')}</h3>
                <p className="u-paragraph-m text-text-faded">
                  {t('tabs.education.description')}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 lg:py-24 u-theme-dark">
        <Container>
          <div className="text-center">
            <h2 className="u-display-m text-white mb-6">{t('cta_title')}</h2>
            <p className="u-paragraph-l text-gray-300 mb-8 max-w-2xl mx-auto">
              {t('cta_description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="default" size="lg">
                {t('cta_start')}
              </Button>
              <Button variant="secondary" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-background-dark">
                {t('cta_github')}
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};
