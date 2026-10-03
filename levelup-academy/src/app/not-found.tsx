import { Footer } from '@/components/site/footer';
import { Header } from '@/components/site/header';
import { ButtonLink } from '@/components/ui/button';

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="container-page flex flex-1 flex-col items-center justify-center py-28 text-center">
        <p className="font-mono text-sm text-accent">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-3 text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-8 flex gap-3">
          <ButtonLink href="/">Home</ButtonLink>
          <ButtonLink href="/courses" variant="secondary">Browse courses</ButtonLink>
        </div>
      </main>
      <Footer />
    </>
  );
}
