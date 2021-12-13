import sys
import re

originalListPath = None
newListPaths = []
outputPath = "./output.txt"

outputChangesOnly = False
outputDict = False
defaultScore = 50
originalDelimiter = ","
newDelimiter = ","

def mergeWordLists():
  mergedList = {}
  mergedKeys = []
  changedKeys = []

  for path in [originalListPath, *newListPaths]:
    file = open(path, "r")
    lines = file.readlines()
    file.close()
    for line in lines:
      if (len(line.strip()) == 0): 
        continue

      normalized = ""
      displayText = ""
      score = defaultScore
      isScoreGiven = False
      
      delimiter = newDelimiter if path != originalListPath else originalDelimiter
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
        continue

      entry = {
        "normalized": normalized,
        "displayText": displayText,
        "score": score,
      }

      if path != originalListPath and not isScoreGiven and normalized in mergedList:
        entry["score"] = mergedList[normalized]["score"]

      isChanged = path != originalListPath and \
        normalized not in mergedList #or \
        # mergedList[normalized].displayText != entry.displayText or \
        # mergedList[normalized].score != entry.score
        
      
      if normalized not in mergedList:
        mergedList[normalized] = entry
        mergedKeys.append(normalized)
          
      if isChanged:
        mergedList[normalized] = entry
        changedKeys.append(normalized)

  outputLines = []
  sortedKeys = []
  if outputChangesOnly:
    changedKeys.sort()
    sortedKeys = changedKeys
  else:
    mergedKeys.sort()
    sortedKeys = mergedKeys
  for key in sortedKeys:
    entry = mergedList[key]
    if outputDict:
      outputLines.append(f"{entry['normalized']};{entry['score']}\n")
    else:
      outputLines.append(f"{entry['normalized']},\"{entry['displayText']}\",{entry['score']}\n")

  outputFile = open(outputPath, "w")
  outputFile.writelines(outputLines)
  outputFile.close()

def normalize(str):
  return re.sub("[^A-Z]", "", str.upper())

def main():
  if (len(sys.argv) < 3):
    print("At least 2 args needed.")
    return

  global originalListPath, newListPaths, outputPath, outputChangesOnly, outputDict, \
    defaultScore, originalDelimiter, newDelimiter

  originalListPath = sys.argv[1]
  newListPaths = [sys.argv[2]]

  i = 2
  while i+1 < len(sys.argv):
    i += 1
    arg = sys.argv[i]
    if (arg == "-list"):
      i += 1
      newListPaths.append(sys.argv[i])
      continue
    if (arg == "-o"):
      i += 1
      outputPath = sys.argv[i]
      continue
    if (arg == "-co"):
      outputChangesOnly = True
      continue
    if (arg == "-dict"):
      outputDict = True
      continue
    if (arg == "-score"):
      i += 1
      defaultScore = int(sys.argv[i])
      continue
    if (arg == "-odel"):
      i += 1
      originalDelimiter = sys.argv[i]
      continue
    if (arg == "-ndel"):
      i += 1
      newDelimiter = sys.argv[i]
      continue

  mergeWordLists()

  print("Done.")

main()
