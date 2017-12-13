from django.db import models

# Create your models here.
class Project(models.Model):
    name = models.CharField(max_length=50)
    def __str__(self):
        return self.name
        
class Case(models.Model):
    title = models.CharField(max_length=100)
    description  = models.CharField(max_length=200)
    projects = models.ManyToManyField(Project)
