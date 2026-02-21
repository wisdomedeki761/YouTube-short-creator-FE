import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/layout/Header';
import { Video, Zap, Shield, BarChart3 } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-gray-900">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
              Professional Video
              <span className="text-primary-600 dark:text-primary-400"> Processing</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Upload, process, and manage your videos with our powerful video editor.
              Automatically add filler content and publish to YouTube and Facebook.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/register">
                <Button size="lg">Get started</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white dark:bg-gray-800 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
                Everything you need
              </h2>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                Powerful features to streamline your video workflow
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-4xl lg:grid-cols-4">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-lg bg-primary-100 p-3">
                  <Video className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold dark:text-gray-100">Video Upload</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Upload videos up to 2GB with drag-and-drop interface
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-lg bg-primary-100 p-3">
                  <Zap className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Fast Processing</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Automated video processing with real-time status updates
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-lg bg-primary-100 p-3">
                  <Shield className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Secure</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Your videos are encrypted and stored securely
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-lg bg-primary-100 p-3">
                  <BarChart3 className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Analytics</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Track your video performance and statistics
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-600 dark:bg-primary-700 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white">
              Ready to get started?
            </h2>
            <p className="mt-4 text-lg text-primary-100 dark:text-primary-200">
              Join thousands of users creating amazing videos
            </p>
            <div className="mt-8">
              <Link href="/register">
                <Button size="lg" variant="secondary">
                  Create free account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

