import requests
import sys
import json

TOP = 8

with open(sys.argv[2], 'r', encoding='utf-8') as file:
    data = file.readlines()

year = sys.argv[1]
bracket = {'year': year}
conference = ''

def setQuarters(team, c, i, p):
    bracket[c]['quarterfinals'][i]['teams'][p] = team

for line in data:

    if line == '\n':
        continue

    if line.strip() in ['westernConference', 'easternConference']:
        conference = line.strip()
        bracket[conference] = {}
        bracket[conference]['quarterfinals'] = [ {'teams': ['',''], 'games': [], 'score': [0,0]} for x in range(4)]
        continue
        
    if not conference:
        break

    line_parse = line.strip().split(',')
   
    if int(line_parse[0]) <= TOP:
    
        rank = int(line_parse[0])
        indices = [0,3,2,1,1,2,3,0]
        
        if rank <= 4:
            setQuarters(line_parse[1], conference, indices[rank - 1], 0)
        else:
            setQuarters(line_parse[1], conference, indices[rank - 1], 1)
            

def setMatchup(c, round, next, i, bracketCounter):

    response = requests.get('http://localhost:5000/playoff/' + year + '/' + bracket[c][round][i]['teams'][0] + '/' + bracket[c][round][i]['teams'][1]).text
    games = json.loads(response)
    
    if(round == 'semifinals'): print(bracket[c][round][i]['teams'][0], bracket[c][round][i]['teams'][1])
    
    bracket[c][round][i]['games'] = games['gameIds']
    bracket[c][round][i]['score'] = games['score']
    
    if(next != 'finals'):
          
        if bracketCounter % 2 == 0:
            bracket[c][next][int(bracketCounter // 2)]['teams'][0] = games['result']
        else:
            bracket[c][next][int(bracketCounter // 2)]['teams'][1] = games['result']
            
        bracketCounter += 1
            
    elif(next == 'finals'):
        
        if c == 'easternConference':
            bracket[finals]['teams'][0] = games['result']
        elif c == 'westernConference':
            bracket[finals]['teams'][1] = games['result']
    
    return bracketCounter

    
def finalResults():
    response = requests.get('http://localhost:5000/playoff/' + year + '/' + bracket['finals']['teams'][0] + '/' + bracket['finals']['teams'][0]).text
    games = json.loads(response)
    
    bracket['finals']['games'] = games['gameIds']
    bracket['finals']['score'] = games['score']

for con in ['westernConference', 'easternConference']:

    bracketCounter = 0

    bracket[con]['semifinals'] = [ {'teams': ['',''], 'games': [], 'score': [0,0]} for x in range(2)]
    
    for i in range(len(bracket[con]['quarterfinals'])):
        bracketCounter = setMatchup(con, 'quarterfinals', 'semifinals',  i, bracketCounter)
    bracketCounter = 0
    
    bracket[con]['confinals'] = [{'teams': ['',''], 'games': [], 'score': [0,0]}]
    
    for i in range(len(bracket[con]['semifinals'])):
        
        if bracket[con]['semifinals'][i]['teams'][0] and bracket[con]['semifinals'][i]['teams'][1]:
            bracketCounter = setMatchup(con, 'semifinals', 'confinals', i, bracketCounter)
    bracketCounter = 0
    
    bracket['finals'] = {'teams': ['',''], 'games': [], 'score': [0,0]}
    
    if bracket[con]['confinals'][0]['teams'][0] and bracket[con]['confinals'][0]['teams'][1]:
        bracketCounter = setMatchup(con, 'confinals', 'finals', i)


if bracket['finals']['teams'][0] and bracket['finals']['teams'][1]:    
    finalResults()
 
res = requests.post('http://localhost:5000/playoff/add/bracket', json=bracket)
    