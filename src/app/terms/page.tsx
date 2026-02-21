import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms and Conditions - Video Editor',
  description: 'Terms and Conditions for Video Editor service',
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <Link href="/">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                Terms and Conditions
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                By accessing and using the Video Editor service ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>2. Service Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Video Editor is a video processing service that allows users to upload, process, and manage video content. The Service includes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Video upload and processing</li>
                <li>Automatic filler content addition</li>
                <li>Video publishing to YouTube and Facebook</li>
                <li>Video management and storage</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>3. Video Processing Limitations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                Processing Queue:
              </p>
              <p>
                Users may process <strong>one (1) video at a time</strong>. Additional video uploads will be queued and processed sequentially after the current video processing is complete.
              </p>
              <p>
                This limitation ensures optimal processing quality and system stability. Attempting to bypass this limitation may result in service restrictions.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>4. Content Usage Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                By uploading content to our Service, you grant us the following rights:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Website Usage:</strong> We reserve the right to use, display, and showcase any video content uploaded to our Service on our website, marketing materials, and promotional content for demonstration and marketing purposes.
                </li>
                <li>
                  <strong>Processing Rights:</strong> We may process, modify, and enhance your video content as necessary to provide the Service, including adding filler content and preparing videos for publication.
                </li>
                <li>
                  <strong>Storage Rights:</strong> We may store your video content on our servers for the duration necessary to provide the Service and as required by law.
                </li>
              </ul>
              <p className="mt-4">
                You retain ownership of your original content, but grant us a non-exclusive, worldwide, royalty-free license to use your content as described above.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>5. Service Changes and Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                Free to Paid Service Transition:
              </p>
              <p>
                We reserve the right to convert the free service to a paid premium service at any time. If such a change occurs:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>We will provide at least <strong>30 days advance notice</strong> via email and website notification</li>
                <li>Existing users will be given the option to subscribe to the premium service or continue with limited free features</li>
                <li>Pricing details will be clearly communicated before any changes take effect</li>
                <li>You may cancel your account at any time before the transition if you do not wish to continue</li>
              </ul>
              <p className="mt-4">
                We may also modify, suspend, or discontinue any aspect of the Service at any time, with or without notice.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>6. User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>You agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information when registering</li>
                <li>Maintain the security of your account credentials</li>
                <li>Not upload content that violates any laws, regulations, or third-party rights</li>
                <li>Not upload content that is illegal, harmful, threatening, abusive, or offensive</li>
                <li>Not use the Service for any illegal or unauthorized purpose</li>
                <li>Not attempt to gain unauthorized access to the Service or its systems</li>
                <li>Not interfere with or disrupt the Service or servers</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>7. Prohibited Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>You may not upload content that:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Contains copyrighted material without proper authorization</li>
                <li>Is defamatory, libelous, or violates privacy rights</li>
                <li>Contains explicit sexual content, violence, or hate speech</li>
                <li>Promotes illegal activities or substances</li>
                <li>Infringes on intellectual property rights</li>
                <li>Contains malware, viruses, or harmful code</li>
                <li>Violates any applicable laws or regulations</li>
              </ul>
              <p className="mt-4 font-semibold text-red-600 dark:text-red-400">
                Violation of these restrictions may result in immediate account termination and legal action.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>8. Account Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use a strong, unique password</li>
                <li>Not share your account credentials with others</li>
                <li>Immediately notify us of any unauthorized use of your account</li>
                <li>Log out from your account when using shared devices</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>9. Video Storage and Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We reserve the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Set limits on storage space and video retention periods</li>
                <li>Delete videos that violate our terms or remain inactive for extended periods</li>
                <li>Remove content that is no longer needed for service provision</li>
                <li>Implement data retention policies in compliance with applicable laws</li>
              </ul>
              <p className="mt-4">
                We recommend that you maintain your own backups of important video content. We are not responsible for any loss of data.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>10. Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                The Service may integrate with third-party platforms such as YouTube and Facebook. By using these integrations, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Comply with the terms of service of these third-party platforms</li>
                <li>Provide valid API keys and credentials for these services</li>
                <li>Understand that we are not responsible for the policies or actions of third-party services</li>
                <li>Accept that third-party service availability may affect our Service</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>11. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind</li>
                <li>We do not guarantee that the Service will be uninterrupted, error-free, or secure</li>
                <li>We are not liable for any indirect, incidental, special, or consequential damages</li>
                <li>Our total liability shall not exceed the amount you paid for the Service in the past 12 months</li>
                <li>We are not responsible for any loss of data, revenue, or business opportunities</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>12. Indemnification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                You agree to indemnify, defend, and hold harmless Video Editor, its affiliates, and their respective officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of another party</li>
                <li>Content you upload or transmit through the Service</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>13. Termination</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violation of these Terms and Conditions</li>
                <li>Fraudulent, abusive, or illegal activity</li>
                <li>Non-payment of fees (for premium services)</li>
                <li>Extended periods of account inactivity</li>
              </ul>
              <p className="mt-4">
                You may terminate your account at any time by contacting us or using the account deletion feature in your settings.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>14. Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                The Service, including its original content, features, and functionality, is owned by Video Editor and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p>
                You may not copy, modify, distribute, sell, or lease any part of our Service without our prior written consent.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>15. Privacy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand how we collect, use, and protect your information.
              </p>
              <Link href="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">
                View Privacy Policy →
              </Link>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>16. Modifications to Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                We reserve the right to modify these Terms and Conditions at any time. We will notify users of any material changes by:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Posting the updated terms on our website</li>
                <li>Sending email notifications to registered users</li>
                <li>Displaying a notice on the Service</li>
              </ul>
              <p className="mt-4">
                Your continued use of the Service after such modifications constitutes acceptance of the updated terms.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>17. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                These Terms and Conditions shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions. Any disputes arising from these Terms shall be resolved through appropriate legal channels.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>18. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <ul className="list-none space-y-2 ml-4">
                <li>Email: support@videoeditor.com</li>
                <li>Website: <Link href="/" className="text-primary-600 dark:text-primary-400 hover:underline">www.videoeditor.com</Link></li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                By using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4 mt-8">
            <Link href="/register">
              <Button>I Accept - Create Account</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

