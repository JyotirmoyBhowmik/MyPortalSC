export const chartData = `
graph TD
    %% Core Nodes
    subgraph UILib["UI Component Library"]
        Layout[App Layouts and Navigation]
        Anim[Animations and Effects]
        Visuals[Charts and Data Visualizations]
        CoreUI[Core UI Components]
    end

    subgraph BizLogic["Business Logic and Pages"]
        Home[Home Page Routing]
        AdminCMS[Admin CMS Dashboard]
        Finance[Enterprise Financial Ledger]
        Portfolio[Portfolio and Projects View]
        Knowledge[Knowledge Base and Blog]
    end

    subgraph DataLayer["Data and Auth Layer"]
        SupabaseClient[Supabase Auth and Client]
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

    %% Implicit Connections
    DB[(PostgreSQL Database)]
    SupabaseClient -.->|Reads and Writes| DB
    Actions -.->|Mutations| DB

    %% Hotspots Styling
    classDef hotspot fill:#7c3aed,stroke:#a78bfa,stroke-width:4px,color:#fff;
    class SupabaseClient hotspot;
    class DatabaseTypes hotspot;
    class CoreUI hotspot;
`;
