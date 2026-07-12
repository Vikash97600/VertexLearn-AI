import uuid
from django.db import models
from django.conf import settings


class Course(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('archived', 'Archived'),
    )

    DIFFICULTY_CHOICES = (
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    instructor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='authored_courses')
    title = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    category = models.CharField(max_length=80, null=True, blank=True)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='intermediate')
    thumbnail_url = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_length=10, decimal_places=2, max_digits=10, default=0.0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Module(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title = models.CharField(max_length=200)
    order_index = models.IntegerField()

    class Meta:
        ordering = ['order_index']

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class Lecture(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='lectures')
    title = models.CharField(max_length=200)
    video_url = models.TextField(null=True, blank=True)
    transcript = models.TextField(null=True, blank=True)
    duration_seconds = models.IntegerField(null=True, blank=True)
    order_index = models.IntegerField()
    
    # Store lists of attachment URLs
    resource_urls = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ['order_index']

    def __str__(self):
        return f"{self.module.title} - {self.title}"
