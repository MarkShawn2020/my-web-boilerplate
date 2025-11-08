'use client';

import {useTranslations} from 'next-intl';
import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import {useAuthUser} from '@/hooks/useAuthUser';
import {useRouter} from '@/libs/I18nNavigation';
import {cn} from '@/utils/Helpers';
import packageJson from '../../../package.json';
import {Button} from '../Button';
import {LocaleSwitcher} from '../LocaleSwitcher';
import {NeuroraIcon} from '../NeuroraIcon';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '../ui/dropdown-menu';
import {UserDropdown} from '../UserDropdown';
import {Container} from './Container';
import {HeaderActionSkeleton} from './HeaderActionSkeleton';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const t = useTranslations('Header');
    const router = useRouter();

    // Auth state and actions
    const {user, isAuthenticated, loading} = useAuthUser();

    // Prevent hydration mismatch by ensuring client-side rendering matches server-side
    useEffect(() => {
        setHasMounted(true);
    }, []);

    // Regular navigation items (Features will be handled separately as dropdown)
    const navigation = [
        {name: 'Gallery', href: '/gallery'}, // TODO: Add t('gallery') to translations
        {name: t('community'), href: '/community'},
        {name: 'Download', href: '/download'}, // TODO: Add t('download') to translations
        {name: t('pricing'), href: '/pricing'},
        {name: t('blog'), href: '/blog'},
    ];

    // Features dropdown configuration
    const featuresDropdownItems = [
        {
            category: 'Core Features', // TODO: Add t('core_features') to translations
            items: [
                {name: 'AI Analysis', href: '/features/ai-analysis'}, // TODO: Add translations
                {name: 'Data Visualization', href: '/features/visualization'},
                {name: 'Smart Insights', href: '/features/insights'},
            ]
        },
        {
            category: 'Advanced Tools', // TODO: Add t('advanced_tools') to translations
            items: [
                {name: 'Automation', href: '/features/automation'},
                {name: 'Collaboration', href: '/features/collaboration'},
                {name: 'Custom Workflows', href: '/features/workflows'},
            ]
        },
        {
            category: 'Integrations', // TODO: Add t('integrations') to translations
            items: [
                {name: 'API Access', href: '/features/api'},
                {name: 'Third Party', href: '/features/integrations'},
                {name: 'Enterprise', href: '/features/enterprise'},
            ]
        }
    ];

    // Handle login button click
    const handleLogin = () => {
        router.push('/sign-in');
    };


    // Handle dashboard navigation
    const handleDashboard = () => {
        router.push('/dashboard');
        setIsMenuOpen(false);
    };

    // Features Dropdown Component
    const FeaturesDropdown = () => (
        <DropdownMenu>
            <DropdownMenuTrigger className="text-text-main hover:text-primary transition-colors no-underline flex items-center space-x-1 outline-none focus:outline-none data-[state=open]:text-primary">
                <span>{t('features')}</span>
                <svg className="w-4 h-4 transition-transform duration-200 data-[state=open]:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="start" sideOffset={8}>
                {featuresDropdownItems.map((section, sectionIndex) => (
                    <div key={section.category}>
                        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {section.category}
                        </DropdownMenuLabel>
                        {section.items.map((item) => (
                            <DropdownMenuItem key={item.name} asChild>
                                <Link href={item.href} className="cursor-pointer flex items-center">
                                    {item.name}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                        {sectionIndex < featuresDropdownItems.length - 1 && <DropdownMenuSeparator />}
                    </div>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <header
            className="sticky top-0 z-50 w-full bg-background-main border-b border-border-default/20 backdrop-blur-sm">
            <Container>
                <div className="flex items-center justify-between py-4 lg:py-6">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2 no-underline"
                              style={{color: 'var(--color-primary, #d97757)'}}>
                            <NeuroraIcon className="h-8 w-8"/>
                            <span className="text-xl font-bold">Neurora</span>
                        </Link>
                        <span
                            className="ml-2 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
              v
                            {packageJson.version}
            </span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        <FeaturesDropdown />
                        {navigation.map(item => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-text-main hover:text-primary transition-colors no-underline"
                            >
                                {item.name}
                            </Link>
                        ))}
                        {/* Show LocaleSwitcher only when user is not authenticated */}
                        {(!hasMounted || loading || !isAuthenticated) && (
                            <div className="pl-4 border-l border-border-default/20">
                                <LocaleSwitcher/>
                            </div>
                        )}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {!hasMounted || loading
                            ? (
                                <HeaderActionSkeleton variant="desktop" />
                            )
                            : isAuthenticated && user
                                ? (
                                    <div className="flex items-center space-x-4">
                                        <Button variant="default" size="default" onClick={handleDashboard}>
                                            Dashboard
                                        </Button>
                                        <UserDropdown/>
                                    </div>
                                )
                                : (
                                    <>
                                        <Button variant="secondary" size="default" onClick={handleLogin}>
                                            {t('login')}
                                        </Button>
                                        <Button variant="default" size="default" onClick={handleLogin}>
                                            {t('try_now')}
                                        </Button>
                                    </>
                                )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 rounded-md text-text-main hover:bg-gray-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMenuOpen
                                ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                )
                                : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    className={cn(
                        'lg:hidden transition-all duration-300 overflow-hidden',
                        isMenuOpen ? 'max-h-[500px] pb-6' : 'max-h-0',
                    )}
                >
                    <nav className="flex flex-col space-y-4">
                        {/* Show LocaleSwitcher only when user is not authenticated */}
                        {(!hasMounted || loading || !isAuthenticated) && (
                            <div className="flex justify-end py-2">
                                <LocaleSwitcher/>
                            </div>
                        )}
                        
                        {/* Mobile Features Section */}
                        <div className="space-y-2">
                            <div className="text-text-main font-medium py-2">{t('features')}</div>
                            {featuresDropdownItems.map((section) => (
                                <div key={section.category} className="ml-4 space-y-1">
                                    <div className="text-sm font-medium text-muted-foreground py-1">
                                        {section.category}
                                    </div>
                                    {section.items.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="block text-text-main hover:text-primary transition-colors py-1 text-sm ml-2 no-underline"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            ))}
                        </div>
                        
                        {/* Regular Navigation Items */}
                        {navigation.map(item => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-text-main hover:text-primary transition-colors py-2 no-underline"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="flex flex-col space-y-3 pt-4 border-t border-border-default/20">
                            {!hasMounted || loading
                                ? (
                                    <HeaderActionSkeleton variant="mobile" />
                                )
                                : isAuthenticated && user
                                    ? (
                                        <>
                                            <div className="flex items-center justify-between px-2 py-1">
                          <span className="text-sm text-gray-600">
                            {user.profile?.fullName || user.email}
                          </span>
                                                <UserDropdown/>
                                            </div>
                                            <Button variant="default" size="default" className="w-full"
                                                    onClick={handleDashboard}>
                                                Dashboard
                                            </Button>
                                        </>
                                    )
                                    : (
                                        <>
                                            <Button variant="secondary" size="default" className="w-full"
                                                    onClick={handleLogin}>
                                                {t('login')}
                                            </Button>
                                            <Button variant="default" size="default" className="w-full"
                                                    onClick={handleLogin}>
                                                {t('try_now')}
                                            </Button>
                                        </>
                                    )}
                        </div>
                    </nav>
                </div>
            </Container>
        </header>
    );
};

export {Header};
