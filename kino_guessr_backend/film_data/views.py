from django.shortcuts import render
from django.http import JsonResponse
from .models import Film, Actor, Poster
import random

def get_random_film(request):
    film = random.choice(Film.objects.all())
    actors = Actor.objects.filter(films=film)
    poster = Poster.objects.get(film=film)

    film_data = {
        "title": film.title,
        'actors': [actor.image_file.url for actor in actors],
        'poster': poster.image_file.url
    }
    return JsonResponse(film_data)

def get_film_names(request):
    film_names = [film.title for film in Film.objects.all().order_by('title')]
    return JsonResponse(film_names, safe=False)