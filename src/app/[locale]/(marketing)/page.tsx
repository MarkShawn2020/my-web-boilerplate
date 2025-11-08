import { 
  ArrowRight, 
  Building, 
  CheckCircle, 
  Globe, 
  GraduationCap,
  Palette,
  Rocket,
  Shield,
  TestTube,
  Users,
  Zap
} from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader } from '@/components/Card';
import { Container } from '@/components/layout/Container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs';

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
      icon: Rocket,
      title: t('features.nextjs.title'),
      description: t('features.nextjs.description'),
    },
    {
      icon: Palette,
      title: t('features.design.title'),
      description: t('features.design.description'),
    },
    {
      icon: Shield,
      title: t('features.security.title'),
      description: t('features.security.description'),
    },
    {
      icon: Zap,
      title: t('features.performance.title'),
      description: t('features.performance.description'),
    },
    {
      icon: Globe,
      title: t('features.i18n.title'),
      description: t('features.i18n.description'),
    },
    {
      icon: TestTube,
      title: t('features.testing.title'),
      description: t('features.testing.description'),
    },
  ];

  const stats = [
    { value: "10K+", label: "活跃创作者" },
    { value: "50M+", label: "内容阅读量" },
    { value: "99.9%", label: "服务可用性" },
    { value: "24/7", label: "技术支持" },
  ];

  return (
    <>
      {/* Hero Section - Clean and Professional */}
      <section className="w-full py-24 lg:py-32">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-main mb-6">
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
              <Link href={`/${locale}/about`}>
                <Button 
                  variant="outline" 
                  size="lg"
                >
                  {t('view_docs')}
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section - Simple and Clean */}
      <section className="w-full py-16 border-y border-border/50">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-text-main mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-text-faded">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Section - Minimalist Cards */}
      <section className="w-full py-24 lg:py-32">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">
              {t('features_title')}
            </h2>
            <p className="text-lg text-text-faded max-w-2xl mx-auto">
              {t('features_description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="border border-border/50 bg-background hover:border-border transition-colors">
                <CardHeader className="pb-4">
                  <feature.icon className="w-8 h-8 text-primary mb-4" />
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

      {/* Use Cases Section - Clean Tabs */}
      <section className="w-full py-24 lg:py-32 bg-background-oat/30">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">
              {t('use_cases_title')}
            </h2>
            <p className="text-lg text-text-faded max-w-2xl mx-auto">
              {t('use_cases_description')}
            </p>
          </div>

          <Tabs defaultValue="individual" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white/50">
              <TabsTrigger value="individual" className="data-[state=active]:bg-background data-[state=active]:text-text-main">
                <Users className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{t('tabs.individual.label')}</span>
              </TabsTrigger>
              <TabsTrigger value="team" className="data-[state=active]:bg-background data-[state=active]:text-text-main">
                <Users className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{t('tabs.team.label')}</span>
              </TabsTrigger>
              <TabsTrigger value="enterprise" className="data-[state=active]:bg-background data-[state=active]:text-text-main">
                <Building className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{t('tabs.enterprise.label')}</span>
              </TabsTrigger>
              <TabsTrigger value="education" className="data-[state=active]:bg-background data-[state=active]:text-text-main">
                <GraduationCap className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{t('tabs.education.label')}</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <TabsContent value="individual">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-semibold text-text-main mb-4">
                      {t('tabs.individual.title')}
                    </h3>
                    <p className="text-text-faded mb-6 leading-relaxed">
                      {t('tabs.individual.description')}
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-text-faded">AI 智能写作辅助</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-text-faded">SEO 优化建议</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-text-faded">多平台同步发布</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="team">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-semibold text-text-main mb-4">
                      {t('tabs.team.title')}
                    </h3>
                    <p className="text-text-faded mb-6 leading-relaxed">
                      {t('tabs.team.description')}
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-text-faded">实时协作编辑</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-text-faded">版本控制管理</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-text-faded">团队权限管理</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="enterprise">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-semibold text-text-main mb-4">
                      {t('tabs.enterprise.title')}
                    </h3>
                    <p className="text-text-faded mb-6 leading-relaxed">
                      {t('tabs.enterprise.description')}
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-text-faded">品牌资产管理</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-text-faded">数据分析洞察</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-text-faded">API 集成支持</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-semibold text-text-main mb-4">
                      {t('tabs.education.title')}
                    </h3>
                    <p className="text-text-faded mb-6 leading-relaxed">
                      {t('tabs.education.description')}
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-text-faded">课程内容管理</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-text-faded">学习路径设计</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-text-faded">互动测验系统</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </Container>
      </section>

      {/* CTA Section - Simple and Direct */}
      <section className="w-full py-24 lg:py-32">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-6">
              {t('cta_title')}
            </h2>
            
            <p className="text-lg text-text-faded mb-10 max-w-2xl mx-auto">
              {t('cta_description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/sign-up`}>
                <Button 
                  variant="default" 
                  size="lg"
                  className="bg-text-main hover:bg-text-main/90 text-white transition-colors"
                >
                  {t('cta_start')}
                </Button>
              </Link>
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button 
                  variant="outline" 
                  size="lg"
                >
                  {t('cta_github')}
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};