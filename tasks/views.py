from datetime import date
from django.shortcuts import render
def home(request):
    context = {
        'app_name': 'My To-Do List',
        'today': date.today(),
    }
    return render(request, 'tasks/index.html', context)