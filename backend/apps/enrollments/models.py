import uuid
from django.db import models
from django.conf import settings
from apps.courses.models import Course, Lecture


class Enrollment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='enrollments')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    progress_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)

    class Meta:
        unique_together = ('user', 'course')

    def __str__(self):
        return f"{self.user.email} -> {self.course.title}"


class LectureProgress(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name='lecture_progresses')
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE)
    watched_seconds = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
    last_watched_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.enrollment.user.email} -> {self.lecture.title} ({self.watched_seconds}s)"


class Note(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='student_notes')
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE)
    timestamp_seconds = models.IntegerField()
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Note by {self.user.email} at {self.timestamp_seconds}s"


class Bookmark(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='student_bookmarks')
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE)
    timestamp_seconds = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Bookmark by {self.user.email} at {self.timestamp_seconds}s"
