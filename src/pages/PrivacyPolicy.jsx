/**
 * Privacy Policy Page
 * COPPA, GDPR, and CCPA compliance
 */

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-sm max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p>
            BSA Troop 242 ("we" or "us") respects your privacy and is committed to protecting your personal data.
            This privacy policy explains how we collect, use, and protect information about you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account Information:</strong> Name, email, password, phone number</li>
            <li><strong>Scout Profile:</strong> Rank, merit badges, skills, advancement progress</li>
            <li><strong>Activity Data:</strong> Event signups, RSVP status, participation records</li>
            <li><strong>Technical Data:</strong> IP address, browser type, pages visited (via analytics)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">3. Children's Privacy (COPPA)</h2>
          <p>
            This application collects information from children under 13. For these users, we:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Require verifiable parental consent before account creation</li>
            <li>Limit collection to information necessary for program operation</li>
            <li>Do not share information with third parties (except with parent consent)</li>
            <li>Provide parents the ability to review, update, or delete their child's information</li>
            <li>Never use a child's information for direct marketing</li>
          </ul>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mt-4">
            <strong>Parental Consent:</strong> We require verifiable parental consent before allowing a scout under 13
            to create an account. Parents can consent by clicking the parental consent link in the registration email.
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">4. How We Use Your Information</h2>
          <p>We use your information for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Providing and managing scout advancement tracking</li>
            <li>Organizing activities and events</li>
            <li>Communicating updates and announcements</li>
            <li>Improving our application and services</li>
            <li>Complying with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
          <p>
            We protect your data using industry-standard security measures including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>HTTPS encryption for all data in transit</li>
            <li>Bcrypt password hashing (never stored in plaintext)</li>
            <li>Firebase security rules (role-based access control)</li>
            <li>Regular security audits and penetration testing</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
          <p>
            We retain your information for as long as your account is active. You can request data deletion at any time.
            We will delete all personal data within 30 days of a verified deletion request.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">7. Your Rights (GDPR)</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Access:</strong> Request all data we hold about you</li>
            <li><strong>Rectification:</strong> Correct inaccurate information</li>
            <li><strong>Erasure:</strong> Request deletion of your account and data</li>
            <li><strong>Portability:</strong> Export your data in machine-readable format</li>
            <li><strong>Objection:</strong> Opt out of non-essential communications</li>
          </ul>
          <p className="mt-4">
            To exercise these rights, contact: <strong>privacy@troop242.org</strong>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">8. Cookies & Analytics</h2>
          <p>
            We use essential cookies to maintain your session. We do not use third-party trackers or advertising cookies.
            Analytics data is anonymized and aggregated.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">9. Third-Party Services</h2>
          <p>
            We use Firebase (Google) for hosting and authentication. Firebase's privacy policy is available at
            <a href="https://firebase.google.com/support/privacy" className="text-blue-600 hover:underline"> firebase.google.com/support/privacy</a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">10. Contact Us</h2>
          <p>
            For privacy questions or to submit a data request:
          </p>
          <ul className="space-y-2">
            <li>Email: <strong>privacy@troop242.org</strong></li>
            <li>Mail: Troop 242, Sanford, FL 32771</li>
          </ul>
        </section>

        <section className="border-t pt-4 mt-8">
          <p className="text-sm text-gray-600">
            Last updated: March 21, 2026
          </p>
        </section>
      </div>
    </div>
  );
}
