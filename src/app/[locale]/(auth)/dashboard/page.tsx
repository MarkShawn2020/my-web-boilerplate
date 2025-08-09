import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

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
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">PodFast Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/transcripts">
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">My Transcripts</h2>
            <p className="text-gray-600">
              Upload and manage your media transcripts. Support for DOCX, PDF, TXT, and more.
            </p>
          </Card>
        </Link>

        <Card className="p-6 opacity-50">
          <h2 className="text-xl font-semibold mb-2">Templates</h2>
          <p className="text-gray-600">
            Coming soon: Save and reuse speaker templates for consistent formatting.
          </p>
        </Card>

        <Card className="p-6 opacity-50">
          <h2 className="text-xl font-semibold mb-2">Settings</h2>
          <p className="text-gray-600">
            Coming soon: Configure default speakers, export formats, and more.
          </p>
        </Card>
      </div>
    </div>
  );
}
