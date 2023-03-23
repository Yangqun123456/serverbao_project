"""serverbao_web URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from app import views

urlpatterns = [
    path('', views.index),
    path('index/', views.index),
    path('mainpage/', views.mainpage),
    path('api/login/', views.login),
    path('api/register/', views.register),
    path('api/addProject/', views.addProject),
    path('api/selectALLProjects/', views.selectALLProjects),
    path('api/selectProject/', views.selectProject),
    path('api/addSubsystem/', views.addSubsystem),
    path('api/selectALLSubsystems/', views.selectALLSubsystems),
    path('api/codeAnalyze/', views.codeAnalyze),
    path('api/documentAnalyze/', views.documentAnalyze),
    path('api/selectEffort_noadjusted/', views.selectEffort_noadjusted),
    path('api/adjustEffort/', views.adjustEffort),
    path('api/addCodeOrganization/', views.addCodeOrganization),
    path('api/updateCodeOrganization/', views.updateCodeOrganization),
    path('api/codeAnalyzer/', views.codeAnalyzer),
    path('api/selectCodeOrganization/', views.selectCodeOrganization),
    path('api/selectALLCodeOrganization/', views.selectALLCodeOrganization)
]
