sed -i 's/(displayExperience as any\[\]).map((exp: any/(displayExperience as Record<string, string | string\[\]>\[\]).map((exp: Record<string, any>/g' src/app/about/page.tsx
sed -i 's/(displayEducation as any\[\]).map((edu: any/(displayEducation as Record<string, string | string\[\]>\[\]).map((edu: Record<string, any>/g' src/app/about/page.tsx
