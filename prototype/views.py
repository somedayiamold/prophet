from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect

from .form import CaseForm

# Create your views here.
def index(request):
	
    return render(request, 'index.html', {'system': '测试系统', 'corporation': 'XXXX', 'wiki': 'Wiki'})

def test(request):
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = CaseForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            # process the data in form.cleaned_data as required
            # ...
            # redirect to a new URL:
            print(form.cleaned_data)
            form.save()
            return HttpResponseRedirect('/prototype/test')

    # if a GET (or any other method) we'll create a blank form
    else:
        form = CaseForm()
        print(form)
        #return render(request, 'show.html', {'form': form})

    return render(request, 'test.html', {'form': form})
