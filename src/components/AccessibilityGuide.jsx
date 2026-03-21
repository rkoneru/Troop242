/**
 * Accessibility Guidelines Component
 * WCAG 2.1 AA Compliance Standards
 */

export default function AccessibilityGuide() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Accessibility Statement</h1>

      <div className="prose prose-sm max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
          <p>
            BSA Troop 242 is committed to providing an accessible website for all users, including
            those with disabilities. We strive to meet WCAG 2.1 Level AA standards.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Accessibility Features</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-lg">🔤 Semantic HTML</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Proper heading hierarchy (h1 → h2 → h3)</li>
                <li>Semantic buttons (&lt;button&gt;, not &lt;div&gt;)</li>
                <li>Proper form labels (&lt;label for="...&gt;)</li>
                <li>Landmark regions (&lt;nav&gt;, &lt;main&gt;, &lt;footer&gt;)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg">⌨️ Keyboard Navigation</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Tab key to navigate all interactive elements</li>
                <li>Enter/Space to activate buttons</li>
                <li>Escape key to close modals/menus</li>
                <li>Arrow keys for dropdowns and lists</li>
                <li>Focus indicators visible on all elements</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg">👁️ Visual Accessibility</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Sufficient color contrast (4.5:1 for text)</li>
                <li>No color alone used to convey information</li>
                <li>Resizable text (Ctrl+/- or browser zoom)</li>
                <li>Dark mode support</li>
                <li>High contrast mode support</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg">🔊 Screen Reader Support</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>ARIA labels on images (alt text)</li>
                <li>ARIA descriptions for complex content</li>
                <li>Skip to main content link</li>
                <li>Proper list structure (&lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;)</li>
                <li>Hidden decorative elements (aria-hidden="true")</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg">⏱️ Timing & Animations</h3>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>No content flashes more than 3 times per second</li>
                <li>Auto-playing content can be paused</li>
                <li>Animations respect prefers-reduced-motion</li>
                <li>Sufficient time for form submission</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Keyboard Shortcuts</h2>
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2 text-left">Key Combination</th>
                <th className="border border-gray-300 p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2"><code>Tab</code></td>
                <td className="border border-gray-300 p-2">Navigate forward</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2"><code>Shift + Tab</code></td>
                <td className="border border-gray-300 p-2">Navigate backward</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2"><code>Enter</code></td>
                <td className="border border-gray-300 p-2">Activate button or submit form</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2"><code>Space</code></td>
                <td className="border border-gray-300 p-2">Toggle checkbox or radio button</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2"><code>Escape</code></td>
                <td className="border border-gray-300 p-2">Close modal or menu</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2"><code>Alt + S</code></td>
                <td className="border border-gray-300 p-2">Open search</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2"><code>Ctrl + /</code></td>
                <td className="border border-gray-300 p-2">Increase text size</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2"><code>Ctrl + -</code></td>
                <td className="border border-gray-300 p-2">Decrease text size</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Technical Standards</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>WCAG 2.1 Level AA</strong> - International accessibility standard</li>
            <li><strong>Section 508</strong> - U.S. federal accessibility requirement</li>
            <li><strong>ARIA 1.2</strong> - Accessible Rich Internet Applications</li>
            <li><strong>ADA Title II</strong> - Americans with Disabilities Act</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Assistive Technologies Supported</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Screen Readers: NVDA, JAWS, VoiceOver</li>
            <li>Speech Recognition: Dragon NaturallySpeaking, Windows Speech Recognition</li>
            <li>Switch Control: Eye trackers, switch devices</li>
            <li>Browser Extensions: Accessibility overlays, zoom tools</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Report an Accessibility Issue</h2>
          <p>
            If you encounter any accessibility barriers, please contact us:
          </p>
          <ul className="space-y-2">
            <li>Email: <strong>accessibility@troop242.org</strong></li>
            <li>Phone: <strong>(407) 555-0242</strong></li>
            <li>Mail: Troop 242, Sanford, FL 32771</li>
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            We will respond to accessibility issues within 5 business days.
          </p>
        </section>

        <section className="border-t pt-4 mt-8">
          <p className="text-sm text-gray-600">
            Last updated: March 21, 2026 | Compliance level: WCAG 2.1 AA
          </p>
        </section>
      </div>
    </div>
  );
}
