import sys
import re

inputPaths = []
outputPath = "./output.txt"
inputFormat = "csv"
outputFormat = "csv"
operation = None

outputChangesOnly = False
displayTextChanges = False
scoreChanges = False
defaultScore = 50

query = None

def runOperation():
  if operation == "merge":
    mergeWordLists()
  elif operation == "query":
    queryWordList()
  elif operation == "delete":
    deleteFromWordList()

def mergeWordLists():
  mergedList = {}
  mergedKeys = []
  changedKeys = []

  fileI = -1
  for path in inputPaths:
    fileI += 1
    file = open(path, "r")
    lines = file.readlines()
    file.close()
    for line in lines:
      if (len(line.strip()) == 0):
        continue

      entry = parseFileLine(line)
      if entry is None:
        continue

      normalized = entry["normalized"]

      if fileI > 0 and not entry["isScoreGiven"] and normalized in mergedList:
        entry["score"] = mergedList[normalized]["score"]

      isChanged = (fileI > 0 and normalized not in mergedList) or \
        (displayTextChanges and mergedList[normalized]["displayText"] != entry["displayText"]) or \
        (scoreChanges and mergedList[normalized]["score"] != entry["score"])
        
      if normalized not in mergedList:
        mergedList[normalized] = entry
        mergedKeys.append(normalized)
          
      if isChanged:
        mergedList[normalized] = entry
        changedKeys.append(normalized)

      outputKeys = changedKeys if outputChangesOnly else mergedKeys
      writeOutputFile(mergedList, outputKeys)

def queryWordList():
  entriesDict = {}
  matchKeys = []

  file = open(inputPaths[0], "r")
  lines = file.readlines()
  file.close()
  for line in lines:
    if (len(line.strip()) == 0):
      continue

    entry = parseFileLine(line)
    if entry is None:
      continue

    normalized = entry["normalized"]
    entriesDict[normalized] = entry

    if re.search(query, normalized):
      matchKeys.append(normalized)

  writeOutputFile(entriesDict, matchKeys)

def deleteFromWordList():
  entriesDict = {}
  outputKeys = []
  deleteKeysDict = {}

  originalFile = open(inputPaths[0], "r")
  originalLines = originalFile.readlines()
  originalFile.close()

  toDeleteFile = open(inputPaths[1], "r")
  toDeleteLines = toDeleteFile.readlines()
  toDeleteFile.close()

  for line in toDeleteLines:
    if (len(line.strip()) == 0):
      continue

    entry = parseFileLine(line)
    if entry is None:
      continue

    normalized = entry["normalized"]
    deleteKeysDict[normalized] = True

  for line in originalLines:
    if (len(line.strip()) == 0):
      continue

    entry = parseFileLine(line)
    if entry is None:
      continue

    normalized = entry["normalized"]
    entriesDict[normalized] = entry

    if normalized not in deleteKeysDict:
      outputKeys.append(normalized)

  writeOutputFile(entriesDict, outputKeys)

def normalize(str):
  return re.sub("[^A-Z]", "", str.upper())

def parseFileLine(line):
  normalized = ""
  displayText = ""
  score = defaultScore
  isScoreGiven = False
  
  delimiter = ";" if inputFormat == "dict" else ","
  regex1 = re.search(f"^\"?(.+?)\"?$", line.strip())
  regex2_noScore = re.search(f"^([a-zA-Z]+?)\{delimiter}\"?(.+?)\"?$", line.strip())
  regex2_score = re.search(f"^\"?(.+?)\"?\{delimiter}([0-9]+)$", line.strip())
  regex3 = re.search(f"^([a-zA-Z]+?)\{delimiter}\"?(.+?)\"?\{delimiter}([0-9]+)$", line.strip())

  if regex3:
    normalized = normalize(regex3.group(1))
    displayText = regex3.group(2)
    score = int(regex3.group(3))
    isScoreGiven = True
  elif regex2_score:
    token1 = regex2_score.group(1)
    normalized = normalize(token1)
    displayText = token1
    score = int(regex2_score.group(2))
    isScoreGiven = True
  elif regex2_noScore:
    normalized = normalize(regex2_noScore.group(1))
    displayText = regex2_noScore.group(2)
  elif regex1:
    token1 = regex1.group(1)
    normalized = normalize(token1)
    displayText = token1
  else:
    return None

  return {
    "normalized": normalized,
    "displayText": displayText,
    "score": score,
    "isScoreGiven": isScoreGiven,
  }

def writeOutputFile(entryDict, outputKeys):
  outputLines = []
  outputKeys.sort()
  for key in outputKeys:
    entry = entryDict[key]
    if outputFormat == "dict":
      outputLines.append(f"{entry['normalized']};{entry['score']}\n")
    else:
      outputLines.append(f"{entry['normalized']},\"{entry['displayText']}\",{entry['score']}\n")

  outputFile = open(outputPath, "w")
  outputFile.writelines(outputLines)
  outputFile.close()

def main():
  if (len(sys.argv) < 1):
    print("Command line args needed.")
    return

  global inputPaths, outputPath, inputFormat, outputFormat, operation, outputChangesOnly, \
    displayTextChanges, scoreChanges, defaultScore, query

  i = 0
  while i+1 < len(sys.argv):
    i += 1
    arg = sys.argv[i]
    if (arg == "-i"):
      i += 1
      inputPaths.append(sys.argv[i])
      continue
    if (arg == "-o"):
      i += 1
      outputPath = sys.argv[i]
      continue
    if (arg == "-if"):
      i += 1
      inputFormat = sys.argv[i]
      continue
    if (arg == "-of"):
      i += 1
      outputFormat = sys.argv[i]
      continue
    if (arg == "-oper"):
      i += 1
      operation = sys.argv[i]
      continue
    if (arg == "-co"):
      outputChangesOnly = True
      continue
    if (arg == "-tc"):
      displayTextChanges = True
      continue
    if (arg == "-sc"):
      scoreChanges = True
      continue
    if (arg == "-score"):
      i += 1
      defaultScore = int(sys.argv[i])
      continue
    if (arg == "-query"):
      i += 1
      query = sys.argv[i]
      continue

  runOperation()

  print("Done.")

main()
