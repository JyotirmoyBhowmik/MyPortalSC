export default function InitiativesLoading() {
    return (
        <>
            {/* Hero skeleton */}
            <section className="py-24 px-4 relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="skeleton skeleton-title mx-auto mb-6" style={{ height: "3rem", width: "60%" }} />
                    <div className="skeleton skeleton-text w-96 mx-auto mb-12" />
                    <div className="flex flex-wrap items-center justify-center gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <div className="skeleton" style={{ height: "2rem", width: "3rem" }} />
                                <div className="skeleton skeleton-text w-16" style={{ height: "0.625rem" }} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Grid skeleton */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-3 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="skeleton" style={{ height: "2rem", width: "5rem", borderRadius: "999px" }} />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="skeleton skeleton-card" />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
