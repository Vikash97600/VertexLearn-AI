import uuid
from django.db import models
from django.conf import settings
from apps.courses.models import Module, Lecture


class Quiz(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='quizzes')
    title = models.CharField(max_length=200)
    is_ai_generated = models.BooleanField(default=False)
    generated_from_lecture = models.ForeignKey(Lecture, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.title


class QuizQuestion(models.Model):
    TYPE_CHOICES = (
        ('mcq', 'Multiple Choice Single Answer'),
        ('multi_select', 'Multiple Select Multiple Answers'),
        ('short_answer', 'Short Text Answer'),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='mcq')
    order_index = models.IntegerField()

    class Meta:
        ordering = ['order_index']

    def __str__(self):
        return f"{self.quiz.title} - Q{self.order_index}"


class QuizOption(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE, related_name='options')
    option_text = models.TextField()
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.option_text


class QuizAttempt(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Attempt by {self.user.email} for {self.quiz.title}"


class QuizAnswer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    attempt = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE)
    
    # Store list of selected option UUIDs as JSON array
    selected_option_ids = models.JSONField(default=list, blank=True)
    text_answer = models.TextField(null=True, blank=True)
    is_correct = models.BooleanField(null=True, blank=True)

    def __str__(self):
        return f"Answer for Q{self.question.order_index} in attempt {self.attempt.id}"
