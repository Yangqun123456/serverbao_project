import os
import re
from app.lib.codeAnalyze import codeSimAnalyze, read_corpus, read_files
from app.lib.dataStructure import codeCountElement, fileElement
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class CodeCounterAnalyze:
    def __init__(self):
        self.code_lines = 0     # 代码行数
        self.comment_lines = 0  # 注释行数
        self.blank_lines = 0    # 空行数
        self.file_count = 0     # 文件数量
        self.code_sim_lines = 0
        self.original_code_lines = 0
        self.file_list = []
        self.original_file_count = 0
        # 统计Java、JavaScript、HTML和CSS文件
        self.suffixes = {'.java', '.js', '.html', '.css'}
        self.test_suffixes = {'Test.java',
                              'Tests.java', 'TestCase.java'}  # 测试文件后缀

    def count(self, path='./app/zip'):
        if not os.path.exists(path):
            print('文件夹不存在！')
            return
        for dirpath, dirnames, filenames in os.walk(path):
            if 'scripts' in dirpath.split(os.path.sep):
                continue  # 如果是 scripts 文件夹，则跳过
            for filename in filenames:
                if filename.endswith(tuple(self.suffixes)) and not filename.endswith(tuple(self.test_suffixes)):
                    codeCount = self.count_file(
                        os.path.join(dirpath, filename), filename)
                    self.file_list.append(fileElement(filename, os.path.join(
                        dirpath, filename).replace("./app/zip\\", ""), codeCount.code_lines))
                    self.code_lines += codeCount.code_lines
                    self.comment_lines += codeCount.comment_lines
                    self.blank_lines += codeCount.blank_lines
                    self.file_count += 1  # 统计文件数量

    def count_file(self, filepath, filename):
        code_lines = 0     # 代码行数
        comment_lines = 0  # 注释行数
        blank_lines = 0    # 空行数
        is_comment = False  # 是否在注释中
        with open(filepath, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()  # 去掉首尾空格
                if re.match('^\\s*$', line):  # 匹配空行
                    blank_lines += 1
                elif filename.endswith('.java'):
                    if line.startswith('/*') and not line.endswith('*/'):  # 匹配多行注释的开头
                        comment_lines += 1
                        is_comment = True
                    elif line.startswith('/*') and line.endswith('*/'):  # 匹配单行多行注释
                        comment_lines += 1
                    elif is_comment:  # 匹配多行注释的结束
                        comment_lines += 1
                        if line.endswith('*/'):
                            is_comment = False
                    elif line.startswith('//'):  # 匹配单行注释
                        comment_lines += 1
                    else:
                        code_lines += 1
                elif filename.endswith('.js'):
                    if line.startswith('//'):  # 匹配单行注释
                        comment_lines += 1
                    elif re.match('^\\s*/\\*', line):  # 匹配多行注释的开头
                        comment_lines += 1
                        is_comment = True
                    elif re.match('.*\\*/\\s*$', line):  # 匹配多行注释的结束
                        comment_lines += 1
                        is_comment = False
                    elif is_comment:  # 匹配多行注释
                        comment_lines += 1
                    else:
                        code_lines += 1
                elif filename.endswith('.html') or filename.endswith('.css'):
                    if re.match('^\\s*<!--', line):  # 匹配HTML注释的开头
                        comment_lines += 1
                        is_comment = True
                    elif re.match('.*-->', line):  # 匹配HTML注释的结束
                        comment_lines += 1
                        is_comment = False
                    elif is_comment:  # 匹配HTML注释
                        comment_lines += 1
                    elif re.match('^\\s*$', line):  # 匹配空行
                        blank_lines += 1
                    else:
                        code_lines += 1
        return codeCountElement(filename, code_lines, comment_lines, blank_lines)

    def codeSimLines(self, sourcePath='./app/resource/codeResource.java'):
        codeList = read_files("./app/zip")  # 读取文件夹下所有的文件
        codeResourceList = read_corpus(sourcePath)  # 读取指定的文件

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
        for code in codeSimList:
            self.code_sim_lines += code.linecount
        self.count_original_code_lines()
        self.count_original_file(codeSimList)
        return codeSimList

    def count_original_code_lines(self):
        self.original_code_lines = self.code_lines-self.code_sim_lines

    def count_original_file(self, codeSimList):
        self.original_file_count = self.file_count - \
            len(set(obj.path for obj in codeSimList))
