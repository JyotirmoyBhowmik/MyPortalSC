const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://cqtluudfmigefqphmfbb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxdGx1dWRmbWlnZWZxcGhtZmJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NDUyOTcsImV4cCI6MjA4NjMyMTI5N30.e2AgRwOI1rugtWIpm0uwTlbV2E7FCcLBeRyva8X3zJY';
const BUCKET = 'project-assets';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function uploadImages() {
    const dir = path.join(process.cwd(), 'public', 'images', 'projects');
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
    console.log(`Found ${files.length} images to upload...`);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const fileData = fs.readFileSync(filePath);
        const storagePath = `projects/images/${file}`;

        console.log(`Uploading ${file} to ${storagePath}...`);
        const { data, error } = await supabase.storage
            .from(BUCKET)
            .upload(storagePath, fileData, {
                contentType: file.endsWith('.png') ? 'image/png' : 'image/jpeg',
                upsert: true
            });

        if (error) {
            console.error(`Error uploading ${file}:`, error);
        } else {
            console.log(`Successfully uploaded ${file} -> ${data.path}`);
        }
    }
    console.log('All image uploads completed!');
}

uploadImages().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
