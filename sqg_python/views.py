from django.shortcuts import render
from django.core.mail import send_mail
from quality_leads.models import *
from django.core import serializers

def index(request):
    return render(request, 'index.html')

def index2(request):
    return render(request, 'index2.html')

def contact(request):
    return render(request, 'contact.html')

def contactForm(request):
    fullName = request.POST['name']
    email = request.POST['email']
    phone = int(request.POST['phone'])
    subject = request.POST['subject']
    message = request.POST['message']

    send_mail(
        subject,
        message,
        email,
        ['support-sqg@nic.in'],
        fail_silently=False,
    )
    return render(request, 'contact.html')

#def index2(request):
#    return render(request, 'index2.html')
#
def checklist(request):
   return render(request, 'checklist.html')

def guidelines(request):
   return render(request, 'guidelines.html')

def webinars(request):
   return render(request, 'webinar_presentation.html')
#
def workshops(request):
   return render(request, 'workshop_presentation.html')

def quality_leads_states(request):
    data = serializers.serialize( "python", Officer.objects.all() )
    final_data=[]
    # Preparing list of dictionaries with all data
    for instance in data:
        temp=serializers.serialize( "python", State.objects.filter(pk=instance['fields']['state']))
        temp=temp[0]['fields']
        instance=instance['fields']
        temp.update(instance)
        final_data.append(temp)
    return render(request,'quality-leads-states.html',{'final_data':final_data})