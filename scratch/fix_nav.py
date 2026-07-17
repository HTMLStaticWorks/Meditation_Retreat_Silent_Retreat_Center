import os
import glob
import re

html_files = glob.glob("*.html")

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Let's do string replacement for the Dashboard nav link
    # Find the closing </ul> of the navbar-nav
    # We will search for '<li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>' or similar (might have ' active')
    
    # 1. First add Dashboard to ul
    if 'href="dashboard.html">Dashboard</a></li>' not in content:
        # Need to insert it before </ul>
        # The </ul> is right after the contact li usually.
        # Let's replace:
        content = re.sub(
            r'(<li class="nav-item"><a class="nav-link(?: active)?" href="contact.html">Contact</a></li>\s*)(</ul>)',
            r'\1<li class="nav-item"><a class="nav-link" href="dashboard.html">Dashboard</a></li>\n                \2',
            content
        )
        # Also handle case where dashboard might be active (wait, it's not active in current structure, but let's just make it standard for now)
        # wait, if the file is dashboard.html, it might need 'nav-link active'. But the user only said "move Dashboard to the navigation after Contact". I will just make it nav-link. If it needs active, I can do it later.

    # 2. Re-write the right-side div.
    # We want to replace the whole <div class="d-flex align-items-center gap-3"> ... </div> that is inside <div class="collapse navbar-collapse" id="navbarNav">
    # Let's use a regex to capture it.
    
    pattern = r'(<div class="d-flex align-items-center gap-3">)[\s\S]*?(</div>\s*</div>\s*</div>\s*</nav>)'
    
    replacement = r'''\1
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-custom btn-sm d-flex align-items-center justify-content-center nav-toggle-btn" id="theme-toggle" title="Toggle Theme">
                            <i class="bi bi-brightness-high"></i>
                        </button>
                        <button class="btn btn-outline-custom btn-sm d-flex align-items-center justify-content-center nav-toggle-btn" id="rtl-toggle" title="RTL">
                            RTL
                        </button>
                    </div>
                    <div class="d-flex gap-2">
                        <a href="login.html" class="btn btn-outline-custom btn-sm d-flex align-items-center" title="Login">
                            Login
                        </a>
                        <a href="register.html" class="btn btn-primary-custom btn-sm d-flex align-items-center" title="Sign Up">
                            Sign Up
                        </a>
                    </div>
                \2'''
    
    content = re.sub(pattern, replacement, content)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {file}")
