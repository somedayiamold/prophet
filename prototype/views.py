from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.
def index(request):
    return render(request, 'index.html', {'system': '测试系统', 'corporation': 'XXXX', 'wiki': 'Wiki'})
