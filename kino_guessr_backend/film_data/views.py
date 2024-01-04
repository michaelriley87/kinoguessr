from django.http import JsonResponse
from .models import Film, Actor, Poster

def get_film_names(request):
    film_names = [film.title for film in Film.objects.all().order_by('title')]
    return JsonResponse(film_names, safe=False)

def get_film_indexes(request):
    film_indexes = [film.id for film in Film.objects.all().order_by('id')]
    return JsonResponse(film_indexes, safe=False)

def get_film_details(request, film_id):
    film = Film.objects.get(id=film_id)
    actors = Actor.objects.filter(films=film)
    poster = Poster.objects.get(film=film)

    film_data = {
        "title": film.title,
        'actors': [actor.image_file.url for actor in actors],
        'poster': poster.image_file.url
    }
    return JsonResponse(film_data)