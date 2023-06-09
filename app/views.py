import json
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from app.models import *
import bcrypt
from app.lib.codeAnalyze import zipDownLoad
from app.lib.documentAnalyze import *
from django.core import serializers
from app.lib.codeCounterAnalyzeClass import CodeCounterAnalyze


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
    ================================================================
    PART 1
    需求文档分析
    ================================================================
'''

'''
    新增项目
'''


def addProject(request):
    if request.method == 'POST':
        if Project.objects.filter(project_id=request.POST.get('project_id'), email=request.POST.get('email')).first() is not None:
            return JsonResponse({'status': 1, 'message': '项目编号已存在'}, json_dumps_params={'ensure_ascii': False})
        else:
            Project.objects.create(project_id=request.POST.get('project_id'), name=request.POST.get('name'), email=request.POST.get('email'), commissioning_unit=request.POST.get(
                'commissioning_unit'), submit_unit=request.POST.get('submit_unit'), estimatedAmount=request.POST.get('estimatedAmount'),
                submitAmount=request.POST.get('submitAmount'), contractAmount=request.POST.get('contractAmount'), type=request.POST.get('type'),
                periodic=request.POST.get('periodic'), location=request.POST.get('location'), personNumber=request.POST.get('personNumber'),
                review_time=request.POST.get('review_time'), industry=request.POST.get('industry'), remark=request.POST.get('remark'))
            return JsonResponse({'status': 0, 'message': '新建项目成功'}, json_dumps_params={'ensure_ascii': False})


'''
    查询所有项目
    @param email String 用户邮箱
'''


def selectALLProjects(request):
    if request.method == 'GET':
        allProjects = Project.objects.filter(
            email=request.GET.get('email')).all()
        return JsonResponse({'status': 0, 'message': '查询项目成功', 'data': json.loads(serializers.serialize('json', allProjects))}, json_dumps_params={'ensure_ascii': False})


'''
    查询项目
    @param project_id String 项目编号
    @param email String 用户邮箱
'''


def selectProject(request):
    if request.method == 'GET':
        project = Project.objects.filter(
            project_id=request.GET.get('project_id'), email=request.GET.get('email'))
        return JsonResponse({'status': 0, 'message': '查询项目成功', 'data': json.loads(serializers.serialize('json', project))}, json_dumps_params={'ensure_ascii': False})


'''
    新增子系统
'''


def addSubsystem(request):
    if request.method == 'POST':
        if Subsystem.objects.filter(name=request.POST.get('name'), project_id=request.POST.get('project_id'), email=request.POST.get('email')).first() is not None:
            return JsonResponse({'status': 1, 'message': '项目中已存在该子系统'}, json_dumps_params={'ensure_ascii': False})
        else:
            Subsystem.objects.create(name=request.POST.get('name'), state=request.POST.get(
                'state'), document=request.POST.get('document'), project_id=request.POST.get('project_id'), email=request.POST.get('email'))
            return JsonResponse({'status': 0, 'message': '新建子系统成功'}, json_dumps_params={'ensure_ascii': False})


'''
    查询项目所有子系统
    @param project_id String 项目编号
    @param email String 用户邮箱
'''


def selectALLSubsystems(request):
    if request.method == 'GET':
        subsystems = Subsystem.objects.filter(
            project_id=request.GET.get('project_id'), email=request.GET.get('email'))
        if subsystems is not None:
            return JsonResponse({'status': 0, 'message': '查询项目所有子系统成功', 'data': json.loads(serializers.serialize('json', subsystems))}, json_dumps_params={'ensure_ascii': False})


'''
    需求文档分析
    @param name String 子系统名
    @param project_id String 隶属项目编号
    @param email String 用户邮箱
'''


def documentAnalyze(request):
    if request.method == 'GET':
        subsystem = Subsystem.objects.filter(name=request.GET.get(
            'name'), project_id=request.GET.get('project_id'), email=request.GET.get('email')).first()
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
                'ilfs': funPoints.ilfsNumber, 'eifs': funPoints.eifsNumber, 'eis': funPoints.eisNumber, 'eos': funPoints.eosNumber, 'eqs': funPoints.eqsNumber}, 'data': [s.__dict__ for s in funPoints.elements]}, json_dumps_params={'ensure_ascii': False})
        else:
            return JsonResponse({'status': 1, 'message': '子系统不存在'}, json_dumps_params={'ensure_ascii': False})


'''
    查询子系统的未调整工作量
    @param name String 子系统名
    @param project_id String 隶属项目编号
    @param email String 用户邮箱
'''


def selectEffort_noadjusted(request):
    if request.method == 'GET':
        subsystem = Subsystem.objects.filter(name=request.GET.get(
            'name'), project_id=request.GET.get('project_id'), email=request.GET.get('email')).first()
        if subsystem is not None:
            return JsonResponse({'status': 0, 'message': '查询未调整工作量成功', 'developmentEffort': subsystem.developmentEffort_noadjusted, 'operationsEffort': subsystem.operationsEffort_noadjusted}, json_dumps_params={'ensure_ascii': False})
        else:
            return JsonResponse({'status': 1, 'message': '子系统不存在'}, json_dumps_params={'ensure_ascii': False})


'''
    更新子系统调整后工作量
    @param name String 子系统名
    @param project_id String 隶属项目编号
    @param email String 用户邮箱
    @param A float
    @param IL float
    @param L float
    @param T float
'''


def adjustEffort(request):
    if request.method == 'POST':
        subsystem = Subsystem.objects.filter(name=request.POST.get(
            'name'), project_id=request.POST.get('project_id'), email=request.POST.get('email')).first()
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
    @param email String 用户邮箱
'''


def costAnalyzer(request):
    if request.method == 'GET':
        subsystem = Subsystem.objects.filter(
            name=request.GET.get('name'), project_id=request.GET.get('project_id'), email=request.GET.get('email')).first()
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
    ================================================================
'''

'''
    新增项目代码
    @param name String 子系统名
    @param project_id String 隶属项目编号
    @param code_zip Binary zip文件
    @param email String 用户邮箱

'''


def addCodeOrganization(request):
    if request.method == 'POST':
        if Project.objects.filter(project_id=request.POST.get('project_id'), email=request.POST.get('email')).first() is None:
            return JsonResponse({'status': 1, 'message': '项目编号不存在'}, json_dumps_params={'ensure_ascii': False})
        elif codeAnalyze.objects.filter(project_id=request.POST.get('project_id')).first() is not None:
            return JsonResponse({'status': 1, 'message': '项目源码已存在'}, json_dumps_params={'ensure_ascii': False})
        else:
            compressed_file = request.FILES.get('code_zip')
            if compressed_file:
                zipDownLoad(compressed_file.read(), './app/zip/'+request.POST.get('project_id'))
                compressed_file_obj = codeAnalyze(project_id=request.POST.get(
                    'project_id'), name=request.POST.get('name'), email=request.POST.get('email'), code_zip='./app/zip/'+request.POST.get('project_id')+compressed_file.name)
                compressed_file_obj.save()
                return JsonResponse({'status': 0, 'message': '新建项目源码成功'}, json_dumps_params={'ensure_ascii': False})
            else:
                return JsonResponse({'status': 1, 'message': '项目源码为空'}, json_dumps_params={'ensure_ascii': False})


'''
    更新项目代码
    @param project_id String 隶属项目编号
    @param code_zip Binary zip文件
    @param email String 用户邮箱

'''


def updateCodeOrganization(request):
    if request.method == 'POST':
        compressed_file_obj = get_object_or_404(
            codeAnalyze, project_id=request.POST.get('project_id'), email=request.POST.get('email'))
        if compressed_file_obj is None:
            return JsonResponse({'status': 1, 'message': '项目不存在'}, json_dumps_params={'ensure_ascii': False})
        else:
            compressed_file = request.FILES.get('code_zip')
            if compressed_file:
                zipDownLoad(compressed_file.read(), './app/zip/'+request.POST.get('project_id'))
                compressed_file_obj.code_zip = './app/zip/'+request.POST.get('project_id')
                compressed_file_obj.save()
                return JsonResponse({'status': 0, 'message': '更新项目源码成功'}, json_dumps_params={'ensure_ascii': False})
            else:
                return JsonResponse({'status': 1, 'message': '项目源码为空'}, json_dumps_params={'ensure_ascii': False})


'''
    项目代码分析
    @param project_id String 隶属项目编号
    @param email String 用户邮箱
'''


def codeAnalyzer(request):
    if request.method == 'POST':
        compressed_file_obj = get_object_or_404(
            codeAnalyze, project_id=request.POST.get('project_id'), email=request.POST.get('email'))
        if compressed_file_obj is None:
            return JsonResponse({'status': 1, 'message': '项目不存在'}, json_dumps_params={'ensure_ascii': False})
        else:
            codeCounter = CodeCounterAnalyze()
            codeCounter.count(compressed_file_obj.code_zip)
            codeSimList = codeCounter.codeSimLines(
                './app/resource/codeResource.java')
            # 保存分析结果至数据库
            compressed_file_obj.code_lines = codeCounter.code_lines
            compressed_file_obj.original_code_lines = codeCounter.original_code_lines
            compressed_file_obj.file_count = codeCounter.file_count
            compressed_file_obj.original_file_count = codeCounter.original_file_count
            compressed_file_obj.blank_lines = codeCounter.blank_lines
            compressed_file_obj.comment_lines = codeCounter.comment_lines
            compressed_file_obj.filename_list = [
                code.__dict__ for code in codeCounter.file_list]
            compressed_file_obj.codeSimList = [
                code.__dict__ for code in codeSimList]
            compressed_file_obj.save()
            return JsonResponse({'status': 0, 'message': '相似度分析成功', 'codeCount': {
                'code_lines': codeCounter.code_lines, 'comment_lines': codeCounter.comment_lines, 'blank_lines': codeCounter.blank_lines, 'original_code_lines': codeCounter.original_code_lines, 'file_count': codeCounter.file_count, 'original_file_count': codeCounter.original_file_count, 'filename_list': [code.__dict__ for code in codeCounter.file_list]},
                'length': len(codeSimList), 'data': [code.__dict__ for code in codeSimList]}, json_dumps_params={'ensure_ascii': False})


'''
    查询代码分析结果
    @param project_id String 隶属项目编号
    @param email String 用户邮箱
'''


def selectCodeOrganization(request):
    if request.method == 'GET':
        code = codeAnalyze.objects.filter(
            project_id=request.GET.get('project_id'), email=request.GET.get('email')).values('project_id', 'name', 'code_lines', 'original_code_lines', 'file_count', 'original_file_count', 'filename_list', 'codeSimList').first()
        if code is None:
            return JsonResponse({'status': 1, 'message': '不存在该项目'}, json_dumps_params={'ensure_ascii': False})
        else:
            return JsonResponse({'status': 0, 'message': '查询项目成功', 'data': code}, json_dumps_params={'ensure_ascii': False})


'''
    查询所有代码分析结果
    @param email String 用户邮箱
'''


def selectALLCodeOrganization(request):
    if request.method == 'GET':
        allCode = list(codeAnalyze.objects.filter(email=request.GET.get('email')).values('project_id', 'name', 'code_lines', 'original_code_lines',
                                                                                         'file_count', 'original_file_count', 'filename_list', 'codeSimList').all())
        return JsonResponse({'status': 0, 'message': '查询项目成功', 'data': allCode}, json_dumps_params={'ensure_ascii': False})
