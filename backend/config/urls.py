"""
URL configuration for VertexLearn AI project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Auth APIs endpoints
    path('api/v1/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # App modules API namespace routing
    path('api/v1/users/', include('apps.users.urls')),
    path('api/v1/courses/', include('apps.courses.urls')),
    path('api/v1/enrollments/', include('apps.enrollments.urls')),
    path('api/v1/assignments/', include('apps.assignments.urls')),
    path('api/v1/quizzes/', include('apps.quizzes.urls')),
]
