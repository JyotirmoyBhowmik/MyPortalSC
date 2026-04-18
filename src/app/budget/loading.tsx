export default function BudgetLoading() {
    return (
        <div className="py-20 px-4 min-h-screen">
            <div className="max-w-[1400px] mx-auto">
                {/* Header skeleton */}
                <div className="text-center mb-12">
                    <div className="skeleton skeleton-text w-40 mx-auto mb-4" style={{ height: "1.5rem" }} />
                    <div className="skeleton skeleton-title mx-auto mb-3" style={{ height: "3rem", width: "50%" }} />
                    <div className="skeleton skeleton-text w-72 mx-auto" />
                </div>

                {/* KPI bar skeleton */}
                <div className="glass rounded-2xl p-6 mb-10">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className="skeleton skeleton-text w-20" />
                                <div className="skeleton" style={{ height: "2rem", width: "6rem" }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Charts skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
                    <div className="skeleton skeleton-card" style={{ height: "22rem" }} />
                    <div className="skeleton skeleton-card" style={{ height: "22rem" }} />
                </div>

                {/* Table skeleton */}
                <div className="glass rounded-2xl overflow-hidden">
                    <div className="p-4 border-b border-border/30">
                        <div className="skeleton skeleton-text w-48" />
                    </div>
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 border-b border-border/20">
                            <div className="skeleton" style={{ height: "2.5rem", width: "5rem" }} />
                            <div className="flex-1 space-y-2">
                                <div className="skeleton skeleton-text w-3/4" />
                                <div className="skeleton skeleton-text w-1/2" style={{ height: "0.625rem" }} />
                            </div>
                            <div className="skeleton" style={{ height: "1.5rem", width: "5rem" }} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
