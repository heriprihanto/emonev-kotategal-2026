import json


total = 0

f = open('tes.json')
data = json.load(f)
# Iterate through the JSON array
for item in data:
    total += item['nilai_realisasi']
    #print(item['nilai_realisasi'])

print (total)