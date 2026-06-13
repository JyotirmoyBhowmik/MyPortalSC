import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Deception & Device Abuse | Jyotirmoy Bhowmik",
    description: "Policies regarding deception and device abuse across global and India standards.",
};

export default function DeceptionAndDeviceAbusePage() {
    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                        Deception & <span className="gradient-text">Device Abuse</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Our policies to prevent deceptive practices and protect against device abuse.
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
                                We maintain a strict zero-tolerance policy against deceptive behaviors, fraud, and
                                unauthorized use or abuse of devices, networks, and services globally.
                            </p>
                            <p>
                                <strong>Prohibited Activities:</strong>
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Deceptive Practices:</strong> Misrepresenting identity, phishing, spoofing, or employing social engineering tactics.</li>
                                <li><strong>Unauthorized Access:</strong> Attempting to bypass security controls, unauthorized scanning, or accessing restricted areas without permission.</li>
                                <li><strong>Resource Abuse:</strong> Using automated systems, botnets, or exploiting vulnerabilities to degrade service performance (e.g., DDoS attacks).</li>
                                <li><strong>Malware Distribution:</strong> Distributing viruses, worms, ransomware, or any other malicious code.</li>
                            </ul>
                            <p className="mt-4">
                                Violations of these standards may result in immediate suspension of access and potential legal action.
                            </p>
                        </div>
                    </section>

                    {/* India Standard Section */}
                    <section className="bg-surface border border-border rounded-xl p-6 md:p-8">
                        <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-border/50">
                            India Standard (CERT-In & IT Act)
                        </h2>
                        <div className="space-y-4 text-muted-foreground">
                            <p>
                                In compliance with the Information Technology Act, 2000 and directives from
                                the Indian Computer Emergency Response Team (CERT-In), we enforce specific protocols
                                to detect, report, and mitigate device abuse and deceptive practices.
                            </p>
                            <p>
                                <strong>Compliance Measures:</strong>
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Incident Reporting:</strong> Mandatory reporting of severe cyber incidents (e.g., data breaches, malicious attacks) to CERT-In within 6 hours of identification.</li>
                                <li><strong>Data Retention:</strong> Maintaining system logs securely for a rolling period of 180 days within Indian jurisdiction as required by CERT-In guidelines.</li>
                                <li><strong>Identity Verification:</strong> Implementing strict KYC (Know Your Customer) and identity verification measures to prevent impersonation and fraud.</li>
                                <li><strong>Cyber Crime Prevention:</strong> Cooperating with law enforcement agencies (LEA) to investigate and prosecute deceptive cyber activities as defined under Section 66D and other relevant sections of the IT Act.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Platform Specifics */}
                    <section className="bg-surface border border-border rounded-xl p-6 md:p-8">
                        <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-border/50">
                            Platform Specific Guidelines
                        </h2>
                        <div className="space-y-6 text-muted-foreground">
                            <div>
                                <h3 className="text-lg font-medium text-foreground mb-2">For Our Apps</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li><strong>Integrity:</strong> Apps must not be reverse-engineered, decompiled, or modified to bypass intended functionality or licensing.</li>
                                    <li><strong>Automation:</strong> Use of emulators, automation scripts, or third-party clients to interact with app APIs maliciously is strictly forbidden.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-foreground mb-2">For Our Sites</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li><strong>Scraping & Crawling:</strong> Automated data extraction must respect `robots.txt` and rate limits to prevent denial of service.</li>
                                    <li><strong>Injection:</strong> Attempting SQL injection, Cross-Site Scripting (XSS), or exploiting input fields will lead to immediate IP blocking and reporting.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-foreground mb-2">For Admin Pages</h3>
                                <ul className="list-disc pl-6 space-y-1">
                                    <li><strong>Access Control:</strong> Sharing administrative credentials or attempting privilege escalation is a severe security violation.</li>
                                    <li><strong>Audit Avoidance:</strong> Attempting to tamper with, bypass, or delete administrative audit logs will result in immediate termination of access and legal review.</li>
                                    <li><strong>Session Management:</strong> Administrators must ensure sessions are terminated appropriately on shared or public devices.</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
