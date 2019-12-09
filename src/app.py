import os
import flask
from trello import TrelloClient
from exercise import Exercise

app = flask.Flask(__name__)

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

@app.route('/')
def hello():
    cards = getGYMCards()
    exercises = []
    for card in cards[1:]:
        exercises.append(Exercise(card).get_json())
    
    return flask.jsonify(exercises)

client = TrelloClient(
    api_key=os.environ['TRELLO_API_KEY'],
    token=os.environ['TRELLO_API_TOKEN']
)

GYM = "GYM"
NON_VALID_LISTS = ["Reference"]

def findGYM(boards):
    for board in boards:
        if (board.name == GYM):
            return board
    return None

def getGYMCards():
    open_lists = findGYM(client.list_boards()).open_lists()
    open_lists = filter(lambda list: not list.name in NON_VALID_LISTS, open_lists)
    all_cards = []
    for open_list in open_lists:
        all_cards += open_list.list_cards()
    return all_cards

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)