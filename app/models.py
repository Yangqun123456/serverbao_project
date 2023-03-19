from django.db import models

# Create your models here.


class User(models.Model):
    username = models.CharField(max_length=20)
    password = models.CharField(max_length=80)
    email = models.CharField(max_length=45)

# Create your models here.


class Project(models.Model):
    project_id = models.CharField(max_length=10)
    name = models.CharField(max_length=20)
    commissioning_unit = models.CharField(max_length=20)
    submit_unit = models.CharField(max_length=20)
    estimatedAmount = models.FloatField()
    submitAmount = models.FloatField()
    contractAmount = models.FloatField()
    type = models.CharField(max_length=20)
    periodic = models.FloatField()
    location = models.CharField(max_length=15)
    personNumber = models.IntegerField()
    review_time = models.DateField()
    industry = models.CharField(max_length=20)
    remark = models.TextField(blank=True)
    state = models.CharField(max_length=20, blank=True)
    finalCost = models.FloatField(blank=True)


class Subsystem(models.Model):
    name = models.CharField(max_length=20)
    developmentEffort_noadjusted = models.FloatField(blank=True)
    operationsEffort_noadjusted = models.FloatField(blank=True)
    state = models.CharField(max_length=20, blank=True)
    document = models.TextField(blank=True)
    developmentEffort_adjusted = models.FloatField(blank=True)
    operationsEffort_adjusted = models.FloatField(blank=True)
    project_id = models.CharField(max_length=10)
