import os

# parent = os.path.dir("./nba_logos")

for dir, x, y in os.walk('./nba_logos/'):
  filenames = y

# print(filenames)

for filename in filenames:
  name = filename[0:-4]
  print(name + ",images/nba_logos" + filename)