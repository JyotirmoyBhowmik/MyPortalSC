import Link from "next/link";



export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#050505] text-[#00ff41] font-mono flex items-center justify-center p-6 sm:p-10 relative overflow-hidden selection:bg-[#00ff41] selection:text-black">
            {/* Scanline CRT overlay effect */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.15] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
            <div className="absolute inset-0 pointer-events-none z-10 opacity-40 shadow-[inset_0_0_100px_rgba(0,0,0,1)]" />

            <div className="w-full max-w-2xl relative z-20">
                <div className="mb-8">
                    <pre className="text-xs sm:text-sm font-bold opacity-80 animate-pulse tracking-widest hidden sm:block">
{`  ___  ___  _  _ 
 /   |/ _ \\| || |
/ /| / /_\\ \\ || |
\\/_| |  _  |__  |
   | | | | |  | |
   \\_\\_| |_/  |_/`}
                    </pre>
                    <div className="text-4xl font-black sm:hidden tracking-widest animate-pulse">404</div>
                </div>

                <div className="space-y-4 text-sm sm:text-base leading-relaxed">
                    <div className="flex gap-2">
                        <span className="opacity-50">root@gateway:~#</span>
                        <span className="animate-[typing_1s_steps(20,end)]">ping -c 4 resource.internal</span>
                    </div>

                    <div className="animate-[fade-in_0.5s_ease-out_1s_both] space-y-1 opacity-80">
                        <p>PING resource.internal (192.168.1.404): 56 data bytes</p>
                        <p>Request timeout for icmp_seq 0</p>
                        <p>Request timeout for icmp_seq 1</p>
                        <p>Request timeout for icmp_seq 2</p>
                        <p>Request timeout for icmp_seq 3</p>
                    </div>

                    <div className="animate-[fade-in_0.5s_ease-out_3s_both] space-y-2 mt-6 border-t border-[#00ff41]/30 pt-4">
                        <p className="font-bold text-red-500 uppercase tracking-wide">Error 404: Destination Host Unreachable</p>
                        <p className="opacity-80">
                            The requested resource was not found on this server. It may have been relocated, deleted, or you might lack the necessary clearance permissions spanning the VPC.
                        </p>
                        <p className="opacity-80 mt-4">Running diagnostic resolution protocol...</p>
                    </div>

                    <div className="animate-[fade-in_0.5s_ease-out_4.5s_both] mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <Link 
                            href="/" 
                            className="bg-[#00ff41]/10 hover:bg-[#00ff41] text-[#00ff41] hover:text-black border border-[#00ff41] px-6 py-2 rounded transition-colors font-bold tracking-wide"
                        >
                            [ Return to Gateway ]
                        </Link>
                        <Link 
                            href="/projects" 
                            className="text-[#00ff41]/60 hover:text-[#00ff41] hover:underline underline-offset-4 transition-colors"
                        >
                            Or query active projects →
                        </Link>
                    </div>
                    
                    <div className="flex gap-2 mt-8 animate-[fade-in_0.5s_ease-out_5s_both]">
                        <span className="opacity-50">root@gateway:~#</span>
                        <span className="w-2.5 h-5 bg-[#00ff41] animate-pulse rounded-sm" />
                    </div>
                </div>
            </div>
        </div>
    );
}
