import uuid
from django.db import models
from django.conf import settings
from apps.courses.models import Course


class Assignment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='assignments')
    title = models.CharField(max_length=200)
    instructions = models.TextField()
    
    # Store grading rubrics structured as JSON
    rubric = models.JSONField(default=dict, blank=True)
    due_date = models.DateTimeField()

    def __str__(self):
        return self.title


class AssignmentSubmission(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE, related_name='submissions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='submissions')
    file_url = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    grade = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    feedback = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Submission by {self.user.email} for {self.assignment.title}"
