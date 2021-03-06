#!/usr/bin/python
#coding=utf8
import urllib
import sys
import os
import re
import time
import xml.dom.minidom as xml

#API_URL = 'http://dict.cn/ws.php?utf8=true&q=%s'
API_URL = 'http://dict-co.iciba.com/api/dictionary.php?key=7472A090A0FA64018AD584482B34538E&w=%s'

def getword(word):
    xmls = urllib.urlopen(API_URL%urllib.quote(word)).read()
    #print xmls
    root = xml.parseString(xmls).documentElement
    #print re.sub(u'>', '>\n',xmls)

    #tags = {'key':'单词', 'pron':'音标', 'def':'释义', 'sent':'例句', 'orig':'例句', 'trans':'翻译', 'acceptation':'释义'}

    tags = {'key':'单词', 'ps':'音标', 'pos':'词性', 'sent':' ', 'orig':'例句', 'trans':'翻译', 'acceptation':'释义'}
	#tags = {'key':'单词', 'ps':'音标', 'sent':'例句', 'orig':'例句', 'trans':'翻译', 'acceptation':'释义'}

    def isElement(node):
        return node.nodeType == node.ELEMENT_NODE
    def isText(node):
        return node.nodeType == node.TEXT_NODE
    def show(node, tagName=None):
        if isText(node):
            tag = tags.get(tagName, tagName)
            if cmp(tagName,'sent')!=0:
                   print '%s:%s'%(tag, node.nodeValue)
            if cmp(tagName,'acceptation')==0:
                   os.system('say %s' % word)
                   time.sleep(3)
            time.sleep(0.05)
        elif isElement(node) and tags.has_key(node.tagName):
            [show(i, node.tagName) for i in node.childNodes]

    [ show(i) for i in root.childNodes if isElement(i) ]
    
def main():
    if len(sys.argv) >= 2:
        word = ' '.join(sys.argv[1:])
        getword(word)
        os.system('say %s' % word);

    else:
        print 'usage:dict [word]'


if __name__ == '__main__':
    reload(sys)
    sys.setdefaultencoding('utf8')
    main()
