from django.db import models
import os

class Film(models.Model):
    title = models.CharField(max_length=100)
    def __str__(self):
        return self.title

class Actor(models.Model):
    image_file = models.ImageField(upload_to='images/')
    films = models.ManyToManyField(Film, related_name='actors')
    def __str__(self):
        return os.path.basename(self.image_file.name)

class Poster(models.Model):
    image_file = models.ImageField(upload_to='images/')
    film = models.OneToOneField(Film, related_name='poster', on_delete=models.CASCADE)
    def __str__(self):
        return os.path.basename(self.image_file.name)