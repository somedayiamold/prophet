from django.forms import ModelForm
from .models import Case

class CaseForm(ModelForm):
    class Meta:
        model = Case
        fields = '__all__'
        labels = {
            'title': '标题',
            'description': '故障描述',
            'projects': '影响项目'
        }

