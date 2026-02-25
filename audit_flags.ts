import * as fs from 'fs';
import * as path from 'path';

const settingKeys = [
    "feature_executive_summary", "feature_timeline", "feature_video_intro", "feature_rich_editor", "feature_drag_drop", "feature_content_versioning", "feature_scheduled_publish",
    "feature_contact_crm", "feature_downloads", "feature_newsletter",
    "navbar_style", "site_template", "feature_i18n", "feature_pdf_export", "feature_2fa", "feature_captcha", "feature_csp_headers", "feature_enhanced_audit", "feature_rbac", "feature_session_management", "feature_3d_globe", "feature_light_theme", "feature_magnetic_buttons", "feature_page_transitions", "feature_particle_bg", "feature_scroll_animations", "feature_analytics_dashboard", "feature_contact_analytics", "feature_initiative_heatmap", "feature_activity_feed", "feature_admin_search", "feature_bulk_actions", "feature_media_library", "feature_jsonld", "feature_og_images", "feature_pwa",
    "feature_blog", "feature_case_studies", "feature_testimonials", "feature_speaking", "feature_publications"
];

function getAllFiles(dirPath: string, arrayOfFiles: string[]) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });
    return arrayOfFiles;
}

const files = getAllFiles('./src', []);
const keyMapping: Record<string, string[]> = {};

settingKeys.forEach(k => keyMapping[k] = []);

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    settingKeys.forEach(key => {
        // Only count if it's NOT just in SettingsManager/data files
        if (!file.includes('SettingsManager.tsx') && !file.includes('settings.ts') && !file.includes('FeatureGate.tsx') && !file.includes('proxy.ts')) {
            if (content.includes(key)) {
                keyMapping[key].push(file.replace(/\\/g, '/'));
            }
        }
    });
});

fs.writeFileSync('flag_map_utf8.json', JSON.stringify(keyMapping, null, 2), 'utf8');
