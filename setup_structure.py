import os

dirs = [
    # Frontend structure
    r"frontend",
    r"frontend/assets",
    r"frontend/assets/css",
    r"frontend/assets/css/base",
    r"frontend/assets/css/components",
    r"frontend/assets/css/layout",
    r"frontend/assets/css/pages",
    r"frontend/assets/css/themes",
    r"frontend/assets/css/utilities",
    r"frontend/assets/css/bootstrap",
    r"frontend/assets/js",
    r"frontend/assets/js/api",
    r"frontend/assets/js/auth",
    r"frontend/assets/js/components",
    r"frontend/assets/js/dashboard",
    r"frontend/assets/js/student",
    r"frontend/assets/js/instructor",
    r"frontend/assets/js/admin",
    r"frontend/assets/js/course",
    r"frontend/assets/js/player",
    r"frontend/assets/js/ai",
    r"frontend/assets/js/discussion",
    r"frontend/assets/js/notification",
    r"frontend/assets/js/assignment",
    r"frontend/assets/js/quiz",
    r"frontend/assets/js/utils",
    r"frontend/assets/js/config",
    r"frontend/assets/js/data",
    r"frontend/assets/js/pages",
    r"frontend/assets/images",
    r"frontend/assets/icons",
    r"frontend/assets/fonts",
    r"frontend/assets/videos",
    
    # Backend structure (Django structure)
    r"backend",
    r"backend/config",
    r"backend/apps",
    r"backend/apps/authentication",
    r"backend/apps/users",
    r"backend/apps/courses",
    r"backend/apps/enrollments",
    r"backend/apps/assignments",
    r"backend/apps/quizzes",
    r"backend/apps/gamification",
    r"backend/apps/discussions",
    r"backend/apps/notifications",
    r"backend/apps/administration",
    
    # AI service structure (FastAPI structure)
    r"ai-service",
    r"ai-service/app",
    r"ai-service/app/routers",
    r"ai-service/app/rag",
    r"ai-service/app/recommendation",
    r"ai-service/app/models",
    r"ai-service/app/core"
]

base_dir = r"d:\Projects\VertexLearn AI"

for d in dirs:
    path = os.path.join(base_dir, d)
    os.makedirs(path, exist_ok=True)
    print(f"Created directory: {path}")

print("Directory structure setup completed successfully.")
