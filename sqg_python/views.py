from django.shortcuts import render

def index(request):
    return render(request, 'index.html')

def contact(request):
    return render(request, 'contact.html')

def index2(request):
    return render(request, 'index2.html')

def checklist(request):
    return render(request, 'checklist.html')

def guidelines(request):
    return render(request, 'guidelines.html')

def webinars(request):
    return render(request, 'webinar_presentation.html')

def workshops(request):
    return render(request, 'workshop_presentation.html')