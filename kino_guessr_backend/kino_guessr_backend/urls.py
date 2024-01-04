from django.contrib import admin
from django.urls import path
from film_data import views
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/get_film_names/', views.get_film_names, name='get_film_names'),
    path('api/get_film_indexes/', views.get_film_indexes, name='get_film_indexes'),
    path('api/get_film_details/<int:film_id>/', views.get_film_details, name='get_film_details'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
