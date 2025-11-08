import { createServerClient } from '@supabase/ssr';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import { Env } from '@/libs/Env';
import { Sponsors } from './Sponsors';

export const Hello = async () => {
  const t = await getTranslations('Dashboard');
  
  // 获取Supabase用户信息
  let userEmail = '';
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      Env.NEXT_PUBLIC_SUPABASE_URL,
      Env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    
    const { data: { user } } = await supabase.auth.getUser();
    userEmail = user?.email ?? '';
  } catch (error) {
    console.warn('Failed to get user from Supabase:', error);
  }

  return (
    <>
      <p>
        {`👋 `}
        {t('hello_message', { email: userEmail })}
      </p>
      <p>
        {t.rich('alternative_message', {
          url: () => (
            <a
              className="text-blue-700 hover:border-b-2 hover:border-blue-700"
              href="https://nextjs-boilerplate.com/pro-saas-starter-kit"
            >
              Next.js Boilerplate SaaS
            </a>
          ),
        })}
      </p>
      <Sponsors />
    </>
  );
};
