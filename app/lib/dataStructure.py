class codeElement:
    def __init__(self, content, path):
        self.content = content
        self.path = path


class codeSimElement:
    def __init__(self, content, path, sim_content, sim_path, sim_value):
        self.content = content
        self.path = path
        self.sim_content = sim_content
        self.sim_path = sim_path
        self.sim_value = sim_value


class sentenceElement:
    def __init__(self, content, title):
        self.content = content
        self.title = title


class funPoints:
    def __init__(self, ilfs, eifs, eis, eos, eqs):
        self.ilfs = ilfs
        self.eifs = eifs
        self.eis = eis
        self.eos = eos
        self.eqs = eqs
        self.ilfsNumber = len(ilfs)
        self.eifsNumber = len(eifs)
        self.eisNumber = len(eis)
        self.eosNumber = len(eos)
        self.eqsNumber = len(eqs)
        self.funNumber = len(ilfs) + len(eifs) + len(eis) + len(eos) + len(eqs)


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
