import simplifiedCFG
import sys
import hashlib

def hash(text):
	m = hashlib.md5()
	m.update(text.encode('utf-8'))
	return m.hexdigest()

def main():
	debug=False
	filename=sys.argv[1]
	if len(sys.argv)>2 and 'DEBUG'==sys.argv[2]:
		debug=True
	'''
	lines=open(filename).readlines()
	print('total line:',len(lines))
	return
	'''
	i=1
	for line in open(filename).readlines()[1:]:
		i+=1
		# (user, problem, timestamp, attempted, passed, code)
		# issue is that code has tabs in it, but the lines are tab-delimited
		#
		# Update: the code part doesn't actually seem to have any tabs in it
		#
		# solution is to split on tabs and slice the first 5 elements, like this:
		try:
			(user, problem, timestamp, attempted, passed, code) = line.rstrip().split('\t')
		except ValueError as e:
			sys.stderr.write('Cannot split line %d properly: %s' % (i, line))
			continue
		# now split on tabs, but take the rest of the line
		# and then use join to put the tabs back in place
		# also need to replace literal \n with a newline character
		
		codeWithNewlines=code.replace('\\n', '\n')
		try:
			cfg=simplifiedCFG.toCFG(codeWithNewlines, "%s-%s-%s" % (user, problem, timestamp), ' ')
			graphviz=simplifiedCFG.toGraphViz(codeWithNewlines, "%s-%s-%s" % (user, problem, timestamp), '\\n')
		except SyntaxError as e:
			if debug:
				sys.stderr.write('SyntaxError: %s\n' % codeWithNewlines)
			continue
		# compressed version
		# print('%s\t%s\t%s' % (problem, passed, cfg))
		# TODO:
		# Figure out multiline issues
		print('%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s' % (user, problem, timestamp, attempted, passed, code, cfg, graphviz))

if __name__=='__main__':
	main()
