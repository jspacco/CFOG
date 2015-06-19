import ast

def toCFG(text, name, delim='\n'):
    myast = ast.parse(text, name)
    v=Myvis(delim=delim)
    v.visit(myast)
    return v.cfg

def toGraphViz(text, name, delim='\n'):
    myast = ast.parse(text, name)
    gv=GraphViz(delim=delim)
    gv.visit(myast)
    return gv.graph

def typename(value):
    return type(value).__name__

class GraphViz(ast.NodeVisitor):
    def __init__(self, delim='\n', debug=False):
        self.nodecount=0
        self.delim=delim
        self.nodenumbers=dict()
        self.nodetypes=dict()
        self.graph=''
        self.DEBUG=debug
        super(GraphViz, self).__init__()

    def createNode(self, node):
        # todo: fake node for if/then/else and for with empty stmts
        if node not in self.nodenumbers:
            self.nodenumbers[node]=str(self.nodecount)
            self.nodecount+=1
            self.nodetypes[node]=typename(node)
    def getNodeNumber(self, node):
        self.createNode(node)
        return self.nodenumbers[node]
    def getNodeType(self, node):
        self.createNode(node)
        return self.nodetypes[node]

    def makeLink(self, src, dst):
        self.graph+='%s -> %s;%s' % (self.getNodeNumber(src), self.getNodeNumber(dst), self.delim)

    def debug(self, msg):
        if self.DEBUG:
            print(msg)

    def generic_visit(self, node):
        name=typename(node)
        self.debug('debug; visiting: %s'%str(name))
        if name == 'Module':
            self.graph+='digraph G {'+self.delim
            ast.NodeVisitor.generic_visit(self, node)
            # TODO: print labels
            for n in self.nodenumbers.keys():
                self.graph+='%s [label="%s"];%s' % (self.getNodeNumber(n), self.getNodeType(n), self.delim)
            self.graph+='}'
        elif name == 'FunctionDef':
            # todo: number of params
            # always create downward links as needed
            for n in ast.iter_child_nodes(node):
                if typename(n) in ('For','If','Return'):
                    self.debug('%s -> %s' % (str(name),typename(n)))
                    self.makeLink(node, n)
            ast.NodeVisitor.generic_visit(self, node)
        elif name == 'For':
            for n in ast.iter_child_nodes(node):
                if typename(n) in ('For', 'If', 'Return'):
                    self.debug('%s -> %s' % (name,typename(n)))
                    self.makeLink(node, n)
            ast.NodeVisitor.generic_visit(self, node)
        elif name == 'If':
            # check the then branch
            found=False
            for n in node.body:
                if typename(n) in ('If','For','Return'):
                    found=True
                    self.makeLink(node,n)
            if not found:
                self.makeLink(node,node)
            if (len(node.orelse)>0):
                found=False
                for n in node.orelse:
                    if typename(n) in ('If','For','Return'):
                        found=True
                        self.makeLink(node,n)
                if not found:
                    self.graph += '%s -> %s;%s' % (self.getNodeNumber(node), self.getNodeNumber(node), self.delim)
            #print('body', node.body, typename(node.body), typename(node.orelse))
            for n in ast.iter_child_nodes(node):
                self.debug('%s ===> %s' % (str(name), typename(n)))
            ast.NodeVisitor.generic_visit(self, node)
        elif name == 'Return':
            # probably no need for recursive step here???
            #print(name, node._fields)
            ast.NodeVisitor.generic_visit(self, node)
        else:
            #print('CATCHALL', name)
            ast.NodeVisitor.generic_visit(self, node)

class Myvis(ast.NodeVisitor):
    def __init__(self, delim='\n', debug=False):
        self.cfg=''
        self.DEBUG=debug
        self.delim=delim
        super(Myvis, self).__init__()

    def generic_visit(self, node):
        name=type(node).__name__
        if self.DEBUG:
            print('debug; visiting:',name)
        if name == 'Module':
            ast.NodeVisitor.generic_visit(self, node)
        elif name == 'FunctionDef':
            # todo: number of params
            self.cfg += 'FunctionDef {'+self.delim
            ast.NodeVisitor.generic_visit(self, node)
            self.cfg += self.delim+'} '
        elif name in ('For', 'If'):
            self.cfg += name+' {'+self.delim
            ast.NodeVisitor.generic_visit(self, node)
            self.cfg += self.delim+'}'+self.delim
        elif name == 'Return':
            self.cfg += name + ' '
            # probably no need for recursive step here???
            ast.NodeVisitor.generic_visit(self, node)
        else:
            #print('CATCHALL', name)
            ast.NodeVisitor.generic_visit(self, node)


def readtext(filename):
    text=''
    for line in open(filename):
        text += line
    return text

def main():
    filename='test1.py'
    myast = ast.parse(readtext(filename), filename)
    #print(ast.dump(myast))
    #v=Myvis()
    v=GraphViz()
    #x=v.visit(myast)
    v.visit(myast)
    print(v.graph)

if __name__=='__main__':
    main()
