'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { createClient } from '@/libs/supabase/client';
import { BaseTemplate } from '@/templates/BaseTemplate';

export default function DashboardLayout(props: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/sign-in');
    router.refresh();
  };

  return (
    <BaseTemplate
      leftNav={(
        <>
          <li>
            <Link
              href="/dashboard/"
              className="border-none text-gray-700 hover:text-gray-900"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/transcripts"
              className="border-none text-gray-700 hover:text-gray-900"
            >
              My Transcripts
            </Link>
          </li>
        </>
      )}
      rightNav={(
        <>
          <li>
            <button
              className="border-none text-gray-700 hover:text-gray-900"
              type="button"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </li>

          <li>
            <LocaleSwitcher />
          </li>
        </>
      )}
    >
      {props.children}
    </BaseTemplate>
  );
}
