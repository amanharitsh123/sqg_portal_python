from django.db import models
from phonenumber_field.formfields import PhoneNumberField

class State(models.Model):
    state_name=models.CharField(max_length=40)
    sio_name=models.CharField(max_length=55)
    sio_email=models.CharField(max_length=70)

class Officer(models.Model):
    name=models.CharField(max_length=100)
    position=models.CharField(
        choices=(
            ("Scientist-A","Scientist-A"),
            ("Scientist-B","Scientist-B"),
            ("Scientist-C","Scientist-C"),
            ("Scientist-D","Scientist-D"),
            ("Scientist-E","Scientist-E"),
            ("Scientist-F","Scientist-F"),
        ),max_length=100
    )
    email=models.CharField(max_length=100)
    phone=PhoneNumberField()
    state=models.ForeignKey(State,on_delete=models.CASCADE)
# Create your models here.
