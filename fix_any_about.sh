sed -i 's/(displayExperience as any\[\]).map((exp: any/(displayExperience as Record<string, unknown>\[\]).map((exp: Record<string, unknown>/g' src/app/about/page.tsx
sed -i 's/(displayEducation as any\[\]).map((edu: any/(displayEducation as Record<string, unknown>\[\]).map((edu: Record<string, unknown>/g' src/app/about/page.tsx
