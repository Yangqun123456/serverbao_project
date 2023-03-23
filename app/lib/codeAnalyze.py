import re
import numpy as np
import shutil
import zipfile
import os
from app.lib.dataStructure import codeElement, codeSimElement
# 读取文件


def read_corpus(fname):
    codeList = []
    temp = ''
    with open(fname, encoding="utf-8") as f:
        while (True):
            line = f.readline()
            # 删除所有中文字符
            pattern = re.compile(r'[\u4e00-\u9fa5]')
            line = re.sub(pattern, '', line)
            # 以10行为粒度
            if line != '' and line != '\n' and ~is_only_bracket_or_space(line):
                temp += line
            if count_lines(temp) >= 10:
                codeList.append(codeElement(temp, fname, count_lines(temp)))
                temp = ''
            if not line:
                codeList.append(codeElement(temp, fname, count_lines(temp)))
                return codeList

# 代码相似度分析


def codeSimAnalyze(cosine_sim, codeList, codeResourceList):
    codeSimList = []
    maxsim_index = (cosine_sim.argmax(axis=1)).tolist()
    maxsim_value = (np.max(cosine_sim, axis=1)).tolist()
    for i in range(len(maxsim_index)):
        if maxsim_value[i] >= 0.6:
            codeSimList.append(codeSimElement(
                codeList[i].content, codeList[i].path, codeList[i].linecount, codeResourceList[maxsim_index[i]].content, codeResourceList[maxsim_index[i]].path, maxsim_value[i]))
    return codeSimList

# 解压zip文件


def zipDownLoad(code_analyze_obj, zip_path='./app/zip'):
    # 读取二进制数据
    compressed_data = code_analyze_obj.code_zip
    # 清空目标文件夹
    shutil.rmtree(zip_path, ignore_errors=True)
    os.mkdir(zip_path)
    temp_file_path = os.path.join(zip_path, 'temp.zip')
    with open(temp_file_path, 'wb') as temp_file:
        temp_file.write(compressed_data)
    # 解压缩文件
    with zipfile.ZipFile(temp_file_path, 'r') as zip_ref:
        zip_ref.extractall(zip_path)
    # 删除临时文件
    os.remove(temp_file_path)


# 遍历文件夹

def traverse_folder(folder_path, file_list):
    suffixes = {'.java', '.js', '.html', '.css', '.py'}
    for file_name in os.listdir(folder_path):
        file_path = os.path.join(folder_path, file_name)
        if os.path.isdir(file_path):
            # 如果是文件夹，则递归遍历
            traverse_folder(file_path, file_list)
        else:
            # 如果是文件，判断是否是java文件
            if file_name.endswith(tuple(suffixes)):
                file_list.append(file_path)

# 读取指定文件夹内所有文件


def read_files(folder_path):
    file_list = []
    traverse_folder(folder_path, file_list)
    codeList = []
    for file_path in file_list:
        codeCorpus = read_corpus(file_path)
        codeList.extend(codeCorpus)
    return codeList

# 向量转列表


def vector_string_to_list(vector):
    vector = vector.replace("[", "").replace("]", "")  # 去掉向量的中括号
    vector_list = vector.split()  # 将字符串按空格分割成列表
    vector_list = [int(x) for x in vector_list]  # 将列表中的字符串转化为整数
    return vector_list

# 计算字符串所占行数


def count_lines(content):
    lines = content.splitlines()
    return len(lines)

# 判断字符串是否仅由空格或括号组成


def is_only_bracket_or_space(input_str):
    if not input_str.strip():  # 判断是否为空字符串
        return True
    for char in input_str:
        if char not in {' ', '{', '}', '(', ')', '[', ']'}:  # 判断是否为大括号或空格
            return False
    return True
