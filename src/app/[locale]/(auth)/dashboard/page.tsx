import { getTranslations } from 'next-intl/server';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
  };
}

export default function Dashboard() {
  return <DashboardOverview />;
}
