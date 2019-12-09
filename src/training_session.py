import re
import json
import datetime

LAST_POUNDS_DATE = datetime.datetime(2019, 8, 12)

MAX_REPETITIONS = 10
RE_MATCHER = re.compile('^[0-9]+')


class TrainingSession(object):

    def __init__(self, card_comment):
        # Dates coming in this format: '2019-04-20T01:57:51.563Z'
        self.date = datetime.datetime.strptime(card_comment['date'], '%Y-%m-%dT%H:%M:%S.%fZ')
        self.breakdown = self._get_breakdown(card_comment['data']['text'])

    def _ensure_kg(self, weight):
        if self.date <= LAST_POUNDS_DATE:
            weight = round(weight / 2.2)
        
        return weight
    
    def _get_breakdown(self, comment_text):
        parts = comment_text.split("\n")
        series = []
        lastWeight = None
        for part in parts:
            all_numbers = RE_MATCHER.findall(part)
            if len(all_numbers) == 0:
                continue

            number = int(all_numbers[0])
            if number > MAX_REPETITIONS:
                lastWeight = self._ensure_kg(number)
            else:
                series.append([lastWeight, number])
        
        return series
    
    def get_json(self):
        return {
            'date': self.date,
            'breakdown': self.breakdown
        }