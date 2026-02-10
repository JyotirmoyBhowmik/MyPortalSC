
import zipfile
import xml.etree.ElementTree as ET
import os

def extract_text_from_docx(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as z:
            xml_content = z.read("word/document.xml")
            tree = ET.fromstring(xml_content)
            
            # Extract text from paragraphs and runs
            # Namespaces are tricky in ElementTree, usually rely on local name
            text_parts = []
            
            # The namespace for w:t is usually http://schemas.openxmlformats.org/wordprocessingml/2006/main
            # We can just iterate all elements and combine text nodes if they are inside a <w:t> tag
            
            namespaces = {
                'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
            }
            
            for paragraph in tree.findall('.//w:p', namespaces):
                para_text = []
                for node in paragraph.findall('.//w:t', namespaces):
                    if node.text:
                        para_text.append(node.text)
                if para_text:
                    text_parts.append(''.join(para_text))
            
            return '\n'.join(text_parts)
    except Exception as e:
        return f"Error reading {docx_path}: {str(e)}"

import sys
if sys.version_info >= (3, 7):
    sys.stdout.reconfigure(encoding='utf-8')

docx_files = [
    "Jyotirmoy_Bhowmik_Resume.docx",
    "Jyotirmoy_Bhowmik_Activity_Summary.docx",
    "Jyotirmoy_Bhowmik_Detailed Activities & Initiative.docx",
    "Jyotirmoy_Bhowmik_Detailed__YearWise_.docx"
]

base_dir = r"c:\Users\TEST\MyPortalSC\Doc"

with open("extracted_content.txt", "w", encoding="utf-8") as f:
    for filename in docx_files:
        path = os.path.join(base_dir, filename)
        f.write(f"--- File: {filename} ---\n")
        if os.path.exists(path):
            text = extract_text_from_docx(path)
            f.write(text + "\n")
        else:
            f.write(f"File not found: {path}\n")
        f.write("\n" + "="*50 + "\n\n")

print("Extraction complete. Check extracted_content.txt")
