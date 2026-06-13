import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Jyotirmoy Bhowmik",
    description: "Privacy policy detailing global and India standards for data protection and privacy.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        Privacy <span className="gradient-text">Policy</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Our commitment to your privacy and data protection across different regions.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Global Standard Section */}
                    <section className="bg-surface border border-border rounded-xl p-6 md:p-8">
                        <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-border/50">
                            Global Standard
                        </h2>
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                We are committed to protecting your personal information and your right to privacy.
                                We recognize the importance of maintaining the confidentiality, integrity, and security
                                of the data we process globally.
                            </p>
                            <p>
                                <strong>Key Principles:</strong>
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Lawfulness, fairness and transparency:</strong> Data is processed lawfully and transparently.</li>
                                <li><strong>Purpose limitation:</strong> Data is collected for specified, explicit, and legitimate purposes.</li>
                                <li><strong>Data minimization:</strong> We collect only what is necessary for the intended purpose.</li>
                                <li><strong>Accuracy:</strong> Reasonable steps are taken to ensure data is accurate and kept up to date.</li>
                                <li><strong>Storage limitation:</strong> Data is kept in a form which permits identification of data subjects for no longer than is necessary.</li>
                                <li><strong>Integrity and confidentiality:</strong> Data is processed in a manner that ensures appropriate security of the personal data.</li>
                            </ul>
                        </div>
                    </section>

                    {/* India Standard Section */}
                    <section className="bg-surface border border-border rounded-xl p-6 md:p-8">
                        <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-border/50">
                            India Standard (DPDP Act)
                        </h2>
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                For individuals residing in India, we process personal data in accordance with the
                                Digital Personal Data Protection (DPDP) Act, 2023.
                            </p>
                            <p>
                                <strong>Your Rights:</strong>
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Right to Access:</strong> You have the right to request a summary of your personal data being processed.</li>
                                <li><strong>Right to Correction & Erasure:</strong> You can request correction of inaccurate data or erasure of data that is no longer necessary.</li>
                                <li><strong>Right to Grievance Redressal:</strong> You have the right to readily available means of grievance redressal.</li>
                                <li><strong>Right to Nominate:</strong> You can nominate any other individual to exercise your rights in the event of your death or incapacity.</li>
                            </ul>
                            <p className="mt-4">
                                <strong>Consent Management:</strong> We ensure that consent is free, specific, informed, unconditional, and unambiguous. You may withdraw your consent at any time.
                            </p>
                        </div>
                    </section>

                    {/* Sample Information Collected */}
                    <section className="bg-surface border border-border rounded-xl p-6 md:p-8">
                        <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-border/50">
                            Sample Information Collected
                        </h2>
                        <div className="space-y-6 text-muted-foreground">
                            <div>
                                <h3 className="text-lg font-medium text-foreground mb-2">Our Apps</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li><strong>Device Data:</strong> OS version, device model, and unique identifiers to ensure app compatibility and security.</li>
                                    <li><strong>Usage Metrics:</strong> Feature interaction and crash reports to improve application stability.</li>
                                    <li><strong>Location:</strong> Coarse location data (if permitted) for regional customization.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-foreground mb-2">Our Sites</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li><strong>Browsing Data:</strong> IP address, browser type, and access times logged for security monitoring.</li>
                                    <li><strong>Cookies & Analytics:</strong> Session cookies and aggregate interaction data to measure content engagement.</li>
                                    <li><strong>Contact Information:</strong> Names and email addresses provided voluntarily via contact forms.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-foreground mb-2">Admin Page</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li><strong>Authentication Data:</strong> Secure credential hashes and Multi-Factor Authentication (MFA) tokens.</li>
                                    <li><strong>Audit Logs:</strong> Detailed logs of actions taken, including IP address, timestamps, and data modifications, for strict access control and compliance.</li>
                                    <li><strong>Administrative Details:</strong> Role assignments and internal contact information.</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
