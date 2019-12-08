import os
from trello import TrelloClient

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

print(getGYMCards())