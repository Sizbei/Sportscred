import requests
import sys
import json

with open(sys.argv[1], 'r', encoding='utf-8') as file:
    data = file.readlines()

for line in data:
    if line == '\n':
        continue
        
    line_parse = [x.strip() for x in line.split(',')]
    
    game = {'team1': line_parse[0], 'team2': line_parse[1], 'result': line_parse[2], 'type': 'playoff', 'gameDay': line_parse[3]}
    
    r = requests.post('http://localhost:5000/playoff/add/game', json=game)
    
    print(r)