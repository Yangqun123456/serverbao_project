import json
from django.http import JsonResponse
from django.shortcuts import render, HttpResponse
from app.models import *
import bcrypt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from app.lib.codeAnalyze import *
from app.lib.documentAnalyze import *
from django.core import serializers


def index(request):
    if request.method == 'GET':
        return render(request, 'index.html')


def mainpage(request):
    if request.method == 'GET':
        return render(request, 'mainpage.html')


'''
    注册用户
    @param username String 用户名
    @param password String 密码
    @param email String 邮箱
'''


def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        email = request.POST.get('email')
        if User.objects.filter(email=email).first() is not None:
            return JsonResponse({'status': 1, 'message': '邮箱已被注册'}, json_dumps_params={'ensure_ascii': False})
        else:
            password = bcrypt.hashpw(password.encode(
                'utf-8'), bcrypt.gensalt(prefix=b'2a')).decode('utf-8')
            User.objects.create(username=username,
                                password=password, email=email)
            return JsonResponse({'status': 0, 'message': '注册成功'}, json_dumps_params={'ensure_ascii': False})


'''
    登陆
    @param username String 用户名
    @param password String 密码
'''


def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        if User.objects.filter(username=username).first() is None:
            return JsonResponse({'status': 1, 'message': '用户名不存在'}, json_dumps_params={'ensure_ascii': False})
        elif bcrypt.checkpw(password.encode('utf-8'), User.objects.filter(username=username).first().password.encode('utf-8')):
            return JsonResponse({'status': 0, 'message': '登陆成功'}, json_dumps_params={'ensure_ascii': False})
        else:
            return JsonResponse({'status': 1, 'message': '输入密码错误'}, json_dumps_params={'ensure_ascii': False})


'''
    新增项目
'''


def addProject(request):
    if request.method == 'POST':
        if Project.objects.filter(project_id=request.POST.get('project_id')).first() is not None:
            return JsonResponse({'status': 1, 'message': '项目编号已存在'}, json_dumps_params={'ensure_ascii': False})
        else:
            Project.objects.create(project_id=request.POST.get('project_id'), name=request.POST.get('name'), commissioning_unit=request.POST.get(
                'commissioning_unit'), submit_unit=request.POST.get('submit_unit'), estimatedAmount=request.POST.get('estimatedAmount'),
                submitAmount=request.POST.get('submitAmount'), contractAmount=request.POST.get('contractAmount'), type=request.POST.get('type'),
                periodic=request.POST.get('periodic'), location=request.POST.get('location'), personNumber=request.POST.get('personNumber'),
                review_time=request.POST.get('review_time'), industry=request.POST.get('industry'), remark=request.POST.get('remark'))
            return JsonResponse({'status': 0, 'message': '新建项目成功'}, json_dumps_params={'ensure_ascii': False})


'''
    查询所有项目
'''


def selectALLProjects(request):
    if request.method == 'GET':
        allProjects = Project.objects.all()
        return JsonResponse({'status': 0, 'message': '查询项目成功', 'data': json.loads(serializers.serialize('json', allProjects))}, json_dumps_params={'ensure_ascii': False})


'''
    查询项目
    @param project_id String 项目编号
'''


def selectProject(request):
    if request.method == 'GET':
        project = Project.objects.filter(
            project_id=request.GET.get('project_id'))
        return JsonResponse({'status': 0, 'message': '查询项目成功', 'data': json.loads(serializers.serialize('json', project))}, json_dumps_params={'ensure_ascii': False})


'''
    新增子系统
'''


def addSubsystem(request):
    if request.method == 'POST':
        if Subsystem.objects.filter(name=request.POST.get('name'), project_id=request.POST.get('project_id')).first() is not None:
            return JsonResponse({'status': 1, 'message': '项目中已存在该子系统'}, json_dumps_params={'ensure_ascii': False})
        else:
            Subsystem.objects.create(name=request.POST.get('name'), effort_noadjusted=request.POST.get(
                'effort_noadjusted'), state=request.POST.get('state'), document=request.POST.get('document'), project_id=request.POST.get('project_id'))
            return JsonResponse({'status': 0, 'message': '新建子系统成功'}, json_dumps_params={'ensure_ascii': False})


'''
    查询项目所有子系统
    @param project_id String 项目编号
'''


def selectALLSubsystems(request):
    if request.method == 'GET':
        subsystems = Subsystem.objects.filter(
            project_id=request.GET.get('project_id'))
        if subsystems is not None:
            return JsonResponse({'status': 0, 'message': '查询项目所有子系统成功', 'data': json.loads(serializers.serialize('json', subsystems))}, json_dumps_params={'ensure_ascii': False})


'''
    需求文档分析
    @param name String 子系统名
    @param project_id String 隶属项目编号
'''


def documentAnalyze(request):
    if request.method == 'GET':
        subsystem = Subsystem.objects.filter(name=request.GET.get(
            'name'), project_id=request.GET.get('project_id')).first()
        if subsystem is not None:
            # 写入doc文档
            updateDocument(subsystem.document, './app/resource/需求文档.docx')
            # 计算功能点
            funPoints = classify_function_points('./app/resource/需求文档.docx')
            # 计算工作量
            effort = effortEstimates(funPoints.funNumber)
            subsystem.developmentEffort_noadjusted = effort.development
            subsystem.operationsEffort_noadjusted = effort.operations
            subsystem.state = '分析成功'
            subsystem.save()
            return JsonResponse({'status': 0, 'message': '文档分析成功', 'funNumber': funPoints.funNumber, 'effort': effort.__dict__, 'size': {
                'ilfs': len(funPoints.ilfs), 'eifs': len(funPoints.eifs), 'eis': len(funPoints.eis), 'eos': len(funPoints.eos), 'eqs': len(funPoints.eqs)}, 'data': {
                'ilfs': [s.__dict__ for s in funPoints.ilfs], 'eifs': [s.__dict__ for s in funPoints.eifs], 'eis': [s.__dict__ for s in funPoints.eis], 'eos': [s.__dict__ for s in funPoints.eos], 'eqs': [s.__dict__ for s in funPoints.eqs]}}, json_dumps_params={'ensure_ascii': False})
        else:
            return JsonResponse({'status': 1, 'message': '子系统不存在'}, json_dumps_params={'ensure_ascii': False})


'''
    查询子系统的未调整工作量
    @param name String 子系统名
    @param project_id String 隶属项目编号
'''


def selectEffort_noadjusted(request):
    if request.method == 'GET':
        subsystem = Subsystem.objects.filter(name=request.GET.get(
            'name'), project_id=request.GET.get('project_id')).first()
        if subsystem is not None:
            return JsonResponse({'status': 0, 'message': '查询未调整工作量成功', 'developmentEffort': subsystem.developmentEffort_noadjusted, 'operationsEffort': subsystem.operationsEffort_noadjusted}, json_dumps_params={'ensure_ascii': False})
        else:
            return JsonResponse({'status': 1, 'message': '子系统不存在'}, json_dumps_params={'ensure_ascii': False})


'''
    更新子系统调整后工作量
    @param name String 子系统名
    @param project_id String 隶属项目编号
    @param A float
    @param IL float
    @param L float
    @param T float
'''


def adjustEffort(request):
    if request.method == 'POST':
        subsystem = Subsystem.objects.filter(name=request.POST.get(
            'name'), project_id=request.POST.get('project_id')).first()
        if subsystem is not None:
            effortFactor = workEffortFactor(float(request.POST.get('A')), float(request.POST.get(
                'IL')), float(request.POST.get('L')), float(request.POST.get('T')))
            effort = effortFactor.adjustEffort(
                subsystem.developmentEffort_noadjusted, subsystem.operationsEffort_noadjusted)
            subsystem.developmentEffort_adjusted = effort.development
            subsystem.operationsEffort_adjusted = effort.operations
            subsystem.save()
            return JsonResponse({'status': 0, 'message': '计算调整后工作量成功', 'effort': effort.__dict__}, json_dumps_params={'ensure_ascii': False})
        else:
            return JsonResponse({'status': 1, 'message': '子系统不存在'}, json_dumps_params={'ensure_ascii': False})


'''
    计算开发成本
    @param name String 子系统名
    @param project_id String 隶属项目编号
'''


def costAnalyze(request):
    if request.method == 'GET':
        subsystem = Subsystem.objects.filter(
            name=request.GET.get('name'), project_id=request.GET.get('project_id')).first()
        if subsystem is not None:
            if subsystem.developmentEffort_adjusted is not None and subsystem.developmentEffort_adjusted is not None:
                project = Project.objects.filter(
                    project_id=request.GET.get('project_id')).first()
                # 计算成本
                cost = costEstimates(effortElement(subsystem.developmentEffort_adjusted,
                                                   subsystem.operationsEffort_adjusted), project.location)
                return JsonResponse({'status': 0, 'message': '成本计算成功', 'cost': cost.__dict__}, json_dumps_params={'ensure_ascii': False})
            else:
                return JsonResponse({'status': 1, 'message': '未执行工作量调整函数'}, json_dumps_params={'ensure_ascii': False})
        else:
            return JsonResponse({'status': 1, 'message': '子系统不存在'}, json_dumps_params={'ensure_ascii': False})


'''
    ================================================================
    PART 2
    代码分析
    ！！！未完成
    ================================================================
'''


def codeAnalyze(request):
    if request.method == 'POST':
        zipfile = request.POST.get('zipfile')
        zipDownLoad(zipfile)  # 解压zip文件
        codeList = read_files("./app/zip")  # 读取文件夹下所有的文件
        codeResourceList = read_corpus(
            './app/resource/codeResource.java')  # 读取指定的文件

        allCode = []
        allCode.extend([code.content for code in codeList])
        allCode.extend([code.content for code in codeResourceList])
        print(len(allCode))

        # TF - IDF 算法
        vectorizer = TfidfVectorizer()
        # Generate matrix of word vectors
        tfidf_matrix_codeStructList = vectorizer.fit_transform(allCode)

        # compute and print the cosine similarity matrix
        cosine_sim = cosine_similarity(
            tfidf_matrix_codeStructList[:len(codeList)], tfidf_matrix_codeStructList[len(codeList):])
        codeSimList = codeSimAnalyze(cosine_sim, codeList, codeResourceList)
        return JsonResponse({'status': 0, 'message': '相似度分析成功', 'data': [code.__dict__ for code in codeSimList], 'length': len(codeSimList)}, json_dumps_params={'ensure_ascii': False})