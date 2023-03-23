class codeElement:
    def __init__(self, content, path, linecount):
        self.content = content
        self.path = path
        self.linecount = linecount


class codeSimElement:
    def __init__(self, content, path, linecount, sim_content, sim_path, sim_value):
        self.content = content
        self.path = path.replace("./app/zip\\", "")
        self.linecount = linecount
        self.sim_content = sim_content
        self.sim_path = sim_path.replace("./app/resource/", "")
        self.sim_value = sim_value

class fileElement:
    def __init__(self, filename, path, linecount):
        self.filename = filename
        self.path = path
        self.linecount = linecount


class sentenceElement:
    def __init__(self, content, title, type):
        self.content = content
        self.title = title
        self.type = type


class funPoints:
    def __init__(self, elements):
        self.elements = elements
        self.ilfsNumber = self.ILF_count()
        self.eifsNumber = self.EIF_count()
        self.eisNumber = self.EI_count()
        self.eosNumber = self.EO_count()
        self.eqsNumber = self.EQ_count()
        self.funNumber = len(elements)

    def ILF_count(self):
        count = 0
        for element in self.elements:
            if element.type == "ILF":
                count += 1
        return count

    def EIF_count(self):
        count = 0
        for element in self.elements:
            if element.type == "EIF":
                count += 1
        return count

    def EI_count(self):
        count = 0
        for element in self.elements:
            if element.type == "EI":
                count += 1
        return count

    def EO_count(self):
        count = 0
        for element in self.elements:
            if element.type == "EO":
                count += 1
        return count

    def EQ_count(self):
        count = 0
        for element in self.elements:
            if element.type == "EQ":
                count += 1
        return count


class developmentFactor:
    def __init__(self, business=1, application=1, completeness=1, quality=0.9):
        self.business = business
        self.application = application
        self.completeness = completeness
        self.quality = quality

    def calculateEffort(self, original, productivity):
        return original*productivity*self.business*self.application*self.completeness*self.quality


class costElement:
    def __init__(self, development, operations):
        self.development = development
        self.operations = operations
        self.totalCost = self.development + self.operations


class effortElement:
    def __init__(self, development, operations):
        self.development = development
        self.operations = operations
        self.totalEffort = self.development + self.operations


class operationsFactor:
    def __init__(self, level=0.95, ability=1, system=1.14):
        self.level = level
        self.ability = ability
        self.system = system

    def calculateEffort(self, original, productivity):
        return original*productivity*self.level*self.ability*self.system


class paylaodPerson:
    def __init__(self, location):
        self.location = location
        self.development = self.developmentPayload(self.location)
        self.operations = self.operationsPayload(self.location)

    def developmentPayload(self, location):
        payload = {
            '北京': 30906,
            '重庆': 23272,
            '上海': 30778,
            '天津': 25281,
            '长春': 21914,
            '成都': 23922,
            '大连': 24648,
            '广州': 27451,
            '哈尔滨': 22422,
            '杭州': 27815,
            '济南': 22645,
            '南京': 26955,
            '宁波': 25706,
            '青岛': 23843,
            '沈阳': 23362,
            '深圳': 29842,
            '武汉': 24510,
            '厦门': 25909,
            '西安': 24394,
            '长沙': 24716,
            '合肥': 22796,
            '昆明': 23745,
            '石家庄': 20617,
            '苏州': 27698,
            '太原': 23159
        }
        return payload.get(location, None)

    def operationsPayload(self, location):
        payload = {
            '北京': 25512,
            '重庆': 19839,
            '上海': 25776,
            '天津': 20717,
            '长春': 16742,
            '成都': 19684,
            '大连': 20760,
            '广州': 22859,
            '哈尔滨': 18531,
            '杭州': 23616,
            '济南': 17734,
            '南京': 20974,
            '宁波': 20054,
            '青岛': 19518,
            '沈阳': 19071,
            '深圳': 25659,
            '武汉': 18624,
            '厦门': 21204,
            '西安': 20171,
            '长沙': 20327,
            '合肥': 19379,
            '昆明': 19140,
            '石家庄': 17205,
            '苏州': 23048,
            '太原': 19111
        }
        return payload.get(location, None)


class workEffortFactor:
    def __init__(self, A, IL, L, T):
        self.A = A
        self.IL = IL
        self.L = L
        self.T = T

    def adjustEffort(self, development, operations):
        return effortElement(development*self.A*self.IL*self.L*self.T, operations*self.A*self.IL*self.L*self.T)


class codeCountElement:
    def __init__(self, filename, code_lines, comment_lines, blank_lines):
        self.filename = filename
        self.code_lines = code_lines
        self.comment_lines = comment_lines
        self.blank_lines = blank_lines
