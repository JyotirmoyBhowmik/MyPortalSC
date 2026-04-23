export const chartData = `
graph TD
    %% Core Nodes
    subgraph "UI Component Library"
        Layout[App Layouts & Navigation]
        Anim[Animations & Effects]
        Visuals[Charts & Data Visualizations]
        CoreUI[Core UI Components]
    end

    subgraph "Business Logic & Pages"
        Home[Home Page Routing]
        AdminCMS[Admin CMS Dashboard]
        Finance[Enterprise Financial Ledger]
        Portfolio[Portfolio & Projects View]
        Knowledge[Knowledge Base & Blog]
    end

    subgraph "Data & Auth Layer"
        SupabaseClient[Supabase Auth & Client]
        DatabaseTypes[DB TypeScript Schema]
        Actions[Server Actions CRUD]
        FinData[Finance Data Fetchers]
        ProjData[Projects Data Fetchers]
    end

    %% Connections
    Layout --> AdminCMS
    Layout --> Home
    Layout --> Finance
    Layout --> Portfolio
    Layout --> Knowledge

    AdminCMS --> CoreUI
    Finance --> CoreUI
    Portfolio --> CoreUI
    Knowledge --> CoreUI
    
    Finance --> Anim
    Finance --> Visuals
    Portfolio --> Visuals
    Knowledge --> Anim

    AdminCMS --> Actions
    Finance --> FinData
    Portfolio --> ProjData
    Knowledge --> SupabaseClient

    Actions --> SupabaseClient
    FinData --> SupabaseClient
    ProjData --> SupabaseClient

    SupabaseClient --> DatabaseTypes

    %% Implicit/Invisible Connections (Dashed)
    DB[(PostgreSQL Database)]
    SupabaseClient -.->|Reads/Writes| DB
    Actions -.->|Mutations| DB

    %% Hotspots Styling
    classDef hotspot fill:#7c3aed,stroke:#a78bfa,stroke-width:4px,color:#fff;
    class SupabaseClient hotspot;
    class DatabaseTypes hotspot;
    class CoreUI hotspot;
`;
