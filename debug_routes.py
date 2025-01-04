from backend.app import create_app
import os

app = create_app()

print("=== Application Configuration ===")
print(f"Template Folder: {app.template_folder}")
print(f"Static Folder: {app.static_folder}")
print(f"Root Path: {app.root_path}")
print("\n=== Registered Routes ===")
for rule in app.url_map.iter_rules():
    print(f"{rule.endpoint}: {rule.rule}")

print("\n=== File Existence Check ===")
print(f"index.html exists: {os.path.exists(os.path.join(app.template_folder, 'index.html'))}")
print(f"index.html full path: {os.path.join(app.template_folder, 'index.html')}")
print(f"index.html contents: {open(os.path.join(app.template_folder, 'index.html'), 'r').read()[:100] + '...' if os.path.exists(os.path.join(app.template_folder, 'index.html')) else 'File not found'}")
