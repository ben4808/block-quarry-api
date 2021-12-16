import re

podcastFilename = "C:\\Users\\ben_z\\Desktop\\entriesData\\podcasts_merged.txt"
dictFilename = "C:\\Users\\ben_z\\Downloads\\rectified4.dict"
outputFilename = "C:\\Users\\ben_z\\Downloads\\rectified4.csv"
entriesDict = {}
entryKeys = []
i = 0
outputSpacedDict = False

dictFile = open(dictFilename)
podcastFile = open(podcastFilename)
outputFile = open(outputFilename, 'w')
podLine = podcastFile.readline()

print("A")

for dictLine in dictFile:
    tokens = dictLine.rstrip().split(";")
    result = {'entry': tokens[0]}
    entry = tokens[0]
    if (len(tokens) == 2):
        result['score'] = int(tokens[1])
    else:
        result['score'] = 50
    if (entry not in entriesDict):
        entriesDict[entry] = result
        entryKeys.append(entry)
    i += 1
    #if (i > 10):
    #    break

entryKeys.sort()

print("B")

i = 0
for entry in entryKeys:
    if (i % 10000 == 0):
        print(i)
    result = entriesDict[entry]
    while(True):
        search = re.search('^([A-Z]+),\"(.*)\",([\d]+)', podLine)
        podEntry = search.group(1)
        if (podEntry < entry):
            podLine = podcastFile.readline()
            continue
        if (podEntry == entry):
            r = search.group(2).strip()
            r = re.sub('  ', ' ', r)
            r = re.sub('^ ', '', r)
            r = re.sub('[^A-Za-z]$', '', r)

            if outputSpacedDict:
              r = r.upper()
              r = re.sub(' ', '-', r)

            result['displayText'] = r
            podLine = podcastFile.readline()
            break
        if (podEntry > entry):
            result['displayText'] = entry.lower()
            break
    i += 1

print("C")

for entry in entryKeys:
    result = entriesDict[entry]
    if outputSpacedDict:
      print(f"{result['entry']};{result['score']}", file=outputFile)
    else:
      print(f"{result['entry']},\"{result['displayText']}\",{result['score']}", file=outputFile)

print("D")

podcastFile.close()
dictFile.close()
outputFile.close()
